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

const defaults = { sound: false, timedChoices: false, textSpeed: 'instant', motion: 'full' };
const allErrors = [];
const missing = [];
const expectedWebglErrors = [];

function monitor(page, scenario, allowWebglFailure = false) {
  page.on('pageerror', (error) => allErrors.push(`${scenario}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const entry = `${scenario}: ${message.text()}`;
    if (allowWebglFailure && /webgl|context/i.test(entry)) expectedWebglErrors.push(entry);
    else allErrors.push(entry);
  });
  page.on('response', (response) => {
    if (response.status() === 404) missing.push(`${scenario}: ${response.url()}`);
  });
}

async function makePage(browser, scenario, viewport, settings = defaults, allowWebglFailure = false) {
  const context = await browser.newContext({ viewport, reducedMotion: settings.motion === 'reduced' ? 'reduce' : 'no-preference' });
  await context.addInitScript((savedSettings) => {
    if (sessionStorage.getItem('ahd.e2e-ready')) return;
    sessionStorage.setItem('ahd.e2e-ready', '1');
    localStorage.clear();
    localStorage.setItem('ahd.profile', JSON.stringify({
      version: 1,
      moments: [],
      endings: [],
      checkpoints: {},
      settings: savedSettings,
    }));
  }, settings);
  const page = await context.newPage();
  monitor(page, scenario, allowWebglFailure);
  return { context, page };
}

async function keyboardStart(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#title-dialog[open]').waitFor();
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (focused !== 'new-btn') throw new Error(`Title focus was ${focused || '(none)'}, expected new-btn`);
  await page.keyboard.press('Enter');
  await page.locator('#title-dialog').waitFor({ state: 'hidden' });
}

async function reachFirstChoice(page) {
  for (let step = 0; step < 50; step++) {
    if (await page.locator('#choices .choice-btn').first().isVisible().catch(() => false)) {
      await page.locator('#card').waitFor({ state: 'hidden' });
      return;
    }
    await page.keyboard.press('Enter');
    await page.waitForTimeout(25);
  }
  throw new Error('Did not reach the first Episode 1 choice.');
}

async function fullKeyboardRun(page) {
  await keyboardStart(page, `${origin}/?test&flat`);
  let decisions = 0;
  for (let step = 0; step < 900; step++) {
    if (await page.locator('#report-dialog[open]').count()) {
      return {
        decisions,
        title: await page.locator('#report-title').textContent(),
        rank: await page.locator('#report-dialog').getAttribute('data-rank'),
      };
    }
    if (await page.locator('#choices .choice-btn').first().isVisible().catch(() => false)) {
      await page.keyboard.press('1');
      decisions++;
    } else {
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(15);
  }
  throw new Error('Keyboard play-through did not reach the report card.');
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
let noGpuBrowser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath });

  const keyboard = await makePage(browser, 'keyboard', { width: 1440, height: 900 }, { ...defaults, motion: 'reduced' });
  const keyboardResult = await fullKeyboardRun(keyboard.page);
  if (!keyboardResult.title || !keyboardResult.rank) throw new Error('Report card was missing its rank or title.');
  await keyboard.page.screenshot({ path: path.join(shotDir, 'report-card.png') });
  await keyboard.context.close();

  const layouts = [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile-portrait', { width: 390, height: 844 }],
    ['mobile-landscape', { width: 844, height: 390 }],
  ];
  const layoutResults = {};
  let performanceResult = null;
  for (const [name, viewport] of layouts) {
    const item = await makePage(browser, name, viewport);
    await keyboardStart(item.page, `${origin}/?test`);
    await reachFirstChoice(item.page);
    await item.page.locator('#room.three-ready').waitFor({ timeout: 10_000 });
    const measurements = await item.page.evaluate(() => ({
      viewport: { width: innerWidth, height: innerHeight },
      bodyScroll: { width: document.body.scrollWidth, height: document.body.scrollHeight },
      world: document.getElementById('world').getBoundingClientRect().toJSON(),
      panel: document.getElementById('panel').getBoundingClientRect().toJSON(),
      panelOverflowY: getComputedStyle(document.getElementById('panel')).overflowY,
      minChoiceHeight: Math.min(...[...document.querySelectorAll('.choice-btn')].map((el) => el.getBoundingClientRect().height)),
    }));
    if (measurements.bodyScroll.width > measurements.viewport.width + 1) throw new Error(`${name} has horizontal page overflow.`);
    if (measurements.minChoiceHeight < 44) throw new Error(`${name} choice target is below 44px.`);
    if (name !== 'desktop' && measurements.bodyScroll.height > measurements.viewport.height + 1) throw new Error(`${name} scrolls the page instead of the story panel.`);
    await item.page.screenshot({ path: path.join(shotDir, `${name}-episode1.png`) });
    layoutResults[name] = measurements;

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
          webgl: !!document.querySelector('#room.three-ready'),
          tier: window.__stage?.tier || null,
        };
      });

      const hadStage = await item.page.evaluate(() => !!(window).__stage);
      if (!hadStage) throw new Error('3D test hook was not exposed.');
      await item.page.evaluate(() => (window).__stage.loseContext());
      await item.page.locator('#room:not(.three-ready)').waitFor({ timeout: 5_000 });
      await item.page.waitForFunction(() => Number(getComputedStyle(document.querySelector('#flat')).opacity) > 0.9);
      await item.page.evaluate(() => (window).__stage.restoreContext());
      await item.page.locator('#room.three-ready').waitFor({ timeout: 8_000 });
    }
    await item.context.close();
  }

  const flat = await makePage(browser, 'flat', { width: 1440, height: 900 });
  await keyboardStart(flat.page, `${origin}/?test&flat`);
  await reachFirstChoice(flat.page);
  if (await flat.page.locator('#room.three-ready').count()) throw new Error('?flat unexpectedly initialized Three.js.');
  const flatImage = await flat.page.locator('#flat-bg').evaluate((el) => getComputedStyle(el).backgroundImage);
  if (!flatImage.includes('room-tv.svg')) throw new Error('Flat fallback did not load the hall artwork.');
  await flat.page.screenshot({ path: path.join(shotDir, 'flat-fallback.png') });
  await flat.context.close();

  const reducedPage = await makePage(browser, 'reduced-motion', { width: 390, height: 844 }, { ...defaults, motion: 'reduced' });
  await keyboardStart(reducedPage.page, `${origin}/?test&flat`);
  await reachFirstChoice(reducedPage.page);
  const motion = await reducedPage.page.evaluate(() => ({
    mode: document.documentElement.dataset.motion,
    transition: getComputedStyle(document.querySelector('.choice-btn')).transitionDuration,
    animation: getComputedStyle(document.querySelector('.red-record')).animationDuration,
  }));
  if (motion.mode !== 'reduced') throw new Error('Reduced-motion setting was not applied.');
  await reducedPage.page.screenshot({ path: path.join(shotDir, 'reduced-motion.png') });
  await reducedPage.context.close();

  const saving = await makePage(browser, 'save-reload', { width: 1280, height: 800 }, { ...defaults, motion: 'reduced' });
  await keyboardStart(saving.page, `${origin}/?test&flat`);
  await saving.page.keyboard.press('Enter');
  await saving.page.waitForTimeout(50);
  const savedLine = await saving.page.locator('#line').textContent();
  const rawSave = await saving.page.evaluate(() => localStorage.getItem('ahd.save'));
  if (!rawSave) throw new Error('No save was written after advancing the story.');
  await saving.page.reload({ waitUntil: 'networkidle' });
  await saving.page.locator('#continue-btn:visible').waitFor();
  await saving.page.keyboard.press('Enter');
  await saving.page.locator('#title-dialog').waitFor({ state: 'hidden' });
  await saving.page.waitForFunction((expected) => document.querySelector('#line')?.textContent === expected, savedLine);
  const restoredLine = await saving.page.locator('#line').textContent();
  if (restoredLine !== savedLine) throw new Error(`Reload restored a different line: "${savedLine}" -> "${restoredLine}"`);
  await saving.context.close();

  noGpuBrowser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--disable-gpu', '--disable-webgl'],
  });
  const disabled = await makePage(noGpuBrowser, 'webgl-disabled', { width: 1280, height: 800 }, defaults, true);
  await keyboardStart(disabled.page, `${origin}/?test`);
  await reachFirstChoice(disabled.page);
  await disabled.page.waitForTimeout(700);
  if (await disabled.page.locator('#room.three-ready').count()) throw new Error('Three.js became ready with WebGL explicitly disabled.');
  const disabledFallback = await disabled.page.locator('#flat').evaluate((el) => Number(getComputedStyle(el).opacity) > 0.9);
  if (!disabledFallback) throw new Error('Fallback was not visible with WebGL disabled.');
  await disabled.page.screenshot({ path: path.join(shotDir, 'webgl-disabled-fallback.png') });
  await disabled.context.close();

  const result = {
    ranAt: new Date().toISOString(),
    executablePath,
    keyboard: keyboardResult,
    layouts: layoutResults,
    fallbacks: { flat: true, webglDisabled: true, contextLossRecovered: true },
    reducedMotion: motion,
    saveReload: { saved: true, restoredSameLine: true },
    performance: performanceResult,
    bundle: distMetrics(),
    screenshots: fs.readdirSync(shotDir).sort(),
    consoleErrors: allErrors,
    expectedWebglErrors,
    missing404s: missing,
  };
  fs.writeFileSync(path.join(outDir, 'e2e-results.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (allErrors.length || missing.length) process.exitCode = 1;
} finally {
  await noGpuBrowser?.close();
  await browser?.close();
  preview.kill('SIGTERM');
}
