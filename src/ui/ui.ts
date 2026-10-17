// Screen-space presentation over the stage: speech bubbles hung off the
// speaker's face, narration captions, choices, the HUD and overlays.
// The director awaits these methods: showLine resolves when the player
// advances, showChoices resolves with the chosen ink index.
import type { Character } from '../content/characters.ts';
import type { ChoiceView, Stats } from '../narrative/session.ts';
import type { Anchor } from '../stage/stage.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const BASE = import.meta.env.BASE_URL;
const STAT_NAMES: Record<keyof Stats, string> = { approval: 'Approval', smarts: 'Street Smarts', trouble: 'Trouble' };

export interface LineOpts {
  auto?: number;
  speed: 'normal' | 'fast' | 'instant';
  anchor: Anchor | null; // where the speaker's face is, if on screen
  insert?: string; // prop close-up panel for this line
}

export interface ChoiceOpts {
  timer?: number;
  hint?: string;
  hintOpen?: boolean; // street-smart players notice without asking
  hotspots?: (ids: { id: string; label: string; pick: () => void }[]) => void;
}

export class UI {
  private overlay = $('overlay');
  private caption = $('caption');
  private bubble = $('bubble');
  private choicesEl = $('choices');
  private list = $('choice-list');
  private hintBtn = $<HTMLButtonElement>('hint-btn');
  private hintText = $('hint-text');
  private timerEl = $('timer');
  private insertEl = $('insert');
  private feedbackEl = $('feedback');
  private cont = $<HTMLButtonElement>('continue');
  private live = $('sr-live');
  private toastEl = $('toast');
  private advance: (() => void) | null = null;
  private typing: { finish: () => void } | null = null;
  private stats: Stats = { approval: 50, smarts: 20, trouble: 0 };
  private log: { who: string; text: string }[] = [];
  private prompt = $('prompt');

  constructor() {
    this.cont.addEventListener('click', () => this.next());
    // Tap anywhere on the scene to advance (but not on buttons).
    $('app').addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('button, dialog, a, .hud')) this.next();
    });
    this.hintBtn.addEventListener('click', () => this.openHint());
  }

  /** Called by tap / Enter / Space. Finishes typing first, then advances. */
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

  // ---------------------------------------------------------------- lines
  showLine(speaker: Character | null, name: string, text: string, o: LineOpts): Promise<void> {
    this.clearChoices();
    this.showInsert(o.insert);
    this.log.push({ who: speaker ? name : '', text });
    if (this.log.length > 120) this.log.shift();
    this.announce(speaker ? `${name}: ${text}` : text);
    this.cont.hidden = false;
    const box = speaker ? this.bubble : this.caption;
    (speaker ? this.caption : this.bubble).hidden = true;
    box.hidden = false;
    box.classList.remove('done');
    if (speaker) this.dressBubble(speaker, name, text);
    const textEl = box.querySelector<HTMLElement>('.text')!;
    return new Promise((resolve) => {
      let auto = 0;
      const done = () => {
        clearTimeout(auto);
        resolve();
      };
      this.advance = done;
      this.typeOut(textEl, text, o.speed, () => {
        box.classList.add('done');
        if (o.auto) auto = window.setTimeout(() => this.advance === done && this.next(), o.auto);
      });
      // Layout is final from the first frame (untyped text is invisible, not missing).
      if (speaker) this.placeBubble(o.anchor, speaker.id === 'tv');
      else this.pop(box);
    });
  }

  private dressBubble(c: Character, name: string, text: string) {
    const tag = this.bubble.querySelector<HTMLElement>('.tag')!;
    tag.textContent = name;
    this.bubble.style.setProperty('--accent', c.accent);
    this.bubble.classList.toggle('broadcast', c.id === 'tv');
    this.bubble.classList.toggle('shout', c.id === 'everybody' || /\b[A-Z]{3,}\b/.test(text));
  }

  /**
   * Hang the bubble off the speaker: beside the face when there is room
   * (landscape), below the chin otherwise (portrait), or pinned to the top
   * edge for voices that are off screen.
   */
  private placeBubble(a: Anchor | null, tv: boolean) {
    const b = this.bubble;
    const vw = this.overlay.clientWidth;
    const vh = this.overlay.clientHeight;
    const m = 12;
    const top = ($('hud').offsetHeight || 56) + 8;
    b.style.left = '0px';
    b.style.top = '0px';
    b.dataset.tail = 'none';
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    let x = (vw - bw) / 2;
    let y = top;
    let tail = 'none';
    let tailAt = 0;
    if (a?.onScreen) {
      const gap = tv ? 16 : Math.max(26, a.h * 0.06);
      const roomR = vw - a.x - gap - m;
      const roomL = a.x - gap - m;
      if (Math.max(roomL, roomR) >= bw && vw > 700) {
        const right = tv ? false : roomR >= bw && (roomL < bw || a.x < vw / 2);
        x = right ? a.x + gap : a.x - gap - bw;
        y = clamp(a.y - bh * 0.55, top, vh - bh - m);
        tail = right ? 'left' : 'right';
        tailAt = clamp(a.y - y, 18, bh - 18);
      } else {
        x = clamp(a.x - bw / 2, m, vw - bw - m);
        y = clamp(a.y + (tv ? 12 : a.h * 0.11), top, vh - bh - m);
        tail = 'up';
        tailAt = clamp(a.x - x, 22, bw - 22);
      }
    }
    b.style.left = `${Math.round(x)}px`;
    b.style.top = `${Math.round(y)}px`;
    b.dataset.tail = tail;
    b.style.setProperty('--tail', `${Math.round(tailAt)}px`);
    b.classList.toggle('offstage', !a?.onScreen);
    this.pop(b);
  }

  private pop(el: HTMLElement) {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  private typeOut(el: HTMLElement, text: string, speed: LineOpts['speed'], onDone: () => void) {
    const cps = speed === 'instant' ? Infinity : speed === 'fast' ? 110 : 52;
    el.innerHTML = '<span></span><span class="unseen"></span>';
    const [seen, unseen] = el.children as unknown as HTMLElement[];
    const finish = () => {
      cancelAnimationFrame(raf);
      seen.textContent = text;
      unseen.textContent = '';
      this.typing = null;
      onDone();
    };
    let raf = 0;
    if (cps === Infinity || !text) return finish();
    let shown = 0;
    let last = performance.now();
    this.typing = { finish };
    const tick = (now: number) => {
      shown = Math.min(text.length, shown + ((now - last) / 1000) * cps);
      last = now;
      const n = Math.floor(shown);
      seen.textContent = text.slice(0, n);
      unseen.textContent = text.slice(n);
      if (shown >= text.length) finish();
      else raf = requestAnimationFrame(tick);
    };
    seen.textContent = '';
    unseen.textContent = text;
    raf = requestAnimationFrame(tick);
  }

  private showInsert(name?: string) {
    if (!name) {
      this.insertEl.classList.remove('show');
      return;
    }
    this.insertEl.querySelector('img')!.src = `${BASE}assets/props/${name}.webp`;
    this.insertEl.classList.remove('show');
    void this.insertEl.offsetWidth;
    this.insertEl.classList.add('show');
  }

  hideDialogue() {
    this.bubble.hidden = true;
    this.caption.hidden = true;
    this.showInsert();
  }

  // ---------------------------------------------------------------- choices
  private clearChoices() {
    this.list.replaceChildren();
    this.choicesEl.hidden = true;
    this.timerEl.hidden = true;
    document.body.classList.remove('choosing');
  }

  private openHint() {
    this.hintText.hidden = false;
    this.hintBtn.setAttribute('aria-expanded', 'true');
    this.announce(this.hintText.textContent || '');
  }

  /** Present choices over the scene. Hotspot choices also appear as markers in the room. */
  showChoices(choices: ChoiceView[], o: ChoiceOpts): Promise<number> {
    this.clearChoices();
    this.cont.hidden = true;
    this.advance = null;
    this.showInsert();
    // the last line becomes the question sitting on top of the answers
    const last = this.log[this.log.length - 1];
    this.prompt.hidden = !last;
    if (last) {
      this.prompt.querySelector('b')!.textContent = last.who;
      this.prompt.querySelector('span')!.textContent = last.text;
      this.prompt.classList.toggle('said', !!last.who);
      this.prompt.style.setProperty('--accent', this.bubble.style.getPropertyValue('--accent'));
    }
    this.bubble.hidden = true;
    this.caption.hidden = true;
    document.body.classList.add('choosing');
    return new Promise((resolve) => {
      let timer = 0;
      const pick = (i: number) => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', onHidden);
        o.hotspots?.([]);
        this.clearChoices();
        resolve(i);
      };
      const timed = !!o.timer && choices.some((c) => c.timeout);
      const shown = choices.filter((c) => !(timed && c.timeout));
      shown.forEach((c, n) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `choice${c.hotspot ? ' look' : ''}`;
        btn.dataset.key = String(n + 1);
        btn.innerHTML = '<kbd aria-hidden="true"></kbd><span class="label"></span><span class="flavour"></span>';
        btn.querySelector('kbd')!.textContent = String(n + 1);
        btn.querySelector('.label')!.textContent = c.hotspot ? `Look: ${c.text}` : c.text;
        btn.querySelector('.flavour')!.textContent = c.flavour || '';
        btn.style.setProperty('--i', String(n));
        btn.addEventListener('click', () => pick(c.index));
        this.list.append(btn);
      });
      o.hotspots?.(choices.filter((c) => c.hotspot).map((c) => ({ id: c.hotspot!, label: c.text, pick: () => pick(c.index) })));
      this.hintBtn.parentElement!.hidden = !o.hint;
      this.hintText.textContent = o.hint || '';
      this.hintText.hidden = true;
      this.hintBtn.setAttribute('aria-expanded', 'false');
      if (o.hint && o.hintOpen) this.openHint();
      this.choicesEl.hidden = false;
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
        this.timerEl.dataset.label = `QUICK! ${o.timer} SECONDS`;
        this.announce(`Choose quickly: you have ${o.timer} seconds. If you do nothing, you will ${fallback.text.toLowerCase()}.`);
        timer = window.setTimeout(() => pick(fallback.index), o.timer! * 1000);
        document.addEventListener('visibilitychange', onHidden);
      } else {
        this.announce(`${shown.length} choices.`);
      }
      // keyboard players land on the first choice; pointer players see no stray focus ring
      if (document.documentElement.dataset.input === 'keys') this.list.querySelector('button')?.focus({ preventScroll: true });
    });
  }

  chooseByKey(key: string): boolean {
    const btn = this.list.querySelector<HTMLButtonElement>(`button[data-key="${key}"]`);
    btn?.click();
    return !!btn;
  }

  // ---------------------------------------------------------------- HUD
  setStats(s: Stats, note?: string) {
    const deltas = (Object.keys(s) as (keyof Stats)[]).map((k) => [k, s[k] - this.stats[k]] as const).filter(([, d]) => d);
    this.stats = { ...s };
    for (const li of document.querySelectorAll<HTMLElement>('.stat')) {
      const k = li.dataset.stat as keyof Stats;
      li.querySelector('.val')!.textContent = String(s[k]);
      li.style.setProperty('--pct', `${s[k]}%`);
      li.setAttribute('aria-label', `${STAT_NAMES[k]} ${s[k]} of 100`);
      const d = deltas.find(([dk]) => dk === k)?.[1];
      const badge = li.querySelector<HTMLElement>('.delta')!;
      if (d) {
        badge.textContent = d > 0 ? `+${d}` : String(d);
        badge.className = `delta show ${(k === 'trouble' ? d < 0 : d > 0) ? 'good' : 'bad'}`;
        clearTimeout(Number(badge.dataset.t));
        badge.dataset.t = String(setTimeout(() => (badge.className = 'delta'), 2200));
      }
    }
    const summary = deltas.map(([k, d]) => `${d > 0 ? '+' : ''}${d} ${STAT_NAMES[k]}`).join(' · ');
    if (summary || note) $('sr-alert').textContent = [note, summary].filter(Boolean).join('. ');
    if (!note) return; // the numbers already pop on the stat chips
    const good = deltas.reduce((acc, [k, d]) => acc + (k === 'trouble' ? -d : d), 0);
    const f = this.feedbackEl;
    f.className = `feedback ${good > 0 ? 'positive' : good < 0 ? 'negative' : ''}`;
    f.replaceChildren(Object.assign(document.createElement('strong'), { textContent: note }));
    if (summary) f.append(Object.assign(document.createElement('span'), { textContent: summary }));
    f.hidden = false;
    this.pop(f);
    clearTimeout(Number(f.dataset.t));
    f.dataset.t = String(setTimeout(() => (f.hidden = true), 4200));
  }

  resetStats(s: Stats) {
    this.stats = { ...s };
    this.setStats(s);
    this.feedbackEl.hidden = true;
    this.log = [];
  }

  setEpisode(n: number, title: string) {
    $('ep-chip').innerHTML = `<b>EP ${n}</b> <span></span>`;
    $('ep-chip').querySelector('span')!.textContent = title;
  }

  // ---------------------------------------------------------------- overlays
  card(kicker: string, title: string, meta: string, hold: number): Promise<void> {
    const card = $('card');
    $('card-kicker').textContent = kicker;
    $('card-title').textContent = title;
    $('card-meta').textContent = meta;
    this.hideDialogue();
    card.hidden = false;
    card.classList.remove('out');
    this.announce(`${kicker}. ${title}. ${meta}.`);
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

  readRoomStamp() {
    this.pop($('readroom-stamp'));
  }

  fx(name: string, reduced: boolean) {
    const layer = $('fx');
    if (name === 'flash' || name === 'impact') {
      if (reduced && name === 'impact') return;
      const f = document.createElement('div');
      f.className = `fx-${name}`;
      layer.append(f);
      setTimeout(() => f.remove(), 900);
      if (name === 'flash') return;
    }
    if (reduced) return;
    const app = $('stage');
    app.classList.remove('fx-shake');
    void app.offsetWidth;
    app.classList.add('fx-shake');
  }

  /** The child's view through the bedroom keyhole: a mask over the whole stage. */
  keyhole(on: boolean) {
    $('keyhole').hidden = !on;
  }

  toast(text: string) {
    this.toastEl.textContent = text;
    this.toastEl.hidden = false;
    this.pop(this.toastEl);
    clearTimeout(Number(this.toastEl.dataset.t));
    this.toastEl.dataset.t = String(setTimeout(() => (this.toastEl.hidden = true), 3000));
  }

  /** Fill the "story so far" dialog. */
  renderLog(into: HTMLElement) {
    into.replaceChildren(
      ...this.log.map(({ who, text }) => {
        const p = document.createElement('p');
        if (who) p.append(Object.assign(document.createElement('b'), { textContent: `${who}: ` }));
        p.append(text);
        if (!who) p.className = 'narration';
        return p;
      }),
    );
    into.scrollTop = into.scrollHeight;
  }
}
