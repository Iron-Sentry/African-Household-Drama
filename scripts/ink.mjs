// Shared Ink tooling: compile the story, extract authoring metadata, and
// simulate playthroughs. Used by the Vite plugin, the tests and `npm run story:check`.
import { Compiler, CompilerOptions, Story } from 'inkjs/full';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STORY_ENTRY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../story/main.ink');

/** Compile an .ink entry file (with INCLUDEs). Throws with readable messages on error. */
export function compileInk(entry = STORY_ENTRY) {
  const dir = path.dirname(entry);
  const files = [entry];
  const errors = [];
  const warnings = [];
  const fileHandler = {
    ResolveInkFilename: (name) => path.resolve(dir, name),
    LoadInkFileContents: (file) => {
      files.push(file);
      return fs.readFileSync(file, 'utf8');
    },
  };
  // ErrorType: 0 = author TODO, 1 = warning, 2 = error
  const onError = (message, type) => (type === 2 ? errors : warnings).push(message);
  const compiler = new Compiler(fs.readFileSync(entry, 'utf8'), new CompilerOptions(entry, [], false, onError, fileHandler));
  let story;
  try {
    story = compiler.Compile();
  } catch (e) {
    if (!errors.length) errors.push(String(e?.message || e));
  }
  if (errors.length) {
    const err = new Error(`Ink compile failed:\n  ${errors.join('\n  ')}`);
    err.inkErrors = errors;
    throw err;
  }
  const sources = Object.fromEntries(files.map((f) => [path.relative(dir, f), fs.readFileSync(f, 'utf8')]));
  return { json: story.ToJson(), warnings, files, meta: extractMeta(sources) };
}

/** Pull authoring metadata out of the raw ink sources (knots, moments, tags). */
export function extractMeta(sources) {
  const knots = [];
  const moments = [];
  const tags = [];
  for (const [file, src] of Object.entries(sources)) {
    let knot = null;
    src.split('\n').forEach((line, i) => {
      const k = line.match(/^\s*===\s*(\w+)\s*===?/);
      if (k && !/function/.test(line)) {
        knot = k[1];
        knots.push(knot);
      }
      const s = line.match(/^\s*=\s+(\w+)/);
      if (s && knot) knots.push(`${knot}.${s[1]}`);
      if (/^\s*\/\//.test(line)) return;
      for (const m of line.matchAll(/#\s*([^#\]\n]+)/g)) {
        const tag = m[1].trim();
        tags.push({ tag, file, line: i + 1 });
        const mo = tag.match(/^moment:(\w+)\/(.+)$/);
        if (mo) moments.push({ id: mo[1], title: mo[2].trim() });
      }
    });
  }
  return { knots, moments, tags };
}

/** Run the story to the end making choices via pick(choices, story). Returns a summary. */
export function playthrough(json, pick, { maxSteps = 5000 } = {}) {
  const story = new Story(json);
  const lines = [];
  const tags = [];
  const choicesMade = [];
  let steps = 0;
  for (;;) {
    while (story.canContinue) {
      const text = story.Continue().trim();
      if (text) lines.push(text);
      tags.push(...story.currentTags);
      if (++steps > maxSteps) throw new Error('Playthrough exceeded max steps (infinite loop?)');
    }
    const choices = story.currentChoices;
    if (!choices.length) break;
    const idx = pick(choices, story);
    choicesMade.push(choices[idx].text);
    story.ChooseChoiceIndex(idx);
  }
  const v = (name) => story.variablesState.$(name);
  return {
    story,
    lines,
    tags,
    choicesMade,
    stats: { approval: v('approval'), smarts: v('smarts'), trouble: v('trouble') },
    rank: (tags.find((t) => t.startsWith('rank:')) || '').slice(5),
  };
}

/** Deterministic PRNG so random playthroughs are reproducible. */
export function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

/** Pick by choice text substring (falls back to the first choice). */
export const byText = (...wanted) => (choices) => {
  for (const w of wanted) {
    const i = choices.findIndex((c) => c.text.toLowerCase().includes(w.toLowerCase()));
    if (i >= 0) return i;
  }
  return 0;
};
