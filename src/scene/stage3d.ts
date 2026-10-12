// Three.js stage. Loaded lazily; if anything here fails the illustrated
// FlatStage simply stays visible. Renders on demand: continuous frames only
// while the camera/lights are moving or a TV/fan/flame is visibly animating.
import * as THREE from 'three';
import { SCENES, type Shot } from '../content/scenes.ts';
import type { StageView } from './flat.ts';
import { buildAuntie, buildCompound, buildHall, Crt, type Room } from './rooms.ts';

interface Preset {
  sky: string;
  ground: string;
  hemi: number;
  sun: string;
  sunI: number;
  lamp: string;
  lampI: number;
  tv: number;
  flame: number;
  bg: string;
  exposure: number;
}

const P = (sky: string, ground: string, hemi: number, sun: string, sunI: number, lamp: string, lampI: number, tv: number, flame: number, bg: string, exposure: number): Preset => ({ sky, ground, hemi, sun, sunI, lamp, lampI, tv, flame, bg, exposure });

// Interior presets assume a warm practical lamp; outdoor ones lean on the sun.
const PRESETS: Record<string, Preset> = {
  snow: P('#6f7fa8', '#2a2030', 0.9, '#8090c0', 0.4, '#ffae72', 4, 6, 0, '#1a1420', 1.1),
  evening: P('#ffdcbb', '#715568', 2.2, '#ffe3bf', 2.4, '#ffae72', 22, 2, 0, '#2a1d24', 1.45),
  film: P('#c0a8c0', '#4a3848', 1.4, '#ffd8b0', 1.2, '#ff9a5c', 12, 9, 0, '#1f1620', 1.35),
  tension: P('#7a6888', '#2a1c2a', 0.8, '#ffc8a0', 0.5, '#ff8a4c', 4, 14, 0, '#120c14', 1.25),
  blackout: P('#28304a', '#0a0a12', 0.25, '#5060a0', 0.15, '#000000', 0, 0, 0, '#07070c', 1.0),
  lamp: P('#4a3020', '#120a08', 0.35, '#ffb070', 0.1, '#000000', 0, 0, 7, '#0c0806', 1.3),
  afternoon: P('#ffe8c8', '#9a7058', 2.4, '#fff0d0', 3.2, '#ffe0a1', 8, 1, 0, '#f2c58e', 1.35),
  dusk: P('#f0a080', '#5a3848', 1.6, '#ff9a60', 2.0, '#ffb070', 10, 1, 0, '#d9826a', 1.3),
  day: P('#fff4e0', '#8a7060', 2.6, '#fff6e6', 2.8, '#ffe8c0', 10, 1, 0, '#e8d6b8', 1.4),
};

type Tier = 'high' | 'low';

export class Stage3D implements StageView {
  readonly renderer: THREE.WebGLRenderer;
  private scene3 = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(39, 1, 0.1, 90);
  private hemi = new THREE.HemisphereLight('#ffdcbb', '#715568', 2.2);
  private sun = new THREE.DirectionalLight('#ffe3bf', 2.4);
  private lamp = new THREE.PointLight('#ffae72', 22, 13, 2);
  private crtHall = new Crt();
  private crtAuntie = new Crt();
  private rooms: Record<string, Room | undefined> = {};
  private sceneId = 'hall';
  private shot: Shot = SCENES.hall.shots.wide;
  private camFrom = { pos: new THREE.Vector3(7, 5, 9.4), look: new THREE.Vector3(0, 1.65, 0), fov: 39 };
  private camTo = { pos: new THREE.Vector3(7, 5, 9.4), look: new THREE.Vector3(0, 1.65, 0), fov: 39 };
  private camT = 1;
  private camDur = 1.2;
  private look = new THREE.Vector3();
  private light: Preset = { ...PRESETS.evening };
  private lightFrom: Preset = { ...PRESETS.evening };
  private lightTo: Preset = { ...PRESETS.evening };
  private lightT = 1;
  private pointer = new THREE.Vector2();
  private clock = new THREE.Clock();
  private raf = 0;
  private active = true;
  private lost = false;
  private frameTimes: number[] = [];
  private lastFrame = 0;
  private lastTv = 0;
  tier: Tier;
  reducedMotion = false;
  onFrame: () => void = () => {};
  onLost: (lost: boolean) => void = () => {};
  private canvas: HTMLCanvasElement;
  private host: HTMLElement;

  constructor(canvas: HTMLCanvasElement, host: HTMLElement) {
    this.canvas = canvas;
    this.host = host;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const weak = (navigator.hardwareConcurrency || 4) <= 4 || ((navigator as { deviceMemory?: number }).deviceMemory || 8) <= 4;
    this.tier = coarse || weak ? 'low' : 'high';
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: this.tier === 'high', powerPreference: 'low-power' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.applyTier();
    this.sun.position.set(-3, 9, 5);
    this.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
    this.sun.shadow.bias = -0.001;
    this.lamp.position.set(-2.9, 2.9, -2.9);
    this.scene3.add(this.hemi, this.sun, this.lamp);
    this.scene3.fog = new THREE.Fog('#2a1d24', 18, 40);

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
      cancelAnimationFrame(this.raf);
      this.onLost(true);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.lost = false;
      this.onLost(false);
      this.kick();
    });
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      this.pointer.set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
      if (!this.reducedMotion) this.kick();
    });
    host.addEventListener('pointerleave', () => this.pointer.set(0, 0));
    new ResizeObserver(() => this.resize()).observe(host);
    document.addEventListener('visibilitychange', () => (document.hidden ? cancelAnimationFrame(this.raf) : this.kick()));
    this.resize();
    this.setScene('hall');
    // Build the other sets when the browser is idle so scene changes don't hitch.
    const idle = (window as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1500));
    idle(() => ['auntie', 'compound'].forEach((id) => this.room(id)));
  }

  private applyTier() {
    const high = this.tier === 'high';
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.25));
    this.renderer.shadowMap.enabled = high;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.sun.castShadow = high;
    this.resize();
  }

  private room(id: string): Room {
    let r = this.rooms[id];
    if (!r) {
      r = id === 'auntie' ? buildAuntie(this.crtAuntie) : id === 'compound' ? buildCompound() : buildHall(this.crtHall);
      r.group.visible = false;
      this.scene3.add(r.group);
      this.rooms[id] = r;
    }
    return r;
  }

  setActive(on: boolean) {
    this.active = on;
    if (on) this.kick();
    else cancelAnimationFrame(this.raf);
  }

  setScene(id: string) {
    this.sceneId = SCENES[id] ? id : 'hall';
    for (const [rid, r] of Object.entries(this.rooms)) if (r) r.group.visible = rid === this.sceneId;
    this.room(this.sceneId).group.visible = true;
    if (this.sceneId === 'auntie' && this.crtAuntie.mode === 'off') this.crtAuntie.mode = 'snow';
    this.setShot('wide', true);
  }

  setShot(name: string, instant = false) {
    const shots = SCENES[this.sceneId].shots;
    this.camFrom = { pos: this.camera.position.clone(), look: this.look.clone(), fov: this.camera.fov };
    if (name === 'push') {
      // slow dolly toward whatever we're looking at
      const dir = this.camTo.look.clone().sub(this.camTo.pos);
      this.camTo = { pos: this.camTo.pos.clone().addScaledVector(dir, 0.22), look: this.camTo.look.clone(), fov: this.camTo.fov - 3 };
      this.camDur = 5;
    } else {
      this.shot = shots[name] || shots.wide;
      this.camTo = { pos: new THREE.Vector3(...this.shot.pos), look: new THREE.Vector3(...this.shot.look), fov: this.shot.fov || 39 };
      this.camDur = 1.4;
    }
    this.camT = instant || this.reducedMotion ? 1 : 0;
    if (this.camT === 1) this.placeCamera(1);
    this.kick();
  }

  setLight(id: string) {
    this.lightFrom = { ...this.light };
    this.lightTo = { ...(PRESETS[id] || PRESETS.evening) };
    this.lightT = this.reducedMotion ? 1 : 0;
    if (this.lightT === 1) this.blendLight(1);
    this.kick();
  }

  setProp(name: string, value: string) {
    for (const id of ['hall', 'auntie']) this.room(id).props[name]?.(value);
    this.kick();
  }

  project(id: string) {
    const h = SCENES[this.sceneId].hotspots[id];
    if (!h) return null;
    const v = new THREE.Vector3(...h.pos).project(this.camera);
    const x = (v.x + 1) * 50;
    const y = (1 - v.y) * 50;
    return v.z > 1 || x < 3 || x > 97 || y < 3 || y > 97 ? null : { x, y };
  }

  private resize() {
    const { width, height } = this.host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.placeCamera(this.camT >= 1 ? 1 : this.camT);
    this.kick();
  }

  private placeCamera(t: number) {
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
    this.camera.position.lerpVectors(this.camFrom.pos, this.camTo.pos, e);
    this.look.lerpVectors(this.camFrom.look, this.camTo.look, e);
    const fov = this.camFrom.fov + (this.camTo.fov - this.camFrom.fov) * e;
    // Portrait screens see less width: widen the lens so the set still reads.
    const a = this.camera.aspect;
    this.camera.fov = fov * (a < 0.8 ? 1.45 : a < 1.2 ? 1.22 : a < 1.5 ? 1.08 : 1);
    if (!this.reducedMotion) {
      this.camera.position.x += this.pointer.x * 0.25;
      this.camera.position.y -= this.pointer.y * 0.12;
    }
    this.camera.lookAt(this.look);
    this.camera.updateProjectionMatrix();
  }

  private blendLight(t: number) {
    const a = this.lightFrom;
    const b = this.lightTo;
    const c = (x: string, y: string) => '#' + new THREE.Color(x).lerp(new THREE.Color(y), t).getHexString();
    const n = (x: number, y: number) => x + (y - x) * t;
    this.light = {
      sky: c(a.sky, b.sky), ground: c(a.ground, b.ground), hemi: n(a.hemi, b.hemi), sun: c(a.sun, b.sun), sunI: n(a.sunI, b.sunI),
      lamp: c(a.lamp, b.lamp), lampI: n(a.lampI, b.lampI), tv: n(a.tv, b.tv), flame: n(a.flame, b.flame), bg: c(a.bg, b.bg), exposure: n(a.exposure, b.exposure),
    };
    const L = this.light;
    this.hemi.color.set(L.sky);
    this.hemi.groundColor.set(L.ground);
    this.hemi.intensity = L.hemi;
    this.sun.color.set(L.sun);
    this.sun.intensity = L.sunI;
    this.lamp.color.set(L.lamp);
    this.lamp.intensity = this.sceneId === 'compound' ? 0 : L.lampI;
    this.scene3.background = new THREE.Color(L.bg);
    (this.scene3.fog as THREE.Fog).color.set(L.bg);
    this.renderer.toneMappingExposure = L.exposure;
    const room = this.rooms[this.sceneId];
    if (room?.tvLight) room.tvLight.intensity = L.tv;
    if (room?.flame) room.flame.intensity = room.flame.userData.base = L.flame;
  }

  /** Is something on screen moving by itself (TV noise, fan, flame)? */
  private get ambientMotion() {
    if (this.reducedMotion) return false;
    return this.sceneId !== 'compound';
  }

  kick() {
    if (!this.active || this.lost || document.hidden) return;
    cancelAnimationFrame(this.raf);
    this.lastFrame = 0;
    this.raf = requestAnimationFrame((now) => this.frame(now));
  }

  private frame(now: number) {
    const dt = Math.min(0.1, this.clock.getDelta());
    const t = this.clock.elapsedTime;
    let moving = false;
    if (this.camT < 1) {
      this.camT = Math.min(1, this.camT + dt / this.camDur);
      moving = true;
    }
    this.placeCamera(this.camT);
    if (this.lightT < 1) {
      this.lightT = Math.min(1, this.lightT + dt / 0.9);
      this.blendLight(this.lightT);
      moving = true;
    }
    const room = this.rooms[this.sceneId];
    if (!this.reducedMotion) room?.tick?.(t, dt);
    // TVs repaint at ~12fps; that's plenty for snow and melodrama.
    if (now - this.lastTv > 80 || this.reducedMotion) {
      this.lastTv = now;
      const crt = this.sceneId === 'auntie' ? this.crtAuntie : this.crtHall;
      if (this.sceneId !== 'compound') crt.paint(this.reducedMotion ? 0 : t);
      if (room?.tvLight && crt.animated && !this.reducedMotion) room.tvLight.intensity = this.light.tv * (0.85 + Math.random() * 0.3);
      if (room?.tvLight && crt.mode === 'off') room.tvLight.intensity = 0;
    }
    this.renderer.render(this.scene3, this.camera);
    this.onFrame();
    this.adapt(now);
    if (moving || this.ambientMotion) {
      // ambient-only animation is capped at ~30fps to save battery
      const wait = moving ? 0 : 30;
      this.raf = requestAnimationFrame((n) => (n - now >= wait ? this.frame(n) : this.idleFrame(now)));
    }
  }

  private idleFrame(prev: number) {
    this.raf = requestAnimationFrame((n) => (n - prev >= 30 ? this.frame(n) : this.idleFrame(prev)));
  }

  /** Drop to the low tier if the device can't keep up. */
  private adapt(now: number) {
    if (this.tier === 'low') return;
    if (this.lastFrame) this.frameTimes.push(now - this.lastFrame);
    this.lastFrame = now;
    if (this.frameTimes.length >= 90) {
      const sorted = [...this.frameTimes].sort((a, b) => a - b);
      const median = sorted[45];
      this.frameTimes = [];
      if (median > 40) {
        this.tier = 'low';
        this.applyTier();
      }
    }
  }

  /** Test hooks: simulate GPU loss and recovery. */
  private loseExt: WEBGL_lose_context | null = null;
  loseContext() {
    this.loseExt = this.renderer.getContext().getExtension('WEBGL_lose_context');
    this.loseExt?.loseContext();
  }

  restoreContext() {
    this.loseExt?.restoreContext();
  }
}
