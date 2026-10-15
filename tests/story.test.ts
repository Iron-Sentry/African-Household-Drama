import { describe, expect, it } from 'vitest';
import { Story } from 'inkjs';
import { byText, compileInk, playthrough, rng } from '../scripts/ink.mjs';
import { validateTags } from '../src/content/validate.ts';

const compiled = compileInk();

interface InkChoice { text: string }

function scripted(...wanted: string[]) {
  let step = 0;
  return (choices: InkChoice[]) => {
    const text = wanted[step++];
    if (!text) throw new Error(`Scripted path ran out at: ${choices.map((choice) => choice.text).join(' | ')}`);
    const index = byText(text)(choices);
    if (!choices[index]?.text.toLowerCase().includes(text.toLowerCase())) {
      throw new Error(`Choice "${text}" not found at step ${step}: ${choices.map((choice) => choice.text).join(' | ')}`);
    }
    return index;
  };
}

const paths: Record<string, string[]> = {
  strategist: [
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Burst out laughing', 'Greet her in Twi',
    'Sit nicely and wait', "Check Mummy's expression", 'Take one and say "Thank you', 'rearrange the circle', 'Repeat the list',
    'Small packet of sugar', 'Toffees', "That's everything", 'Tell Sister Akos', 'Look at Kojo', "didn't buy any sugar", 'Close your eyes',
  ],
  akola: [
    'Pretend to be asleep', 'Do exactly what Daddy says', 'Announce that you are very thirsty', 'Good afternoon',
    'The telephone', 'Give the padlock', 'The framed photograph', 'Sit nicely and wait', 'Nod politely', 'Take the biscuits immediately',
    'rearrange the circle', 'I know, Mummy', 'Box of matches', 'Small packet of sugar', 'Tin of milk', 'Toffees', "That's everything",
    'Spend it on bofrot', 'Look at Kojo', "didn't buy any sugar", 'Reach for the antenna',
  ],
  golden: [
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Announce that you are very thirsty', 'Greet her in Twi', 'Sit nicely and wait',
    "Check Mummy's expression", 'Take one and say "Medaase', 'Slip one biscuit', 'Write it on the back', 'Loaf of tea bread',
    'Candles', 'Box of matches', 'Toffees', "That's everything", 'Say nothing. Take it home', 'Confess and hand over', 'Laugh',
  ],
  comedian: [
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Burst out laughing', 'Greet her in Twi',
    'The telephone', 'Give the padlock', 'The framed photograph', 'Sit nicely and wait', 'Nod politely', "Check Mummy's expression",
    'Take three biscuits', 'Sit on your hands', 'I know, Mummy', 'Small packet of sugar', 'Loaf of tea bread', 'Box of matches',
    'Candles', 'Tin of milk', 'Toffees', "That's everything", 'Tell Sister Akos', 'ask Mummy first', 'Laugh',
  ],
};

describe('compiled story graph', () => {
  it('compiles without warnings and all authored tags validate', () => {
    expect(compiled.warnings).toEqual([]);
    expect(validateTags(compiled.meta.tags)).toEqual([]);
    expect(compiled.meta.knots.length).toBeGreaterThan(20);
    expect(compiled.meta.moments).toHaveLength(33);
  });

  it('finishes 250 deterministic random routes with a valid rank and bounded stats', () => {
    const ranks = new Set<string>();
    const invalid: string[] = [];
    for (let seed = 1; seed <= 250; seed++) {
      const random = rng(seed);
      const result = playthrough(compiled.json, (choices) => Math.floor(random() * choices.length));
      if (!['golden', 'akola', 'strategist', 'comedian'].includes(result.rank)) invalid.push(`seed ${seed}: rank ${result.rank || '(missing)'}`);
      for (const value of Object.values(result.stats)) {
        if (value < 0 || value > 100) invalid.push(`seed ${seed}: stat ${value}`);
      }
      ranks.add(result.rank);
    }
    expect(invalid).toEqual([]);
    expect(ranks).toEqual(new Set(['golden', 'akola', 'strategist', 'comedian']));
  }, 15_000);
});

describe('rank outcomes', () => {
  for (const [rank, choices] of Object.entries(paths)) {
    it(`reaches ${rank} through a scripted byText path`, () => {
      expect(playthrough(compiled.json, scripted(...choices)).rank).toBe(rank);
    });
  }

  it.each([
    [85, 60, 15, 'golden'],
    [84, 60, 15, 'comedian'],
    [85, 59, 15, 'comedian'],
    [85, 60, 16, 'comedian'],
    [50, 70, 55, 'akola'],
    [50, 100, 54, 'strategist'],
    [50, 70, 0, 'strategist'],
    [50, 69, 54, 'comedian'],
  ])('rank boundary approval=%i smarts=%i trouble=%i -> %s', (approval, smarts, trouble, expected) => {
    const story = new Story(compiled.json);
    story.variablesState.$('approval', approval);
    story.variablesState.$('smarts', smarts);
    story.variablesState.$('trouble', trouble);
    expect(story.EvaluateFunction('rank')).toBe(expected);
  });
});
