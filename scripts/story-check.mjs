// `npm run story:check` — compile the story, validate tags, and sample
// thousands of random playthroughs to show how endings are distributed.
import { compileInk, playthrough, rng } from './ink.mjs';
import { validateTags } from '../src/content/validate.ts';

const runs = Number(process.argv[2] || 3000);
let compiled;
try {
  compiled = compileInk();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
const { json, warnings, meta } = compiled;
warnings.forEach((w) => console.warn('warning:', w));

const problems = validateTags(meta.tags);
problems.forEach((p) => console.error('tag problem:', p));

const ranks = {};
const momentCounts = {};
let lines = 0;
for (let i = 0; i < runs; i++) {
  const r = rng(i + 1);
  const res = playthrough(json, (choices) => Math.floor(r() * choices.length));
  ranks[res.rank] = (ranks[res.rank] || 0) + 1;
  lines += res.lines.length;
  res.tags.filter((t) => t.startsWith('moment:')).forEach((t) => (momentCounts[t.split('/')[0].slice(7)] = 1));
}
console.log(`Compiled OK — ${meta.knots.length} knots/stitches, ${meta.moments.length} moments, ${meta.tags.length} tags.`);
console.log(`${runs} random playthroughs, avg ${(lines / runs).toFixed(0)} lines each. Ending distribution:`);
for (const [k, n] of Object.entries(ranks).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(12)} ${((100 * n) / runs).toFixed(1)}%`);
const unseen = meta.moments.filter((m) => !momentCounts[m.id]).map((m) => m.id);
console.log(unseen.length ? `Moments never reached by random play: ${unseen.join(', ')}` : 'Every moment was reached by random play.');
process.exit(problems.length ? 1 : 0);
