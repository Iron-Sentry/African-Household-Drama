// Character registry and sprite poses.
//
// Every on-stage character is a set of painted full-body poses
// (public/assets/characters/<sprite>_<pose>.webp, 512×640). Ink asks for a
// mood (#expr:mum=sideeye) or a pose by name (#expr:mum=offer_food); MOODS maps
// each shared mood onto the closest pose that sprite actually has.
// The player child and their friend swap sprites with the boy/girl choice.

import { assetUrl } from './assets.ts';

export type Player = 'boy' | 'girl';

export interface Character {
  id: string;
  name: string; // shown on the speech bubble
  speakers: string[]; // names that may prefix a line in ink ("Mummy: ...")
  kind: 'adult' | 'child';
  accent: string; // name-tag colour
  sprite?: string | ((p: Player) => string); // pose sheet; voices have none
}

export const MOOD_NAMES = ['neutral', 'happy', 'delight', 'laugh', 'proud', 'smile', 'smug', 'flat', 'sideeye', 'angry', 'shock', 'worried', 'sad', 'hurt', 'eyesclosed', 'focused', 'stare', 'strain'] as const;

// Poses per sheet, then mood -> pose in MOOD_NAMES order.
// A sheet named <sheet>_<outfit> (child_boy_uniform) is that character in other
// clothes, switched with #outfit:child=uniform; it needs its own mood map.
// Poses still waiting for art are drawn from stand-ins: see src/content/assets.ts.
// head: top of the hair (or head tie) to the chin, in % of the 640 px canvas height.
// Poses of one sheet share a scale, so this is measured once on the idle pose and
// lets the stage find the chin in every pose (bubbles hang below it on phones).
const SHEETS: Record<string, { poses: string[]; moods: string[]; head: number }> = {
  mother: {
    head: 21,
    poses: ['idle', 'approve', 'arms_crossed', 'offer_food', 'scold', 'shocked', 'side_eye', 'stern', 'think', 'lantern', 'wail'],
    moods: ['idle', 'approve', 'approve', 'approve', 'approve', 'idle', 'arms_crossed', 'stern', 'side_eye', 'scold', 'shocked', 'think', 'think', 'think', 'approve', 'think', 'stern', 'stern'],
  },
  father: {
    head: 15.5,
    poses: ['idle', 'approve', 'hands_on_hips', 'laugh', 'read_paper', 'scold', 'shocked', 'stern', 'think', 'dig', 'lecture'],
    moods: ['idle', 'approve', 'laugh', 'laugh', 'approve', 'idle', 'hands_on_hips', 'stern', 'think', 'scold', 'shocked', 'think', 'think', 'think', 'think', 'idle', 'stern', 'hands_on_hips'],
  },
  child_boy: {
    head: 22.5,
    // "think" is seated (knees up), so no standing mood maps to it; use #expr:child=think deliberately
    poses: ['idle', 'ashamed', 'comment', 'eyes_closed', 'happy', 'laugh', 'plead', 'proud', 'run', 'startled', 'think', 'panic', 'dig', 'sneak'],
    moods: ['idle', 'happy', 'happy', 'laugh', 'proud', 'happy', 'proud', 'idle', 'idle', 'comment', 'startled', 'plead', 'ashamed', 'ashamed', 'eyes_closed', 'idle', 'startled', 'plead'],
  },
  child_girl: {
    head: 26, // includes the hair puffs
    poses: ['idle', 'arms_crossed', 'celebrate', 'comment', 'eyes_closed', 'run', 'scared', 'shy', 'think', 'panic', 'dig', 'sneak'],
    moods: ['idle', 'celebrate', 'celebrate', 'celebrate', 'idle', 'idle', 'arms_crossed', 'arms_crossed', 'think', 'arms_crossed', 'scared', 'shy', 'shy', 'shy', 'eyes_closed', 'think', 'scared', 'shy'],
  },
  friend_mother: {
    head: 19,
    poses: ['idle', 'hands_on_hips', 'laugh', 'point', 'shocked', 'wave'],
    moods: ['idle', 'wave', 'laugh', 'laugh', 'idle', 'idle', 'hands_on_hips', 'hands_on_hips', 'hands_on_hips', 'point', 'shocked', 'shocked', 'idle', 'idle', 'laugh', 'idle', 'shocked', 'hands_on_hips'],
  },
  bofrot_seller: {
    head: 21,
    poses: ['idle', 'call', 'laugh', 'offer'],
    moods: ['idle', 'offer', 'laugh', 'laugh', 'idle', 'idle', 'idle', 'idle', 'idle', 'call', 'laugh', 'idle', 'idle', 'idle', 'laugh', 'idle', 'idle', 'idle'],
  },
  auntie_efua: {
    head: 22,
    poses: ['idle', 'arms_crossed', 'gossip', 'laugh', 'offer_biscuits', 'point', 'shocked', 'wave', 'welcome', 'over_wall'],
    moods: ['idle', 'welcome', 'wave', 'laugh', 'welcome', 'idle', 'gossip', 'arms_crossed', 'arms_crossed', 'point', 'shocked', 'gossip', 'arms_crossed', 'arms_crossed', 'laugh', 'idle', 'arms_crossed', 'arms_crossed'],
  },
  // ---- Episode Four
  child_boy_uniform: {
    head: 22.5,
    poses: ['idle', 'proud', 'nervous', 'ashamed'],
    moods: ['idle', 'proud', 'proud', 'proud', 'proud', 'idle', 'proud', 'idle', 'nervous', 'nervous', 'nervous', 'nervous', 'ashamed', 'ashamed', 'ashamed', 'idle', 'nervous', 'nervous'],
  },
  child_girl_uniform: {
    head: 26,
    poses: ['idle', 'proud', 'nervous', 'ashamed'],
    moods: ['idle', 'proud', 'proud', 'proud', 'proud', 'idle', 'proud', 'idle', 'nervous', 'nervous', 'nervous', 'nervous', 'ashamed', 'ashamed', 'ashamed', 'idle', 'nervous', 'nervous'],
  },
  teacher: {
    head: 19, // the stand-in's; re-measure on teacher_idle when the art lands
    poses: ['idle', 'inspect', 'approve', 'stern', 'shocked', 'laugh'],
    moods: ['idle', 'approve', 'approve', 'laugh', 'approve', 'approve', 'approve', 'idle', 'stern', 'stern', 'shocked', 'inspect', 'stern', 'shocked', 'laugh', 'inspect', 'inspect', 'stern'],
  },
  classmate: {
    head: 22.5, // the stand-in's; re-measure on classmate_idle when the art lands
    poses: ['idle', 'show_off', 'laugh'],
    moods: ['idle', 'show_off', 'show_off', 'laugh', 'show_off', 'idle', 'show_off', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'laugh', 'idle', 'idle', 'idle'],
  },
};

const kid = (p: Player) => `child_${p}`;
const otherKid = (p: Player) => `child_${p === 'boy' ? 'girl' : 'boy'}`;

export const CHARACTERS: Record<string, Character> = {
  mum: { id: 'mum', name: 'Mummy', speakers: ['Mummy'], kind: 'adult', accent: '#b8432c', sprite: 'mother' },
  dad: { id: 'dad', name: 'Daddy', speakers: ['Daddy'], kind: 'adult', accent: '#6d4a2b', sprite: 'father' },
  child: { id: 'child', name: 'Nana', speakers: ['Nana'], kind: 'child', accent: '#d07a12', sprite: kid },
  friend: { id: 'friend', name: 'Kojo', speakers: ['Kojo', 'Adjoa'], kind: 'child', accent: '#2f6aa8', sprite: otherKid },
  auntie: { id: 'auntie', name: 'Auntie Efua', speakers: ['Auntie Efua', 'Auntie'], kind: 'adult', accent: '#8a2f8f', sprite: 'auntie_efua' },
  friendmum: { id: 'friendmum', name: "Kojo's Mother", speakers: ["Kojo's Mother", "Adjoa's Mother"], kind: 'adult', accent: '#2e7d3a', sprite: 'friend_mother' },
  bofrot: { id: 'bofrot', name: 'Auntie Akua', speakers: ['Auntie Akua'], kind: 'adult', accent: '#c4561f', sprite: 'bofrot_seller' },
  teacher: { id: 'teacher', name: 'Madam', speakers: ['Madam'], kind: 'adult', accent: '#33508f', sprite: 'teacher' },
  classmate: { id: 'classmate', name: 'Kwame', speakers: ['Kwame'], kind: 'child', accent: '#7a5a1e', sprite: 'classmate' },
  // Voices without a body on stage.
  tv: { id: 'tv', name: 'On the TV', speakers: ['TV'], kind: 'adult', accent: '#2f5f7a' },
  neighbour: { id: 'neighbour', name: 'A neighbour', speakers: ['Neighbour'], kind: 'adult', accent: '#6a5a4a' },
  everybody: { id: 'everybody', name: 'Everybody', speakers: ['Everybody'], kind: 'adult', accent: '#b8432c' },
};

export const ON_STAGE = Object.values(CHARACTERS).filter((c) => c.sprite).map((c) => c.id);

/** The friend from next door is whichever child the player didn't pick. */
export const friendFor = (p: Player) =>
  p === 'boy' ? { friend: 'Adjoa', fhe: 'she', fhim: 'her', fhis: 'her' } : { friend: 'Kojo', fhe: 'he', fhim: 'him', fhis: 'his' };

/** The pose sheet for a character: their outfit's sheet when they have one (#outfit). */
export function sheetFor(id: string, player: Player, outfit = ''): string | null {
  const s = CHARACTERS[id]?.sprite;
  const base = typeof s === 'function' ? s(player) : s || null;
  return base && outfit && SHEETS[`${base}_${outfit}`] ? `${base}_${outfit}` : base;
}

/** True when this character has that outfit under either player choice. */
export function validOutfit(id: string, outfit: string): boolean {
  if (outfit === 'none') return true;
  return (['boy', 'girl'] as Player[]).every((p) => sheetFor(id, p, outfit) !== sheetFor(id, p));
}

/** Every pose name a cue may use for this character (in any outfit), under either player choice. */
export function validExpr(id: string, value: string): boolean {
  if ((MOOD_NAMES as readonly string[]).includes(value)) return true;
  return (['boy', 'girl'] as Player[]).every((p) => {
    const base = sheetFor(id, p);
    if (!base) return false;
    const sheets = Object.keys(SHEETS).filter((name) => name === base || name.startsWith(`${base}_`));
    return sheets.some((name) => SHEETS[name].poses.includes(value));
  });
}

/** Image URL for a mood or pose, falling back to idle if the sheet lacks it. */
export function poseUrl(id: string, expr: string, player: Player, outfit = ''): string | null {
  const sheet = sheetFor(id, player, outfit);
  if (!sheet) return null;
  const { poses, moods } = SHEETS[sheet];
  const i = (MOOD_NAMES as readonly string[]).indexOf(expr);
  const pose = i >= 0 ? moods[i] : poses.includes(expr) ? expr : 'idle';
  return assetUrl(`characters/${sheet}_${pose}.webp`);
}

/** Head height (top of hair to chin) in % of the sprite canvas. */
export function headHeight(id: string, player: Player, outfit = ''): number {
  const sheet = sheetFor(id, player, outfit);
  return (sheet && SHEETS[sheet].head) || 20;
}

/** Every pose file a sheet needs, as asset paths (the asset test checks them). */
export function allPosePaths(): string[] {
  return Object.entries(SHEETS).flatMap(([sheet, { poses }]) => poses.map((p) => `characters/${sheet}_${p}.webp`));
}

/** "dad@73" stands Daddy at x = 73% of the painting; plain "dad" is spread along the floor. */
export function castEntry(token: string): { id: string; at?: number } {
  const [id, at] = token.trim().split('@');
  return at === undefined ? { id } : { id, at: Number(at) };
}

/** All pose URLs for a sheet, for preloading. */
export function allPoseUrls(id: string, player: Player, outfit = ''): string[] {
  const sheet = sheetFor(id, player, outfit);
  return sheet ? SHEETS[sheet].poses.map((p) => poseUrl(id, p, player, outfit)!) : [];
}

const SPEAKERS = new Map<string, Character>();
for (const c of Object.values(CHARACTERS)) for (const s of c.speakers) SPEAKERS.set(s.toLowerCase(), c);

/** Split "Mummy: Sit properly." into speaker + text. Unknown prefixes are narration. */
export function parseLine(raw: string): { speaker: Character | null; name: string; text: string } {
  const m = raw.match(/^([A-Z][\w' ]{0,24}):\s+(.*)$/s);
  const c = m && SPEAKERS.get(m[1].toLowerCase());
  return c ? { speaker: c, name: m![1], text: m![2].trim() } : { speaker: null, name: '', text: raw.trim() };
}
