// Illustrated 2D stage. Always present: it's what players see before WebGL is
// ready, when WebGL is unavailable, or after the GPU context is lost. Camera
// shots become CSS framing; lighting becomes a tint layer.
import { SCENES } from '../content/scenes.ts';

export interface StageView {
  setScene(id: string): void;
  setShot(name: string, instant?: boolean): void;
  setLight(id: string): void;
  setProp(name: string, value: string): void;
  /** Hotspot position in % of the room window, or null if off-screen. */
  project(id: string): { x: number; y: number } | null;
}

const TINTS: Record<string, [string, number]> = {
  snow: ['#1d2a44', 0.45],
  evening: ['#3a2030', 0.12],
  film: ['#20304a', 0.3],
  tension: ['#140c1c', 0.5],
  blackout: ['#05070f', 0.88],
  lamp: ['#2a1405', 0.62],
  afternoon: ['#ffb060', 0.06],
  dusk: ['#5a2a3a', 0.28],
  day: ['#ffffff', 0],
};

export class FlatStage implements StageView {
  private scene = 'hall';
  private shot = 'wide';
  private pushed = false;
  private frame: HTMLElement;
  private bg: HTMLElement;
  private tint: HTMLElement;

  constructor(frame: HTMLElement, bg: HTMLElement, tint: HTMLElement) {
    this.frame = frame;
    this.bg = bg;
    this.tint = tint;
  }

  setScene(id: string) {
    this.scene = SCENES[id] ? id : 'hall';
    this.bg.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/${SCENES[this.scene].fallback}')`;
    this.setShot('wide', true);
  }

  setShot(name: string, instant = false) {
    const shots = SCENES[this.scene].shots;
    if (name === 'push') {
      this.pushed = true;
    } else if (shots[name]) {
      this.shot = name;
      this.pushed = false;
    }
    const [s, x, y] = shots[this.shot].flat;
    this.frame.classList.toggle('instant', instant);
    this.frame.style.transformOrigin = `${x}% ${y}%`;
    this.frame.style.transform = `scale(${this.pushed ? s * 1.18 : s})`;
  }

  setLight(id: string) {
    const [color, alpha] = TINTS[id] || TINTS.day;
    this.tint.style.background = color;
    this.tint.style.opacity = String(alpha);
  }

  setProp() {
    /* the illustrated rooms are static */
  }

  project(id: string) {
    const h = SCENES[this.scene].hotspots[id];
    if (!h) return null;
    const [s0, ox, oy] = SCENES[this.scene].shots[this.shot].flat;
    const s = this.pushed ? s0 * 1.18 : s0;
    const x = ox + (h.flat[0] - ox) * s;
    const y = oy + (h.flat[1] - oy) * s;
    return x < 3 || x > 97 || y < 3 || y > 97 ? null : { x, y };
  }
}
