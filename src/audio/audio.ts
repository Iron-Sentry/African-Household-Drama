// Lightweight, fully synthesized sound design (no audio files, nothing licensed).
// Off by default; the context is only created after the player turns sound on.
// Nothing in the story depends on hearing these sounds.

type Amb = { stop: () => void };

export class Audio {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private noise!: AudioBuffer;
  private plucks = new Map<number, AudioBuffer>();
  private amb: Amb | null = null;
  private ambName = '';
  enabled = false;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      try {
        this.ensure();
        this.ctx!.resume();
        const want = this.ambName;
        this.ambName = '';
        this.ambience(want);
      } catch {
        this.enabled = false;
      }
    } else {
      this.amb?.stop();
      this.amb = null;
      this.ctx?.suspend();
    }
  }

  /** Pause/resume everything without forgetting the current ambience. */
  setPaused(paused: boolean) {
    if (!this.ctx || !this.enabled) return;
    if (paused) this.ctx.suspend();
    else this.ctx.resume();
  }

  private ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  // ---- building blocks -------------------------------------------------
  private tone(freq: number, at: number, dur: number, gain = 0.06, type: OscillatorType = 'sine', to?: number, dest: AudioNode = this.master) {
    const c = this.ctx!;
    const o = c.createOscillator();
    const g = c.createGain();
    const t = c.currentTime + at;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hiss(at: number, dur: number, gain: number, freq = 3000, q = 0.7, type: BiquadFilterType = 'bandpass', sweepTo?: number) {
    const c = this.ctx!;
    const s = c.createBufferSource();
    s.buffer = this.noise;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    const t = c.currentTime + at;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + Math.min(0.03, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    s.connect(f).connect(g).connect(this.master);
    s.start(t, Math.random());
    s.stop(t + dur + 0.05);
  }

  /** Karplus–Strong plucked string: a small highlife guitar for stingers. */
  private pluck(freq: number, at: number, gain = 0.18, dest: AudioNode = this.master) {
    const c = this.ctx!;
    const key = Math.round(freq);
    let buf = this.plucks.get(key);
    if (!buf) {
      const sr = c.sampleRate;
      const n = Math.floor(sr * 1.1);
      buf = c.createBuffer(1, n, sr);
      const out = buf.getChannelData(0);
      const period = Math.round(sr / freq);
      const line = new Float32Array(period).map(() => Math.random() * 2 - 1);
      for (let i = 0; i < n; i++) {
        const j = i % period;
        const v = line[j];
        line[j] = 0.497 * (v + line[(j + 1) % period]);
        out[i] = v;
      }
      this.plucks.set(key, buf);
    }
    const s = c.createBufferSource();
    s.buffer = buf;
    const g = c.createGain();
    g.gain.value = gain;
    s.connect(g).connect(dest);
    s.start(c.currentTime + at);
  }

  private highlife(gain = 0.16, dest?: AudioNode) {
    // A short, original two-bar highlife-style lick (C major, syncopated).
    const notes: [number, number][] = [
      [392, 0], [523, 0.18], [659, 0.36], [587, 0.63], [523, 0.81], [440, 0.99], [392, 1.26], [440, 1.44], [523, 1.62], [392, 1.98],
    ];
    notes.forEach(([f, t]) => this.pluck(f, t, gain, dest));
    [131, 196, 131, 175].forEach((f, i) => this.pluck(f, i * 0.54, gain * 0.9, dest));
  }

  // ---- one-shot effects --------------------------------------------------
  sfx(name: string) {
    if (!this.enabled) return;
    try {
      this.ensure();
      const T = this.tone.bind(this);
      const H = this.hiss.bind(this);
      switch (name) {
        case 'good': T(523, 0, 0.18, 0.05); T(659, 0.1, 0.2, 0.05); T(784, 0.2, 0.32, 0.05); break;
        case 'bad': T(233, 0, 0.24, 0.07, 'triangle'); T(175, 0.16, 0.36, 0.06, 'triangle'); break;
        case 'click': T(380, 0, 0.06, 0.03, 'triangle'); break;
        case 'sting': T(147, 0, 0.18, 0.07, 'sawtooth'); T(139, 0.22, 0.18, 0.07, 'sawtooth'); T(110, 0.46, 0.9, 0.08, 'sawtooth'); break;
        case 'kiss': H(0, 0.12, 0.05, 2400); [784, 988, 1175, 1568].forEach((f, i) => T(f, 0.12 + i * 0.07, 0.5, 0.035, 'triangle')); break;
        case 'romance': [262, 330, 392, 494].forEach((f) => T(f, 0, 2.6, 0.022, 'sawtooth', f * 1.003)); break;
        case 'tvclear': H(0, 0.35, 0.06, 4000); T(1046, 0.3, 0.25, 0.03); break;
        case 'static': H(0, 0.7, 0.08, 3500, 0.5); break;
        case 'thump': T(110, 0, 0.25, 0.14, 'sine', 45); H(0, 0.08, 0.06, 900, 0.8, 'lowpass'); break;
        case 'whoosh': H(0, 0.45, 0.07, 400, 1.2, 'bandpass', 3200); break;
        case 'powercut': T(180, 0, 0.5, 0.08, 'sawtooth', 35); H(0, 0.05, 0.08, 2000); this.ambience(''); break;
        case 'powerup': T(40, 0, 0.7, 0.05, 'sawtooth', 120); T(120, 0.6, 0.4, 0.02, 'sine'); break;
        case 'knock': T(190, 0, 0.09, 0.14, 'triangle', 120); T(190, 0.18, 0.09, 0.14, 'triangle', 120); break;
        case 'crinkle': for (let i = 0; i < 8; i++) H(i * 0.04 + Math.random() * 0.02, 0.04, 0.05, 5000, 2); break;
        case 'crunch': for (let i = 0; i < 4; i++) H(i * 0.08, 0.07, 0.08, 1400, 0.8); break;
        case 'coin': T(2637, 0, 0.18, 0.025); T(3520, 0.03, 0.22, 0.02); break;
        case 'pop': T(620, 0, 0.08, 0.05, 'sine', 900); break;
        case 'radio': this.highlife(0.07); break;
        case 'radiooff': T(300, 0, 0.05, 0.04, 'square'); break;
        case 'cheer': H(0, 1.4, 0.07, 1200, 0.4); H(0.1, 1.2, 0.05, 2200, 0.6); break;
        case 'title': this.highlife(0.16); break;
      }
    } catch {
      /* sound never blocks the game */
    }
  }

  // ---- ambience beds -------------------------------------------------------
  ambience(name: string) {
    if (name === this.ambName && this.amb) return;
    this.ambName = name;
    this.amb?.stop();
    this.amb = null;
    if (!this.enabled || !name) return;
    try {
      this.ensure();
      this.amb = this.buildAmb(name);
    } catch {
      this.amb = null;
    }
  }

  private buildAmb(name: string): Amb | null {
    const c = this.ctx!;
    const bus = c.createGain();
    bus.gain.setValueAtTime(0, c.currentTime);
    bus.gain.linearRampToValueAtTime(1, c.currentTime + 1.2);
    bus.connect(this.master);
    const nodes: AudioScheduledSourceNode[] = [];
    const timers: number[] = [];
    const noiseBed = (freq: number, type: BiquadFilterType, gain: number, q = 0.7) => {
      const s = c.createBufferSource();
      s.buffer = this.noise;
      s.loop = true;
      const f = c.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = c.createGain();
      g.gain.value = gain;
      s.connect(f).connect(g).connect(bus);
      s.start();
      nodes.push(s);
    };
    const every = (ms: number, fn: () => void, jitter = 0) => {
      const loop = () => {
        fn();
        timers.push(window.setTimeout(loop, ms + Math.random() * jitter));
      };
      timers.push(window.setTimeout(loop, 300));
    };
    switch (name) {
      case 'static':
        noiseBed(3200, 'bandpass', 0.05, 0.5);
        break;
      case 'film': {
        // muffled melodrama strings coming out of a small TV speaker
        const f = c.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 900;
        const g = c.createGain();
        g.gain.value = 0.018;
        f.connect(g).connect(bus);
        [196, 247, 294].forEach((hz) => {
          const o = c.createOscillator();
          o.type = 'sawtooth';
          o.frequency.value = hz;
          o.detune.value = Math.random() * 10 - 5;
          o.connect(f);
          o.start();
          nodes.push(o);
        });
        noiseBed(2500, 'bandpass', 0.008);
        break;
      }
      case 'hall':
        noiseBed(260, 'lowpass', 0.05);
        break;
      case 'night':
        noiseBed(180, 'lowpass', 0.03);
        every(900, () => {
          for (let i = 0; i < 3; i++) this.tone(4300, i * 0.06, 0.04, 0.008, 'sine');
        }, 1400);
        break;
      case 'auntie':
      case 'clock':
        noiseBed(300, 'lowpass', name === 'clock' ? 0.015 : 0.03);
        every(1000, () => this.hiss(0, 0.03, name === 'clock' ? 0.05 : 0.025, 3800, 3));
        break;
      case 'compound':
        noiseBed(500, 'lowpass', 0.025);
        every(2600, () => this.tone(2200 + Math.random() * 900, 0, 0.09, 0.012, 'sine', 3400), 3000);
        every(9000, () => {
          const radio = c.createBiquadFilter();
          radio.type = 'bandpass';
          radio.frequency.value = 1400;
          radio.Q.value = 0.9;
          const g = c.createGain();
          g.gain.value = 0.35;
          radio.connect(g).connect(bus);
          this.highlife(0.05, radio);
        }, 4000);
        break;
      default:
        return null;
    }
    return {
      stop: () => {
        timers.forEach(clearTimeout);
        const t = c.currentTime;
        bus.gain.cancelScheduledValues(t);
        bus.gain.setValueAtTime(bus.gain.value, t);
        bus.gain.linearRampToValueAtTime(0, t + 0.5);
        nodes.forEach((n) => n.stop(t + 0.6));
        setTimeout(() => bus.disconnect(), 800);
      },
    };
  }
}
