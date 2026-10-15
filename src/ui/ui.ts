// DOM presentation for the story panel and overlays. The director awaits these
// methods: showLine resolves when the player advances, showChoices resolves
// with the chosen ink index.
import { CHARACTERS, characterSvg, type Character } from '../content/characters.ts';
import type { ChoiceView, Stats } from '../narrative/session.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const STAT_NAMES: Record<keyof Stats, string> = { approval: 'Approval', smarts: 'Street Smarts', trouble: 'Trouble' };
const TV_ICON = '<svg viewBox="0 0 40 40"><rect x="5" y="11" width="30" height="22" rx="3" fill="#3f6c86"/><rect x="8" y="14" width="20" height="16" rx="2" fill="#9cc4dc"/><path d="M14 4l6 7 6-7" stroke="#3f6c86" stroke-width="2.5" fill="none"/></svg>';

export interface LineOpts {
  auto?: number;
  speed: 'normal' | 'fast' | 'instant';
  expr?: string;
}

export class UI {
  readonly world = $('world');
  readonly room = $('room');
  private line = $('line');
  private name = $('speaker-name');
  private eyebrow = $('speaker-eyebrow');
  private avatar = $('avatar');
  private choicesEl = $('choices');
  private lookList = $('look-list');
  private hotspotsEl = $('hotspots');
  private cont = $<HTMLButtonElement>('continue');
  private heading = $('choices-heading');
  private hint = $('choices-hint');
  private timerEl = $('timer');
  private feedbackEl = $('feedback');
  private live = $('sr-live');
  private toastEl = $('toast');
  private advance: (() => void) | null = null;
  private typing: { finish: () => void } | null = null;
  private hotspotIds: { id: string; btn: HTMLButtonElement }[] = [];
  private stats: Stats = { approval: 50, smarts: 20, trouble: 0 };
  project: (id: string) => { x: number; y: number } | null = () => null;

  constructor() {
    this.cont.addEventListener('click', () => this.next());
    // Tapping the scene advances too (but not when tapping a hotspot).
    this.world.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('button')) this.next();
    });
    $('dialogue').addEventListener('click', () => this.next());
  }

  get waitingForLine() {
    return !!this.advance;
  }

  /** Called by click / Enter / Space. Finishes typing first, then advances. */
  next() {
    if (this.typing) return this.typing.finish();
    const go = this.advance;
    this.advance = null;
    go?.();
  }

  announce(text: string) {
    // clear first so repeated identical lines are still read out
    this.live.textContent = '';
    requestAnimationFrame(() => (this.live.textContent = text));
  }

  setSpeaker(c: Character | null, expr = 'neutral') {
    this.eyebrow.textContent = c ? 'NOW SPEAKING' : 'THE STORY';
    this.name.textContent = c ? c.name : 'Narrator';
    this.name.style.color = c ? c.accent : '';
    this.avatar.className = `speaker-avatar ${c?.id === 'tv' ? 'tv' : ''}`;
    if (c?.body) this.avatar.innerHTML = characterSvg(c, expr, `av-${c.id}`);
    else if (c?.id === 'tv') this.avatar.innerHTML = TV_ICON;
    else this.avatar.textContent = c ? c.name[0] : '✳';
  }

  showLine(speaker: Character | null, text: string, o: LineOpts): Promise<void> {
    this.clearChoices();
    this.setSpeaker(speaker, o.expr);
    this.line.classList.toggle('tv-line', speaker?.id === 'tv');
    this.line.classList.toggle('narration', !speaker);
    this.announce(speaker ? `${speaker.name}: ${text}` : text);
    this.heading.textContent = 'THE STORY CONTINUES';
    this.hint.textContent = '';
    this.cont.hidden = false;
    return new Promise((resolve) => {
      let auto = 0;
      const done = () => {
        clearTimeout(auto);
        resolve();
      };
      this.advance = done;
      const startAuto = () => {
        if (o.auto) auto = window.setTimeout(() => this.advance === done && this.next(), o.auto);
      };
      this.typeOut(text, o.speed, startAuto);
    });
  }

  private typeOut(text: string, speed: LineOpts['speed'], onDone: () => void) {
    const cps = speed === 'instant' ? Infinity : speed === 'fast' ? 110 : 48;
    if (cps === Infinity || !text) {
      this.line.textContent = text;
      this.typing = null;
      return onDone();
    }
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    const finish = () => {
      cancelAnimationFrame(raf);
      this.line.textContent = text;
      this.typing = null;
      onDone();
    };
    this.typing = { finish };
    const tick = (now: number) => {
      shown = Math.min(text.length, shown + ((now - last) / 1000) * cps);
      last = now;
      this.line.textContent = text.slice(0, Math.floor(shown));
      if (shown >= text.length) finish();
      else raf = requestAnimationFrame(tick);
    };
    this.line.textContent = '';
    raf = requestAnimationFrame(tick);
  }

  private clearChoices() {
    this.choicesEl.replaceChildren();
    this.lookList.replaceChildren();
    this.lookList.hidden = true;
    this.hotspotsEl.replaceChildren();
    this.hotspotIds = [];
    this.timerEl.hidden = true;
  }

  /** Present choices. Hotspot choices appear in the scene and as "look" chips. */
  showChoices(choices: ChoiceView[], o: { timer?: number }): Promise<number> {
    this.clearChoices();
    this.cont.hidden = true;
    this.advance = null;
    return new Promise((resolve) => {
      let timer = 0;
      const pick = (i: number) => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', onHidden);
        this.clearChoices();
        resolve(i);
      };
      const timed = !!o.timer && choices.some((c) => c.timeout);
      const main = choices.filter((c) => !c.hotspot && !(timed && c.timeout));
      const looks = choices.filter((c) => c.hotspot);
      main.forEach((c, n) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-index" aria-hidden="true"></span><span class="choice-text"><span class="choice-label"></span><span class="choice-flavour"></span></span><span class="choice-arrow" aria-hidden="true">↗</span>`;
        btn.querySelector('.choice-index')!.textContent = String(n + 1);
        btn.querySelector('.choice-label')!.textContent = c.text;
        btn.querySelector('.choice-flavour')!.textContent = c.flavour || '';
        btn.dataset.key = String(n + 1);
        btn.addEventListener('click', () => pick(c.index));
        this.choicesEl.append(btn);
      });
      if (looks.length) {
        this.lookList.hidden = false;
        const label = document.createElement('span');
        label.className = 'look-label';
        label.textContent = 'Look around:';
        this.lookList.append(label);
        for (const c of looks) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'look-chip';
          chip.textContent = c.text;
          chip.addEventListener('click', () => pick(c.index));
          this.lookList.append(chip);
          const spot = document.createElement('button');
          spot.type = 'button';
          spot.className = 'hotspot';
          spot.tabIndex = -1; // keyboard users get the chips; avoids duplicate tab stops
          spot.setAttribute('aria-hidden', 'true');
          spot.innerHTML = `<span class="hotspot-ring"></span><span class="hotspot-label"></span>`;
          spot.querySelector('.hotspot-label')!.textContent = c.text;
          spot.addEventListener('click', (e) => {
            e.stopPropagation();
            pick(c.index);
          });
          this.hotspotsEl.append(spot);
          this.hotspotIds.push({ id: c.hotspot!, btn: spot });
        }
        this.placeHotspots();
      }
      this.heading.textContent = looks.length && main.length === 1 ? 'LOOK AROUND, OR…' : 'WHAT WILL YOU DO?';
      this.hint.textContent = main.length > 1 ? `PRESS 1–${main.length}` : '';
      const onHidden = () => {
        // never let a timer run out while the player is away
        if (document.hidden && timer) {
          clearTimeout(timer);
          timer = 0;
          this.timerEl.hidden = true;
        }
      };
      if (timed) {
        const fallback = choices.find((c) => c.timeout)!;
        this.timerEl.hidden = false;
        const bar = this.timerEl.firstElementChild as HTMLElement;
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = `timer ${o.timer}s linear forwards`;
        this.heading.textContent = `QUICK! ${o.timer} SECONDS`;
        this.announce(`Choose quickly: you have ${o.timer} seconds. If you do nothing, you will ${fallback.text.toLowerCase()}.`);
        timer = window.setTimeout(() => pick(fallback.index), o.timer! * 1000);
        document.addEventListener('visibilitychange', onHidden);
      } else {
        this.announce(`${main.length + looks.length} choices.`);
      }
      const first = this.choicesEl.querySelector('button') || this.lookList.querySelector('button');
      if (document.activeElement === this.cont || this.cont.contains(document.activeElement)) (first as HTMLElement)?.focus();
    });
  }

  /** Keep hotspot markers glued to the set while the camera moves. */
  placeHotspots() {
    for (const { id, btn } of this.hotspotIds) {
      const p = this.project(id);
      btn.hidden = !p;
      if (p) {
        btn.style.left = `${p.x}%`;
        btn.style.top = `${p.y}%`;
      }
    }
  }

  chooseByKey(key: string): boolean {
    const btn = this.choicesEl.querySelector<HTMLButtonElement>(`button[data-key="${key}"]`);
    btn?.click();
    return !!btn;
  }

  focusContinue() {
    if (!this.cont.hidden) this.cont.focus();
  }

  setStats(s: Stats, note?: string) {
    const deltas = (Object.keys(s) as (keyof Stats)[]).map((k) => [k, s[k] - this.stats[k]] as const).filter(([, d]) => d);
    this.stats = { ...s };
    for (const li of document.querySelectorAll<HTMLElement>('.stat')) {
      const k = li.dataset.stat as keyof Stats;
      li.querySelector('.stat-val')!.textContent = String(s[k]);
      (li.querySelector('.stat-bar span') as HTMLElement).style.width = `${s[k]}%`;
      const d = deltas.find(([dk]) => dk === k)?.[1];
      const badge = li.querySelector<HTMLElement>('.stat-delta')!;
      if (d) {
        badge.textContent = d > 0 ? `+${d}` : String(d);
        badge.className = `stat-delta show ${(k === 'trouble' ? d < 0 : d > 0) ? 'good' : 'bad'}`;
        setTimeout(() => (badge.className = 'stat-delta'), 1800);
      }
    }
    if (!deltas.length && !note) return;
    const summary = deltas.map(([k, d]) => `${d > 0 ? '+' : ''}${d} ${STAT_NAMES[k]}`).join(' · ');
    const good = deltas.reduce((acc, [k, d]) => acc + (k === 'trouble' ? -d : d), 0);
    this.feedbackEl.hidden = false;
    this.feedbackEl.className = `feedback ${good > 0 ? 'positive' : good < 0 ? 'negative' : ''}`;
    this.feedbackEl.replaceChildren();
    if (note) {
      const strong = document.createElement('strong');
      strong.textContent = note;
      this.feedbackEl.append(strong);
    }
    if (summary) {
      const span = document.createElement('span');
      span.textContent = summary;
      this.feedbackEl.append(span);
    }
    $('sr-alert').textContent = [note, summary].filter(Boolean).join('. ');
  }

  resetStats(s: Stats) {
    this.stats = { ...s };
    this.setStats(s);
    this.feedbackEl.hidden = true;
  }

  clearFeedback() {
    this.feedbackEl.hidden = true;
  }

  card(kicker: string, title: string, meta: string, hold: number): Promise<void> {
    const card = $('card');
    $('card-kicker').textContent = kicker;
    $('card-title').textContent = title;
    $('card-meta').textContent = meta;
    card.hidden = false;
    card.classList.remove('out');
    this.announce(`${kicker}. ${title}. ${meta}.`);
    this.line.textContent = '';
    return new Promise((resolve) => {
      const t = setTimeout(() => this.next(), hold);
      this.advance = () => {
        clearTimeout(t);
        card.classList.add('out');
        setTimeout(() => (card.hidden = true), 450);
        resolve();
      };
    });
  }

  fx(name: string, reduced: boolean) {
    if (name === 'flash') {
      const f = document.createElement('div');
      f.className = 'fx-flash';
      $('fx').append(f);
      setTimeout(() => f.remove(), 700);
      return;
    }
    if (reduced) return;
    if (name === 'impact') {
      const f = document.createElement('div');
      f.className = 'fx-impact';
      $('fx').append(f);
      setTimeout(() => f.remove(), 900);
    }
    this.world.classList.remove('fx-shake');
    void this.world.offsetWidth;
    this.world.classList.add('fx-shake');
  }

  /** The child's view through the bedroom keyhole: a mask over the whole stage. */
  keyhole(on: boolean, instant = false) {
    const layer = $('fx');
    layer.querySelector('.fx-keyhole')?.remove();
    if (!on) return;
    const k = document.createElement('div');
    k.className = instant ? 'fx-keyhole instant' : 'fx-keyhole';
    k.innerHTML = '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice"><path fill-rule="evenodd" d="M-200-200H360V300H-200Z M80 22a13 13 0 0 1 7 24l7 34H66l7-34a13 13 0 0 1 7-24Z"/></svg>';
    layer.append(k);
  }

  toast(text: string) {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    clearTimeout(Number(this.toastEl.dataset.t));
    this.toastEl.dataset.t = String(setTimeout(() => this.toastEl.classList.remove('show'), 2600));
  }

  setScene(title: string, location: string, episode: number) {
    $('scene-title').textContent = title;
    $('scene-location').textContent = location.toUpperCase();
    $('scene-number').innerHTML = `0${episode}<span>/</span>03`;
    $('episode-label').textContent = `EPISODE 0${episode}`;
  }

  setProgress(pct: number, caption: string) {
    const p = Math.round(Math.max(0, Math.min(100, pct)));
    $('progress-fill').style.width = `${p}%`;
    $('progress-num').textContent = `${String(p).padStart(2, '0')}%`;
    $('progress').setAttribute('aria-valuenow', String(p));
    $('progress-caption').textContent = caption.toUpperCase();
  }

  static portrait(id: string, expr: string) {
    return CHARACTERS[id]?.body ? characterSvg(CHARACTERS[id], expr, `rp-${id}`) : '';
  }
}
