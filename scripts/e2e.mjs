import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'test-results');
const shotDir = path.join(outDir, 'screenshots');
const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const fullChrome = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1234/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const headlessShell = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell');
const executablePath = [fullChrome, headlessShell].find((candidate) => fs.existsSync(candidate));

if (!executablePath) throw new Error('No compatible cached Playwright Chromium executable was found.');
fs.mkdirSync(shotDir, { recursive: true });

const build = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);

const preview = spawn(path.join(root, 'node_modules/.bin/vite'), ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let previewLog = '';
preview.stdout.on('data', (chunk) => (previewLog += chunk));
preview.stderr.on('data', (chunk) => (previewLog += chunk));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await sleep(100);
  }
  throw new Error(`Vite preview did not start.\n${previewLog}`);
}

const defaults = { sound: false, timedChoices: false, textSpeed: 'instant', motion: 'full', bigText: false, music: false };
const allErrors = [];
const missing = [];

function monitor(page, scenario) {
  page.on('pageerror', (error) => allErrors.push(`${scenario}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') allErrors.push(`${scenario}: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() === 404) missing.push(`${scenario}: ${response.url()}`);
  });
}

async function makePage(browser, scenario, viewport, settings = defaults, player = 'boy') {
  const context = await browser.newContext({ viewport, reducedMotion: settings.motion === 'reduced' ? 'reduce' : 'no-preference' });
  await context.addInitScript(([savedSettings, savedPlayer]) => {
    if (sessionStorage.getItem('ahd.e2e-ready')) return;
    sessionStorage.setItem('ahd.e2e-ready', '1');
    localStorage.clear();
    localStorage.setItem('ahd.profile', JSON.stringify({
      version: 1,
      moments: [],
      endings: [],
      checkpoints: {},
      settings: savedSettings,
      player: savedPlayer,
      soundUpgraded: true,
    }));
  }, [settings, player]);
  const page = await context.newPage();
  monitor(page, scenario);
  return { context, page };
}

async function keyboardStart(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#title-dialog[open]').waitFor();
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (focused !== 'new-btn') throw new Error(`Title focus was ${focused || '(none)'}, expected new-btn`);
  await page.keyboard.press('Enter');
  await page.locator('#who-dialog[open]').waitFor();
  await page.keyboard.press('Enter'); // the remembered player is focused
  await page.locator('#title-dialog').waitFor({ state: 'hidden' });
}

const choiceVisible = (page) => page.locator('#choices .choice').first().isVisible().catch(() => false);
const currentLine = (page) => page.evaluate(() => document.querySelector('#bubble:not([hidden]) .text, #caption:not([hidden]) .text')?.textContent || '');

async function reachFirstChoice(page) {
  for (let step = 0; step < 60; step++) {
    if (await choiceVisible(page)) {
      await page.locator('#card').waitFor({ state: 'hidden' });
      return;
    }
    await page.keyboard.press('Enter');
    await page.waitForTimeout(25);
  }
  throw new Error('Did not reach the first Episode 1 choice.');
}

async function fullKeyboardRun(page) {
  await keyboardStart(page, `${origin}/?test`);
  let decisions = 0;
  let bubbles = 0;
  for (let step = 0; step < 1200; step++) {
    if (await page.locator('#report-dialog[open]').count()) {
      return {
        decisions,
        speechBubblesSeen: bubbles,
        title: await page.locator('#report-title').textContent(),
        rank: await page.locator('#report-dialog').getAttribute('data-rank'),
      };
    }
    if (await choiceVisible(page)) {
      await page.keyboard.press('1');
      decisions++;
    } else {
      if (await page.locator('#bubble:not([hidden])').count()) bubbles++;
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(15);
  }
  throw new Error('Keyboard play-through did not reach the report card.');
}

/** Every visible dialogue box and choice must sit fully inside the viewport. */
function measureLayout() {
  const vw = innerWidth;
  const vh = innerHeight;
  const inside = (el) => {
    const r = el.getBoundingClientRect();
    return r.left >= -1 && r.top >= -1 && r.right <= vw + 1 && r.bottom <= vh + 1;
  };
  const visible = [...document.querySelectorAll('#bubble, #caption, #choices, .choice')].filter((el) => !el.closest('[hidden]') && el.getClientRects().length);
  return {
    viewport: { width: vw, height: vh },
    bodyScroll: { width: document.body.scrollWidth, height: document.body.scrollHeight },
    offscreen: visible.filter((el) => !inside(el)).map((el) => el.id || el.className),
    minChoiceHeight: Math.min(...[...document.querySelectorAll('.choice')].map((el) => el.getBoundingClientRect().height)),
    hudButtons: [...document.querySelectorAll('.hud-btn')].map((el) => Math.round(el.getBoundingClientRect().height)),
  };
}

function distMetrics() {
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else {
        const data = fs.readFileSync(file);
        files.push({ file: path.relative(path.join(root, 'dist'), file), bytes: data.length, gzipBytes: gzipSync(data).length });
      }
    }
  };
  visit(path.join(root, 'dist'));
  return {
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
    totalGzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0),
    largest: files.sort((a, b) => b.bytes - a.bytes).slice(0, 8),
  };
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath });

  const keyboard = await makePage(browser, 'keyboard', { width: 1440, height: 900 }, { ...defaults, motion: 'reduced' });
  const keyboardResult = await fullKeyboardRun(keyboard.page);
  if (!keyboardResult.title || !keyboardResult.rank) throw new Error('Report card was missing its rank or title.');
  if (keyboardResult.speechBubblesSeen < 50) throw new Error(`Only ${keyboardResult.speechBubblesSeen} speech bubbles were shown.`);
  await keyboard.page.waitForTimeout(400);
  await keyboard.page.screenshot({ path: path.join(shotDir, 'report-card.png') });
  await keyboard.context.close();

  const layouts = [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile-portrait', { width: 390, height: 844 }],
    ['small-portrait', { width: 360, height: 800 }],
    ['mobile-landscape', { width: 844, height: 390 }],
  ];
  const layoutResults = {};
  let performanceResult = null;
  for (const [name, viewport] of layouts) {
    // desktop plays with sound + music on, so a missing audio file shows up as a 404
    const item = await makePage(browser, name, viewport, name === 'desktop' ? { ...defaults, sound: true, music: true } : defaults);
    await keyboardStart(item.page, `${origin}/?test`);
    await item.page.keyboard.press('Enter'); // past the episode card
    for (let i = 0; i < 2; i++) await item.page.keyboard.press('Enter');
    await item.page.waitForTimeout(900);
    const line = measureLayout.toString();
    const lineLayout = await item.page.evaluate(`(${line})()`);
    await item.page.screenshot({ path: path.join(shotDir, `${name}-dialogue.png`) });
    await reachFirstChoice(item.page);
    await item.page.waitForTimeout(600);
    const choiceLayout = await item.page.evaluate(`(${line})()`);
    for (const m of [lineLayout, choiceLayout]) {
      if (m.bodyScroll.width > m.viewport.width + 1 || m.bodyScroll.height > m.viewport.height + 1) throw new Error(`${name} scrolls the page.`);
      if (m.offscreen.length) throw new Error(`${name} has dialogue or choices off screen: ${m.offscreen.join(', ')}`);
      if (m.hudButtons.some((h) => h < 44)) throw new Error(`${name} HUD button below 44px.`);
    }
    if (choiceLayout.minChoiceHeight < 44) throw new Error(`${name} choice target is below 44px.`);
    await item.page.screenshot({ path: path.join(shotDir, `${name}-choices.png`) });
    layoutResults[name] = { dialogue: lineLayout, choices: choiceLayout };

    if (name === 'desktop') {
      performanceResult = await item.page.evaluate(async () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByName('first-contentful-paint')[0];
        let frames = 0;
        const start = performance.now();
        await new Promise((resolve) => {
          const frame = (now) => {
            frames++;
            if (now - start >= 1200) resolve();
            else requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        });
        const elapsed = performance.now() - start;
        return {
          responseMs: navigation.responseEnd - navigation.startTime,
          domContentLoadedMs: navigation.domContentLoadedEventEnd - navigation.startTime,
          loadMs: navigation.loadEventEnd - navigation.startTime,
          firstContentfulPaintMs: paint?.startTime || null,
          measuredFps: (frames * 1000) / elapsed,
          transferredBytes: performance.getEntriesByType('resource').reduce((sum, r) => sum + (r.transferSize || 0), navigation.transferSize || 0),
        };
      });
    }
    await item.context.close();
  }

  // Playing as a girl makes the friend next door Kojo, drawn with the boy sprite.
  const girl = await makePage(browser, 'girl-player', { width: 1280, height: 800 }, defaults, 'girl');
  await keyboardStart(girl.page, `${origin}/?test&knot=ep3.errand`);
  let friendTag = '';
  // scene changes now play a curtain, so give the lines time to arrive
  for (let step = 0; step < 80 && !friendTag; step++) {
    friendTag = await girl.page.evaluate(() => (document.querySelector('#bubble:not([hidden]) .tag')?.textContent === 'Kojo' ? 'Kojo' : ''));
    if (!friendTag) await girl.page.keyboard.press('Enter');
    await girl.page.waitForTimeout(120);
  }
  const sprites = await girl.page.evaluate(() => [...document.querySelectorAll('.actor img.on')].map((img) => img.getAttribute('src')));
  if (friendTag !== 'Kojo') throw new Error('Girl player never heard from Kojo.');
  if (!sprites.some((s) => s?.includes('child_girl_')) || !sprites.some((s) => s?.includes('child_boy_'))) throw new Error(`Girl player sprites wrong: ${sprites.join(', ')}`);
  await girl.page.screenshot({ path: path.join(shotDir, 'girl-player-kojo.png') });
  await girl.context.close();

  const reducedPage = await makePage(browser, 'reduced-motion', { width: 390, height: 844 }, { ...defaults, motion: 'reduced' });
  await keyboardStart(reducedPage.page, `${origin}/?test`);
  await reachFirstChoice(reducedPage.page);
  const motion = await reducedPage.page.evaluate(() => ({
    mode: document.documentElement.dataset.motion,
    transition: getComputedStyle(document.querySelector('.choice')).transitionDuration,
    worldTransition: getComputedStyle(document.querySelector('.world')).transitionDuration,
  }));
  if (motion.mode !== 'reduced') throw new Error('Reduced-motion setting was not applied.');
  await reducedPage.page.screenshot({ path: path.join(shotDir, 'reduced-motion.png') });
  await reducedPage.context.close();

  const saving = await makePage(browser, 'save-reload', { width: 1280, height: 800 }, { ...defaults, motion: 'reduced' });
  await keyboardStart(saving.page, `${origin}/?test`);
  // advance past the opening curtain and card until a couple of lines have played
  let shownLines = 0;
  for (let i = 0; i < 40 && shownLines < 2; i++) {
    if (await currentLine(saving.page)) shownLines++;
    await saving.page.keyboard.press('Enter');
    await saving.page.waitForTimeout(150);
  }
  await saving.page.waitForFunction(() => !!document.querySelector('#bubble:not([hidden]) .text, #caption:not([hidden]) .text')?.textContent);
  const savedLine = await currentLine(saving.page);
  const rawSave = await saving.page.evaluate(() => localStorage.getItem('ahd.save'));
  if (!rawSave || !savedLine) throw new Error('No save was written after advancing the story.');
  await saving.page.reload({ waitUntil: 'networkidle' });
  await saving.page.locator('#continue-btn:visible').waitFor();
  await saving.page.keyboard.press('Enter');
  await saving.page.locator('#title-dialog').waitFor({ state: 'hidden' });
  await saving.page.waitForFunction((expected) => document.querySelector('#bubble:not([hidden]) .text, #caption:not([hidden]) .text')?.textContent === expected, savedLine);
  await saving.context.close();

  const result = {
    ranAt: new Date().toISOString(),
    executablePath,
    keyboard: keyboardResult,
    layouts: layoutResults,
    girlPlayer: { friend: friendTag },
    reducedMotion: motion,
    saveReload: { saved: true, restoredSameLine: true, line: savedLine },
    performance: performanceResult,
    bundle: distMetrics(),
    screenshots: fs.readdirSync(shotDir).sort(),
    consoleErrors: allErrors,
    missing404s: missing,
  };
  fs.writeFileSync(path.join(outDir, 'e2e-results.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (allErrors.length || missing.length) process.exitCode = 1;
} finally {
  await browser?.close();
  preview.kill('SIGTERM');
}
