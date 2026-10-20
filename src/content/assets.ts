// Art that the story already uses but that hasn't been delivered yet.
//
// Every key is a path under public/assets/ exactly as docs/ASSET_REQUESTS.md
// names it (as .webp). Until the file exists, the game draws the stand-in
// instead: another existing asset, or `null` for a labelled placeholder card.
//
// When the art lands: encode it to that path (see docs/AUTHORING.md) and
// delete its line here. `npm test` fails while a delivered file still has a
// line, and fails if anything the story uses is neither on disk nor listed.

export const PLACEHOLDERS: Record<string, string | null> = {
  // ---- Batch 2: Episode Four, The Agric Homework (brief items in brackets)
  // Backgrounds [1–3]. The scene pieces in scenes.ts (dug hole, Auntie's
  // seedling) are positioned for the stand-ins; re-place them on the new art.
  'rooms/compound_corner_dusk.webp': 'rooms/compound_courtyard.webp',
  'rooms/compound_corner_night.webp': 'rooms/compound_courtyard.webp',
  'rooms/school_yard_morning.webp': 'rooms/bofrot_street.webp',

  // Madam, the class teacher [4]. Stand-in: Kojo's mother's poses.
  // Re-measure `head` for the teacher sheet in characters.ts when she lands.
  'characters/teacher_idle.webp': 'characters/friend_mother_idle.webp',
  'characters/teacher_inspect.webp': 'characters/friend_mother_point.webp',
  'characters/teacher_approve.webp': 'characters/friend_mother_wave.webp',
  'characters/teacher_stern.webp': 'characters/friend_mother_hands_on_hips.webp',
  'characters/teacher_shocked.webp': 'characters/friend_mother_shocked.webp',
  'characters/teacher_laugh.webp': 'characters/friend_mother_laugh.webp',

  // Kwame, the show-off classmate [5] (nice to have). Stand-in: the boy.
  'characters/classmate_idle.webp': 'characters/child_boy_idle.webp',
  'characters/classmate_show_off.webp': 'characters/child_boy_proud.webp',
  'characters/classmate_laugh.webp': 'characters/child_boy_laugh.webp',

  // Nana at home [6].
  'characters/child_boy_panic.webp': 'characters/child_boy_startled.webp',
  'characters/child_boy_dig.webp': 'characters/child_boy_proud.webp',
  'characters/child_boy_sneak.webp': 'characters/child_boy_run.webp',
  'characters/child_girl_panic.webp': 'characters/child_girl_scared.webp',
  'characters/child_girl_dig.webp': 'characters/child_girl_celebrate.webp',
  'characters/child_girl_sneak.webp': 'characters/child_girl_run.webp',

  // Nana at school, in uniform [7]: the `uniform` outfit sheets.
  'characters/child_boy_uniform_idle.webp': 'characters/child_boy_idle.webp',
  'characters/child_boy_uniform_proud.webp': 'characters/child_boy_proud.webp',
  'characters/child_boy_uniform_nervous.webp': 'characters/child_boy_plead.webp',
  'characters/child_boy_uniform_ashamed.webp': 'characters/child_boy_ashamed.webp',
  'characters/child_girl_uniform_idle.webp': 'characters/child_girl_idle.webp',
  'characters/child_girl_uniform_proud.webp': 'characters/child_girl_celebrate.webp',
  'characters/child_girl_uniform_nervous.webp': 'characters/child_girl_scared.webp',
  'characters/child_girl_uniform_ashamed.webp': 'characters/child_girl_shy.webp',

  // Daddy and Mummy [8–9], Auntie Efua [10] (nice to have).
  'characters/father_dig.webp': 'characters/father_hands_on_hips.webp',
  'characters/father_lecture.webp': 'characters/father_scold.webp',
  'characters/mother_lantern.webp': 'characters/mother_stern.webp',
  'characters/mother_wail.webp': 'characters/mother_shocked.webp',
  'characters/auntie_efua_over_wall.webp': 'characters/auntie_efua_gossip.webp',

  // Props [11–18]: close-up panels (#insert) and scene pieces.
  'props/seedling_tin.webp': null,
  'props/pepper_plant_tin.webp': null,
  'props/auntie_seedling.webp': null,
  'props/mango_stick_tin.webp': null,
  'props/dug_hole.webp': null,
  'props/hurricane_lantern.webp': null,
  'props/agric_exercise_book.webp': null,
  'props/watering_can_tin.webp': null,

  // Stickers [19–22].
  'fx/ewurade.webp': 'fx/ei.webp',
  'fx/see_me.webp': 'fx/trouble.webp',
  'fx/very_good.webp': 'fx/good_child.webp',
  'fx/my_pepper.webp': 'fx/oops.webp',
};

const BASE = import.meta.env?.BASE_URL ?? './';

/** URL for an asset path under public/assets/, using its stand-in until it is delivered. */
export function assetUrl(path: string): string {
  if (!(path in PLACEHOLDERS)) return `${BASE}assets/${path}`;
  const stand = PLACEHOLDERS[path];
  return stand ? `${BASE}assets/${stand}` : placeholderCard(path);
}

/** A dashed card naming the missing file, so nobody mistakes it for finished art. */
function placeholderCard(path: string): string {
  const name = path.split('/').pop()!.replace('.webp', '').replace(/_/g, ' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300"><rect x="6" y="6" width="348" height="288" rx="22" fill="#fff4dc" stroke="#1d1420" stroke-width="5" stroke-dasharray="16 10"/><text x="180" y="138" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="700" fill="#1d1420">${name}</text><text x="180" y="180" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#8a5a3a">art coming</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
