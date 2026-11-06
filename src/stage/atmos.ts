// The air in the room: dust in the sun, rain outside, fireflies after dark, and
// confetti when something is worth celebrating. Drawn in screen space over the
// world, so it stays the same size whatever the camera does. One canvas, asleep
// when there is nothing to draw, and never used under reduced motion.

export type Air = 'none' | 'dust' | 'drizzle' | 'rain' | 'fireflies';

type Mote = { x: number; y: number; r: number; v: number; phase: number };
type Drop = { x: number; y: number; len: number; v: number; front: boolean };
type Ring = { x: number; y: number; age: number };
type Paper = { x: number; y: number; vx: number; vy: number; s: number; rot: number; vr: number; color: string };

const COLORS = ['#f2b53c', '#e5583f', '#2f8a5b', '#fff7e6', '#3a5fb0', '#b8432c'];

/** A soft round dot, drawn once and stamped many times: far cheaper than a gradient per particle. */
function softDot(rgb: string) {
  const c = Object.assign(document.createElement('canvas'), { width: 32, height: 32 });
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(0.35, `rgba(${rgb}, .55)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, 32, 32);
  return c;
}

export class Atmos {
  reduced = false;
  private cv = document.createElement('canvas');
  private ctx = this.cv.getContext('2d');
  private air: Air = 'none';
  private motes: Mote[] = [];
  private drops: Drop[] = [];
  private rings: Ring[] = [];
  private papers: Paper[] = [];
  private w = 0;
  private h = 0;
  private raf = 0;
  private last = 0;
  private dust = softDot('255, 228, 170');
  private fly = softDot('214, 255, 130');

  constructor(root: HTMLElement) {
    this.cv.className = 'atmos';
    this.cv.setAttribute('aria-hidden', 'true');
    root.append(this.cv);
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      this.w = root.clientWidth;
      this.h = root.clientHeight;
      this.cv.width = this.w * dpr;
      this.cv.height = this.h * dpr;
      this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.seed();
    };
    new ResizeObserver(fit).observe(root);
    fit();
  }

  set(air: Air) {
    const next = this.reduced ? 'none' : air;
    if (next === this.air) return;
    this.air = next;
    this.seed();
    this.wake();
  }

  /** Paper falling from the top of the screen. */
  confetti() {
    if (this.reduced) return;
    for (let i = 0; i < Math.min(180, this.w / 7); i++) {
      this.papers.push({
        x: Math.random() * this.w,
        y: -20 - Math.random() * this.h * 0.7,
        vx: (Math.random() - 0.5) * 50,
        vy: 90 + Math.random() * 120,
        s: 5 + Math.random() * 7,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 9,
        color: COLORS[i % COLORS.length],
      });
    }
    this.wake();
  }

  private seed() {
    const area = (this.w * this.h) / (1440 * 900);
    const n = (full: number) => Math.round(full * Math.min(1, Math.max(0.35, area)));
    this.motes = [];
    this.drops = [];
    this.rings = [];
    const spread = (count: number, r0: number, r1: number) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: r0 + Math.random() * (r1 - r0),
        v: 6 + Math.random() * 14,
        phase: Math.random() * 6.28,
      }));
    if (this.air === 'dust') this.motes = spread(n(34), 1.5, 4.5);
    if (this.air === 'fireflies') this.motes = spread(n(18), 3, 6);
    if (this.air === 'rain' || this.air === 'drizzle') {
      this.drops = Array.from({ length: n(this.air === 'rain' ? 340 : 90) }, () => {
        const front = Math.random() < 0.3;
        return { x: Math.random() * this.w * 1.2, y: Math.random() * this.h, len: front ? 26 + Math.random() * 18 : 12 + Math.random() * 12, v: front ? 1150 : 780, front };
      });
    }
  }

  private wake() {
    if (this.raf || !this.ctx) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const c = this.ctx!;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    c.clearRect(0, 0, this.w, this.h);
    if (this.air === 'dust') this.drawDust(c, now, dt);
    else if (this.air === 'fireflies') this.drawFireflies(c, now, dt);
    else if (this.air === 'rain' || this.air === 'drizzle') this.drawRain(c, dt);
    this.drawPapers(c, dt);
    this.raf = this.air === 'none' && !this.papers.length ? 0 : requestAnimationFrame(this.tick);
  };

  private drawDust(c: CanvasRenderingContext2D, now: number, dt: number) {
    for (const m of this.motes) {
      m.y -= m.v * 0.35 * dt;
      m.x += Math.sin(now / 2400 + m.phase) * 7 * dt;
      if (m.y < -8) {
        m.y = this.h + 8;
        m.x = Math.random() * this.w;
      }
      c.globalAlpha = 0.16 + 0.18 * (0.5 + 0.5 * Math.sin(now / 1500 + m.phase));
      c.drawImage(this.dust, m.x - m.r, m.y - m.r, m.r * 2, m.r * 2);
    }
    c.globalAlpha = 1;
  }

  private drawFireflies(c: CanvasRenderingContext2D, now: number, dt: number) {
    c.globalCompositeOperation = 'lighter';
    for (const m of this.motes) {
      m.x += Math.sin(now / 1700 + m.phase) * m.v * dt;
      m.y += Math.cos(now / 2100 + m.phase * 2) * m.v * 0.7 * dt;
      m.x = (m.x + this.w) % this.w;
      m.y = (m.y + this.h) % this.h;
      const pulse = Math.max(0, Math.sin(now / 900 + m.phase * 3));
      c.globalAlpha = pulse * pulse;
      const r = m.r * 3;
      c.drawImage(this.fly, m.x - r, m.y - r, r * 2, r * 2);
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }

  private drawRain(c: CanvasRenderingContext2D, dt: number) {
    const lean = 0.16;
    for (const front of [false, true]) {
      c.beginPath();
      c.lineWidth = front ? 1.6 : 1;
      c.strokeStyle = front ? 'rgba(225, 235, 255, .42)' : 'rgba(205, 220, 250, .26)';
      for (const d of this.drops) {
        if (d.front !== front) continue;
        d.y += d.v * dt;
        d.x -= d.v * lean * dt;
        if (d.y > this.h) {
          // a drop hits the ground somewhere on the floor, then starts again above the frame
          if (this.rings.length < 60) this.rings.push({ x: d.x, y: this.h * (0.72 + Math.random() * 0.28), age: 0 });
          d.y = -d.len;
          d.x = Math.random() * this.w * 1.2;
        }
        c.moveTo(d.x, d.y);
        c.lineTo(d.x + d.len * lean, d.y - d.len);
      }
      c.stroke();
    }
    c.lineWidth = 1.2;
    this.rings = this.rings.filter((r) => (r.age += dt) < 0.32);
    for (const r of this.rings) {
      const t = r.age / 0.32;
      c.strokeStyle = `rgba(230, 240, 255, ${0.45 * (1 - t)})`;
      c.beginPath();
      c.ellipse(r.x, r.y, 2 + t * 13, 1 + t * 4, 0, 0, 6.28);
      c.stroke();
    }
  }

  private drawPapers(c: CanvasRenderingContext2D, dt: number) {
    for (const p of this.papers) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.scale(1, Math.abs(Math.cos(p.rot * 1.7)) * 0.8 + 0.2); // paper tumbling in the air
      c.fillStyle = p.color;
      c.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62);
      c.restore();
    }
    this.papers = this.papers.filter((p) => p.y < this.h + 20);
  }
}
