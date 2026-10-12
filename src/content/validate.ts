// Story tag validation, shared by the tests, `npm run story:check` and the dev overlay.
import { CHARACTERS, EXPRESSIONS } from './characters.ts';
import { SCENES, LIGHTS, ALL_SHOTS, ALL_HOTSPOTS } from './scenes.ts';

export const EMOTES = ['sweat', 'shock', 'question', 'anger', 'sparkle', 'heart', 'dots'];
export const ANIMS = ['bounce', 'shake', 'jump', 'lean', 'slump'];
export const FX = ['shake', 'impact', 'flash'];
export const SFX = ['good', 'bad', 'click', 'sting', 'kiss', 'romance', 'tvclear', 'static', 'thump', 'whoosh', 'powercut', 'powerup', 'knock', 'crinkle', 'crunch', 'coin', 'pop', 'radio', 'radiooff', 'cheer', 'title'];
export const AMBIENCE = ['static', 'film', 'night', 'hall', 'auntie', 'clock', 'compound'];
export const PROPS: Record<string, RegExp> = {
  tv: /^(snow|film|kiss|news|off)$/,
  foil: /^(on|off)$/,
  lamp: /^(on|off)$/,
  tray: /^(on|off)$/,
  biscuits: /^-?\d+$/,
  auntie_tv: /^(snow|fixed)$/,
};

const onStage = Object.values(CHARACTERS).filter((c) => c.body).map((c) => c.id);
const FLAGS = ['report', 'rankcopy', 'remember', 'timeout'];

/** Returns a list of human-readable problems, empty if every tag is valid. */
export function validateTag(tag: string): string | null {
  if (FLAGS.includes(tag)) return null;
  const i = tag.indexOf(':');
  if (i < 0) return `unknown tag "${tag}"`;
  const key = tag.slice(0, i);
  const val = tag.slice(i + 1).trim();
  const pair = (list: string[]) => {
    const [who, what] = val.split('=');
    if (!onStage.includes(who)) return `unknown character "${who}"`;
    if (!list.includes(what)) return `unknown ${key} "${what}"`;
    return null;
  };
  switch (key) {
    case 'scene': return SCENES[val] ? null : `unknown scene "${val}"`;
    case 'light': return (LIGHTS as readonly string[]).includes(val) ? null : `unknown light "${val}"`;
    case 'cam': return ALL_SHOTS.has(val) ? null : `unknown camera shot "${val}"`;
    case 'hotspot': return ALL_HOTSPOTS.has(val) ? null : `unknown hotspot "${val}"`;
    case 'cast': {
      if (val === 'none') return null;
      const bad = val.split(',').map((s) => s.trim()).filter((id) => !onStage.includes(id));
      return bad.length ? `unknown cast member(s) ${bad.join(', ')}` : null;
    }
    case 'expr': return pair(Object.keys(EXPRESSIONS));
    case 'emote': return pair(EMOTES);
    case 'anim': return pair(ANIMS);
    case 'quote': return pair(Object.keys(EXPRESSIONS));
    case 'focus': return val === 'none' || onStage.includes(val) ? null : `unknown focus "${val}"`;
    case 'fx': return FX.includes(val) ? null : `unknown fx "${val}"`;
    case 'sfx': return SFX.includes(val) ? null : `unknown sfx "${val}"`;
    case 'amb': return AMBIENCE.includes(val) ? null : `unknown ambience "${val}"`;
    case 'prop': {
      const [name, v] = val.split('=');
      if (!PROPS[name]) return `unknown prop "${name}"`;
      return PROPS[name].test(v ?? '') ? null : `bad value "${v}" for prop "${name}"`;
    }
    case 'timer': case 'auto': case 'episode': return /^\d+$/.test(val) ? null : `${key} needs a number`;
    case 'card': return val.split('/').length === 3 ? null : 'card needs Kicker/Title/Meta';
    case 'moment': return /^\w+\/.+/.test(val) ? null : 'moment needs id/Title';
    case 'rank': return /^(golden|akola|strategist|comedian|\{rank\(\)\}|\{r\})$/.test(val) ? null : `unknown rank "${val}"`;
    case 'note': case 'flavour': return val ? null : `${key} needs text`;
    default: return `unknown tag "${key}"`;
  }
}

export function validateTags(tags: { tag: string; file: string; line: number }[]): string[] {
  return tags.flatMap(({ tag, file, line }) => {
    const p = validateTag(tag);
    return p ? [`${file}:${line} #${tag} — ${p}`] : [];
  });
}
