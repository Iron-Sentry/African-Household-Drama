// Procedural low-poly sets: a deliberately toy-like miniature theatre.
// Geometry is shared (unit primitives scaled per mesh) and materials are
// cached by colour, so the three rooms stay cheap on phones.
import * as THREE from 'three';

export interface Room {
  group: THREE.Group;
  /** per-frame updates (fan blades, flames); dt in seconds */
  tick?: (t: number, dt: number) => void;
  props: Record<string, (value: string) => void>;
  /** lights owned by the room that presets may drive */
  tvLight?: THREE.PointLight;
  flame?: THREE.PointLight;
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_SPHERE = new THREE.SphereGeometry(1, 16, 10);
const cylCache = new Map<string, THREE.CylinderGeometry>();
const matCache = new Map<string, THREE.MeshStandardMaterial>();

export function matte(color: string, roughness = 0.95, metalness = 0): THREE.MeshStandardMaterial {
  const key = `${color}|${roughness}|${metalness}`;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshStandardMaterial({ color, roughness, metalness })));
  return m;
}

type Mat = string | THREE.Material;
const mat = (m: Mat) => (typeof m === 'string' ? matte(m) : m);

function box(p: THREE.Object3D, w: number, h: number, d: number, x: number, y: number, z: number, m: Mat, ry = 0) {
  const mesh = new THREE.Mesh(UNIT_BOX, mat(m));
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.castShadow = mesh.receiveShadow = true;
  p.add(mesh);
  return mesh;
}

function sphere(p: THREE.Object3D, r: number, x: number, y: number, z: number, m: Mat) {
  const mesh = new THREE.Mesh(UNIT_SPHERE, mat(m));
  mesh.scale.setScalar(r);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  p.add(mesh);
  return mesh;
}

function cyl(p: THREE.Object3D, rt: number, rb: number, h: number, x: number, y: number, z: number, m: Mat, seg = 18) {
  const key = `${rt}|${rb}|${seg}`;
  let g = cylCache.get(key);
  if (!g) cylCache.set(key, (g = new THREE.CylinderGeometry(rt, rb, 1, seg)));
  const mesh = new THREE.Mesh(g, mat(m));
  mesh.scale.y = h;
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  p.add(mesh);
  return mesh;
}

function plane(p: THREE.Object3D, w: number, h: number, x: number, y: number, z: number, m: THREE.Material, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  p.add(mesh);
  return mesh;
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const picture = (tex: THREE.Texture) => new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });

// ---------------------------------------------------------------------------
// A small CRT whose canvas we repaint for snow / film / kiss / news / off.
// ---------------------------------------------------------------------------
export class Crt {
  canvas = document.createElement('canvas');
  texture: THREE.CanvasTexture;
  mode = 'off';
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas.width = 256;
    this.canvas.height = 160;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.paint(0);
  }

  get animated() {
    return this.mode !== 'off';
  }

  paint(t: number) {
    const c = this.ctx;
    const w = 256;
    const h = 160;
    if (this.mode === 'off') {
      c.fillStyle = '#121619';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#ffffff10';
      c.beginPath();
      c.ellipse(80, 50, 60, 30, -0.4, 0, Math.PI * 2);
      c.fill();
    } else if (this.mode === 'snow') {
      const img = c.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 200 + 30;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      c.putImageData(img, 0, 0);
    } else if (this.mode === 'news') {
      c.fillStyle = '#23466e';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#c9d6e6';
      c.fillRect(0, 118, w, 30);
      c.fillStyle = '#23466e';
      c.font = 'bold 15px sans-serif';
      c.fillText('AKOSOMBO WATER LEVEL', 12, 139);
      c.fillStyle = '#8a5a44';
      c.beginPath();
      c.arc(128, 62, 22, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#2b2b35';
      c.fillRect(96, 84, 64, 34);
    } else {
      // the film: Isabella (left) and Ricardo (right, moustache) in melodrama light
      const kiss = this.mode === 'kiss';
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, kiss ? '#b0507a' : '#719eaa');
      g.addColorStop(1, kiss ? '#3a1630' : '#20334c');
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      const lean = kiss ? 22 : 0;
      c.fillStyle = '#e8a0b4';
      c.beginPath();
      c.ellipse(78 + lean, 160, 46, 70, 0, Math.PI, 0);
      c.fill();
      c.fillStyle = '#c99680';
      c.beginPath();
      c.arc(80 + lean, 64, 22, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#3d4859';
      c.beginPath();
      c.ellipse(180 - lean, 160, 50, 76, 0, Math.PI, 0);
      c.fill();
      c.fillStyle = '#b58468';
      c.beginPath();
      c.arc(176 - lean, 60, 23, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#2a1c1c';
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(160 - lean, 70);
      c.quadraticCurveTo(170 - lean, 64, 178 - lean, 70);
      c.stroke();
      if (kiss) {
        c.fillStyle = '#ffd0dc';
        c.font = '26px serif';
        c.fillText('♥', 116, 32 + Math.sin(t * 4) * 4);
      }
    }
    if (this.mode !== 'off') {
      c.fillStyle = '#00000022';
      for (let y = (t * 40) % 4; y < h; y += 4) c.fillRect(0, y, w, 1.4);
    }
    this.texture.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Shared interior shell (from the original prototype's room)
// ---------------------------------------------------------------------------
function interior(room: THREE.Group, o: { wall: string; side: string; floor: string; rug: [string, string, string]; sofa: string; cushion: string; pillows: [string, string] }) {
  box(room, 10, 0.23, 8, 0, -0.13, 0, o.floor);
  box(room, 10, 4.85, 0.18, 0, 2.3, -4, o.wall);
  box(room, 0.18, 4.85, 8, -5, 2.3, 0, o.side);
  box(room, 10, 0.21, 0.23, 0, 0.16, -3.83, '#e8be91');
  box(room, 0.21, 0.21, 8, -4.82, 0.16, 0, '#e8be91');
  for (let i = -4; i <= 4; i++) box(room, 0.016, 0.006, 8, i, 0, 0, '#8d655d');
  for (let j = -3; j <= 3; j++) box(room, 10, 0.006, 0.017, 0, 0, j, '#87655a');
  box(room, 5.4, 0.038, 3.05, 1.25, 0.036, 0.9, o.rug[0]);
  box(room, 5.0, 0.044, 2.65, 1.25, 0.065, 0.9, o.rug[1]);
  box(room, 4.6, 0.05, 2.25, 1.25, 0.081, 0.9, o.rug[2]);
  box(room, 3.85, 0.85, 1.32, 1.2, 0.78, 0.9, o.sofa);
  box(room, 3.85, 0.96, 0.41, 1.2, 1.27, 1.65, o.sofa);
  box(room, 3.55, 0.3, 1.12, 1.2, 1.1, 0.9, o.cushion);
  box(room, 0.42, 1.04, 1.44, -0.82, 0.96, 0.92, o.sofa);
  box(room, 0.42, 1.04, 1.44, 3.21, 0.96, 0.92, o.sofa);
  box(room, 0.8, 0.55, 0.2, 0.1, 1.57, 1.4, o.pillows[0]).rotation.z = 0.14;
  box(room, 0.7, 0.5, 0.22, 2.2, 1.6, 1.42, o.pillows[1]).rotation.z = -0.13;
  // coffee table
  cyl(room, 1.13, 1.21, 0.13, 1.24, 0.73, -1.24, '#966747', 28);
  cyl(room, 0.12, 0.14, 0.54, 0.65, 0.43, -1.4, '#654131', 10);
  cyl(room, 0.12, 0.14, 0.54, 1.83, 0.43, -1.4, '#654131', 10);
  cyl(room, 0.12, 0.14, 0.54, 0.95, 0.43, -0.79, '#654131', 10);
  cyl(room, 0.39, 0.34, 0.05, 1.18, 0.83, -1.16, '#eddbc0', 24);
  // window with curtains
  box(room, 2.15, 1.97, 0.12, -2.95, 3.1, -3.8, '#eacb9e');
  const glass = box(room, 1.86, 1.72, 0.13, -2.95, 3.1, -3.72, new THREE.MeshBasicMaterial({ color: '#8fb2c0' }));
  box(room, 0.085, 1.73, 0.16, -2.95, 3.1, -3.63, '#f8dfb7');
  box(room, 1.86, 0.085, 0.16, -2.95, 3.1, -3.63, '#f8dfb7');
  return glass;
}

function standingFan(room: THREE.Group) {
  cyl(room, 0.44, 0.55, 0.09, 4.26, 0.1, 2.43, '#49454b');
  cyl(room, 0.07, 0.07, 2.56, 4.26, 1.37, 2.43, '#65646c');
  sphere(room, 0.31, 4.26, 2.78, 2.43, '#6b6972');
  const blades = new THREE.Group();
  blades.position.set(4.26, 2.78, 2.72);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const b = box(blades, 0.24, 0.84, 0.045, -Math.sin(a) * 0.38, Math.cos(a) * 0.38, 0, '#ded1c0');
    b.rotation.z = a;
  }
  room.add(blades);
  return blades;
}

function kerosenLamp(room: THREE.Group, x: number, y: number, z: number) {
  const lamp = new THREE.Group();
  lamp.position.set(x, y, z);
  cyl(lamp, 0.16, 0.2, 0.18, 0, 0.09, 0, '#7a4b2e');
  cyl(lamp, 0.09, 0.13, 0.32, 0, 0.36, 0, new THREE.MeshStandardMaterial({ color: '#fff0d0', transparent: true, opacity: 0.35, roughness: 0.1 }));
  const flame = sphere(lamp, 0.05, 0, 0.32, 0, new THREE.MeshBasicMaterial({ color: '#ffcc66' }));
  flame.scale.set(0.05, 0.09, 0.05);
  cyl(lamp, 0.03, 0.03, 0.25, 0.17, 0.5, 0, '#5a4a3a', 6).rotation.z = 0.5;
  const light = new THREE.PointLight('#ffae5c', 0, 9, 1.6);
  light.userData.base = 0;
  light.position.set(0, 0.45, 0);
  lamp.add(light);
  room.add(lamp);
  return { lamp, light };
}

// ---------------------------------------------------------------------------
// The family hall
// ---------------------------------------------------------------------------
export function buildHall(crt: Crt): Room {
  const group = new THREE.Group();
  interior(group, {
    wall: '#b98888', side: '#8f7480', floor: '#b08168', rug: ['#a55f61', '#d59a76', '#ab6b69'],
    sofa: '#7a5d77', cushion: '#b27e84', pillows: ['#d6a575', '#d4a8a3'],
  });
  // wedding photograph above the sofa
  const wedding = canvasTex(256, 180, (c) => {
    c.fillStyle = '#e9dcc0';
    c.fillRect(0, 0, 256, 180);
    c.fillStyle = '#b9a98a';
    c.fillRect(12, 12, 232, 156);
    c.fillStyle = '#f7f2e8';
    c.beginPath();
    c.ellipse(96, 180, 48, 90, 0, Math.PI, 0);
    c.fill(); // bride's dress
    c.fillStyle = '#7a4a34';
    c.beginPath();
    c.arc(96, 70, 20, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2b2730';
    c.beginPath();
    c.ellipse(160, 180, 44, 92, 0, Math.PI, 0);
    c.fill(); // groom's suit
    c.fillStyle = '#6e4230';
    c.beginPath();
    c.arc(160, 66, 21, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1e1a1e';
    c.beginPath();
    c.ellipse(160, 50, 22, 12, 0, Math.PI, 0);
    c.fill(); // Daddy's hair, once
  });
  box(group, 2.03, 1.35, 0.09, 1.45, 3.17, -3.76, '#5a3d3d');
  plane(group, 1.85, 1.18, 1.45, 3.17, -3.695, picture(wedding));
  // office calendar (Akosombo Dam)
  const cal = canvasTex(160, 220, (c) => {
    c.fillStyle = '#f5efe2';
    c.fillRect(0, 0, 160, 220);
    const g = c.createLinearGradient(0, 0, 0, 110);
    g.addColorStop(0, '#9cc4dc');
    g.addColorStop(1, '#5d8aa8');
    c.fillStyle = g;
    c.fillRect(8, 8, 144, 100);
    c.fillStyle = '#8b8b84';
    c.fillRect(8, 64, 144, 22); // the dam wall
    c.fillStyle = '#4c7f9e';
    c.fillRect(8, 86, 144, 22);
    c.fillStyle = '#4f7a4c';
    c.beginPath();
    c.moveTo(8, 64);
    c.lineTo(40, 40);
    c.lineTo(80, 60);
    c.lineTo(8, 64);
    c.fill();
    c.fillStyle = '#7a2a2a';
    c.font = 'bold 22px sans-serif';
    c.fillText('1998', 52, 132);
    c.fillStyle = '#555';
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) c.fillRect(14 + k * 19, 146 + r * 17, 12, 9);
  });
  plane(group, 0.62, 0.86, 3.6, 3.0, -3.89, picture(cal));
  // TV cabinet + set + rabbit ears (+ optional foil)
  box(group, 2.2, 0.7, 0.93, -2.25, 0.73, -2.25, '#654131');
  box(group, 2.3, 0.12, 1.15, -2.25, 1.15, -2.25, '#966747');
  box(group, 2.08, 1.59, 0.74, -2.22, 1.99, -2.24, '#4b3740');
  box(group, 1.73, 1.26, 0.05, -2.35, 2.02, -1.836, '#181f29');
  const screen = plane(group, 1.65, 1.13, -2.35, 2.02, -1.802, picture(crt.texture));
  screen.renderOrder = 1;
  cyl(group, 0.06, 0.06, 0.05, -1.23, 2.36, -1.76, '#e4b77d');
  cyl(group, 0.06, 0.06, 0.05, -1.23, 2.11, -1.76, '#e4b77d');
  cyl(group, 0.5, 0.5, 0.012, -2.22, 2.79, -2.24, '#f4ece0', 20); // lace doily
  const earL = box(group, 0.025, 0.7, 0.025, -2.5, 3.1, -2.17, '#86817d');
  earL.rotation.z = 0.42;
  const earR = box(group, 0.025, 0.7, 0.025, -2.0, 3.1, -2.17, '#86817d');
  earR.rotation.z = -0.42;
  const foil = new THREE.Group();
  const shiny = matte('#d8dde2', 0.25, 0.9);
  sphere(foil, 0.09, -2.64, 3.38, -2.17, shiny).scale.set(0.09, 0.14, 0.09);
  sphere(foil, 0.09, -1.86, 3.38, -2.17, shiny).scale.set(0.09, 0.14, 0.09);
  foil.visible = false;
  group.add(foil);
  const tvLight = new THREE.PointLight('#8fb8ff', 0, 7, 1.8);
  tvLight.position.set(-2.3, 2.0, -1.2);
  group.add(tvLight);
  // the remote, in its permanent plastic
  box(group, 0.16, 0.05, 0.42, 3.21, 1.52, 0.95, '#2a2a30');
  box(group, 0.2, 0.06, 0.46, 3.21, 1.53, 0.95, new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.22, roughness: 0.05 }));
  // side table + plant
  const pot = cyl(group, 0.33, 0.27, 0.48, -4.12, 0.38, 2.33, '#ad714f');
  pot.castShadow = true;
  for (let i = 0; i < 6; i++) sphere(group, 0.31, -4.12 + Math.cos(i * 1.1) * 0.24, 0.77 + (i % 2) * 0.24, 2.33 + Math.sin(i * 1.1) * 0.24, '#537a59').scale.set(0.2, 0.45, 0.19);
  const blades = standingFan(group);
  const { lamp, light: flame } = kerosenLamp(group, 1.55, 0.8, -1.05);
  lamp.visible = false;
  return {
    group,
    tvLight,
    flame,
    tick: (t) => {
      blades.rotation.z = t * 5;
      if (lamp.visible) flame.intensity = flame.userData.base * (0.9 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7.3) * 0.05);
    },
    props: {
      tv: (v) => (crt.mode = v),
      foil: (v) => (foil.visible = v === 'on'),
      lamp: (v) => (lamp.visible = v === 'on'),
    },
  };
}

// ---------------------------------------------------------------------------
// Auntie Efua's front room
// ---------------------------------------------------------------------------
export function buildAuntie(crt: Crt): Room {
  const group = new THREE.Group();
  interior(group, {
    wall: '#a0aa91', side: '#879885', floor: '#af9472', rug: ['#577f6f', '#9ab092', '#6c9382'],
    sofa: '#638e7a', cushion: '#87a990', pillows: ['#c78e68', '#e3c48d'],
  });
  // plastic cover on the sofa
  box(group, 3.6, 0.02, 1.15, 1.2, 1.27, 0.9, new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, roughness: 0.05 }));
  // Kwabena in London
  const london = canvasTex(200, 260, (c) => {
    c.fillStyle = '#c9ccd2';
    c.fillRect(0, 0, 200, 260);
    c.fillStyle = '#b8231f';
    c.fillRect(70, 70, 130, 120); // red bus
    c.fillStyle = '#e9e3d4';
    c.fillRect(80, 84, 110, 22);
    c.fillRect(80, 130, 110, 22);
    c.fillStyle = '#3a3a44';
    c.beginPath();
    c.ellipse(80, 260, 54, 120, 0, Math.PI, 0);
    c.fill(); // thick coat
    c.fillStyle = '#6e4430';
    c.beginPath();
    c.arc(80, 112, 24, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#f6efe0';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(80, 118, 10, 0.2, Math.PI - 0.2);
    c.stroke(); // big smile
  });
  box(group, 1.4, 1.75, 0.09, 1.45, 3.17, -3.76, '#c9a35a');
  plane(group, 1.22, 1.56, 1.45, 3.17, -3.695, picture(london));
  // Auntie's TV on a low cabinet
  box(group, 1.58, 1.0, 0.55, -2.3, 0.55, -2.55, '#654131');
  box(group, 1.75, 0.1, 0.71, -2.3, 1.08, -2.55, '#966747');
  box(group, 1.3, 1.0, 0.7, -2.3, 1.62, -2.6, '#3e3438');
  box(group, 1.05, 0.78, 0.04, -2.38, 1.64, -2.24, '#151a20');
  plane(group, 0.98, 0.7, -2.38, 1.64, -2.215, picture(crt.texture));
  const earL = box(group, 0.02, 0.6, 0.02, -2.5, 2.35, -2.55, '#86817d');
  earL.rotation.z = 0.5;
  const earR = box(group, 0.02, 0.6, 0.02, -2.1, 2.35, -2.55, '#86817d');
  earR.rotation.z = -0.5;
  const tvLight = new THREE.PointLight('#a0c0ff', 0, 5, 1.8);
  tvLight.position.set(-2.3, 1.7, -1.8);
  group.add(tvLight);
  // the glass showcase
  box(group, 1.7, 2.6, 0.7, 3.7, 1.3, -3.5, '#5e3b28');
  box(group, 1.5, 2.3, 0.05, 3.7, 1.35, -3.14, new THREE.MeshStandardMaterial({ color: '#dff0f0', transparent: true, opacity: 0.25, roughness: 0.05 }));
  for (let s = 0; s < 3; s++) {
    box(group, 1.5, 0.04, 0.6, 3.7, 0.55 + s * 0.75, -3.5, '#7a5236');
    for (let k = 0; k < 4; k++) cyl(group, 0.16, 0.16, 0.02, 3.17 + k * 0.35, 0.78 + s * 0.75, -3.62, '#f6f3ea', 20).rotation.x = Math.PI / 2.2;
  }
  sphere(group, 0.12, 3.7, 2.17, -3.4, '#fbfbf6'); // the ceramic swan
  sphere(group, 0.05, 3.79, 2.33, -3.4, '#fbfbf6');
  // telephone with padlock on a side table
  box(group, 0.9, 0.9, 0.9, -4.2, 0.45, 1.0, '#7a5236');
  cyl(group, 0.42, 0.42, 0.012, -4.2, 0.91, 1.0, '#f4ece0', 20);
  box(group, 0.42, 0.18, 0.5, -4.2, 1.0, 1.0, '#efe3c6');
  box(group, 0.12, 0.08, 0.56, -4.2, 1.14, 1.0, '#efe3c6');
  cyl(group, 0.12, 0.12, 0.03, -4.02, 1.1, 1.05, '#d8ccb0', 16).rotation.z = Math.PI / 2;
  box(group, 0.06, 0.07, 0.03, -3.98, 1.06, 1.12, matte('#d6a645', 0.3, 0.8));
  // wall clock
  cyl(group, 0.35, 0.35, 0.06, -4.88, 3.4, -1.2, '#f2e6cc', 24).rotation.z = Math.PI / 2;
  // tray of biscuits + malt
  const tray = new THREE.Group();
  cyl(tray, 0.62, 0.58, 0.04, 1.24, 0.82, -1.24, '#c0c4c6', 28);
  const biscuits: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    biscuits.push(cyl(tray, 0.07, 0.07, 0.025, 1.12 + Math.cos(a) * 0.3, 0.86, -1.24 + Math.sin(a) * 0.3, '#d29a55', 12));
  }
  cyl(tray, 0.06, 0.07, 0.34, 1.6, 0.99, -1.05, '#5a2e1a');
  cyl(tray, 0.06, 0.07, 0.34, 1.62, 0.99, -1.4, '#5a2e1a');
  tray.visible = false;
  group.add(tray);
  let count = 12;
  const setBiscuits = (n: number) => {
    count = Math.max(0, Math.min(12, n));
    biscuits.forEach((b, i) => (b.visible = i < count));
  };
  for (let i = 0; i < 5; i++) sphere(group, 0.31, -4.12 + Math.cos(i * 1.2) * 0.22, 0.77 + (i % 2) * 0.2, 2.6 + Math.sin(i * 1.2) * 0.22, '#55785b').scale.set(0.2, 0.42, 0.19);
  cyl(group, 0.3, 0.25, 0.45, -4.12, 0.3, 2.6, '#c5a46f');
  const blades = standingFan(group);
  return {
    group,
    tvLight,
    tick: (t) => (blades.rotation.z = t * 5),
    props: {
      auntie_tv: (v) => (crt.mode = v === 'fixed' ? 'news' : 'snow'),
      tray: (v) => (tray.visible = v === 'on'),
      biscuits: (v) => setBiscuits(v.startsWith('-') ? count + Number(v) : Number(v)),
    },
  };
}

// ---------------------------------------------------------------------------
// The compound and Sister Akos's kiosk
// ---------------------------------------------------------------------------
export function buildCompound(): Room {
  const group = new THREE.Group();
  // laterite ground with a swept sand patch
  box(group, 26, 0.2, 22, 0, -0.1, 0, '#b8714a');
  cyl(group, 4.5, 4.5, 0.02, -0.5, 0.01, 1.2, '#cf9a6a', 32);
  // compound wall, painted cream with a blue band
  box(group, 22, 2.4, 0.3, 0, 1.2, -4.6, '#e9dcc2');
  box(group, 22, 0.3, 0.32, 0, 0.45, -4.6, '#3f6c9a');
  // Auntie Efua's house front and green gate (left)
  box(group, 5.5, 3.6, 0.3, -6.2, 1.8, -3.0, '#d9b98e');
  box(group, 1.2, 1.0, 0.1, -6.6, 2.3, -2.84, '#6c8fa0');
  box(group, 0.15, 2.2, 0.15, -4.6, 1.1, -2.7, '#7b6a5a');
  box(group, 0.15, 2.2, 0.15, -2.6, 1.1, -2.7, '#7b6a5a');
  box(group, 0.95, 1.9, 0.06, -4.1, 1.0, -2.7, '#3d7a55');
  box(group, 0.95, 1.9, 0.06, -3.1, 1.0, -2.7, '#3d7a55');
  for (let i = 0; i < 6; i++) box(group, 0.03, 1.7, 0.08, -4.5 + i * 0.32, 1.0, -2.66, '#2f5f42');
  // the kiosk
  const blue = '#2f6fa8';
  box(group, 2.8, 0.2, 1.8, 2.7, 0.1, -2.9, '#5c5c60'); // concrete blocks
  box(group, 2.8, 2.7, 0.08, 2.7, 1.55, -3.75, '#1f4f7c'); // back
  box(group, 0.08, 2.7, 1.8, 1.32, 1.55, -2.9, blue);
  box(group, 0.08, 2.7, 1.8, 4.08, 1.55, -2.9, blue);
  box(group, 2.8, 1.05, 0.08, 2.7, 0.72, -2.02, blue); // below the counter
  box(group, 2.8, 0.5, 0.08, 2.7, 2.65, -2.02, blue); // above the window
  box(group, 3.2, 0.1, 2.2, 2.7, 2.95, -2.9, '#8a8a90'); // roof sheet
  box(group, 2.9, 0.08, 0.5, 2.7, 1.27, -1.85, '#c9a36a'); // counter board
  const sign = canvasTex(512, 72, (c) => {
    c.fillStyle = '#1d4a7a';
    c.fillRect(0, 0, 512, 72);
    c.fillStyle = '#ffd34d';
    c.font = 'bold 40px Georgia, serif';
    c.textAlign = 'center';
    c.fillText("GOD'S TIME IS THE BEST", 256, 50);
  });
  plane(group, 2.7, 0.38, 2.7, 2.62, -1.97, picture(sign));
  // shelves and stock (hotspot anchors in scenes.ts line up with these)
  box(group, 2.5, 0.05, 0.5, 2.7, 1.95, -3.45, '#a37b4f');
  box(group, 2.5, 0.05, 0.5, 2.7, 1.45, -3.45, '#a37b4f');
  const stock = (x: number, y: number, draw: (g: THREE.Group) => void) => {
    const g = new THREE.Group();
    g.position.set(x, y, -3.4);
    draw(g);
    group.add(g);
  };
  stock(1.95, 1.98, (g) => [-0.12, 0.12].forEach((dx) => { cyl(g, 0.09, 0.09, 0.2, dx, 0.1, 0, '#d9dde0', 14); cyl(g, 0.092, 0.092, 0.09, dx, 0.1, 0, '#c4302b', 14); }));
  stock(2.65, 1.98, (g) => sphere(g, 1, 0, 0.12, 0, '#d9a25c').scale.set(0.24, 0.12, 0.14));
  stock(3.35, 1.98, (g) => { box(g, 0.16, 0.24, 0.1, -0.1, 0.12, 0, '#f6f2e8'); box(g, 0.16, 0.24, 0.1, 0.1, 0.12, 0, '#f6f2e8'); });
  stock(1.95, 1.48, (g) => [-0.1, 0, 0.1].forEach((dx) => box(g, 0.08, 0.05, 0.12, dx, 0.03, 0, '#e2b84a')));
  stock(2.65, 1.48, (g) => { cyl(g, 0.12, 0.12, 0.26, 0, 0.13, 0, new THREE.MeshStandardMaterial({ color: '#f0f4f4', transparent: true, opacity: 0.4 })); ['#e04848', '#f2c14e', '#4aa86a'].forEach((col, i) => sphere(g, 0.035, -0.05 + i * 0.05, 0.08, 0, col)); });
  stock(3.35, 1.48, (g) => [-0.06, 0, 0.06].forEach((dx) => cyl(g, 0.025, 0.025, 0.3, dx, 0.15, 0, '#f8f4e8', 8)));
  // radio on the counter
  box(group, 0.4, 0.22, 0.16, 3.6, 1.42, -1.95, '#6b4a3a');
  const ant = box(group, 0.012, 0.4, 0.012, 3.75, 1.7, -1.95, '#999');
  ant.rotation.z = -0.4;
  // mango tree
  cyl(group, 0.22, 0.32, 2.6, -1.2, 1.3, -3.4, '#5b3d2a', 10);
  [[-1.2, 3.2, -3.4, 1.4], [-2.1, 2.8, -3.2, 1.0], [-0.3, 2.9, -3.0, 1.0], [-1.4, 3.8, -3.6, 1.0]].forEach(([x, y, z, r]) => sphere(group, r, x, y, z, '#3f6b3a').scale.set(r, r * 0.8, r));
  // clothesline
  cyl(group, 0.04, 0.04, 2.4, -1.0, 1.2, 0.9 - 3.4, '#6a5a4a', 6);
  box(group, 0.02, 0.02, 3.6, -1.0, 2.35, -1.6, '#ddd');
  [['#d9893a', -2.6], ['#7b4aa0', -1.6], ['#e2c04a', -0.7]].forEach(([col, z]) => box(group, 0.02, 0.9, 0.7, -1.0, 1.9, Number(z), col as string));
  // bicycle tyre and stick (Kojo's)
  const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 24), matte('#222'));
  tyre.position.set(0.8, 0.44, 1.2);
  tyre.rotation.y = 0.6;
  tyre.castShadow = true;
  group.add(tyre);
  // bofrot seller across the road
  box(group, 1.0, 0.7, 0.7, -1.6, 0.35, 3.6, '#7a5236');
  cyl(group, 0.36, 0.3, 0.22, -1.6, 0.81, 3.6, '#c79a52', 16);
  for (let i = 0; i < 7; i++) sphere(group, 0.08, -1.75 + (i % 4) * 0.1, 0.95, 3.5 + Math.floor(i / 4) * 0.15, '#c8822f');
  return { group, props: {} };
}
