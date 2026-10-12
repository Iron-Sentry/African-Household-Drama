// The director: pulls beats from the ink story and stages them — scene, light,
// camera, cast, expressions, sound — then waits for the player.
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/400-italic.css';
import './styles.css';
import { storyJson, meta } from 'virtual:story';
import { CHARACTERS } from './content/characters.ts';
import { SCENES } from './content/scenes.ts';
import { Session, type Cue, type LineBeat, type Report } from './narrative/session.ts';
import { clearSave, loadProfile, loadSave, writeProfile, writeSave, type Checkpoint, type Settings, type StageState } from './game/save.ts';
import { UI } from './ui/ui.ts';
import { Actors } from './ui/actors.ts';
import { FlatStage, type StageView } from './scene/flat.ts';
import { Audio } from './audio/audio.ts';
import type { Stage3D } from './scene/stage3d.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);
const EPISODE_LINES = [0, 62, 70, 95]; // rough first-play line counts, for the progress bar
const EPISODE_TITLES = ['', 'The Kissing Scene', "The Neighbour's Biscuit", 'The Errand'];

const ui = new UI();
const actors = new Actors($('actors'), $('room'));
const flat = new FlatStage($('flat'), $('flat-bg'), $('tint'));
const audio = new Audio();
let three: Stage3D | null = null;
let threeLost = false;

const profile = loadProfile();
let settings: Settings = profile.settings;
let session = new Session(storyJson);
let running = false;
let runId = 0; // bumps on restart so an old story loop stops cleanly
let episode = 1;
let episodeLines = 0;
let checkpoint: Checkpoint = { episode: 1, vars: {} };
let pendingTimer = 0;

const freshStage = (): StageState => ({ scene: 'hall', light: 'evening', cam: 'wide', amb: '', cast: [], expr: {}, props: { tv: 'off', foil: 'off', lamp: 'off', tray: 'off' } });
let stage = freshStage();

// ---------------------------------------------------------------------------
// Settings & motion
// ---------------------------------------------------------------------------
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => settings.motion === 'reduced' || (settings.motion === 'system' && reducedQuery.matches);

function applySettings() {
  document.documentElement.dataset.motion = reduced() ? 'reduced' : 'full';
  if (three) three.reducedMotion = reduced();
  audio.setEnabled(settings.sound);
  const btn = $('sound-toggle');
  btn.setAttribute('aria-pressed', String(settings.sound));
  btn.querySelector('.label')!.textContent = settings.sound ? 'SOUND ON' : 'SOUND OFF';
  btn.querySelector('.ico')!.textContent = settings.sound ? '♫' : '♪';
  profile.settings = settings;
  writeProfile(profile);
}
reducedQuery.addEventListener('change', applySettings);

// ---------------------------------------------------------------------------
// Staging
// ---------------------------------------------------------------------------
const views = (): StageView[] => (three ? [flat, three] : [flat]);

function setScene(id: string) {
  stage.scene = id;
  stage.cam = 'wide';
  views().forEach((v) => v.setScene(id));
  const s = SCENES[id];
  ui.setScene(s.title, s.location, episode);
  actors.focus('none');
}

/** Re-apply a whole stage snapshot (after loading a save or jumping). */
function applyStage(s: StageState) {
  stage = { ...freshStage(), ...s, props: { ...freshStage().props, ...s.props } };
  setScene(stage.scene);
  views().forEach((v) => {
    v.setShot(stage.cam, true);
    v.setLight(stage.light);
    for (const [k, val] of Object.entries(stage.props)) v.setProp(k, val);
  });
  actors.setCast(stage.cast, stage.expr);
  audio.ambience(stage.amb);
}

function applyCue(c: Cue) {
  switch (c.key) {
    case 'scene': return setScene(c.value);
    case 'light':
      stage.light = c.value;
      return views().forEach((v) => v.setLight(c.value));
    case 'cam':
      if (c.value !== 'push') stage.cam = c.value;
      views().forEach((v) => v.setShot(c.value));
      return setTimeout(() => ui.placeHotspots(), 50);
    case 'prop': {
      const [name, value] = c.value.split('=');
      if (name === 'biscuits' && value.startsWith('-')) stage.props.biscuits = String(Number(stage.props.biscuits || 12) + Number(value));
      else stage.props[name] = value;
      return views().forEach((v) => v.setProp(name, value));
    }
    case 'cast':
      stage.cast = c.value === 'none' ? [] : c.value.split(',').map((s) => s.trim());
      return actors.setCast(stage.cast, stage.expr);
    case 'expr':
      stage.expr[c.who!] = c.value;
      return actors.setExpr(c.who!, c.value);
    case 'emote': return actors.emote(c.who!, c.value);
    case 'anim': return reduced() ? undefined : actors.anim(c.who!, c.value);
    case 'focus': return actors.focus(c.value);
    case 'fx': return ui.fx(c.value, reduced());
    case 'sfx': return audio.sfx(c.value);
    case 'amb':
      stage.amb = c.value;
      return audio.ambience(c.value);
    case 'timer':
      pendingTimer = Number(c.value);
      return;
    case 'episode':
      episode = Number(c.value);
      episodeLines = 0;
      checkpoint = { episode, vars: session.vars() };
      profile.checkpoints[episode] = checkpoint;
      writeProfile(profile);
      ui.setScene(SCENES[stage.scene].title, SCENES[stage.scene].location, episode);
      return;
    case 'moment': {
      const [id, title] = [c.value.slice(0, c.value.indexOf('/')), c.value.slice(c.value.indexOf('/') + 1)];
      if (!profile.moments.includes(id)) {
        profile.moments.push(id);
        writeProfile(profile);
        ui.toast(`✳ Moment discovered: ${title}`);
      }
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// The story loop
// ---------------------------------------------------------------------------
async function play(id: number) {
  while (id === runId) {
    const beat = session.next();
    if (beat.kind === 'end') return;
    if (beat.kind === 'choices') {
      const timer = settings.timedChoices ? pendingTimer : 0;
      pendingTimer = 0;
      ui.clearFeedback();
      const index = await ui.showChoices(beat.choices, { timer });
      if (id !== runId) return;
      audio.sfx('click');
      session.choose(index);
      continue;
    }
    if (beat.cues.some((c) => c.key === 'report')) return showReport(session.collectReport(beat));
    await stageLine(beat, id);
  }
}

async function stageLine(beat: LineBeat, id: number) {
  const before = structuredClone(stage);
  let card: string[] | null = null;
  let note: string | undefined;
  let auto = 0;
  for (const c of beat.cues) {
    if (c.key === 'card') card = c.value.split('/');
    else if (c.key === 'note') note = c.value;
    else if (c.key === 'auto') auto = Number(c.value);
    else applyCue(c);
  }
  writeSave({ ink: beat.resumeState, stage: before, resume: checkpoint });
  ui.setStats(session.stats, note);
  episodeLines++;
  ui.setProgress(((episode - 1 + Math.min(0.97, episodeLines / EPISODE_LINES[episode])) / 3) * 100, EPISODE_TITLES[episode] || '');
  if (card) {
    if (episode === 1 && card[0] === 'Episode One') audio.sfx('title');
    await ui.card(card[0], card[1], card[2], reduced() ? 2200 : 3200);
    if (id !== runId) return;
  }
  if (!beat.text) return;
  const who = beat.speaker?.body ? beat.speaker.id : null;
  actors.speaking(who);
  const stopTalking = setTimeout(() => actors.stopTalking(), Math.min(4200, 400 + beat.text.length * 22));
  await ui.showLine(beat.speaker, beat.text, { auto, speed: settings.textSpeed, expr: who ? stage.expr[who] : undefined });
  clearTimeout(stopTalking);
  actors.stopTalking();
}

function start(kind: 'new' | 'continue' | { episode: number }) {
  runId++;
  session = new Session(storyJson);
  stage = freshStage();
  episode = 1;
  episodeLines = 0;
  pendingTimer = 0;
  checkpoint = { episode: 1, vars: {} };
  const save = kind === 'continue' ? loadSave() : null;
  let resumed = false;
  if (save?.ink) {
    try {
      session.restore(save.ink);
      checkpoint = save.resume;
      episode = save.resume.episode;
      if (save.stage) applyStage(save.stage);
      resumed = true;
    } catch {
      /* story was edited since this save: fall back to the episode checkpoint */
    }
  }
  if (!resumed) {
    const cp = save?.resume || (typeof kind === 'object' ? profile.checkpoints[kind.episode] : null);
    const knot = params.get('knot');
    if (cp && cp.episode > 0) session.jump(`ep${cp.episode}`, cp.vars);
    else if (knot && params.has('dev')) session.jump(knot, devVars());
    else if (kind === 'new') clearSave();
    applyStage(stage);
  }
  ui.resetStats(session.stats);
  running = true;
  play(runId);
}

function devVars() {
  const out: Record<string, unknown> = {};
  for (const pair of (params.get('set') || '').split(',').filter(Boolean)) {
    const [k, v] = pair.split(':');
    out[k] = v === 'true' ? true : v === 'false' ? false : isNaN(Number(v)) ? v : Number(v);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Report card
// ---------------------------------------------------------------------------
function showReport(r: Report) {
  running = false;
  clearSave();
  if (!profile.endings.includes(r.rank)) profile.endings.push(r.rank);
  writeProfile(profile);
  const dlg = $<HTMLDialogElement>('report-dialog');
  dlg.dataset.rank = r.rank;
  $('report-title').textContent = r.title;
  $('report-stamp').textContent = { golden: '✷', akola: '!', strategist: '✦', comedian: '☺' }[r.rank] || '✳';
  $('report-copy').replaceChildren(...r.copy.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  if (r.quote) {
    $('report-portrait').innerHTML = UI.portrait(r.quote.who, r.quote.expr);
    $('report-quote-text').textContent = `“${r.quote.text}”`;
    $('report-quote-who').textContent = r.quote.speaker;
  }
  const s = session.stats;
  $('report-scores').innerHTML = (['approval', 'smarts', 'trouble'] as const)
    .map((k) => `<div class="score"><span>${{ approval: 'Approval', smarts: 'Street Smarts', trouble: 'Trouble' }[k]}</span><strong>${s[k]}</strong><span class="stat-bar"><span style="width:${s[k]}%"></span></span></div>`)
    .join('');
  $('report-remember').replaceChildren(...r.remember.map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  const found = meta.moments.filter((m) => profile.moments.includes(m.id));
  $('report-moments-title').textContent = `Moments discovered: ${found.length} of ${meta.moments.length}`;
  $('report-moments').replaceChildren(
    ...meta.moments.map((m) => {
      const li = document.createElement('li');
      const got = profile.moments.includes(m.id);
      li.className = got ? 'got' : 'locked';
      li.textContent = got ? m.title : '???';
      return li;
    }),
  );
  $('report-moments-title').insertAdjacentHTML('beforeend', '');
  ui.announce(`Report card. ${r.title}.`);
  setTimeout(() => {
    dlg.showModal();
    audio.sfx(r.rank === 'akola' ? 'sting' : 'title');
  }, reduced() ? 300 : 1200);
}

// ---------------------------------------------------------------------------
// Title, settings and episodes dialogs (native <dialog>: focus trap + inert page)
// ---------------------------------------------------------------------------
const titleDlg = $<HTMLDialogElement>('title-dialog');
const settingsDlg = $<HTMLDialogElement>('settings-dialog');
const episodesDlg = $<HTMLDialogElement>('episodes-dialog');
const reportDlg = $<HTMLDialogElement>('report-dialog');

function openTitle() {
  const hasSave = !!loadSave();
  $('continue-btn').hidden = !hasSave;
  $('episodes-btn').hidden = !Object.keys(profile.checkpoints).length;
  $('new-btn').querySelector('span')!.textContent = hasSave ? 'START OVER' : 'ENTER THE HOUSEHOLD';
  const n = profile.moments.length;
  $('title-moments').textContent = n ? `${n} OF ${meta.moments.length} MOMENTS DISCOVERED · ${profile.endings.length} OF 4 ENDINGS` : 'EVERY CHOICE IS REMEMBERED. BY SOMEBODY.';
  three?.setActive(false);
  audio.setPaused(true);
  if (!titleDlg.open) titleDlg.showModal();
  (hasSave ? $('continue-btn') : $('new-btn')).focus();
}

function closeTitle() {
  titleDlg.close();
  three?.setActive(true);
  audio.setPaused(false);
  requestAnimationFrame(() => ui.focusContinue());
}

titleDlg.addEventListener('cancel', (e) => {
  e.preventDefault(); // Escape resumes only if a story is running
  if (running) closeTitle();
});
$('continue-btn').addEventListener('click', () => {
  closeTitle();
  if (!running) start('continue');
});
$('new-btn').addEventListener('click', () => {
  if (loadSave() && running && !confirm('Start a new story? Your current progress will be replaced.')) return;
  closeTitle();
  start('new');
});
$('episodes-btn').addEventListener('click', () => openEpisodes());
$('title-settings-btn').addEventListener('click', () => openSettings());
$('brand-home').addEventListener('click', (e) => {
  e.preventDefault();
  openTitle();
});

function openEpisodes() {
  const list = $('episode-list');
  list.replaceChildren(
    ...[1, 2, 3].map((n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'episode-btn';
      b.disabled = !profile.checkpoints[n];
      b.innerHTML = `<span>EPISODE 0${n}</span><strong></strong>`;
      b.querySelector('strong')!.textContent = b.disabled ? 'Locked. Reach it in the story first.' : EPISODE_TITLES[n];
      b.addEventListener('click', () => {
        episodesDlg.close();
        reportDlg.close();
        if (titleDlg.open) closeTitle();
        start({ episode: n });
      });
      return b;
    }),
  );
  episodesDlg.showModal();
}

function openSettings() {
  const form = settingsDlg.querySelector('form')!;
  (form.elements.namedItem('sound') as HTMLInputElement).checked = settings.sound;
  (form.elements.namedItem('timedChoices') as HTMLInputElement).checked = settings.timedChoices;
  form.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => (r.checked = settings[r.name as 'motion' | 'textSpeed'] === r.value));
  three?.setActive(false);
  settingsDlg.showModal();
}

settingsDlg.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  settings = { ...settings, [t.name]: t.type === 'checkbox' ? t.checked : t.value };
  applySettings();
});
settingsDlg.addEventListener('close', () => {
  if (!titleDlg.open) three?.setActive(true);
});
$('restart-btn').addEventListener('click', () => {
  if (!confirm('Restart from the beginning of Episode One?')) return;
  settingsDlg.close();
  if (titleDlg.open) closeTitle();
  clearSave();
  start('new');
});
$('settings-open').addEventListener('click', openSettings);
$('sound-toggle').addEventListener('click', () => {
  settings = { ...settings, sound: !settings.sound };
  applySettings();
  if (settings.sound) audio.sfx('good');
});
$('report-again').addEventListener('click', () => {
  reportDlg.close();
  start('new');
});
$('report-episodes').addEventListener('click', openEpisodes);
reportDlg.addEventListener('cancel', (e) => e.preventDefault());

// ---------------------------------------------------------------------------
// Keyboard: Enter/Space continue, digits choose, Escape opens the menu
// ---------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector('dialog[open]')) return;
  const target = e.target as HTMLElement;
  if (e.key === 'Escape') return openTitle();
  if (/^[1-9]$/.test(e.key) && !e.repeat) {
    if (ui.chooseByKey(e.key)) e.preventDefault();
    return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
    const onOtherControl = target.closest('button, a, input') && target.id !== 'continue';
    if (onOtherControl) return;
    e.preventDefault();
    ui.next();
  }
});

// Pause sound when the tab is hidden.
document.addEventListener('visibilitychange', () => audio.setPaused(document.hidden || titleDlg.open));

// ---------------------------------------------------------------------------
// 3D stage: progressive enhancement over the illustrated fallback
// ---------------------------------------------------------------------------
async function launch3D() {
  if (params.has('flat')) return;
  try {
    const { Stage3D } = await import('./scene/stage3d.ts');
    three = new Stage3D($<HTMLCanvasElement>('three-canvas'), $('room'));
  } catch (err) {
    console.info('3D stage unavailable, using the illustrated stage.', err);
    return;
  }
  three.reducedMotion = reduced();
  three.onFrame = () => ui.placeHotspots();
  three.onLost = (lost) => {
    threeLost = lost;
    $('room').classList.toggle('three-ready', !lost);
    ui.placeHotspots();
  };
  three.setScene(stage.scene);
  three.setShot(stage.cam, true);
  three.setLight(stage.light);
  for (const [k, v] of Object.entries(stage.props)) three.setProp(k, v);
  three.setActive(!titleDlg.open);
  requestAnimationFrame(() => $('room').classList.add('three-ready'));
  if (params.has('dev') || params.has('test')) Object.assign(window, { __stage: three });
}

ui.project = (id) => (three && !threeLost ? three.project(id) : flat.project(id));

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
applySettings();
flat.setScene('hall');
flat.setLight('evening');
ui.setScene(SCENES.hall.title, SCENES.hall.location, 1);
ui.resetStats(session.stats);
ui.setSpeaker(null);
openTitle();
launch3D();

if (params.has('dev')) {
  import('./dev/devtools.ts').then(({ mountDevtools }) =>
    mountDevtools({
      knots: meta.knots,
      session: () => session,
      jump: (knot: string, vars: Record<string, unknown>) => {
        runId++;
        session = new Session(storyJson);
        session.jump(knot, vars);
        stage = freshStage();
        applyStage(stage);
        ui.resetStats(session.stats);
        if (titleDlg.open) closeTitle();
        running = true;
        play(runId);
      },
    }),
  );
}
if (params.has('dev') || params.has('test')) Object.assign(window, { __ahd: { session: () => session, profile, CHARACTERS } });
