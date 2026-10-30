import { describe, expect, it } from 'vitest';
import { compileInk } from '../scripts/ink.mjs';
import { CHARACTERS, parseLine } from '../src/content/characters.ts';
import { Session, parseTag, type LineBeat } from '../src/narrative/session.ts';

const { json } = compileInk();
const storySources = import.meta.glob('../story/*.ink', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

describe('parsing', () => {
  it('parses registered dialogue and leaves narration or unknown prefixes untouched', () => {
    expect(parseLine('Mummy: Sit properly.')).toMatchObject({ speaker: CHARACTERS.mum, text: 'Sit properly.' });
    expect(parseLine('Auntie Efua: Come in!')).toMatchObject({ speaker: CHARACTERS.auntie, text: 'Come in!' });
    expect(parseLine('Adjoa: Chale!')).toMatchObject({ speaker: CHARACTERS.friend, name: 'Adjoa', text: 'Chale!' });
    expect(parseLine("Kojo's Mother: Esi!")).toMatchObject({ speaker: CHARACTERS.friendmum, name: "Kojo's Mother" });
    expect(parseLine('Narrator: This is deliberately unknown.')).toEqual({ speaker: null, name: '', text: 'Narrator: This is deliberately unknown.' });
    expect(parseLine('The room is quiet.')).toEqual({ speaker: null, name: '', text: 'The room is quiet.' });
  });

  it('parses simple, value and paired tags', () => {
    expect(parseTag('report')).toEqual({ key: 'report', value: '' });
    expect(parseTag('scene: hall')).toEqual({ key: 'scene', value: 'hall' });
    expect(parseTag('expr: mum=sideeye')).toEqual({ key: 'expr', who: 'mum', value: 'sideeye' });
    expect(parseTag('quote:auntie=laugh')).toEqual({ key: 'quote', who: 'auntie', value: 'laugh' });
    expect(parseTag('sticker:mum=akola_bone')).toEqual({ key: 'sticker', who: 'mum', value: 'akola_bone' });
  });

  it('has no speaker-shaped source lines with an unregistered speaker', () => {
    const unknown: string[] = [];
    for (const [file, source] of Object.entries(storySources)) {
      source.split('\n').forEach((line, index) => {
        const text = line.trim();
        if (!/^[A-Z][\w' ]{0,24}:\s+/.test(text)) return;
        if (!parseLine(text).speaker) unknown.push(`${file.split('/').pop()}:${index + 1} ${text}`);
      });
    }
    expect(unknown).toEqual([]);
  });
});

describe('Session', () => {
  it('names the friend after the child the player did not pick', () => {
    const session = new Session(json);
    session.setPlayer('girl');
    expect(session.vars()).toMatchObject({ friend: 'Kojo', fhe: 'he', fhis: 'his' });
    session.setPlayer('boy');
    expect(session.vars()).toMatchObject({ friend: 'Adjoa', fhe: 'she', fhis: 'her' });
  });

  it('exposes all global variables for checkpoints', () => {
    const vars = new Session(json).vars();
    expect(vars).toMatchObject({ approval: 50, smarts: 20, trouble: 0, antenna: 'none', finale: 'none', friend: 'Adjoa' });
    expect(Object.keys(vars).length).toBeGreaterThan(20);
  });

  it('collects a complete report when the dynamic rank tag is on an empty beat', () => {
    const session = new Session(json);
    let first: LineBeat | null = null;
    for (let steps = 0; steps < 3000; steps++) {
      const beat = session.next();
      if (beat.kind === 'choices') session.choose(0);
      else if (beat.kind === 'line' && beat.cues.some((cue) => cue.key === 'report')) {
        first = beat;
        break;
      } else if (beat.kind === 'end') break;
    }
    expect(first).not.toBeNull();
    const report = session.collectReport(first!);
    // Always taking the first choice plays the volume as the family comedian.
    expect(report.rank).toBe('comedian');
    expect(report.title).toBe('The Family Comedian');
    expect(report.copy.length).toBeGreaterThan(0);
    expect(report.quote?.speaker).toBe('Auntie Efua');
    expect(report.remember.length).toBeGreaterThan(2);
  });
});
