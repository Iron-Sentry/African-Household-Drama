// Sound: real recordings (CC0 / CC-BY from Freesound, see docs/AUDIO_CREDITS.md),
// fetched on first use. Three buses: effects, ambience and music; anything that
// comes out of the TV or radio goes through a small-speaker filter first.
// The context only starts after a tap or key press (browser autoplay rules),
// and nothing in the story depends on hearing it.

type Shot = { f: string; g: number; tv?: boolean; at?: number; dur?: number; duck?: boolean };
type Bed = { layers: [file: string, gain: number, lowpass?: number][]; tv?: [string, number]; music?: boolean };

const SFX: Record<string, Shot> = {
  good: { f: 'good', g: 0.5, duck: true },
  bad: { f: 'bad', g: 0.45, duck: true },
  sting: { f: 'sting', g: 0.65, duck: true },
  click: { f: 'click', g: 0.35 },
  pop: { f: 'pop', g: 0.45 },
  whoosh: { f: 'whoosh', g: 0.4 },
  kiss: { f: 'kiss', g: 0.5, tv: true },
  thump: { f: 'thump', g: 0.8 },
  knock: { f: 'knock', g: 0.8 },
  door: { f: 'door', g: 0.75 },
  crinkle: { f: 'crinkle', g: 0.45 },
  crunch: { f: 'crunch', g: 0.85 },
  coin: { f: 'cash', g: 0.6 },
  throat: { f: 'throat', g: 0.75 },
  heartbeat: { f: 'heartbeat', g: 0.8, duck: true },
  snore: { f: 'snore', g: 0.8 },
  yawn: { f: 'yawn', g: 0.7 },
  cheer: { f: 'cheer', g: 0.6 },
  powerup: { f: 'fan_on', g: 0.6 },
  radio: { f: 'radio', g: 0.5, tv: true },
  radiooff: { f: 'tv_switch', g: 0.6 },
  static: { f: 'tv_static', g: 0.45, tv: true, dur: 0.9 },
  tvclear: { f: 'tv_blips', g: 0.4, tv: true },
  romance: { f: 'tv_film', g: 0.55, tv: true, dur: 6 },
  theme: { f: 'tv_film', g: 0.55, tv: true, at: 8, dur: 6 },
  title: { f: 'music_guitar', g: 0.6, dur: 7, duck: true },
  // Episode Four. dig and splash borrow the nearest recording until their own
  // arrive; bell and rooster stay silent (no entry) rather than sound wrong.
  dig: { f: 'thump', g: 0.5 },
  splash: { f: 'whoosh', g: 0.35 },
};

// Room tones per #amb. A lowpass on a layer pushes it "outside" or "through a wall".
const BEDS: Record<string, Bed> = {
  hall: { layers: [['amb_fan', 0.4], ['amb_kids', 0.1, 900]], music: true },
  compound: { layers: [['amb_birds', 0.4], ['amb_kids', 0.28], ['amb_backyard', 0.35]], music: true },
  street: { layers: [['amb_street', 0.5], ['amb_birds', 0.12]], music: true },
  auntie: { layers: [['amb_clock', 0.22], ['amb_birds', 0.12, 1200]], music: true },
  clock: { layers: [['amb_clock', 0.5]] },
  school: { layers: [['amb_kids', 0.45], ['amb_birds', 0.25]], music: true },
  dusk: { layers: [['amb_night', 0.3], ['amb_birds', 0.1, 1200], ['amb_kids', 0.08, 700]], music: true },
  night: { layers: [['amb_night', 0.55]] },
  static: { layers: [['amb_fan', 0.2]], tv: ['tv_static', 0.25] },
  film: { layers: [['amb_fan', 0.2]], tv: ['tv_film', 0.3] },
};

const url = (f: string) => `${import.meta.env.BASE_URL}assets/audio/${f}.mp3`;

export class Audio {
  enabled = false;
  musicOn = true;
  private ctx: AudioContext | null = null;
  private sfxBus!: GainNode;
  private ambBus!: GainNode;
  private musicBus!: GainNode;
  private tvIn!: AudioNode;
  private cache = new Map<string, Promise<AudioBuffer | null>>();
  private bed: { stop: () => void } | null = null;
  private bedName = '';
  private song: { stop: () => void } | null = null;
  private songName = '';
  private titleScreen = false;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) {
      this.bed?.stop();
      this.song?.stop();
      this.bed = this.song = null;
      this.ctx?.suspend();
    } else if (this.ctx) this.unlock();
  }

  setMusic(on: boolean) {
    this.musicOn = on;
    this.refreshMusic();
  }

  /** Browsers only allow sound after a gesture: call this from tap/key handlers. */
  unlock() {
    if (!this.enabled) return;
    try {
      this.ensure();
      this.ctx!.resume();
      if (!this.bed) this.startBed(this.bedName);
      this.refreshMusic();
    } catch {
      this.enabled = false; // no Web Audio: play silently
    }
  }

  setPaused(paused: boolean) {
    if (!this.ctx || !this.enabled) return;
    if (paused) this.ctx.suspend();
    else this.ctx.resume();
  }

  /** The title screen gets its own tune; gameplay gets the household bed. */
  setTitle(on: boolean) {
    this.titleScreen = on;
    this.refreshMusic();
  }

  private ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = (this.ctx = new Ctx());
    const master = c.createGain();
    master.gain.value = 0.9;
    // a gentle limiter so stacked effects never clip
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.ratio.value = 6;
    master.connect(comp).connect(c.destination);
    this.sfxBus = c.createGain();
    this.ambBus = c.createGain();
    this.musicBus = c.createGain();
    this.musicBus.gain.value = 0.22;
    [this.sfxBus, this.ambBus, this.musicBus].forEach((b) => b.connect(master));
    // small CRT/radio speaker: no lows, no highs, a honky middle
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 320;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3600;
    const mid = c.createBiquadFilter();
    mid.type = 'peaking';
    mid.frequency.value = 1500;
    mid.gain.value = 5;
    hp.connect(lp).connect(mid).connect(this.sfxBus);
    this.tvIn = hp;
  }

  private load(f: string) {
    if (!this.cache.has(f)) {
      this.cache.set(
        f,
        fetch(url(f))
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
          .then((b) => this.ctx!.decodeAudioData(b))
          .catch(() => null), // a missing file just stays silent
      );
    }
    return this.cache.get(f)!;
  }

  private voice(buf: AudioBuffer, dest: AudioNode, gain: number, o: { loop?: boolean; at?: number; dur?: number; fadeIn?: number } = {}) {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = buf;
    src.loop = !!o.loop;
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(o.fadeIn ? 0 : gain, t);
    if (o.fadeIn) g.gain.linearRampToValueAtTime(gain, t + o.fadeIn);
    if (o.dur) {
      g.gain.setValueAtTime(gain, t + Math.max(0, o.dur - 0.6));
      g.gain.linearRampToValueAtTime(0, t + o.dur);
    }
    src.connect(g).connect(dest);
    src.start(t, o.loop ? Math.random() * buf.duration : o.at || 0, o.loop ? undefined : o.dur);
    const stop = (fade = 0.8) => {
      const n = c.currentTime;
      g.gain.cancelScheduledValues(n);
      g.gain.setValueAtTime(g.gain.value, n);
      g.gain.linearRampToValueAtTime(0, n + fade);
      src.stop(n + fade + 0.05);
    };
    return { stop, g };
  }

  // ---- effects -------------------------------------------------------------
  sfx(name: string) {
    if (!this.enabled || !this.ctx) return;
    if (name === 'powercut') return this.powercut();
    const s = SFX[name];
    if (!s) return;
    if (s.duck) this.duck();
    this.load(s.f).then((buf) => buf && this.voice(buf, s.tv ? this.tvIn : this.sfxBus, s.g, { at: s.at, dur: s.dur }));
  }

  /** Stingers push the music down for a moment so they land. */
  private duck() {
    const g = this.musicBus.gain;
    const t = this.ctx!.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(0.06, t + 0.15);
    g.linearRampToValueAtTime(0.22, t + 2.4);
  }

  /** The light goes: the fan's hum sags and dies, then silence. */
  private powercut() {
    const c = this.ctx!;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 1.1);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 1.25);
    this.bed?.stop();
    this.bed = null;
  }

  // ---- ambience ------------------------------------------------------------
  ambience(name: string) {
    if (name === this.bedName && (this.bed || !this.ctx)) return;
    this.bedName = name;
    if (this.enabled && this.ctx) this.startBed(name);
    this.refreshMusic();
  }

  private startBed(name: string) {
    this.bed?.stop();
    this.bed = null;
    const def = BEDS[name];
    if (!def) return;
    const c = this.ctx!;
    const voices: { stop: (f?: number) => void }[] = [];
    let live = true;
    const add = (f: string, gain: number, dest: AudioNode, lowpass?: number) =>
      this.load(f).then((buf) => {
        if (!buf || !live) return;
        let out: AudioNode = dest;
        if (lowpass) {
          const lp = c.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = lowpass;
          lp.connect(dest);
          out = lp;
        }
        voices.push(this.voice(buf, out, gain, { loop: true, fadeIn: 1.5 }));
      });
    def.layers.forEach(([f, g, lp]) => add(f, g, this.ambBus, lp));
    if (def.tv) add(def.tv[0], def.tv[1], this.tvIn);
    this.bed = {
      stop: () => {
        live = false;
        voices.forEach((v) => v.stop(1.2));
      },
    };
  }

  // ---- music ---------------------------------------------------------------
  private refreshMusic() {
    if (!this.enabled || !this.ctx) return;
    const want = !this.musicOn ? '' : this.titleScreen ? 'music_guitar' : BEDS[this.bedName]?.music ? 'music_kalimba' : '';
    if (want === this.songName && (this.song || !want)) return;
    this.songName = want;
    this.song?.stop();
    this.song = null;
    if (!want) return;
    let live = true;
    let v: { stop: (f?: number) => void } | null = null;
    this.song = {
      stop: () => {
        live = false;
        v?.stop(1.5);
      },
    };
    this.load(want).then((buf) => {
      if (buf && live) v = this.voice(buf, this.musicBus, 1, { loop: true, fadeIn: 2 });
    });
  }
}
