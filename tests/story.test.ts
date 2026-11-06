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
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Burst out laughing', 'Greet her in Twi', 'Sit nicely and wait',
    "Check Mummy's expression", 'Take one and say "Thank you', 'rearrange the circle', 'Repeat the list', 'Confess',
    'Small packet of sugar', 'Toffees', "That's everything", 'Ask what SHE', 'Count the change', 'Close your eyes',
    'Whisper it to Daddy', 'Remind him', 'Plant the mango stick',
    'Ask your friend to answer', "Daddy's white shirt first", 'Whisper, "Daddy', 'Eat it NOW',
    'Search the room like a detective', 'Football now', 'Fill one bucket', 'Keep it for your own bath',
    'Ask Auntie Akua', "Borrow Daddy's tie", 'You both cook like angels', 'Tell her about the twelve malts',
    'Suggest counting the empty bottles', 'Run to buy ice', 'Bunny ears',
  ],
  akola: [
    'Pretend to be asleep', 'Do exactly what Daddy says', 'Announce that you are very thirsty', 'Good afternoon',
    'The wall clock', 'Shout to Auntie', 'The framed photograph', 'Sit nicely and wait', 'Nod politely', 'Take the biscuits immediately',
    'rearrange the circle', 'I know, Mummy', 'Look at', 'Box of matches', 'Small packet of sugar', 'Tin of milk', 'Toffees', "That's everything",
    'Tell her everything', 'Spend it on bofrot', 'Reach for the antenna',
    'Say nothing', 'Borrow Auntie Efua', 'All by myself',
    "Pretend you didn't hear", 'Shout "I\'m coming', 'Grab everything at once', 'Slide the thigh', 'Save it for last',
    'Say your friend was holding it', 'Five more minutes', 'Hide the empty bucket', 'Five more minutes', 'Blame the streetlight',
    'Scrub it secretly', 'You, Auntie', 'Tell her about the twelve malts', 'Blame your friend',
    'Disappear into the bedroom', 'Bunny ears',
  ],
  golden: [
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Announce that you are very thirsty', 'Greet her in Twi', 'Sit nicely and wait',
    "Check Mummy's expression", 'Take one and say "Medaase', 'Slip one biscuit', 'Write it on the back', 'Confess', 'Loaf of tea bread',
    'Candles', 'Box of matches', 'Tin of milk', 'Small packet of sugar', "That's everything", 'Everybody is fine', 'Say nothing. Take it home', 'Close your eyes',
    'Tell Mummy the truth', 'Take the hoe', 'Go and ask Auntie Efua properly', 'Show her your blisters',
    'Shout "Yes, Mummy', "Daddy's white shirt first", 'Close your eyes and pray properly', 'Offer it to Mummy',
    'Confess. "Daddy', 'Football now', 'Get up and fill the drum', 'Give her two buckets', 'Go home now',
    'Tell Mummy and ask for help', 'You both cook like angels', 'Look at Mummy and say nothing',
    'Suggest counting the empty bottles', 'Ask what job is most urgent', 'Smile properly',
  ],
  comedian: [
    'Answer in a sleepy voice', 'Do exactly what Daddy says', 'Burst out laughing', 'Greet her in Twi',
    'The wall clock', 'Shout to Auntie', 'The framed photograph', 'Sit nicely and wait', 'Nod politely', "Check Mummy's expression",
    'Keep staring at Mummy', 'Sit on your hands', 'I know, Mummy', 'Small packet of sugar', 'Loaf of tea bread', 'Box of matches',
    'Candles', 'Tin of milk', 'Toffees', "That's everything", 'Tell her everything', 'Tell Auntie she gave', 'Laugh',
    'Tell Mummy the truth', 'Let Daddy finish', 'Pull up one of Mummy', 'All by myself',
    'Shout "Yes, Mummy', "Mummy's good kaba first", 'Keep one eye on the pot', 'Offer it to Mummy', 'Say nothing',
    'Fill one bucket', 'Give it to Daddy', 'Five more minutes', 'Show her the twenty-three runs', 'Cover it with your hand',
    'My Daddy', 'Everybody is fine, Auntie', 'Admit you drank one', 'Stand there', 'Look at Mummy',
  ],
};

describe('compiled story graph', () => {
  it('compiles without warnings and all authored tags validate', () => {
    expect(compiled.warnings).toEqual([]);
    expect(validateTags(compiled.meta.tags)).toEqual([]);
    expect(compiled.meta.knots.length).toBeGreaterThan(20);
    expect(compiled.meta.moments).toHaveLength(90);
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
  }, 120_000); // re-parses the story per run; slow on a busy machine
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
