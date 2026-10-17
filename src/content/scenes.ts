// Scene registry: every location the story can switch to with #scene:<id>.
// All positions are percentages of the painted background (16:9), so the
// camera, actors, hotspots and the TV overlay stay glued to the painting.

/** Camera framing: zoom, then the point (x%, y%) to centre on. */
export type Shot = [scale: number, x: number, y: number];

export interface Scene {
  id: string;
  title: string;
  location: string;
  bg: string; // public/assets/...
  floor: [number, number]; // x% range the cast spreads across
  tv?: [left: number, top: number, width: number, height: number]; // the painted screen, if the room has one
  lamp: [number, number]; // where a kerosene lamp would sit
  shots: Record<string, Shot>;
  hotspots: Record<string, { label: string; at: [number, number] }>;
}

export const SCENES: Record<string, Scene> = {
  hall: {
    id: 'hall',
    title: 'The Family Hall',
    location: 'Home · Accra',
    bg: 'rooms/family_hall.webp',
    floor: [10, 70],
    tv: [79.5, 29.8, 7.9, 14.9],
    lamp: [51, 60],
    shots: {
      wide: [1, 50, 50],
      keyhole: [1.3, 66, 40],
      sofa: [1.12, 38, 58],
      tv: [1.8, 83.5, 40],
      tv_close: [3.4, 83.5, 37.5],
      remote: [2.4, 57, 62],
      photo: [2.4, 89, 14],
      fan: [2, 71, 36],
      lamp: [1.7, 51, 60],
      table: [1.5, 51, 64],
    },
    hotspots: {},
  },
  auntie: {
    id: 'auntie',
    title: "Auntie Efua's House",
    location: 'Next door',
    bg: 'rooms/neighbours_lounge.webp',
    floor: [14, 72],
    tv: [76.85, 30.3, 6.65, 12.75],
    lamp: [40, 58],
    shots: {
      wide: [1, 50, 50],
      door: [1.35, 40, 42],
      clock: [3, 72.4, 15.5],
      showcase: [2.1, 62, 35],
      phone: [2.6, 71.5, 40],
      portrait: [2.6, 62, 12],
      auntie_tv: [2.6, 80.3, 36],
      tray: [1.7, 40, 58],
      tray_close: [2.8, 39, 57],
      counter: [1.9, 40, 56],
    },
    hotspots: {
      clock: { label: 'The wall clock', at: [72.4, 15] },
      phone: { label: 'The telephone', at: [71.5, 41] },
      showcase: { label: 'The glass showcase', at: [62, 38] },
      portrait: { label: 'The framed photograph', at: [62.3, 11.5] },
      auntie_tv: { label: "Auntie's television", at: [81.5, 37] },
    },
  },
};

// Outdoor and bedroom paintings from art_incoming (see docs/ASSET_REQUESTS.md).
SCENES.compound = {
  id: 'compound',
  title: 'The Compound',
  location: 'Outside · Accra',
  bg: 'rooms/compound_courtyard.webp',
  floor: [22, 78],
  lamp: [50, 60],
  shots: { wide: [1, 50, 50], gate: [1.8, 40, 38], door: [1.7, 88, 42], tree: [1.8, 70, 25] },
  hotspots: {},
};
SCENES.street = {
  id: 'street',
  title: 'The Lane',
  location: 'Outside the gate',
  bg: 'rooms/bofrot_street.webp',
  floor: [32, 84],
  lamp: [14, 46],
  shots: { wide: [1, 50, 50], stall: [1.9, 17, 45], sign: [2.8, 31, 24], gate: [1.8, 57, 40] },
  hotspots: {},
};
SCENES.bedroom = {
  id: 'bedroom',
  title: "Nana's Room",
  location: 'Home · Night',
  bg: 'rooms/nana_bedroom_night.webp',
  floor: [34, 74],
  lamp: [2, 56],
  shots: { wide: [1, 50, 50], bed: [1.8, 18, 62], door: [1.9, 84, 42], window: [2, 44, 24] },
  hotspots: {},
};

export const LIGHTS = ['day', 'afternoon', 'evening', 'dusk', 'moon', 'film', 'tension', 'snow', 'lamp', 'blackout', 'doorway'] as const;

export const ALL_SHOTS = new Set(Object.values(SCENES).flatMap((s) => [...Object.keys(s.shots), 'push']));
export const ALL_HOTSPOTS = new Set(Object.values(SCENES).flatMap((s) => Object.keys(s.hotspots)));
