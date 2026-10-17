import { describe, expect, it } from 'vitest';
import { byText, compileInk, playthrough } from '../scripts/ink.mjs';

const { json } = compileInk();
const common = ['Answer in a sleepy voice', 'Do exactly what Daddy says', 'Sit nicely and wait', "That's everything"];
const run = (...choices: string[]) => playthrough(json, byText(...choices, ...common));

describe('cross-episode callbacks', () => {
  it('changes Auntie Efua’s Episode 2 gossip based on the Episode 1 reaction', () => {
    const laugh = run('Burst out laughing');
    const eyes = run('Immediately close your eyes');
    expect(laugh.lines).toContain('Auntie Efua: And I hear somebody was laughing at the kissing scene! Hihihi!');
    expect(eyes.lines).toContain('Auntie Efua: Your mummy says you closed your eyes like a pastor praying. Good child!');
    expect(laugh.lines).not.toContain('Auntie Efua: Your mummy says you closed your eyes like a pastor praying. Good child!');
  });

  it('carries the bofrot decision into the Episode 3 home scene', () => {
    const spent = run('Spend it on bofrot');
    const returned = run('Tell Auntie she gave you too much');
    const knockOn = "Adjoa's Mother: Esi! Thank you oo, for the bofrot your child bought my Adjoa! Ten bofrot! You people are rich now!";
    expect(spent.lines).toContain(knockOn);
    expect(returned.lines).not.toContain(knockOn);
    expect(returned.lines).toContain('Auntie Efua: Esi! Have you heard? Your child gave me back my own money! A whole thousand cedis!');
  });

  it('brings what you told Auntie Efua home with you', () => {
    const told = run('Tell her everything');
    const fine = run('Everybody is fine');
    expect(told.lines).toContain("Mummy: Nana. Why does Efua know that Daddy's car is still at the mechanic?");
    expect(fine.lines).not.toContain("Mummy: Nana. Why does Efua know that Daddy's car is still at the mechanic?");
    expect(fine.lines).toContain('Mummy: Efua says you told her "everybody is fine." She was very annoyed.');
  });

  it('only accuses a biscuit thief who pocketed one', () => {
    const pocketed = run('Slip one biscuit');
    const honest = run('Sit on your hands');
    const accusation = 'Auntie Efua: When you left, I counted.';
    expect(pocketed.lines).toContain(accusation);
    expect(honest.lines).not.toContain(accusation);
  });
});
