// Scene registry: every location the story can switch to with #scene:<id>.
// Camera shots and hotspots are named here so writers can reference them
// from ink, and both the 3D stage and the 2D fallback know where things are.

export type Vec3 = [number, number, number];

export interface Shot {
  pos: Vec3; // 3D camera position
  look: Vec3; // 3D look-at target
  fov?: number;
  flat: [number, number, number]; // 2D fallback framing: scale, x%, y% (transform-origin)
}

export interface Hotspot {
  label: string;
  pos: Vec3; // 3D anchor
  flat: [number, number]; // 2D fallback anchor, % of the room window
}

export interface Scene {
  id: string;
  title: string; // shown top-left of the stage
  location: string;
  fallback: string; // illustrated 2D room (assets/)
  shots: Record<string, Shot>;
  hotspots: Record<string, Hotspot>;
}

export const SCENES: Record<string, Scene> = {
  hall: {
    id: 'hall',
    title: 'The Family Hall',
    location: 'Home · Accra',
    fallback: 'room-tv.svg',
    shots: {
      wide: { pos: [7, 5, 9.4], look: [0, 1.65, 0], flat: [1, 50, 50] },
      sofa: { pos: [5.6, 3.4, 6.6], look: [0.6, 1.4, -0.4], fov: 40, flat: [1.12, 55, 62] },
      tv: { pos: [0.9, 2.6, 2.6], look: [-2.3, 2.0, -1.9], fov: 38, flat: [1.6, 30, 45] },
      tv_close: { pos: [-1.95, 2.15, 0.2], look: [-2.35, 2.0, -1.85], fov: 36, flat: [2.4, 26, 44] },
      remote: { pos: [4.7, 2.7, 3.4], look: [3.15, 1.4, 0.9], fov: 34, flat: [1.8, 82, 70] },
      calendar: { pos: [3.4, 3.0, -0.4], look: [3.6, 3.0, -3.9], fov: 36, flat: [2.0, 76, 30] },
      photo: { pos: [1.45, 3.0, -0.2], look: [1.45, 3.15, -3.8], fov: 36, flat: [1.9, 52, 26] },
      fan: { pos: [2.2, 2.6, 6.0], look: [4.26, 2.4, 2.43], fov: 36, flat: [1.7, 92, 50] },
      lamp: { pos: [3.4, 2.2, 1.9], look: [1.3, 1.0, -1.2], fov: 40, flat: [1.5, 52, 70] },
      table: { pos: [3.4, 2.9, 2.6], look: [1.2, 0.8, -1.2], fov: 42, flat: [1.4, 52, 72] },
    },
    hotspots: {
      remote: { label: 'Remote control', pos: [3.2, 1.55, 0.95], flat: [83, 70] },
      calendar: { label: 'Calendar', pos: [3.6, 3.0, -3.85], flat: [74, 30] },
      photo: { label: 'Wedding photograph', pos: [1.45, 3.17, -3.7], flat: [52, 25] },
      fan: { label: 'Standing fan', pos: [4.26, 2.8, 2.45], flat: [93, 46] },
    },
  },
  auntie: {
    id: 'auntie',
    title: "Auntie Efua's House",
    location: 'Next door',
    fallback: 'room-neighbour.svg',
    shots: {
      wide: { pos: [7, 5, 9.4], look: [0, 1.65, 0], flat: [1, 50, 50] },
      door: { pos: [7.6, 4.2, 8.2], look: [0.4, 1.6, -0.6], fov: 42, flat: [1.08, 60, 55] },
      phone: { pos: [-2.6, 2.0, 2.6], look: [-4.2, 1.15, 1.0], fov: 34, flat: [2.0, 12, 62] },
      showcase: { pos: [3.4, 2.4, 0.4], look: [3.7, 1.9, -3.5], fov: 38, flat: [1.8, 80, 45] },
      portrait: { pos: [1.45, 3.0, -0.2], look: [1.45, 3.15, -3.8], fov: 36, flat: [1.9, 52, 26] },
      auntie_tv: { pos: [-1.1, 2.4, 0.6], look: [-2.3, 2.1, -2.5], fov: 36, flat: [2.0, 25, 45] },
      tray: { pos: [3.2, 3.0, 1.6], look: [1.24, 0.85, -1.2], fov: 38, flat: [1.6, 50, 72] },
      tray_close: { pos: [2.2, 2.0, 0.2], look: [1.2, 0.85, -1.2], fov: 34, flat: [2.4, 50, 74] },
      mum_eyes: { pos: [5.2, 3.1, 5.4], look: [0.0, 1.6, 0.0], fov: 32, flat: [1.35, 30, 45] },
    },
    hotspots: {
      phone: { label: 'Telephone', pos: [-4.2, 1.2, 1.0], flat: [12, 62] },
      showcase: { label: 'Glass showcase', pos: [3.7, 1.9, -3.5], flat: [80, 42] },
      portrait: { label: 'Framed photograph', pos: [1.45, 3.17, -3.7], flat: [52, 25] },
      auntie_tv: { label: "Auntie's television", pos: [-2.3, 2.1, -2.5], flat: [25, 44] },
    },
  },
  compound: {
    id: 'compound',
    title: 'The Compound',
    location: 'Outside · Accra',
    fallback: 'compound.svg',
    shots: {
      wide: { pos: [6.5, 4.6, 10], look: [0, 1.6, -1], flat: [1, 50, 50] },
      gate: { pos: [-1.2, 2.8, 6.5], look: [-3.4, 1.6, -2.5], fov: 42, flat: [1.3, 22, 55] },
      gate_close: { pos: [-2.4, 2.2, 2.6], look: [-3.6, 1.7, -2.6], fov: 36, flat: [1.8, 18, 52] },
      kiosk: { pos: [5.6, 3.0, 5.8], look: [2.8, 1.8, -2.2], fov: 40, flat: [1.35, 72, 50] },
      shelf: { pos: [3.0, 2.1, 1.4], look: [2.8, 1.8, -2.3], fov: 36, flat: [2.0, 72, 48] },
      counter: { pos: [3.6, 1.9, 0.6], look: [2.8, 1.3, -1.3], fov: 34, flat: [2.2, 72, 62] },
      road: { pos: [1.5, 2.4, 7.5], look: [-1.0, 1.2, 2.5], fov: 40, flat: [1.4, 40, 70] },
    },
    hotspots: {
      milk: { label: 'Tin of milk', pos: [1.95, 2.2, -2.45], flat: [62, 40] },
      bread: { label: 'Loaf of tea bread', pos: [2.65, 2.2, -2.45], flat: [70, 40] },
      sugar: { label: 'Small packet of sugar', pos: [3.35, 2.2, -2.45], flat: [78, 40] },
      matches: { label: 'Box of matches', pos: [1.95, 1.65, -2.45], flat: [62, 54] },
      toffee: { label: 'Toffees', pos: [2.65, 1.65, -2.45], flat: [70, 54] },
      candles: { label: 'Candles', pos: [3.35, 1.65, -2.45], flat: [78, 54] },
    },
  },
};

export const LIGHTS = ['snow', 'evening', 'film', 'tension', 'blackout', 'lamp', 'afternoon', 'dusk', 'day'] as const;
export type LightId = (typeof LIGHTS)[number];

export const ALL_SHOTS = new Set(Object.values(SCENES).flatMap((s) => [...Object.keys(s.shots), 'push']));
export const ALL_HOTSPOTS = new Set(Object.values(SCENES).flatMap((s) => Object.keys(s.hotspots)));
