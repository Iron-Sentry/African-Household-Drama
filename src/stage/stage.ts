// The stage: one 16:9 "world" (painted room, cast, TV, light) behind a camera.
// Everything is positioned in % of the painting, so camera moves, actors and
// the TV overlay stay glued together. The UI asks where a speaker's face is on
// screen (anchor) to hang speech bubbles off it.
import { SCENES, type Scene } from '../content/scenes.ts';
import { assetUrl } from '../content/assets.ts';
import { CHARACTERS, allPoseUrls, castEntry, headHeight, poseUrl, type Player } from '../content/characters.ts';

const BASE = import.meta.env.BASE_URL;
const ASPECT = 16 / 9;
// Sprite height and how far the feet sit below the frame, in % of world height.
const BODY = { adult: { h: 92, b: -14, face: 0.13 }, child: { h: 67, b: -6, face: 0.16 } };

// Comic marks, inked like the speech bubbles. Each kind has its own motion in styles.css.
const INK = 'stroke="#1d1420" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
// Shots about people (not props): on a phone these follow the speaker's face.
const PEOPLE_SHOTS = new Set(['wide', 'door', 'sofa', 'gate', 'bed']);

const EMOTE_ART: Record<string, string> = {
  sweat: `<svg viewBox="0 0 48 60"><path d="M6 10l8 6M4 22l9 3" ${INK} fill="none"/><path class="drop" d="M30 6C24 20 19 27 19 35a11 11 0 0 0 22 0c0-8-5-15-11-29z" fill="#a9dcf5" ${INK}/><path d="M25 36a5 5 0 0 0 4 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  shock: `<svg viewBox="0 0 60 60"><path d="M10 18l8 8M50 18l-8 8M30 4v10" ${INK} fill="none"/><path d="M25 18h10l-2 24h-6z" fill="#ff5a3c" ${INK}/><circle cx="30" cy="51" r="5" fill="#ff5a3c" ${INK}/></svg>`,
  question: `<svg viewBox="0 0 50 60"><path d="M14 20a11 11 0 1 1 17 9c-4 3-6 5-6 11" fill="none" stroke="#1d1420" stroke-width="11" stroke-linecap="round"/><path d="M14 20a11 11 0 1 1 17 9c-4 3-6 5-6 11" fill="none" stroke="#ffc83d" stroke-width="5.5" stroke-linecap="round"/><circle cx="25" cy="52" r="5.5" fill="#ffc83d" ${INK}/></svg>`,
  anger: `<svg viewBox="0 0 60 60"><g fill="none" stroke="#1d1420" stroke-width="11" stroke-linecap="round"><path d="M10 24q12 0 12-12M38 12q0 12 12 12M50 36q-12 0-12 12M22 48q0-12-12-12"/></g><g fill="none" stroke="#ff4a3a" stroke-width="6" stroke-linecap="round"><path d="M10 24q12 0 12-12M38 12q0 12 12 12M50 36q-12 0-12 12M22 48q0-12-12-12"/></g></svg>`,
  sparkle: `<svg viewBox="0 0 60 60"><path d="M24 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="#ffe07a" ${INK}/><path d="M47 36l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff4c2" ${INK}/></svg>`,
  heart: `<svg viewBox="0 0 50 50"><path d="M25 44S5 31 5 17a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 14-20 27-20 27z" fill="#ff7a93" ${INK}/><path d="M13 15a5 5 0 0 1 6-3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  dots: `<svg viewBox="0 0 72 52"><path d="M10 8h52a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H30l-12 10 2-10h-10a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z" fill="#fff7e6" ${INK}/><circle class="d1" cx="22" cy="23" r="4.5" fill="#1d1420"/><circle class="d2" cx="36" cy="23" r="4.5" fill="#1d1420"/><circle class="d3" cx="50" cy="23" r="4.5" fill="#1d1420"/></svg>`,
};

/**
 * Where the face is in a pose, in % of the 512×640 canvas, measured from the
 * sprite's own pixels. Every pose of a sheet shares one head height (top of the
 * hair to the chin, see SHEETS in characters.ts), so only the head top and the
 * face centre are found here: the top is the highest point near the torso line
 * that is head-wide just below it (a raised hand is too narrow), and the centre
 * is the middle of the cheeks, below hair puffs and head ties.
 */
type Head = { x: number; y: number; chin: number; w: number };
const heads = new Map<string, Promise<Head>>();
function measureHead(url: string, head: number) {
  if (!heads.has(url)) {
    heads.set(url, (async () => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const W = 128, H = 160;
      const ctx = Object.assign(document.createElement('canvas'), { width: W, height: H }).getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, W, H);
      const a = ctx.getImageData(0, 0, W, H).data;
      const on = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H && a[(y * W + x) * 4 + 3] > 140;
      const runAt = (x: number, y: number): [number, number] | null => {
        if (!on(x, y)) return null;
        let l = x, r = x;
        while (on(l - 1, y)) l--;
        while (on(r + 1, y)) r++;
        return [l, r];
      };
      let sx = 0, n = 0;
      for (let y = Math.round(H * 0.4); y < H * 0.5; y++) for (let x = 0; x < W; x++) if (on(x, y)) { sx += x; n++; }
      const cx = n ? Math.round(sx / n) : W / 2;
      const hp = (head / 100) * H;
      const fw = hp * 0.85;
      let best: { t: number; x: number; score: number } | null = null;
      for (let x = Math.max(0, cx - Math.round(W * 0.2)); x <= Math.min(W - 1, cx + Math.round(W * 0.2)); x++) {
        let t = 0;
        while (t < H * 0.6 && !on(x, t)) t++;
        if (t >= H * 0.6) continue;
        const r = runAt(x, Math.round(t + hp * 0.45));
        if (!r || r[1] - r[0] + 1 < fw * 0.55) continue;
        const score = t + Math.abs(x - cx) * 0.15;
        if (!best || score < best.score) best = { t, x, score };
      }
      const top = best ? best.t : 0;
      const hx = best ? best.x : cx;
      const low = Math.round(top + hp * 0.75);
      let r: [number, number] | null = null;
      for (let d = 0; d < 24 && !r; d++) r = runAt(hx - d, low) || runAt(hx + d, low);
      const fx = !r ? hx : r[1] - r[0] + 1 < fw * 1.5 ? (r[0] + r[1]) / 2 : Math.max(r[0] + fw / 2, Math.min(r[1] - fw / 2, hx));
      return { x: (fx / W) * 100, y: (top / H) * 100, chin: ((top + hp) / H) * 100, w: (fw / W) * 100 };
    })().catch(() => ({ x: 50, y: 3, chin: 3 + head, w: 22 })));
  }
  return heads.get(url)!;
}

const ANTENNA = `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="#2a2326" stroke-width="2.6" stroke-linecap="round"><path d="M50 92L14 8"/><path d="M50 92L88 14"/></g><circle cx="14" cy="8" r="3" fill="#2a2326"/><circle cx="88" cy="14" r="3" fill="#2a2326"/><g class="foil" fill="#d9dde3" stroke="#8a9099" stroke-width="1.2"><path d="M8 2l9 2 3 9-6 5-9-3-2-8z"/><path d="M82 8l10 1 2 9-7 4-8-4z"/></g><ellipse cx="50" cy="94" rx="15" ry="6" fill="#2a2326"/></svg>`;

interface Actor {
  id: string;
  el: HTMLElement;
  imgs: HTMLImageElement[];
  front: number;
  url: string;
  pose: string; // the mood or pose ink asked for, kept so a re-skin can ask again
  x: number;
  emote: HTMLElement;
  sticker: HTMLImageElement;
}

export interface Anchor {
  x: number;
  y: number; // face centre
  top: number; // top of the hair
  chin: number;
  half: number; // half the face's width
  h: number; // on-screen sprite height, for spacing the bubble
  onScreen: boolean;
}

/** A face on screen, in px: the UI keeps captions and answers off these. */
export interface FaceBox {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export class Stage {
  player: Player = 'boy';
  reduced = false;
  private root: HTMLElement;
  private world: HTMLElement;
  private bg: HTMLImageElement;
  private dark: HTMLImageElement; // the night painting, faded in over the day one
  private pieces: HTMLElement;
  private light = '';
  private outfits: Record<string, string> = {};
  private cast: HTMLElement;
  private spots: HTMLElement;
  private tv: HTMLElement;
  private antenna: HTMLElement;
  private lamp: HTMLElement;
  private snow: HTMLCanvasElement;
  private scene: Scene = SCENES.hall;
  private actors = new Map<string, Actor>();
  private order: string[] = [];
  private props: Record<string, string> = {};
  private shot = 'wide';
  private pushed = false;
  private focused = 'none';
  private readRoom = false;
  private followId: string | null = null; // who the phone camera is keeping in frame
  private choosing = false; // choice stack covers the lower ~60% of a phone screen
  private zoom = 1; // extra push used for the establishing settle after a scene change
  private W = 0;
  private H = 0;
  private cam = { s: 1, tx: 0, ty: 0 };
  private snowRaf = 0;
  private preloaded = new Set<string>();

  constructor(root: HTMLElement) {
    this.root = root;
    root.innerHTML = `<div class="world" id="world"><img class="room" alt="" draggable="false"><img class="room after-dark" alt="" draggable="false"><div class="pieces" aria-hidden="true"></div><div class="tv" aria-hidden="true"><img class="tv-film" src="${BASE}assets/tv/film_two_shot.webp" alt=""><img class="tv-kiss" src="${BASE}assets/tv/film_kiss.webp" alt=""><div class="tv-news"><img src="${BASE}assets/tv/news_desk.webp" alt=""><b><span>AKOSOMBO WATER LEVEL LOW · LIGHTS OFF TUESDAY AND THURSDAY · BLACK STARS SQUAD NAMED · </span></b></div><canvas width="96" height="72"></canvas><i class="glass"></i></div><div class="antenna" aria-hidden="true">${ANTENNA}</div><div class="lamp" aria-hidden="true"><i></i></div><div class="cast" aria-hidden="true"></div><div class="light" aria-hidden="true"></div><div class="spots"></div></div>`;
    this.world = root.querySelector('.world')!;
    this.bg = root.querySelector('.room')!;
    this.dark = root.querySelector('.room.after-dark')!;
    this.pieces = root.querySelector('.pieces')!;
    this.cast = root.querySelector('.cast')!;
    this.spots = root.querySelector('.spots')!;
    this.tv = root.querySelector('.tv')!;
    this.antenna = root.querySelector('.antenna')!;
    this.lamp = root.querySelector('.lamp')!;
    this.snow = this.tv.querySelector('canvas')!;
    new ResizeObserver(() => this.layout(true)).observe(root);
  }

  /** Narrow screens show a slice of the room, so the camera follows whoever speaks. */
  get portrait() {
    return this.root.clientWidth < this.root.clientHeight * 1.15;
  }

  // ---------------------------------------------------------------- scene
  setScene(id: string) {
    this.scene = SCENES[id] || SCENES.hall;
    const s = this.scene;
    this.bg.src = assetUrl(s.bg);
    this.dark.removeAttribute('src');
    if (s.night) this.dark.src = assetUrl(s.night);
    this.pieces.replaceChildren(
      ...Object.entries(s.pieces || {}).map(([name, p]) => {
        const img = Object.assign(document.createElement('img'), { alt: '', draggable: false, src: assetUrl(p.src) });
        img.dataset.piece = name;
        Object.assign(img.style, { left: `${p.at[0]}%`, top: `${p.at[1]}%`, width: `${p.w}%` });
        return img;
      }),
    );
    this.renderPieces();
    this.renderNight(true);
    const [l, t, w, h] = s.tv || [0, 0, 0, 0];
    Object.assign(this.tv.style, { left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`, display: s.tv ? '' : 'none' });
    Object.assign(this.antenna.style, { left: `${l + w * 0.5}%`, top: `${t - 17}%`, display: s.tv ? '' : 'none' });
    Object.assign(this.lamp.style, { left: `${s.lamp[0]}%`, top: `${s.lamp[1]}%` });
    this.world.style.setProperty('--tv-x', `${l + w / 2}%`);
    this.world.style.setProperty('--tv-y', `${t + h / 2}%`);
    this.world.style.setProperty('--lamp-x', `${s.lamp[0]}%`);
    this.world.style.setProperty('--lamp-y', `${s.lamp[1]}%`);
    this.shot = 'wide';
    this.pushed = false;
    this.focused = 'none';
    this.followId = null;
    this.clearHotspots();
    this.renderTv();
    this.frame(true);
  }

  /** Resolves once the painting and every pose on stage can draw (or after `ms`). */
  ready(ms = 1500): Promise<void> {
    const imgs = [this.bg, ...[...this.actors.values()].map((a) => a.imgs[a.front])];
    const all = Promise.all(imgs.map((i) => (i.src ? i.decode().catch(() => {}) : null)));
    return Promise.race([all.then(() => {}), new Promise<void>((r) => setTimeout(r, ms))]);
  }

  /** Establishing shot: open a touch closer, then let the camera drift into the framing. */
  settle() {
    if (this.reduced) return;
    this.zoom = 1.08;
    this.frame(true);
    this.zoom = 1;
    requestAnimationFrame(() => requestAnimationFrame(() => this.frame(false, true)));
  }

  setLight(id: string) {
    this.world.dataset.light = id;
    this.light = id;
    this.renderNight();
  }

  /** Scenes with a night painting swap to it once it is dark. */
  private renderNight(instant = false) {
    const on = !!this.scene.night && ['moon', 'blackout', 'lamp'].includes(this.light);
    this.dark.classList.toggle('instant', instant || this.reduced);
    this.dark.classList.toggle('on', on);
  }

  private renderPieces() {
    for (const img of this.pieces.querySelectorAll<HTMLImageElement>('img')) img.classList.toggle('on', this.props[img.dataset.piece!] === 'on');
  }

  /** Dress a character in another sheet (#outfit:child=uniform), or back in their own ('none'). */
  setOutfit(id: string, outfit: string) {
    const was = this.outfits[id] || '';
    const now = outfit === 'none' ? '' : outfit;
    if (was === now) return;
    if (now) this.outfits[id] = now;
    else delete this.outfits[id];
    const a = this.actors.get(id);
    if (!a) return;
    const pose = a.pose;
    a.url = '';
    this.setExpr(id, pose);
    this.preload(id);
  }

  setProp(name: string, value: string) {
    this.props[name] = value;
    if (name === 'foil') this.antenna.classList.toggle('foiled', value === 'on');
    if (name === 'lamp') this.lamp.classList.toggle('on', value === 'on');
    this.renderPieces();
    this.renderTv();
  }

  private renderTv() {
    const p = this.props;
    const state = this.scene.id === 'auntie' ? ({ snow: 'snow', fixed: 'news' } as Record<string, string>)[p.auntie_tv] || 'off' : p.tv || 'off';
    const was = this.tv.dataset.state;
    this.tv.dataset.state = state;
    this.world.classList.toggle('tv-on', state !== 'off');
    // a burst of static between channels, like a real set
    if (was && was !== state && state !== 'off' && state !== 'snow' && !this.reduced) {
      this.tv.classList.remove('flick');
      void this.tv.offsetWidth;
      this.tv.classList.add('flick');
      setTimeout(() => this.tv.classList.remove('flick'), 340); // its fade-out must not stick to the snow layer
    }
    cancelAnimationFrame(this.snowRaf);
    if (state === 'off') return;
    const ctx = this.snow.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(this.snow.width, this.snow.height);
    let last = 0;
    const draw = (t: number) => {
      if (t - last > 60) {
        last = t;
        for (let i = 0; i < img.data.length; i += 4) {
          const v = (Math.random() * 230) | 0;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      if (!this.reduced && (this.tv.dataset.state === 'snow' || this.tv.classList.contains('flick'))) this.snowRaf = requestAnimationFrame(draw);
    };
    this.snowRaf = requestAnimationFrame(draw);
  }

  // ---------------------------------------------------------------- cast
  /** Who stands in the room, left to right. A token may pin a spot: "dad@73". */
  setCast(tokens: string[], expr: Record<string, string>) {
    const ids = tokens.map((t) => castEntry(t).id);
    for (const [id, a] of this.actors) {
      if (ids.includes(id)) continue;
      this.actors.delete(id);
      a.el.style.setProperty('--enter', a.x < 50 ? '-45%' : '45%'); // walk off the nearer side
      a.el.classList.add('leaving');
      setTimeout(() => a.el.remove(), this.reduced ? 0 : 450);
    }
    const entries = tokens.map(castEntry).filter((e) => CHARACTERS[e.id]?.sprite);
    this.order = entries.map((e) => e.id);
    const [a0, a1] = this.scene.floor;
    entries.forEach(({ id, at }, i) => {
      const x = at ?? (entries.length === 1 ? (a0 + a1) / 2 : a0 + ((a1 - a0) * (i + 0.5)) / entries.length);
      let a = this.actors.get(id);
      if (!a) {
        a = this.makeActor(id, expr[id] || 'neutral', x);
        this.actors.set(id, a);
      }
      a.x = x;
      a.el.style.left = `${x}%`;
    });
    if (this.followId && !this.actors.has(this.followId)) this.followId = null;
    if (!this.actors.has(this.focused)) this.focused = 'none';
    this.frame();
  }

  private makeActor(id: string, expr: string, x: number): Actor {
    const kind = CHARACTERS[id].kind;
    const el = document.createElement('div');
    el.className = `actor ${kind} entering`;
    el.dataset.id = id;
    el.style.setProperty('--h', `${BODY[kind].h}%`);
    el.style.setProperty('--b', `${BODY[kind].b}%`);
    el.style.setProperty('--d', `${(Math.random() * -4).toFixed(2)}s`);
    el.style.setProperty('--enter', x < 50 ? '-45%' : '45%'); // walk in from the nearer side
    el.style.left = `${x}%`;
    el.innerHTML = `<div class="body"><img alt="" draggable="false" class="on"><img alt="" draggable="false"></div><div class="emote"></div><img class="sticker" alt="">`;
    this.cast.append(el);
    const url = poseUrl(id, expr, this.player, this.outfits[id])!;
    const imgs = [...el.querySelectorAll<HTMLImageElement>('.body img')];
    imgs[0].src = url;
    this.placeHead(el, id, url);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('entering')));
    this.preload(id);
    return { id, el, imgs, front: 0, url, pose: expr, x, emote: el.querySelector('.emote')!, sticker: el.querySelector('.sticker')! };
  }

  private placeHead(el: HTMLElement, id: string, url: string) {
    return measureHead(url, headHeight(id, this.player, this.outfits[id])).then((h) => {
      el.style.setProperty('--hx', `${h.x}%`);
      el.style.setProperty('--hy', `${h.y}%`);
      el.style.setProperty('--hw', `${h.w}%`);
      el.dataset.hx = String(h.x);
      el.dataset.hy = String(h.y);
      el.dataset.hc = String(h.chin);
      el.dataset.hw = String(h.w);
      if (id === this.followId || id === this.focused) this.frame(); // the face moved: keep it framed
    });
  }

  /** Resolves once this character's current pose has a measured face (or after `ms`). */
  measured(id: string, ms = 400): Promise<void> {
    const a = this.actors.get(id);
    if (!a) return Promise.resolve();
    const done = this.placeHead(a.el, id, a.url).then(() => {});
    return Promise.race([done, new Promise<void>((r) => setTimeout(r, ms))]);
  }

  private preload(id: string) {
    for (const u of allPoseUrls(id, this.player, this.outfits[id])) {
      if (this.preloaded.has(u)) continue;
      this.preloaded.add(u);
      measureHead(u, headHeight(id, this.player, this.outfits[id])); // loads the pose and knows its face before it is needed
    }
  }

  /** Swap pose with a short crossfade (static sprites: no fake skeletal animation). */
  setExpr(id: string, expr: string) {
    const a = this.actors.get(id);
    const url = poseUrl(id, expr, this.player, this.outfits[id]);
    if (a) a.pose = expr;
    if (!a || !url || a.url === url) return;
    a.url = url;
    const back = a.imgs[1 - a.front];
    const swap = () => {
      if (a.url !== url) return; // a newer pose won the race
      back.classList.add('on');
      a.imgs[a.front].classList.remove('on');
      a.front = 1 - a.front;
    };
    this.placeHead(a.el, id, url);
    back.src = url;
    back.decode().then(swap, swap);
  }

  /** Re-skin the player and friend after the boy/girl choice. */
  setPlayer(p: Player) {
    if (p === this.player) return;
    this.player = p;
    for (const a of this.actors.values()) {
      if (a.id !== 'child' && a.id !== 'friend') continue;
      a.url = '';
      this.setExpr(a.id, a.pose);
    }
  }

  speaking(id: string | null) {
    for (const [aid, a] of this.actors) a.el.classList.toggle('talking', aid === id);
    if (id && this.actors.has(id)) {
      this.followId = id;
      this.frame();
    }
  }

  emote(id: string, kind: string) {
    const a = this.actors.get(id);
    if (!a || !EMOTE_ART[kind]) return;
    a.emote.innerHTML = EMOTE_ART[kind];
    a.emote.className = 'emote';
    void a.emote.offsetWidth;
    a.emote.className = `emote show ${kind}`;
    clearTimeout(Number(a.emote.dataset.t));
    a.emote.dataset.t = String(setTimeout(() => (a.emote.className = 'emote'), 2400));
  }

  sticker(id: string, name: string) {
    const a = this.actors.get(id);
    if (!a) return;
    a.sticker.src = assetUrl(`fx/${name}.webp`);
    // burst on the side away from where the speech bubble will hang
    // near a screen edge there's no room beside the head, so burst above it
    const sx = this.project(a.x, 0).x / this.root.clientWidth;
    const side = sx < 0.22 || sx > 0.78 ? 'over' : sx < 0.5 ? 'west' : 'east';
    a.sticker.className = 'sticker';
    void a.sticker.offsetWidth;
    a.sticker.className = `sticker show ${side}`;
    clearTimeout(Number(a.sticker.dataset.t));
    a.sticker.dataset.t = String(setTimeout(() => (a.sticker.className = 'sticker'), 2000));
  }

  anim(id: string, kind: string) {
    const body = this.actors.get(id)?.el.querySelector<HTMLElement>('.body');
    if (!body || this.reduced) return;
    body.className = 'body';
    void body.offsetWidth; // restart the animation
    body.className = `body anim-${kind}`;
  }

  // ---------------------------------------------------------------- camera
  setShot(name: string, instant = false) {
    if (name === 'push') this.pushed = true;
    else if (this.scene.shots[name]) {
      this.shot = name;
      this.pushed = false;
    }
    this.frame(instant, name === 'push');
  }

  /** Reaction shot: push in on one character's face and soften the rest. */
  focus(id: string) {
    this.focused = this.actors.has(id) ? id : 'none';
    if (this.focused === 'none') this.readRoom = false;
    this.frame();
  }

  /** While choices are up on a phone, frame faces higher so the answers never cover them. */
  setChoosing(on: boolean) {
    if (this.choosing === on) return;
    this.choosing = on;
    if (this.portrait) this.frame();
  }

  /** READ THE ROOM: a tighter push on the focused face with a vignette. */
  setReadRoom(on: boolean) {
    this.readRoom = on;
    this.world.classList.toggle('read-room', on);
    this.frame();
  }

  private layout(instant = false) {
    const vw = this.root.clientWidth;
    const vh = this.root.clientHeight;
    this.W = Math.max(vw, vh * ASPECT);
    this.H = this.W / ASPECT;
    this.world.style.width = `${this.W}px`;
    this.world.style.height = `${this.H}px`;
    this.world.style.setProperty('--wu', `${this.W / 100}px`);
    this.frame(instant);
  }

  /** A point on the head in % of the world: `at` 0 is the top of the hair, 1 the chin, 0.5 the face centre. */
  private headY(a: Actor, at = 0.5) {
    const b = BODY[CHARACTERS[a.id].kind];
    const top = Number(a.el.dataset.hy);
    const chin = Number(a.el.dataset.hc);
    const face = a.el.dataset.hc ? (top + (chin - top) * at) / 100 : b.face + (at - 0.5) * 0.2; // a body-type guess until measured
    return 100 - (b.b + b.h) + b.h * face;
  }

  private faceY(a: Actor) {
    return this.headY(a);
  }

  /** Half the face's width in % of the world. */
  private faceHalf(a: Actor) {
    const hw = a.el.dataset.hw ? Number(a.el.dataset.hw) : 22;
    return ((hw / 100) * (BODY[CHARACTERS[a.id].kind].h * 0.8)) / ASPECT / 2;
  }

  /** Horizontal face centre in % of the world (the sprite is centred on a.x). */
  private faceX(a: Actor) {
    const b = BODY[CHARACTERS[a.id].kind];
    const hx = a.el.dataset.hx ? Number(a.el.dataset.hx) : 50;
    return a.x + ((hx - 50) / 100) * (b.h * 0.8) / ASPECT;
  }

  private frame(instant = false, slow = false) {
    if (!this.W) return;
    const vw = this.root.clientWidth;
    const vh = this.root.clientHeight;
    const focus = this.actors.get(this.focused);
    const portrait = this.portrait;
    let [s, x, y] = this.scene.shots[this.shot] || this.scene.shots.wide;
    // On phones, text lives in the lower half; whoever matters keeps their face up here.
    let face: Actor | undefined;
    if (focus) {
      s = this.readRoom ? (portrait ? 1.55 : 1.75) : portrait ? 1.35 : 1.32;
      x = this.faceX(focus);
      y = this.faceY(focus) + (this.readRoom ? 4 : 12);
      face = focus;
    } else {
      if (this.pushed) s *= 1.12;
      if (portrait && PEOPLE_SHOTS.has(this.shot)) {
        const xs = this.order.map((id) => this.actors.get(id)!.x);
        face = (this.followId && this.actors.get(this.followId)) || undefined;
        x = face ? this.faceX(face) : (xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : x);
        s = Math.max(s, 1.25); // closer, so faces are big enough to read
      }
    }
    const faceAt = this.choosing ? 0.2 : 0.3; // fraction of the screen height where the face sits
    // a low face (a child) can only rise that far if we're zoomed in enough to have floor below it
    if (portrait && face) s = Math.min(2.4, Math.max(s, ((1 - faceAt) * vh) / ((1 - this.faceY(face) / 100) * this.H)));
    s *= this.zoom;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const tx = clamp(vw / 2 - (s * x * this.W) / 100, vw - s * this.W, 0);
    const wantY = portrait && face ? vh * faceAt - (s * this.faceY(face) * this.H) / 100 : vh / 2 - (s * y * this.H) / 100;
    const ty = clamp(wantY, vh - s * this.H, 0);
    this.cam = { s, tx, ty };
    this.world.classList.toggle('instant', instant || this.reduced);
    this.world.classList.toggle('slow', slow);
    this.world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    this.world.style.setProperty('--inv', String(1 / s));
    for (const [id, a] of this.actors) a.el.classList.toggle('dim', !!focus && id !== this.focused);
  }

  /** Screen position of a world point given in % of the painting. */
  project(xPct: number, yPct: number) {
    const { s, tx, ty } = this.cam;
    return { x: tx + (s * xPct * this.W) / 100, y: ty + (s * yPct * this.H) / 100 };
  }

  /** Where to hang a speech bubble: the speaker's face, or the TV screen. */
  anchor(id: string): Anchor | null {
    const vw = this.root.clientWidth;
    const vh = this.root.clientHeight;
    if (id === 'tv') {
      if (!this.scene.tv) return null;
      const [l, t, w] = this.scene.tv;
      const p = this.project(l + w / 2, t);
      return { ...p, top: p.y, chin: p.y, half: 0, h: 0, onScreen: p.x > 0 && p.x < vw && p.y > 0 && p.y < vh };
    }
    const a = this.actors.get(id);
    if (!a) return null;
    const p = this.project(this.faceX(a), this.faceY(a));
    const top = this.project(0, this.headY(a, 0)).y;
    const chin = this.project(0, this.headY(a, 1)).y;
    const half = this.project(this.faceHalf(a), 0).x - this.project(0, 0).x;
    const h = (BODY[CHARACTERS[id].kind].h / 100) * this.H * this.cam.s;
    return { ...p, top, chin, half, h, onScreen: p.x > 20 && p.x < vw - 20 && p.y > 0 && p.y < vh * 0.8 };
  }

  /** Every face currently on screen (where the camera is heading, not mid-move). */
  faces(): FaceBox[] {
    const vw = this.root.clientWidth;
    const vh = this.root.clientHeight;
    const out: FaceBox[] = [];
    for (const a of this.actors.values()) {
      if (!a.el.dataset.hc) continue;
      const half = this.faceHalf(a);
      const l = this.project(this.faceX(a) - half, this.headY(a, 0.15));
      const r = this.project(this.faceX(a) + half, this.headY(a, 1));
      if (r.x < 0 || l.x > vw || r.y < 0 || l.y > vh) continue;
      out.push({ id: a.id, left: l.x, right: r.x, top: l.y, bottom: r.y });
    }
    return out;
  }

  // ---------------------------------------------------------------- hotspots
  showHotspots(list: { id: string; label: string; pick: () => void }[]) {
    this.clearHotspots();
    for (const h of list) {
      const spot = this.scene.hotspots[h.id];
      if (!spot) continue;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hotspot';
      b.tabIndex = -1; // keyboard users get the same option in the choice list
      b.setAttribute('aria-hidden', 'true');
      b.style.left = `${spot.at[0]}%`;
      b.style.top = `${spot.at[1]}%`;
      b.innerHTML = '<span class="ring"></span><span class="label"></span>';
      b.querySelector('.label')!.textContent = h.label;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        h.pick();
      });
      this.spots.append(b);
    }
  }

  clearHotspots() {
    this.spots.replaceChildren();
  }
}
