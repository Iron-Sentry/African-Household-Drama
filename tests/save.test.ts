import { describe, expect, it } from 'vitest';
import {
  PROFILE_KEY,
  SAVE_KEY,
  clearSave,
  loadProfile,
  loadSave,
  migrate,
  writeSave,
  type StageState,
} from '../src/game/save.ts';

class MemoryStore {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const stage: StageState = {
  player: 'girl', scene: 'auntie', light: 'afternoon', cam: 'tray', amb: 'auntie', cast: ['mum', 'child', 'auntie'],
  expr: { mum: 'sideeye' }, props: { auntie_tv: 'snow' },
};

describe('save data', () => {
  it('round-trips a v2 save', () => {
    const store = new MemoryStore();
    expect(writeSave({ ink: '{"state":1}', stage, resume: { episode: 2, vars: { approval: 72 } } }, store)).toBe(true);
    expect(loadSave(store)).toMatchObject({
      version: 2,
      ink: '{"state":1}',
      stage,
      resume: { episode: 2, vars: { approval: 72 } },
    });
    expect(loadSave(store)?.savedAt).toEqual(expect.any(Number));
  });

  it('migrates and clamps a v1 save', () => {
    expect(migrate({ version: 1, current: 'neigh_offer', approval: 120, smarts: -2, trouble: 26.4 })).toMatchObject({
      version: 2,
      ink: null,
      stage: null,
      resume: { episode: 2, vars: { approval: 100, smarts: 0, trouble: 26 } },
    });
  });

  it('rejects garbage, malformed v2 data and unknown versions', () => {
    expect(migrate(null)).toBeNull();
    expect(migrate('not a save')).toBeNull();
    expect(migrate({ version: 2, resume: null })).toBeNull();
    expect(migrate({ version: 99, resume: { episode: 1, vars: {} } })).toBeNull();
  });

  it('survives storage methods that throw', () => {
    const broken = {
      getItem() { throw new Error('blocked'); },
      setItem() { throw new Error('full'); },
      removeItem() { throw new Error('blocked'); },
    };
    expect(loadSave(broken)).toBeNull();
    expect(writeSave({ ink: null, stage: null, resume: { episode: 1, vars: {} } }, broken)).toBe(false);
    expect(() => clearSave(broken)).not.toThrow();
  });

  it('clears the active save key', () => {
    const store = new MemoryStore();
    store.setItem(SAVE_KEY, '{}');
    clearSave(store);
    expect(store.getItem(SAVE_KEY)).toBeNull();
  });

  it('turns sound on once for players from before v2, then respects their choice', () => {
    const store = new MemoryStore();
    store.setItem(PROFILE_KEY, JSON.stringify({ version: 1, settings: { sound: false } }));
    expect(loadProfile(store).settings.sound).toBe(true);
    store.setItem(PROFILE_KEY, JSON.stringify({ version: 1, soundUpgraded: true, settings: { sound: false } }));
    expect(loadProfile(store).settings.sound).toBe(false);
  });
});
