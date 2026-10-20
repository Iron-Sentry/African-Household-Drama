// Art that the story already uses but that hasn't been delivered yet.
//
// Every key is a path under public/assets/ exactly as docs/ASSET_REQUESTS.md
// names it (as .webp). Until the file exists, the game draws the stand-in
// instead: another existing asset, or `null` for a labelled placeholder card.
//
// When the art lands: encode it to that path (see docs/AUTHORING.md) and
// delete its line here. `npm test` fails while a delivered file still has a
// line, and fails if anything the story uses is neither on disk nor listed.

export const PLACEHOLDERS: Record<string, string | null> = {};

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
