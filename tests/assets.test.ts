import { describe, expect, it } from 'vitest';
import { assetExists as exists } from '../scripts/assets.mjs';
import { PLACEHOLDERS } from '../src/content/assets.ts';
import { allPosePaths } from '../src/content/characters.ts';
import { SCENES } from '../src/content/scenes.ts';
import { INSERTS, STICKERS } from '../src/content/validate.ts';

/** Every image the registries can ask for. */
const used = [
  ...Object.values(SCENES).flatMap((s) => [s.bg, ...(s.night ? [s.night] : []), ...Object.values(s.pieces || {}).map((p) => p.src)]),
  ...allPosePaths(),
  ...INSERTS.map((n) => `props/${n}.webp`),
  ...STICKERS.map((n) => `fx/${n}.webp`),
];

describe('art and placeholders', () => {
  it('has every image the story uses, or a stand-in for it', () => {
    expect(used.filter((p) => !exists(p) && !(p in PLACEHOLDERS))).toEqual([]);
  });

  it('points every stand-in at art that exists', () => {
    expect(Object.entries(PLACEHOLDERS).filter(([, s]) => s && !exists(s))).toEqual([]);
  });

  it('drops placeholders once the real file is delivered (delete these lines in src/content/assets.ts)', () => {
    expect(Object.keys(PLACEHOLDERS).filter(exists)).toEqual([]);
  });

  it('lists no placeholder the story never uses', () => {
    expect(Object.keys(PLACEHOLDERS).filter((p) => !used.includes(p))).toEqual([]);
  });
});
