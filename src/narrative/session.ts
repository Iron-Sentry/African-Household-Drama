// Narrative runtime: a thin wrapper over inkjs that turns ink output into
// "beats" (a line with cues, a set of choices, or the end) for the director.
// No DOM here, so it runs in Node tests too.
import { Story } from 'inkjs';
import { friendFor, parseLine, type Character, type Player } from '../content/characters.ts';

export interface Cue {
  key: string;
  value: string;
  who?: string; // for expr/emote/anim/quote/sticker/outfit: "mum=angry" -> who "mum", value "angry"
}

export interface LineBeat {
  kind: 'line';
  speaker: Character | null;
  name: string; // the prefix as written ("Adjoa", "Auntie"), for the name tag
  text: string;
  cues: Cue[];
  /** ink state just before this line, for saving/resuming exactly here */
  resumeState: string;
}

export interface ChoiceView {
  index: number;
  text: string;
  flavour?: string;
  hotspot?: string;
  timeout: boolean;
}

export interface ChoiceBeat {
  kind: 'choices';
  choices: ChoiceView[];
}

export type Beat = LineBeat | ChoiceBeat | { kind: 'end' };

export interface Stats {
  approval: number;
  smarts: number;
  trouble: number;
}

export interface Report {
  rank: string;
  title: string;
  copy: string[];
  quote?: { who: string; expr: string; speaker: string; text: string };
  remember: string[];
}

const PAIRED = new Set(['expr', 'emote', 'anim', 'quote', 'sticker', 'outfit']);

export function parseTag(tag: string): Cue {
  const i = tag.indexOf(':');
  if (i < 0) return { key: tag.trim(), value: '' };
  const key = tag.slice(0, i).trim();
  const value = tag.slice(i + 1).trim();
  if (PAIRED.has(key)) {
    const [who, v] = value.split('=');
    return { key, who: who.trim(), value: (v || '').trim() };
  }
  return { key, value };
}

export class Session {
  story: Story;

  constructor(json: string) {
    this.story = new Story(json);
  }

  get stats(): Stats {
    const v = this.story.variablesState;
    return { approval: v.$('approval') as number, smarts: v.$('smarts') as number, trouble: v.$('trouble') as number };
  }

  next(): Beat {
    if (this.story.canContinue) {
      const resumeState = this.story.state.ToJson();
      const raw = this.story.Continue() || '';
      const { speaker, name, text } = parseLine(raw.trim());
      return { kind: 'line', speaker, name, text, cues: (this.story.currentTags || []).map(parseTag), resumeState };
    }
    const choices = this.story.currentChoices;
    if (!choices.length) return { kind: 'end' };
    return {
      kind: 'choices',
      choices: choices.map((c, index) => {
        const cues = (c.tags || []).map(parseTag);
        const get = (k: string) => cues.find((q) => q.key === k)?.value;
        return { index, text: c.text, flavour: get('flavour'), hotspot: get('hotspot'), timeout: cues.some((q) => q.key === 'timeout') };
      }),
    };
  }

  /** Name the friend from next door after the child the player didn't pick. */
  setPlayer(p: Player) {
    for (const [k, v] of Object.entries(friendFor(p))) this.story.variablesState.$(k, v);
  }

  choose(index: number) {
    this.story.ChooseChoiceIndex(index);
  }

  /** Read the rest of the story (the report knot) into a report card. */
  collectReport(first: LineBeat): Report {
    const report: Report = { rank: '', title: '', copy: [], remember: [] };
    let needsTitle = false;
    const take = (b: LineBeat) => {
      const has = (k: string) => b.cues.some((c) => c.key === k);
      const rank = b.cues.find((c) => c.key === 'rank');
      const quote = b.cues.find((c) => c.key === 'quote');
      const line = b.text;
      if (rank) {
        report.rank = rank.value;
        if (line) report.title = line;
        else needsTitle = true;
      } else if (needsTitle && line) {
        report.title = line;
        needsTitle = false;
      } else if (quote) {
        report.quote = { who: quote.who!, expr: quote.value, speaker: b.name, text: b.text };
      } else if (has('rankcopy')) report.copy.push(line);
      else if (has('remember')) report.remember.push(line);
    };
    take(first);
    for (let b = this.next(); b.kind === 'line'; b = this.next()) take(b);
    return report;
  }

  vars(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    const vs = this.story.variablesState as unknown as { _globalVariables: Map<string, unknown> };
    for (const name of vs._globalVariables.keys()) out[name] = this.story.variablesState.$(name);
    return out;
  }

  /** Jump to a knot/stitch ("ep2" or "ep2.tray"), optionally overriding variables. */
  jump(path: string, vars: Record<string, unknown> = {}) {
    this.story.ResetState();
    for (const [k, v] of Object.entries(vars)) this.story.variablesState.$(k, v as never);
    this.story.ChoosePathString(path);
  }

  restore(state: string) {
    this.story.state.LoadJson(state);
  }
}
