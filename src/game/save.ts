// Versioned local save data. Two keys:
//  - SAVE_KEY: the run in progress (exact ink position + what's on stage)
//  - PROFILE_KEY: things that outlive a run (moments found, endings seen,
//    episode checkpoints for replay, settings)
// Every read is defensive: storage can be unavailable, full, or corrupt.

export const SAVE_VERSION = 2;
export const SAVE_KEY = 'ahd.save';
export const PROFILE_KEY = 'ahd.profile';

export interface StageState {
  player: 'boy' | 'girl';
  scene: string;
  light: string;
  cam: string;
  amb: string;
  cast: string[];
  expr: Record<string, string>;
  props: Record<string, string>;
}

export interface Checkpoint {
  episode: number;
  vars: Record<string, unknown>;
}

export interface SaveData {
  version: typeof SAVE_VERSION;
  savedAt: number;
  ink: string | null; // exact position; null after a migration
  stage: StageState | null;
  resume: Checkpoint; // fallback if `ink` no longer loads (story edited)
}

export interface Settings {
  sound: boolean;
  timedChoices: boolean;
  textSpeed: 'normal' | 'fast' | 'instant';
  motion: 'system' | 'reduced' | 'full';
  bigText: boolean;
  music: boolean;
}

export interface Profile {
  version: 1;
  moments: string[];
  endings: string[];
  checkpoints: Record<number, Checkpoint>;
  settings: Settings;
  player: 'boy' | 'girl';
  soundUpgraded?: boolean; // v2 turned real audio on by default, once, for existing players
}

export const DEFAULT_SETTINGS: Settings = { sound: true, timedChoices: true, textSpeed: 'normal', motion: 'system', bigText: false, music: true };

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function safeStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readJson(store: Store | null, key: string): unknown {
  try {
    const raw = store?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(store: Store | null, key: string, value: unknown): boolean {
  try {
    store?.setItem(key, JSON.stringify(value));
    return !!store;
  } catch {
    return false; // quota or privacy mode: the game keeps running without saving
  }
}

// Legacy v1: the shape the original single-file prototype's state would have
// taken (one node id + three scores). Its nodes map onto the new episodes.
interface SaveV1 {
  version: 1;
  current: string;
  approval: number;
  smarts: number;
  trouble: number;
}

const clamp = (n: unknown, fallback: number) => (typeof n === 'number' && isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : fallback);

/** Upgrade any known save shape to the current version, or return null if unusable. */
export function migrate(data: unknown): SaveData | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (d.version === 1) {
    const v1 = d as unknown as SaveV1;
    const episode = /^neigh_|^ending$/.test(String(v1.current)) ? 2 : 1;
    return {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      ink: null,
      stage: null,
      resume: { episode, vars: { approval: clamp(v1.approval, 50), smarts: clamp(v1.smarts, 20), trouble: clamp(v1.trouble, 0) } },
    };
  }
  if (d.version === SAVE_VERSION) {
    const resume = d.resume as Checkpoint | undefined;
    if (!resume || typeof resume.episode !== 'number' || typeof resume.vars !== 'object') return null;
    return d as unknown as SaveData;
  }
  return null; // unknown future/garbage version: ignore rather than crash
}

export function loadSave(store = safeStore()): SaveData | null {
  return migrate(readJson(store, SAVE_KEY));
}

export function writeSave(save: Omit<SaveData, 'version' | 'savedAt'>, store = safeStore()): boolean {
  return writeJson(store, SAVE_KEY, { version: SAVE_VERSION, savedAt: Date.now(), ...save });
}

export function clearSave(store = safeStore()) {
  try {
    store?.removeItem(SAVE_KEY);
  } catch {
    /* nothing to clear */
  }
}

export function loadProfile(store = safeStore()): Profile {
  const p = readJson(store, PROFILE_KEY) as Partial<Profile> | null;
  return {
    version: 1,
    moments: Array.isArray(p?.moments) ? p!.moments.filter((m) => typeof m === 'string') : [],
    endings: Array.isArray(p?.endings) ? p!.endings.filter((m) => typeof m === 'string') : [],
    checkpoints: p?.checkpoints && typeof p.checkpoints === 'object' ? p.checkpoints : {},
    settings: { ...DEFAULT_SETTINGS, ...(p?.settings || {}), ...(p?.soundUpgraded ? {} : { sound: true }) },
    player: p?.player === 'girl' ? 'girl' : 'boy',
    soundUpgraded: true,
  };
}

export function writeProfile(profile: Profile, store = safeStore()): boolean {
  return writeJson(store, PROFILE_KEY, profile);
}
