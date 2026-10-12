// Character registry and cut-out art.
//
// Bodies are the original prototype SVGs with the face features removed;
// faces are generated per expression from a few anchor points so every
// character shares one expression vocabulary. Add a character by adding an
// entry to CHARACTERS (see docs/AUTHORING.md).

export interface FaceRig {
  lx: number; // left eye centre x
  rx: number; // right eye centre x
  ey: number; // eye centre y
  by: number; // brow baseline y
  mx: number; // mouth centre x
  my: number; // mouth y
  mw: number; // mouth half-width
  skin: string; // eyelid colour
  ink: string; // brow/line colour
  lip: string; // mouth line colour
  glasses?: boolean;
}

export interface Character {
  id: string;
  name: string; // shown in the dialogue box
  speakers: string[]; // names that may prefix a line in ink ("Mummy: ...")
  kind: 'adult' | 'child';
  accent: string; // UI accent for the speaker label
  body?: string; // SVG inner markup, 270x540 viewBox
  face?: FaceRig;
}

const shade = `<filter id="shade" x="-15%" y="-10%" width="130%" height="130%"><feDropShadow dx="-2" dy="8" stdDeviation="5" flood-color="#291c20" flood-opacity=".27"/></filter>`;
const grads = (skin: [string, string, string], shirt: [string, string]) =>
  `<linearGradient id="skin" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="${skin[0]}"/><stop offset=".75" stop-color="${skin[1]}"/><stop offset="1" stop-color="${skin[2]}"/></linearGradient>` +
  `<linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${shirt[0]}"/><stop offset="1" stop-color="${shirt[1]}"/></linearGradient>${shade}`;

const childBody = (skin: [string, string, string], shirt: [string, string], shorts: string, hair: string, badge: string) =>
  `<defs>${grads(skin, shirt)}</defs><g filter="url(#shade)"><path d="M89 399L90 515Q105 529 122 514L131 395Z M141 395L146 514Q167 528 183 510L180 398Z" fill="#986b4b" stroke="#674d3e" stroke-width="3"/><path d="M87 507Q78 529 127 527L123 511Z M146 508Q146 532 190 523L181 505Z" fill="#eee7c5" stroke="#4c3432" stroke-width="3"/>
<path d="M84 336L81 422L133 423 136 375 140 422 188 422 184 336Z" fill="${shorts}" stroke="#344f4a" stroke-width="4"/><path d="M136 347L138 384" stroke="#345c4f" stroke-width="3"/>
<g class="arm-l"><path d="M81 241Q58 258 53 311L56 379Q65 396 80 378L91 304Z" fill="url(#skin)" stroke="#603b2f" stroke-width="3"/><ellipse cx="66" cy="386" rx="14" ry="24" fill="url(#skin)"/></g><g class="arm-r"><path d="M184 238Q209 246 214 301L209 378Q192 392 186 376L176 298Z" fill="url(#skin)" stroke="#603b2f" stroke-width="3"/><ellipse cx="202" cy="384" rx="14" ry="24" fill="url(#skin)"/></g>
<path d="M104 216Q130 205 160 214Q184 221 187 249L184 354Q134 364 82 354L83 246Q88 219 104 216Z" fill="url(#shirt)" stroke="#9f6038" stroke-width="4"/><path d="M95 222Q69 228 64 279L85 284 102 247Z M173 220Q201 227 207 279L185 284 169 245Z" fill="${shirt[0]}" stroke="#9f6038" stroke-width="3"/>${badge}
<path d="M109 194L109 223Q134 239 161 221L157 193Z" fill="url(#skin)" stroke="#6b3a30" stroke-width="3"/><ellipse cx="84" cy="155" rx="14" ry="21" fill="url(#skin)"/><ellipse cx="186" cy="155" rx="14" ry="21" fill="url(#skin)"/><path d="M84 118Q83 83 134 78Q182 79 187 119L181 177Q173 211 137 216Q97 207 88 172Z" fill="url(#skin)" stroke="#653b30" stroke-width="3"/>
${hair}<path d="M137 157L134 177 141 179" stroke="#99593e" stroke-width="3" fill="none"/></g>`;

const nanaHair = `<path d="M83 140Q61 131 71 111Q59 90 82 80Q80 60 104 57Q114 37 135 52Q159 35 166 59Q190 50 193 75Q220 84 198 110Q203 133 182 141L176 103Q139 111 95 101Z" fill="#262026" stroke="#3a2930" stroke-width="3"/><circle cx="92" cy="76" r="12" fill="#36272d"/><circle cx="117" cy="58" r="14" fill="#33262b"/><circle cx="151" cy="60" r="13" fill="#36272d"/><circle cx="177" cy="73" r="13" fill="#33262b"/>`;
const kojoHair = `<path d="M84 122Q80 84 134 76Q186 80 187 122L180 108Q136 92 90 108Z" fill="#221c22" stroke="#3a2930" stroke-width="3"/>`;

const adultWoman = (skin: [string, string, string], dress: [string, string], dressStroke: string, sleeve: string, dots: string, hair: string, extra = '') =>
  `<defs>${grads(skin, dress)}</defs><g filter="url(#shade)"><path d="M83 436L83 512Q107 536 124 518L125 435Z M152 435L153 514Q174 532 192 512L190 434Z" fill="#5e324d"/><path d="M81 514Q94 535 124 521L118 509Z M153 513Q164 531 197 519L188 507Z" fill="#2c2331"/>
<path d="M95 211Q138 196 175 211Q190 225 200 261L222 450Q132 468 54 445L73 255Q77 225 95 211Z" fill="url(#shirt)" stroke="${dressStroke}" stroke-width="4"/>${dots}${extra}
<g class="arm-l"><path d="M77 233Q55 244 49 306L49 382Q56 398 69 385L89 301Z" fill="url(#skin)" stroke="#683a31" stroke-width="3"/><path d="M46 380Q44 416 61 420Q77 410 69 376Z" fill="url(#skin)" stroke="#683a31" stroke-width="3"/></g><g class="arm-r"><path d="M185 227Q215 236 222 293L228 357Q228 380 211 375L187 299Z" fill="url(#skin)" stroke="#683a31" stroke-width="3"/><path d="M207 366Q206 398 224 400Q238 389 225 356Z" fill="url(#skin)" stroke="#683a31" stroke-width="3"/></g>
<path d="M92 213Q71 216 57 269L87 282 108 231Z M165 208Q203 216 218 270L189 286 160 237Z" fill="${sleeve}" stroke="${dressStroke}" stroke-width="3"/><path d="M112 180L109 219Q138 245 162 218L158 182Z" fill="url(#skin)" stroke="#713d2f" stroke-width="3"/>
<ellipse cx="83" cy="149" rx="15" ry="22" fill="url(#skin)"/><ellipse cx="187" cy="149" rx="15" ry="22" fill="url(#skin)"/><path d="M84 101Q88 68 135 66Q180 70 187 109L182 154Q172 202 136 208Q96 206 87 162Z" fill="url(#skin)" stroke="#684333" stroke-width="3"/>
${hair}<circle cx="72" cy="160" r="8" fill="#efbd79"/><circle cx="193" cy="158" r="8" fill="#efbd79"/><path d="M136 148L131 168 142 168" stroke="#8c523d" stroke-width="3" fill="none"/></g>`;

const MUM_BODY = `<defs>${grads(['#cc8861', '#a85f46', '#874532'], ['#e5a56b', '#bd775a'])}</defs><g filter="url(#shade)">
<path d="M82 436 L81 516 Q100 535 119 514 L125 436Z" fill="#56313b"/><path d="M148 435 L157 516 Q180 532 195 509 L188 431Z" fill="#50313b"/><path d="M78 515 Q79 534 116 529 L123 518 L92 509Z" fill="#281e2b"/><path d="M155 517 Q173 536 200 518 L186 509Z" fill="#261c26"/>
<path d="M96 206 Q112 197 154 201 Q179 202 188 235 L220 447 Q137 469 52 443 L81 234Q82 215 96 206Z" fill="url(#shirt)" stroke="#522f45" stroke-width="4"/>
<path d="M111 220 Q133 235 151 215 L164 445 M95 249 L75 442" stroke="#e5a16e" stroke-width="4" fill="none" opacity=".65"/>
<g fill="#ffd3a0" opacity=".8"><path d="M92 296l13 -16 12 17 -14 15z M151 319l13 -16 13 17 -14 15z M100 398l13 -16 12 17 -14 15z M179 407l12 -15 12 18 -13 14z"/><circle cx="160" cy="258" r="8"/><circle cx="107" cy="347" r="8"/><circle cx="179" cy="369" r="8"/></g>
<g class="arm-l"><path d="M85 219 Q62 225 61 263L51 355Q52 375 67 371L89 266Z" fill="url(#skin)" stroke="#583026" stroke-width="3"/><path d="M49 349Q45 383 58 401Q76 403 70 368Z" fill="url(#skin)" stroke="#643b2f" stroke-width="2"/></g><g class="arm-r"><path d="M182 215 Q207 218 210 257 L219 353Q221 374 206 375L181 267Z" fill="url(#skin)" stroke="#583026" stroke-width="3"/><path d="M202 365Q196 399 213 400Q227 391 219 354Z" fill="url(#skin)" stroke="#643b2f" stroke-width="2"/></g>
<path d="M93 203Q67 209 62 249L83 264Q89 247 98 235Z" fill="#dc9869" stroke="#522f45" stroke-width="3"/><path d="M169 201Q201 210 210 246L187 268 174 230Z" fill="#df9c6b" stroke="#522f45" stroke-width="3"/>
<path d="M107 175 L108 215Q135 241 163 213L156 172Z" fill="url(#skin)" stroke="#653829" stroke-width="3"/>
<ellipse cx="80" cy="147" rx="16" ry="22" fill="url(#skin)"/><ellipse cx="184" cy="146" rx="16" ry="22" fill="url(#skin)"/><path d="M84 96 Q89 63 133 63Q180 63 184 99L181 153Q176 197 137 207Q99 205 87 166Z" fill="url(#skin)" stroke="#603e36" stroke-width="3"/>
<path d="M80 132Q54 93 74 62Q88 46 104 47Q99 22 125 28Q139 9 161 32Q186 28 194 62Q213 90 186 132L182 96Q131 110 84 96Z" fill="#be674d" stroke="#6d3b43" stroke-width="4"/><path d="M83 77Q123 50 183 77 M104 47Q147 63 175 94" stroke="#e8a56d" stroke-width="12" fill="none"/><path d="M88 92Q138 65 180 99" stroke="#7b3d45" stroke-width="4" fill="none"/>
<path d="M135 143L129 162Q134 168 142 164" stroke="#8a4b36" stroke-width="3" fill="none"/>
<circle cx="75" cy="159" r="5" fill="#eecb76"/><circle cx="191" cy="159" r="5" fill="#eecb76"/></g>`;

const DAD_BODY = `<defs>${grads(['#b98062', '#8a5746', '#703c32'], ['#dfd6b2', '#9ea98c'])}</defs><g filter="url(#shade)"><path d="M90 402L83 518Q97 537 119 516L132 409Z" fill="#4e4650" stroke="#352931" stroke-width="3"/><path d="M137 409L153 520Q176 537 188 513L180 398Z" fill="#4e4650" stroke="#352931" stroke-width="3"/><path d="M81 519Q93 536 123 526L126 514 93 512Z M150 516Q160 534 195 523L185 508 163 508Z" fill="#271f27"/>
<g class="arm-l"><path d="M79 235Q55 240 54 296L61 386Q63 401 80 393L95 288Z" fill="url(#skin)" stroke="#59352f" stroke-width="3"/><path d="M61 379Q56 412 75 420Q89 408 78 383Z" fill="url(#skin)" stroke="#59352f" stroke-width="2"/></g><g class="arm-r"><path d="M189 232Q215 238 215 293L210 389Q202 402 188 389L174 287Z" fill="url(#skin)" stroke="#59352f" stroke-width="3"/><path d="M190 382Q180 413 198 420Q217 412 211 381Z" fill="url(#skin)" stroke="#59352f" stroke-width="2"/></g>
<path d="M104 204Q132 199 166 202Q186 203 193 236L187 406Q143 424 81 404L83 238Q86 213 104 204Z" fill="url(#shirt)" stroke="#4c423e" stroke-width="4"/><path d="M121 205L132 246 148 206" fill="#ede2c8" stroke="#775948" stroke-width="3"/><path d="M134 239L135 396" stroke="#6e7a64" stroke-width="2"/><g fill="#a5ab8a"><circle cx="136" cy="268" r="2.4"/><circle cx="136" cy="300" r="2.4"/><circle cx="136" cy="332" r="2.4"/></g><path d="M92 214Q68 213 62 260L84 274 104 230Z M171 211Q202 211 210 260L186 275 164 227Z" fill="#d2cba8" stroke="#5b5c51" stroke-width="3"/>
<path d="M111 166L111 210Q137 233 161 209L157 168Z" fill="url(#skin)" stroke="#704431" stroke-width="3"/>
<ellipse cx="81" cy="136" rx="15" ry="21" fill="url(#skin)"/><ellipse cx="188" cy="136" rx="15" ry="21" fill="url(#skin)"/><path d="M82 98Q82 57 136 58Q186 57 188 98L183 148Q174 191 135 195Q97 193 87 151Z" fill="url(#skin)" stroke="#6b4635" stroke-width="3"/>
<path d="M83 117Q68 85 87 65Q107 45 145 50Q188 49 191 93L186 114 178 79Q142 89 91 81Z" fill="#29242a"/><path d="M89 78Q131 61 179 75" fill="none" stroke="#504044" stroke-width="4"/>
<path d="M137 134L131 156 140 160" fill="none" stroke="#764832" stroke-width="3"/><path d="M112 166Q135 172 160 166" fill="none" stroke="#403030" stroke-width="6" stroke-linecap="round"/></g>`;

// Glasses are drawn over the generated eyes.
export const DAD_GLASSES = `<rect x="97" y="125" width="32" height="21" rx="7" fill="#302b32" fill-opacity=".12" stroke="#372e30" stroke-width="4"/><rect x="144" y="125" width="32" height="21" rx="7" fill="#302b32" fill-opacity=".12" stroke="#372e30" stroke-width="4"/><path d="M129 133Q136 130 144 133 M98 131L84 127M175 130L186 125" fill="none" stroke="#372e30" stroke-width="4"/>`;

const AUNTIE_HAIR = `<path d="M78 126Q59 111 68 84Q54 62 79 50Q86 25 107 29Q124 11 141 31Q172 16 178 41Q205 36 209 62Q229 85 194 130L179 97Q137 105 91 95Z" fill="#31272d" stroke="#4d2f35" stroke-width="4"/><path d="M85 80Q145 54 185 83" stroke="#b85a77" stroke-width="15" fill="none"/>`;
const AUNTIE_DOTS = `<g fill="#ebb97e" opacity=".75"><circle cx="103" cy="276" r="15"/><circle cx="164" cy="313" r="15"/><circle cx="123" cy="380" r="15"/><circle cx="185" cy="399" r="13"/></g><g fill="#8d446a"><circle cx="103" cy="276" r="7"/><circle cx="164" cy="313" r="7"/><circle cx="123" cy="380" r="7"/><circle cx="185" cy="399" r="7"/></g>`;
// Sister Akos: headscarf, print dress and a kiosk apron.
const AKOS_SCARF = `<path d="M76 128Q56 92 76 62Q96 34 136 36Q180 36 196 66Q212 98 192 130L183 100Q136 86 88 100Z" fill="#2f7d6d" stroke="#1f4d48" stroke-width="4"/><path d="M80 78Q136 52 192 80" stroke="#f0c45a" stroke-width="7" fill="none"/><path d="M188 66Q214 52 222 70Q212 84 194 80Z" fill="#2f7d6d" stroke="#1f4d48" stroke-width="3"/>`;
const AKOS_DOTS = `<g fill="#f0c45a" opacity=".85"><path d="M96 262l10 -12 10 12 -10 12z M160 300l10 -12 10 12 -10 12z M110 372l10 -12 10 12 -10 12z M178 392l10 -12 10 12 -10 12z"/></g>`;
const AKOS_APRON = `<path d="M96 262Q138 252 178 262L190 430Q138 446 84 430Z" fill="#f4ead6" stroke="#8b7a64" stroke-width="3"/><path d="M110 330Q138 338 166 330L168 372Q138 380 108 372Z" fill="#e7d9bd" stroke="#8b7a64" stroke-width="2"/>`;
const NANA_BADGE = `<ellipse cx="135" cy="296" rx="36" ry="31" fill="#f7e4a1"/><path d="M114 289l16 11 27 -19" fill="none" stroke="#d28c54" stroke-width="7" stroke-linecap="round"/>`;
const KOJO_BADGE = `<path d="M84 262L186 262 M84 300L186 300 M84 338L186 338" stroke="#f3efe2" stroke-width="12"/><text x="135" y="322" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="40" fill="#b8332f">10</text>`;

export const CHARACTERS: Record<string, Character> = {
  mum: {
    id: 'mum', name: 'Mummy', speakers: ['Mummy'], kind: 'adult', accent: '#b0583f', body: MUM_BODY,
    face: { lx: 116, rx: 157, ey: 142, by: 124, mx: 136, my: 181, mw: 22, skin: '#b56f50', ink: '#33232a', lip: '#682d34' },
  },
  dad: {
    id: 'dad', name: 'Daddy', speakers: ['Daddy'], kind: 'adult', accent: '#5b6b4f', body: DAD_BODY,
    face: { lx: 113, rx: 160, ey: 135, by: 117, mx: 136, my: 176, mw: 22, skin: '#9d6a52', ink: '#29242a', lip: '#49302d', glasses: true },
  },
  child: {
    id: 'child', name: 'Nana', speakers: ['Nana'], kind: 'child', accent: '#c4813b',
    body: childBody(['#d69369', '#ab6749', '#864b38'], ['#f9da81', '#e6a951'], '#547f67', nanaHair, NANA_BADGE),
    face: { lx: 115, rx: 158, ey: 154, by: 142, mx: 137, my: 194, mw: 22, skin: '#c07c58', ink: '#3a292a', lip: '#6e3531' },
  },
  auntie: {
    id: 'auntie', name: 'Auntie Efua', speakers: ['Auntie Efua', 'Auntie'], kind: 'adult', accent: '#8c506d',
    body: adultWoman(['#bd8564', '#9a644b', '#80513b'], ['#c17c93', '#8c506d'], '#573953', '#b85b77', AUNTIE_DOTS, AUNTIE_HAIR),
    face: { lx: 114, rx: 158, ey: 145, by: 127, mx: 137, my: 185, mw: 24, skin: '#a87052', ink: '#39262b', lip: '#7d2e40' },
  },
  akos: {
    id: 'akos', name: 'Sister Akos', speakers: ['Sister Akos'], kind: 'adult', accent: '#2f7d6d',
    body: adultWoman(['#a9714f', '#875540', '#6c4130'], ['#3f8f7c', '#285e55'], '#1f4d48', '#2f7d6d', AKOS_DOTS, AKOS_SCARF, AKOS_APRON),
    face: { lx: 114, rx: 158, ey: 145, by: 128, mx: 137, my: 185, mw: 22, skin: '#94603f', ink: '#2c1f22', lip: '#6b2a33' },
  },
  kojo: {
    id: 'kojo', name: 'Kojo', speakers: ['Kojo'], kind: 'child', accent: '#3d6fa8',
    body: childBody(['#9c6346', '#7a4a35', '#5f3828'], ['#4f7fc0', '#2f5a93'], '#6b5440', kojoHair, KOJO_BADGE),
    face: { lx: 115, rx: 158, ey: 154, by: 142, mx: 137, my: 194, mw: 22, skin: '#8a5a40', ink: '#2a1e20', lip: '#5a2a28' },
  },
  // Voices without a cut-out on stage.
  tv: { id: 'tv', name: 'On the television', speakers: ['TV'], kind: 'adult', accent: '#3f6c86' },
  neighbour: { id: 'neighbour', name: 'A neighbour', speakers: ['Neighbour'], kind: 'adult', accent: '#7a6a5a' },
  kojomum: { id: 'kojomum', name: "Kojo's Mother", speakers: ["Kojo's Mother"], kind: 'adult', accent: '#3d6fa8' },
  everybody: { id: 'everybody', name: 'Everybody', speakers: ['Everybody'], kind: 'adult', accent: '#b0583f' },
};

const SPEAKERS = new Map<string, Character>();
for (const c of Object.values(CHARACTERS)) for (const s of c.speakers) SPEAKERS.set(s.toLowerCase(), c);

/** Split "Mummy: Sit properly." into speaker + text. Unknown prefixes are narration. */
export function parseLine(raw: string): { speaker: Character | null; text: string } {
  const m = raw.match(/^([A-Z][\w' ]{0,24}):\s+(.*)$/s);
  const c = m && SPEAKERS.get(m[1].toLowerCase());
  return c ? { speaker: c, text: m![2].trim() } : { speaker: null, text: raw.trim() };
}

// ---------------------------------------------------------------------------
// Expression rig
// ---------------------------------------------------------------------------
type Eyes = 'open' | 'side' | 'happy' | 'tight' | 'wide' | 'narrow' | 'stare';
type Brows = 'neutral' | 'raised' | 'angry' | 'worried' | 'flat' | 'skeptic';
type Mouth = 'neutral' | 'smile' | 'grin' | 'laugh' | 'frown' | 'o' | 'flat' | 'smirk' | 'wobble' | 'tight' | 'shout';

export const EXPRESSIONS: Record<string, [Eyes, Brows, Mouth]> = {
  neutral: ['open', 'neutral', 'neutral'],
  happy: ['open', 'raised', 'smile'],
  delight: ['happy', 'raised', 'grin'],
  laugh: ['happy', 'raised', 'laugh'],
  proud: ['happy', 'neutral', 'smile'],
  smile: ['open', 'neutral', 'smirk'],
  smug: ['narrow', 'skeptic', 'smirk'],
  flat: ['narrow', 'flat', 'flat'],
  sideeye: ['side', 'skeptic', 'flat'],
  angry: ['narrow', 'angry', 'shout'],
  shock: ['wide', 'raised', 'o'],
  worried: ['open', 'worried', 'wobble'],
  sad: ['open', 'worried', 'frown'],
  hurt: ['open', 'worried', 'frown'],
  eyesclosed: ['tight', 'worried', 'tight'],
  focused: ['narrow', 'flat', 'neutral'],
  stare: ['stare', 'raised', 'flat'],
  strain: ['tight', 'angry', 'tight'],
};

function eyes(f: FaceRig, kind: Eyes): string {
  const one = (x: number) => {
    const y = f.ey;
    switch (kind) {
      case 'happy':
        return `<path d="M${x - 8} ${y + 3}Q${x} ${y - 7} ${x + 8} ${y + 3}" stroke="${f.ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
      case 'tight':
        return `<path d="M${x - 8} ${y}Q${x} ${y + 4} ${x + 8} ${y}M${x - 9} ${y - 5}L${x - 5} ${y - 2}M${x + 9} ${y - 5}L${x + 5} ${y - 2}" stroke="${f.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      case 'wide':
        return `<circle cx="${x}" cy="${y}" r="10" fill="#fff6e6" stroke="${f.ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="4.5" fill="#201b20"/>`;
      case 'stare':
        return `<circle cx="${x}" cy="${y}" r="9" fill="#fff6e6" stroke="${f.ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="2.2" fill="#201b20"/>`;
      case 'side':
        return `<ellipse cx="${x + 4}" cy="${y + 1}" rx="6" ry="6.5" fill="#201b20"/><path d="M${x - 8} ${y - 6}H${x + 9}V${y - 1}H${x - 8}Z" fill="${f.skin}"/><path d="M${x - 9} ${y - 1}H${x + 10}" stroke="${f.ink}" stroke-width="4" stroke-linecap="round"/>`;
      case 'narrow':
        return `<ellipse cx="${x}" cy="${y + 1}" rx="6" ry="5" fill="#201b20"/><path d="M${x - 8} ${y - 6}H${x + 8}V${y - 1}H${x - 8}Z" fill="${f.skin}"/><path d="M${x - 9} ${y - 1}Q${x} ${y - 3} ${x + 9} ${y - 1}" stroke="${f.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      default:
        return `<ellipse cx="${x}" cy="${y}" rx="6" ry="8" fill="#201b20"/><circle cx="${x + 2}" cy="${y - 3}" r="2.4" fill="#fff0d2"/>`;
    }
  };
  const blink = kind === 'open' || kind === 'side' || kind === 'narrow' || kind === 'wide';
  return `<g class="eyes${blink ? ' blinks' : ''}">${one(f.lx)}${one(f.rx)}</g>`;
}

function brows(f: FaceRig, kind: Brows): string {
  const b = (x: number, side: -1 | 1) => {
    const y = f.by;
    const inner = x - side * 11; // end nearest the nose
    const outer = x + side * 11;
    switch (kind) {
      case 'raised':
        return `M${outer} ${y - 4}Q${x} ${y - 15} ${inner} ${y - 6}`;
      case 'angry':
        return `M${outer} ${y - 6}Q${x} ${y - 6} ${inner} ${y + 3}`;
      case 'worried':
        return `M${outer} ${y + 1}Q${x} ${y - 4} ${inner} ${y - 8}`;
      case 'flat':
        return `M${outer} ${y - 2}L${inner} ${y - 2}`;
      case 'skeptic':
        return side < 0 ? `M${outer} ${y - 7}Q${x} ${y - 15} ${inner} ${y - 7}` : `M${outer} ${y - 1}L${inner} ${y}`;
      default:
        return `M${outer} ${y + 1}Q${x} ${y - 8} ${inner} ${y + 1}`;
    }
  };
  return `<path class="brows" d="${b(f.lx, -1)} ${b(f.rx, 1)}" stroke="${f.ink}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
}

function mouth(f: FaceRig, kind: Mouth): string {
  const { mx: x, my: y, mw: w, lip } = f;
  const line = (d: string, sw = 4) => `<path d="${d}" stroke="${lip}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  switch (kind) {
    case 'smile':
      return line(`M${x - w} ${y - 3}Q${x} ${y + 12} ${x + w} ${y - 3}`);
    case 'grin':
      return `<path d="M${x - w} ${y - 4}Q${x} ${y + 18} ${x + w} ${y - 4}Z" fill="#5a2228" stroke="${lip}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - w + 4} ${y - 2}H${x + w - 4}" stroke="#fff2df" stroke-width="4"/>`;
    case 'laugh':
      return `<path d="M${x - w - 2} ${y - 6}Q${x} ${y + 26} ${x + w + 2} ${y - 6}Z" fill="#5a2228" stroke="${lip}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 9} ${y + 10}Q${x} ${y + 3} ${x + 9} ${y + 10}" fill="#d0676c"/><path d="M${x - w + 2} ${y - 4}H${x + w - 2}" stroke="#fff2df" stroke-width="4"/>`;
    case 'frown':
      return line(`M${x - w + 4} ${y + 6}Q${x} ${y - 6} ${x + w - 4} ${y + 6}`);
    case 'o':
      return `<ellipse cx="${x}" cy="${y + 4}" rx="8" ry="11" fill="#5a2228" stroke="${lip}" stroke-width="3"/>`;
    case 'flat':
      return line(`M${x - w + 6} ${y + 1}H${x + w - 6}`);
    case 'smirk':
      return line(`M${x - w + 4} ${y + 2}Q${x + 2} ${y + 6} ${x + w} ${y - 5}`);
    case 'wobble':
      return line(`M${x - w + 4} ${y + 2}q6 -5 11 0t11 0t11 0`, 3.5);
    case 'tight':
      return line(`M${x - 9} ${y + 2}H${x + 9}`, 5);
    case 'shout':
      return `<path d="M${x - w + 2} ${y + 6}Q${x} ${y - 10} ${x + w - 2} ${y + 6}Q${x} ${y + 16} ${x - w + 2} ${y + 6}Z" fill="#5a2228" stroke="${lip}" stroke-width="3"/>`;
    default:
      return line(`M${x - w} ${y - 1}Q${x} ${y + 7} ${x + w} ${y - 2}`);
  }
}

/** Face markup (eyes, brows, mouth + talking mouth) for one expression. */
export function faceSvg(c: Character, expression: string): string {
  const f = c.face!;
  const [e, b, m] = EXPRESSIONS[expression] || EXPRESSIONS.neutral;
  const talk = `<ellipse class="mouth-talk" cx="${f.mx}" cy="${f.my + 3}" rx="${f.mw * 0.45}" ry="7" fill="#5a2228" stroke="${f.lip}" stroke-width="3"/>`;
  return `${eyes(f, e)}${f.glasses ? DAD_GLASSES : ''}${brows(f, b)}<g class="mouth">${mouth(f, m)}</g>${talk}`;
}

/** Full character SVG with ids namespaced so several can share one document. */
export function characterSvg(c: Character, expression = 'neutral', idPrefix = c.id): string {
  const body = c.body!.replace(/id="(\w+)"/g, `id="${idPrefix}-$1"`).replace(/url\(#(\w+)\)/g, `url(#${idPrefix}-$1)`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 540" aria-hidden="true" focusable="false">${body}<g class="face">${faceSvg(c, expression)}</g></svg>`;
}
