import { describe, expect, it } from 'vitest';
import { POSE_FACING, allPosePaths, hearerOf } from '../src/content/characters.ts';

describe('who faces whom', () => {
  it('lists only poses that exist', () => {
    const poses = new Set(allPosePaths().map((p) => p.replace('characters/', '').replace('.webp', '')));
    expect(Object.keys(POSE_FACING).filter((p) => !poses.has(p))).toEqual([]);
  });

  it('talks to whoever is called by name', () => {
    const cast = ['mum', 'child', 'dad'];
    expect(hearerOf('child', 'Yes, Mummy.', cast, 'dad')).toBe('mum');
    expect(hearerOf('mum', 'Nana! Sit down.', cast, 'dad')).toBe('child');
    expect(hearerOf('child', "Daddy... you're sitting on it.", cast, 'mum')).toBe('dad');
    expect(hearerOf('mum', 'Daddy said so when he came home.', cast, 'child')).toBe('child'); // named, but not called
  });

  it('otherwise answers whoever spoke last, then Nana, and never talks to themselves', () => {
    expect(hearerOf('mum', 'Hmm.', ['mum', 'child', 'dad'], 'dad')).toBe('dad');
    expect(hearerOf('mum', 'Hmm.', ['mum', 'child', 'dad'], 'mum')).toBe('child');
    expect(hearerOf('mum', 'Hmm.', ['mum', 'dad'], null)).toBe('dad');
    expect(hearerOf('mum', 'Hmm.', ['mum'], null)).toBeNull();
  });
});
