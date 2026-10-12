// The 2D cut-out layer: characters standing in front of the 3D room.
// Handles who is on stage, expressions, talking, emotes, small body
// animations and "reaction shot" focus.
import { CHARACTERS, characterSvg, faceSvg } from '../content/characters.ts';

const SLOTS: Record<number, number[]> = { 1: [50], 2: [31, 68], 3: [19, 50, 81], 4: [13, 37, 63, 87] };

const EMOTE_ART: Record<string, string> = {
  sweat: '<svg viewBox="0 0 40 40"><path d="M20 4C14 16 10 21 10 27a10 10 0 0 0 20 0c0-6-4-11-10-23z" fill="#9fd3f0" stroke="#2c4f66" stroke-width="2.5"/><path d="M15 27a5 5 0 0 0 4 5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
  shock: '<svg viewBox="0 0 40 40"><path d="M16 3h8l-2 23h-4z" fill="#e8533f" stroke="#3a1d1d" stroke-width="2"/><circle cx="20" cy="33" r="4" fill="#e8533f" stroke="#3a1d1d" stroke-width="2"/></svg>',
  question: '<svg viewBox="0 0 40 40"><path d="M12 13a8 8 0 1 1 12 7c-3 2-4 3-4 7" stroke="#f3c45f" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20" cy="34" r="3.2" fill="#f3c45f"/></svg>',
  anger: '<svg viewBox="0 0 40 40"><g stroke="#e0473a" stroke-width="4.5" stroke-linecap="round" fill="none"><path d="M8 15q7 0 7-7M25 8q0 7 7 7M32 25q-7 0-7 7M15 32q0-7-7-7"/></g></svg>',
  sparkle: '<svg viewBox="0 0 40 40"><path d="M20 2l4 13 13 5-13 4-4 14-4-14-13-4 13-5z" fill="#ffd877" stroke="#9a6a1f" stroke-width="1.5"/></svg>',
  heart: '<svg viewBox="0 0 40 40"><path d="M20 35S4 25 4 14a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 11-16 21-16 21z" fill="#ec6f7f" stroke="#6a2230" stroke-width="2"/></svg>',
  dots: '<svg viewBox="0 0 60 30"><g fill="#fff6e6" stroke="#3a2a2f" stroke-width="2"><circle cx="12" cy="15" r="5"/><circle cx="30" cy="15" r="5"/><circle cx="48" cy="15" r="5"/></g></svg>',
};

interface Actor {
  id: string;
  el: HTMLElement;
  face: SVGGElement;
  emote: HTMLElement;
  expr: string;
}

export class Actors {
  private actors = new Map<string, Actor>();
  private order: string[] = [];
  private focused = 'none';
  private root: HTMLElement;
  private room: HTMLElement;

  constructor(root: HTMLElement, room: HTMLElement) {
    this.root = root;
    this.room = room;
  }

  /** Set who is on stage, left to right. Unchanged actors keep their state. */
  setCast(ids: string[], expr: Record<string, string> = {}) {
    for (const [id, a] of this.actors) {
      if (!ids.includes(id)) {
        this.actors.delete(id);
        a.el.classList.add('leaving');
        a.el.addEventListener('transitionend', () => a.el.remove(), { once: true });
        setTimeout(() => a.el.remove(), 700); // in case transitions are disabled
      }
    }
    ids.forEach((id) => {
      if (this.actors.has(id) || !CHARACTERS[id]?.body) return;
      const el = document.createElement('div');
      el.className = `actor ${CHARACTERS[id].kind} entering`;
      el.dataset.id = id;
      el.innerHTML = `<div class="actor-body">${characterSvg(CHARACTERS[id], expr[id] || 'neutral', `a-${id}`)}</div><div class="emote"></div>`;
      el.style.setProperty('--blink-delay', `${(Math.random() * 4).toFixed(2)}s`);
      this.root.append(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('entering')));
      this.actors.set(id, { id, el, face: el.querySelector('.face')!, emote: el.querySelector('.emote')!, expr: expr[id] || 'neutral' });
    });
    this.order = ids.filter((id) => this.actors.has(id));
    const slots = SLOTS[this.order.length] || SLOTS[4];
    this.order.forEach((id, i) => {
      const a = this.actors.get(id)!;
      a.el.style.setProperty('--x', `${slots[i]}%`);
      a.el.style.zIndex = String(CHARACTERS[id].kind === 'child' ? 3 : 2);
    });
    this.focus(this.focused);
  }

  get cast() {
    return [...this.order];
  }

  setExpr(id: string, expr: string) {
    const a = this.actors.get(id);
    if (!a || a.expr === expr) return;
    a.expr = expr;
    a.face.innerHTML = faceSvg(CHARACTERS[id], expr);
  }

  expressions(): Record<string, string> {
    return Object.fromEntries([...this.actors].map(([id, a]) => [id, a.expr]));
  }

  speaking(id: string | null) {
    for (const [aid, a] of this.actors) a.el.classList.toggle('talking', aid === id);
  }

  stopTalking() {
    this.speaking(null);
  }

  emote(id: string, kind: string) {
    const a = this.actors.get(id);
    if (!a || !EMOTE_ART[kind]) return;
    a.emote.innerHTML = EMOTE_ART[kind];
    a.emote.className = `emote show ${kind}`;
    clearTimeout(Number(a.emote.dataset.t));
    a.emote.dataset.t = String(setTimeout(() => (a.emote.className = 'emote'), 2200));
  }

  anim(id: string, kind: string) {
    const body = this.actors.get(id)?.el.querySelector<HTMLElement>('.actor-body');
    if (!body) return;
    body.classList.remove('anim-bounce', 'anim-shake', 'anim-jump', 'anim-lean', 'anim-slump');
    void body.offsetWidth; // restart the animation
    body.classList.add(`anim-${kind}`);
  }

  /** Reaction shot: push in on one character, soften everything else. */
  focus(id: string) {
    this.focused = this.actors.has(id) ? id : 'none';
    const on = this.focused !== 'none';
    this.root.classList.toggle('focusing', on);
    this.room.classList.toggle('dof', on);
    for (const [aid, a] of this.actors) a.el.classList.toggle('dim', on && aid !== id);
    if (on) {
      const x = this.actors.get(id)!.el.style.getPropertyValue('--x');
      this.root.style.setProperty('--fx', x);
      this.root.style.setProperty('--fy', CHARACTERS[id].kind === 'child' ? '52%' : '34%');
    }
  }
}
