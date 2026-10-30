// The director: pulls beats from the ink story and stages them (scene, light,
// camera, cast, poses, sound), then hangs each line off whoever is speaking.
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
import { CHARACTERS, castEntry, poseUrl, type Player } from './content/characters.ts';
import { SCENES } from './content/scenes.ts';
import { Session, type Cue, type LineBeat, type Report } from './narrative/session.ts';
import { clearSave, loadProfile, loadSave, writeProfile, writeSave, type Checkpoint, type Settings, type StageState } from './game/save.ts';
import { UI } from './ui/ui.ts';
import { Stage } from './stage/stage.ts';
import { Audio } from './audio/audio.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);
const EPISODE_TITLES = [
  '', 'The Kissing Scene', "The Neighbour's Biscuit", 'The Errand', 'The Science Homework', 'When Mummy Calls Your Full Name',
  'The Meat in the Soup', 'Who Touched the Remote?', 'The Water You Forgot to Fetch', 'Five More Minutes', 'Sunday Best',
  'The Family Gossip Trap', 'Who Finished the Malt?', 'Christmas Visitors Are Coming',
];
const EPISODES = EPISODE_TITLES.length - 1;

const ui = new UI();
const stage = new Stage($('stage'));
const audio = new Audio();

const profile = loadProfile();
let settings: Settings = profile.settings;
let session = new Session(storyJson);
let running = false;
let runId = 0; // bumps on restart so an old story loop stops cleanly
let episode = 1;
let checkpoint: Checkpoint = { episode: 1, vars: {} };
let pendingTimer = 0;
let pendingHint = '';

const freshState = (): StageState => ({
  player: profile.player,
  scene: 'hall',
  light: 'evening',
  cam: 'wide',
  amb: '',
  cast: [],
  expr: {},
  outfit: {},
  props: { tv: 'off', auntie_tv: 'off', foil: 'off', lamp: 'off', keyhole: 'off' },
});
let state = freshState();

// ---------------------------------------------------------------------------
// Settings & motion
// ---------------------------------------------------------------------------
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => settings.motion === 'reduced' || (settings.motion === 'system' && reducedQuery.matches);

function applySettings() {
  document.documentElement.dataset.motion = reduced() ? 'reduced' : 'full';
  document.documentElement.dataset.text = settings.bigText ? 'big' : 'normal';
  stage.reduced = reduced();
  audio.setEnabled(settings.sound);
  audio.setMusic(settings.music);
  $('mute-btn').setAttribute('aria-pressed', String(!settings.sound));
  $('mute-btn').classList.toggle('off', !settings.sound);
  profile.settings = settings;
  writeProfile(profile);
}
reducedQuery.addEventListener('change', applySettings);

// ---------------------------------------------------------------------------
// Staging
// ---------------------------------------------------------------------------
/** Re-apply a whole stage snapshot (after loading a save or jumping). */
function applyState(s: StageState) {
  const fresh = freshState();
  state = { ...fresh, ...s, props: { ...fresh.props, ...s.props } };
  stage.setPlayer(state.player);
  stage.setScene(state.scene);
  stage.setLight(state.light);
  for (const [k, v] of Object.entries(state.props)) stage.setProp(k, v);
  for (const [id, o] of Object.entries(state.outfit || {})) stage.setOutfit(id, o);
  stage.setCast(state.cast, state.expr);
  for (const { id } of state.cast.map(castEntry)) stage.setExpr(id, state.expr[id] || 'neutral');
  stage.setShot(state.cam, true);
  aimKeyhole();
  audio.ambience(state.amb);
}

/** Peeping through the door: the hole follows what the scene says the child is looking at. */
function aimKeyhole() {
  const on = state.props.keyhole === 'on';
  const at = SCENES[state.scene]?.keyhole;
  ui.keyhole(on, on && at ? stage.project(at[0], at[1]) : undefined);
}
addEventListener('resize', () => requestAnimationFrame(aimKeyhole));

function applyCue(c: Cue) {
  switch (c.key) {
    case 'scene':
      state.scene = c.value;
      state.cam = 'wide';
      return stage.setScene(c.value);
    case 'light':
      state.light = c.value;
      return stage.setLight(c.value);
    case 'cam':
      if (c.value !== 'push') state.cam = c.value;
      return stage.setShot(c.value);
    case 'prop': {
      const [name, value] = c.value.split('=');
      state.props[name] = value;
      if (name === 'keyhole') return aimKeyhole();
      return stage.setProp(name, value);
    }
    case 'cast':
      state.cast = c.value === 'none' ? [] : c.value.split(',').map((s) => s.trim());
      return stage.setCast(state.cast, state.expr);
    case 'outfit':
      state.outfit = { ...state.outfit, [c.who!]: c.value };
      return stage.setOutfit(c.who!, c.value);
    case 'expr':
      state.expr[c.who!] = c.value;
      return stage.setExpr(c.who!, c.value);
    case 'emote': return stage.emote(c.who!, c.value);
    case 'sticker':
      audio.sfx('pop');
      return reduced() ? undefined : stage.sticker(c.who!, c.value);
    case 'anim': return stage.anim(c.who!, c.value);
    case 'focus': return stage.focus(c.value);
    case 'readroom':
      ui.readRoomStamp();
      return stage.setReadRoom(true);
    case 'fx': return ui.fx(c.value, reduced());
    case 'sfx': return audio.sfx(c.value);
    case 'amb':
      state.amb = c.value;
      return audio.ambience(c.value);
    case 'timer':
      pendingTimer = Number(c.value);
      return;
    case 'hint':
      pendingHint = c.value;
      return;
    case 'episode':
      episode = Number(c.value);
      checkpoint = { episode, vars: session.vars() };
      profile.checkpoints[episode] = checkpoint;
      writeProfile(profile);
      ui.setEpisode(episode, EPISODE_TITLES[episode]);
      return;
    case 'moment': {
      const cut = c.value.indexOf('/');
      const [id, title] = [c.value.slice(0, cut), c.value.slice(cut + 1)];
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
      const hint = pendingHint;
      pendingTimer = 0;
      pendingHint = '';
      stage.speaking('child');
      stage.setChoosing(true);
      const index = await ui.showChoices(beat.choices, {
        timer,
        hint,
        hintOpen: session.stats.smarts >= 50,
        hotspots: (list) => (list.length ? stage.showHotspots(list) : stage.clearHotspots()),
        faces: stage.faces(),
      });
      if (id !== runId) return;
      audio.sfx('click');
      stage.setChoosing(false);
      stage.setReadRoom(false);
      session.choose(index);
      continue;
    }
    if (beat.cues.some((c) => c.key === 'report')) return showReport(session.collectReport(beat));
    await stageLine(beat, id);
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function stageLine(beat: LineBeat, id: number) {
  const before = structuredClone(state);
  // A new location (or an episode card) changes behind a curtain, never in a single frame.
  const sceneCue = beat.cues.find((c) => c.key === 'scene' && c.value !== state.scene);
  const hasCard = beat.cues.some((c) => c.key === 'card');
  const kind = beat.cues.find((c) => c.key === 'transition')?.value || 'fade';
  const covered = (!!sceneCue || hasCard) && kind !== 'cut';
  const place = sceneCue && !hasCard ? SCENES[sceneCue.value] : null;
  if (covered) {
    if (kind === 'iris') audio.sfx('whoosh');
    await ui.cover(kind, place && { title: place.title, location: place.location }, reduced());
    if (id !== runId) return;
  }
  let card: string[] | null = null;
  let note: string | undefined;
  let insert: string | undefined;
  let auto = 0;
  for (const c of beat.cues) {
    if (c.key === 'card') card = c.value.split('/');
    else if (c.key === 'note') note = c.value;
    else if (c.key === 'auto') auto = Number(c.value);
    else if (c.key === 'insert') insert = c.value;
    else applyCue(c);
  }
  if (state.props.keyhole === 'on') aimKeyhole();
  writeSave({ ink: beat.resumeState, stage: before, resume: checkpoint });
  if (covered) {
    // hold long enough to read the place name, and until the new art can draw
    await Promise.all([stage.ready(), wait(place && !reduced() ? 1000 : 150)]);
    if (id !== runId) return;
  }
  if (card) {
    if (episode === 1 && card[0] === 'Episode One') audio.sfx('title');
    await ui.card(card[0], card[1], card[2], reduced() ? 2400 : 3400);
    if (id !== runId) return;
  }
  if (covered) {
    stage.settle();
    await ui.uncover(reduced());
    if (id !== runId) return;
  }
  ui.setStats(session.stats, note);
  if (!beat.text) return;
  const who = beat.speaker?.id ?? null;
  stage.speaking(who && CHARACTERS[who].sprite ? who : null);
  if (who) await stage.measured(who);
  await stage.landing(); // a long pan finishes before the bubble hangs off its face
  if (id !== runId) return;
  const anchor = who ? stage.anchor(who) : null;
  const stopTalking = setTimeout(() => stage.speaking(null), Math.min(4200, 400 + beat.text.length * 22));
  await ui.showLine(beat.speaker, beat.name, beat.text, { auto, speed: settings.textSpeed, anchor, faces: stage.faces(), insert });
  clearTimeout(stopTalking);
}

function start(kind: 'new' | 'continue' | { episode: number }) {
  runId++;
  ui.clearCurtain();
  session = new Session(storyJson);
  session.setPlayer(profile.player);
  state = freshState();
  episode = 1;
  pendingTimer = 0;
  pendingHint = '';
  checkpoint = { episode: 1, vars: {} };
  const save = kind === 'continue' ? loadSave() : null;
  let resumed = false;
  if (save?.ink) {
    try {
      session.restore(save.ink);
      checkpoint = save.resume;
      episode = save.resume.episode;
      applyState(save.stage || freshState());
      resumed = true;
    } catch {
      /* story was edited since this save: fall back to the episode checkpoint */
    }
  }
  if (!resumed) {
    const cp = save?.resume || (typeof kind === 'object' ? profile.checkpoints[kind.episode] : null);
    const knot = params.get('knot');
    if (cp && cp.episode > 0) session.jump(`ep${cp.episode}`, cp.vars);
    else if (knot && (params.has('dev') || params.has('test'))) session.jump(knot, devVars());
    else if (kind === 'new') clearSave();
    session.setPlayer(profile.player);
    applyState(state);
  }
  ui.setEpisode(episode, EPISODE_TITLES[episode]);
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
  ui.hideDialogue();
  if (!profile.endings.includes(r.rank)) profile.endings.push(r.rank);
  writeProfile(profile);
  const dlg = $<HTMLDialogElement>('report-dialog');
  dlg.dataset.rank = r.rank;
  $('report-title').textContent = r.title;
  $('report-copy').replaceChildren(...r.copy.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  if (r.quote) {
    $<HTMLImageElement>('report-portrait').src = poseUrl(r.quote.who, r.quote.expr, profile.player) || '';
    $('report-quote-text').textContent = `“${r.quote.text}”`;
    $('report-quote-who').textContent = r.quote.speaker;
  }
  const s = session.stats;
  $('report-scores').replaceChildren(
    ...(['approval', 'smarts', 'trouble'] as const).map((k) => {
      const d = document.createElement('div');
      d.className = 'score';
      d.style.setProperty('--pct', `${s[k]}%`);
      d.innerHTML = `<span>${{ approval: 'Approval', smarts: 'Street Smarts', trouble: 'Trouble' }[k]}</span><strong>${s[k]}</strong><i></i>`;
      return d;
    }),
  );
  $('report-remember').replaceChildren(...r.remember.map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  $('report-moments-title').textContent = `Moments discovered: ${meta.moments.filter((m) => profile.moments.includes(m.id)).length} of ${meta.moments.length}`;
  $('report-moments').replaceChildren(
    ...meta.moments.map((m) => {
      const got = profile.moments.includes(m.id);
      return Object.assign(document.createElement('li'), { className: got ? 'got' : 'locked', textContent: got ? m.title : '???' });
    }),
  );
  ui.announce(`Report card. ${r.title}.`);
  setTimeout(() => {
    dlg.showModal();
    audio.sfx(r.rank === 'akola' ? 'sting' : 'title');
  }, reduced() ? 300 : 1400);
}

// ---------------------------------------------------------------------------
// Title, player choice, pause, log and episodes (native <dialog>: focus trap + inert page)
// ---------------------------------------------------------------------------
const titleDlg = $<HTMLDialogElement>('title-dialog');
const whoDlg = $<HTMLDialogElement>('who-dialog');
const settingsDlg = $<HTMLDialogElement>('settings-dialog');
const episodesDlg = $<HTMLDialogElement>('episodes-dialog');
const logDlg = $<HTMLDialogElement>('log-dialog');
const reportDlg = $<HTMLDialogElement>('report-dialog');

function openTitle() {
  const hasSave = !!loadSave();
  $('continue-btn').hidden = !hasSave;
  $('episodes-btn').hidden = !Object.keys(profile.checkpoints).length;
  $('new-btn').textContent = hasSave ? 'Start a new story' : 'Enter the household';
  $('new-btn').classList.toggle('ghost', hasSave);
  $('new-btn').classList.toggle('primary', !hasSave);
  const n = profile.moments.length;
  $('title-moments').textContent = n ? `${n} of ${meta.moments.length} moments discovered · ${profile.endings.length} of 4 endings` : `${EPISODES} episodes · about an hour`;
  audio.setTitle(true);
  if (!titleDlg.open) titleDlg.showModal();
  (hasSave ? $('continue-btn') : $('new-btn')).focus();
}

function closeTitle() {
  titleDlg.close();
  audio.setTitle(false);
}

titleDlg.addEventListener('cancel', (e) => {
  e.preventDefault(); // Escape resumes only if a story is running
  if (running) closeTitle();
});
$('continue-btn').addEventListener('click', () => {
  closeTitle();
  start('continue');
});
$('new-btn').addEventListener('click', () => {
  if (loadSave() && !confirm('Start a new story? Your current progress will be replaced.')) return;
  whoDlg.showModal();
  whoDlg.querySelector<HTMLButtonElement>(`.who-btn[value="${profile.player}"]`)?.focus();
});
whoDlg.addEventListener('close', () => {
  const p = whoDlg.returnValue as Player;
  whoDlg.returnValue = '';
  if (p !== 'boy' && p !== 'girl') return;
  profile.player = p;
  writeProfile(profile);
  reportDlg.close();
  if (titleDlg.open) closeTitle();
  start('new');
});
$('episodes-btn').addEventListener('click', () => openEpisodes());
$('title-settings-btn').addEventListener('click', () => openSettings());

function openEpisodes() {
  $('episode-list').replaceChildren(
    ...Array.from({ length: EPISODES }, (_, i) => i + 1).map((n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'episode-btn';
      b.disabled = !profile.checkpoints[n];
      b.innerHTML = `<span>Episode ${n}</span><strong></strong>`;
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
  for (const k of ['sound', 'music', 'timedChoices', 'bigText'] as const) (form.elements.namedItem(k) as HTMLInputElement).checked = settings[k];
  form.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => (r.checked = settings[r.name as 'motion' | 'textSpeed'] === r.value));
  $('title-btn').hidden = titleDlg.open;
  audio.setPaused(true);
  settingsDlg.showModal();
}

settingsDlg.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  settings = { ...settings, [t.name]: t.type === 'checkbox' ? t.checked : t.value };
  applySettings();
  if (t.name === 'sound' && t.checked) {
    audio.unlock();
    audio.sfx('good');
  }
});
settingsDlg.addEventListener('close', () => audio.setPaused(false));
$('restart-btn').addEventListener('click', () => {
  if (!confirm('Restart from the beginning of Episode One?')) return;
  settingsDlg.close();
  if (titleDlg.open) closeTitle();
  clearSave();
  start('new');
});
$('title-btn').addEventListener('click', () => {
  settingsDlg.close();
  openTitle();
});
$('menu-btn').addEventListener('click', openSettings);
$('mute-btn').addEventListener('click', () => {
  settings = { ...settings, sound: !settings.sound };
  applySettings();
  audio.unlock();
});
$('log-btn').addEventListener('click', () => {
  logDlg.showModal();
  ui.renderLog($('log'));
});
$('report-again').addEventListener('click', () => $('new-btn').click());
$('report-episodes').addEventListener('click', openEpisodes);
reportDlg.addEventListener('cancel', (e) => e.preventDefault());

// ---------------------------------------------------------------------------
// Keyboard: Enter/Space continue, digits choose, Escape pauses
// ---------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector('dialog[open]')) return;
  const target = e.target as HTMLElement;
  if (e.key === 'Escape') return openSettings();
  if (/^[1-9]$/.test(e.key) && !e.repeat) {
    if (ui.chooseByKey(e.key)) e.preventDefault();
    return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
    if (target.closest('button, a, input') && target.id !== 'continue') return;
    e.preventDefault();
    ui.next();
  }
});

addEventListener('pointerdown', () => (document.documentElement.dataset.input = 'pointer'), true);
addEventListener('keydown', () => (document.documentElement.dataset.input = 'keys'), true);

// Browsers only allow sound after a gesture; the first tap or key starts it.
addEventListener('pointerdown', () => audio.unlock(), true);
addEventListener('keydown', () => audio.unlock(), true);
// Pause sound when the tab is hidden.
document.addEventListener('visibilitychange', () => audio.setPaused(document.hidden));

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
applySettings();
stage.setPlayer(profile.player);
stage.setScene('hall');
stage.setLight('evening');
ui.setEpisode(1, EPISODE_TITLES[1]);
ui.resetStats(session.stats);
openTitle();

if (params.has('dev')) {
  import('./dev/devtools.ts').then(({ mountDevtools }) =>
    mountDevtools({
      knots: meta.knots,
      session: () => session,
      jump: (knot: string, vars: Record<string, unknown>) => {
        runId++;
        ui.clearCurtain();
        session = new Session(storyJson);
        session.jump(knot, vars);
        session.setPlayer(profile.player);
        applyState(freshState());
        ui.resetStats(session.stats);
        if (titleDlg.open) closeTitle();
        running = true;
        play(runId);
      },
    }),
  );
}
if (params.has('dev') || params.has('test')) Object.assign(window, { __ahd: { session: () => session, profile, stage } });
