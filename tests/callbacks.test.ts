import { describe, expect, it } from 'vitest';
import { byText, compileInk, playthrough } from '../scripts/ink.mjs';

const { json } = compileInk();
const common = ['Hold it exactly', 'Watch the film', 'Sit nicely and wait', "That's everything"];
const run = (...choices: string[]) => playthrough(json, byText(...choices, ...common));

describe('cross-episode callbacks', () => {
  it('changes Auntie Efua’s Episode 2 gossip based on the Episode 1 reaction', () => {
    const laugh = run('Burst out laughing');
    const eyes = run('Immediately close your eyes');
    expect(laugh.lines).toContain('Auntie Efua: And I hear somebody was laughing at the Sunday film! Hihihi!');
    expect(eyes.lines).toContain('Auntie Efua: Your mummy says you closed your eyes like a pastor praying. Good child!');
    expect(laugh.lines).not.toContain('Auntie Efua: Your mummy says you closed your eyes like a pastor praying. Good child!');
  });

  it('carries the bofrot decision into the Episode 3 home scene', () => {
    const spent = run('Spend it on bofrot');
    const returned = run('Tell Sister Akos she gave you too much');
    const knockOn = "Kojo's Mother: Esi! Thank you oo, for the bofrot your child bought my Kojo! Ten bofrot! You people are rich now!";
    expect(spent.lines).toContain(knockOn);
    expect(returned.lines).not.toContain(knockOn);
    expect(returned.lines).toContain('Auntie Efua: Esi! Have you heard? Akos says your child gave back her money! A whole thousand cedis!');
  });
});
