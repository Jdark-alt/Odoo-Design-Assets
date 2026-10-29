// Odoo Experience India — doodle set, v2.
// Drawn on a 96 x 96 grid in the Odoo doodle language: a hand-drawn ink outline,
// a flat palette fill offset down-right, and a short white shine inside.
// v2: slimmer outline (3.2 on the grid) and no ink lines closer than about 8
// units apart, so the colour fill carries each doodle.
// `fills` are closed silhouettes (filled, offset), `lines` are ink strokes,
// `shine` are thin white strokes. All coordinates absolute.

const r = (n) => Math.round(n * 100) / 100;

function circle(cx, cy, rad) {
  return `M${r(cx - rad)} ${cy} A${rad} ${rad} 0 1 0 ${r(cx + rad)} ${cy} A${rad} ${rad} 0 1 0 ${r(cx - rad)} ${cy} Z`;
}
function ellipse(cx, cy, rx, ry) {
  return `M${r(cx - rx)} ${cy} A${rx} ${ry} 0 1 0 ${r(cx + rx)} ${cy} A${rx} ${ry} 0 1 0 ${r(cx - rx)} ${cy} Z`;
}
function petal(cx, cy, deg, r0, len, w) {
  const a = (deg * Math.PI) / 180, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
  const P = (s, t) => `${r(cx + u[0] * s + v[0] * t)} ${r(cy + u[1] * s + v[1] * t)}`;
  return `M${P(r0, 0)} C${P(len * 0.45, w)} ${P(len * 0.95, w * 0.8)} ${P(len, 0)} C${P(len * 0.95, -w * 0.8)} ${P(len * 0.45, -w)} ${P(r0, 0)} Z`;
}
const flowerPetals = (cx, cy, rot, len, w) => [0, 72, 144, 216, 288].map((d) => petal(cx, cy, d + rot, 3, len, w));

const FRONDS = [
  'M54 30 C46 20 32 18 18 29 C32 27 44 29 54 30 Z',
  'M54 30 C50 16 58 8 70 6 C64 15 60 23 54 30 Z',
  'M54 30 C64 22 78 22 86 33 C76 29 64 29 54 30 Z',
  'M54 30 C46 33 38 41 36 54 C42 44 48 37 54 30 Z',
  'M54 30 C62 34 70 42 72 54 C66 45 60 38 54 30 Z',
];

module.exports = [
  {
    id: 'filter-coffee', label: 'Filter coffee', region: 'Bengaluru', fill: 'yellow',
    note: 'Davara and tumbler. The city runs on it.',
    fills: [
      'M33 24 L63 24 L60.5 58 L35.5 58 Z',
      'M20 60 C21 70 27 76.5 38 77 L58 77 C69 76.5 75 70 76 60 C76 54 20 54 20 60 Z',
    ],
    lines: [
      ellipse(48, 24, 15, 4),
      'M33 24.5 L35.6 55', 'M63 24.5 L60.4 55',
      'M20 60 C24 56 31 55 35.6 55', 'M60.4 55 C65 55 72 56 76 60',
      'M20 60 C30 65.5 66 65.5 76 60',
      'M20 60.5 C21 70 27 76.5 38 77 L58 77 C69 76.5 75 70 76 60.5',
      'M42 16 C38.5 12.5 45.5 10.5 42 5.5', 'M54 16 C50.5 12.5 57.5 10.5 54 5.5',
    ],
    shine: ['M39 31 L40 48'],
  },
  {
    id: 'auto-rickshaw', label: 'Auto-rickshaw', region: 'Bengaluru', fill: 'teal',
    note: 'Side view, facing right, open at the side.',
    fills: ['M14 62 L14 34 C14 24 20 19.5 30 19.5 L62 19.5 C68 19.5 72 22.5 74 27.5 L78 44 L84.5 52 C86.5 55 85.5 60.5 81.5 62 Z'],
    lines: [
      'M14 61 L14 34 C14 24 20 19.5 30 19.5 L62 19.5 C68 19.5 72 22.5 74 27.5 L78 44',
      'M78 44 L84.5 52 C86.5 55 85.5 60.5 81.5 62 L36 62',
      'M18 62 L14 62',
      'M24 52 L24 31 C24 29 25 28 27 28 L54 28 L54 52 Z',
      circle(27, 65, 7.5), circle(72, 65, 7.5),
    ],
    shine: ['M19 32 C19 28 21 26 24 25'],
  },
  {
    id: 'vidhana-soudha', label: 'Vidhana Soudha', region: 'Bengaluru', fill: 'cyan',
    note: 'Central dome over a colonnade, simplified to a doodle.',
    fills: ['M14 72 L14 42 L34 42 C34 22 62 22 62 42 L82 42 L82 72 Z'],
    lines: [
      'M35 42 C35.5 24 60.5 24 61 42', 'M48 25 L48 15',
      'M12 42.5 L84 42.5', 'M16 43 L16 72', 'M80 43 L80 72',
      'M18 42 C18.5 34 27.5 34 28 42', 'M68 42 C68.5 34 77.5 34 78 42',
      'M32 51 L32 66', 'M48 51 L48 66', 'M64 51 L64 66',
      'M9 72.5 L87 72.5',
    ],
    shine: ['M40 38 C40.5 33 42.5 30 45.5 28.5'],
  },
  {
    id: 'namma-metro', label: 'Namma Metro', region: 'Bengaluru', fill: 'purple',
    note: 'Front of a metro car. The Purple Line is already on brand.',
    fills: ['M26 70 L26 28 C26 19 32 14 41 14 L55 14 C64 14 70 19 70 28 L70 70 C70 73 68 75 65 75 L31 75 C28 75 26 73 26 70 Z'],
    lines: [
      'M26 70 L26 28 C26 19 32 14 41 14 L55 14 C64 14 70 19 70 28 L70 70 C70 73 68 75 65 75 L31 75 C28 75 26 73 26 70 Z',
      'M32.5 25 C32.5 22.5 34 21.5 36.5 21.5 L59.5 21.5 C62 21.5 63.5 22.5 63.5 25 L63.5 39 L32.5 39 Z',
      'M26 50 L70 50',
      circle(36, 62, 3.4), circle(60, 62, 3.4),
      'M14 82 L82 82',
    ],
    shine: ['M36.5 26 L36.5 34'],
  },
  {
    id: 'coconut-palm', label: 'Coconut palm', region: 'South India', fill: 'teal',
    note: 'Leaning trunk and five fronds.',
    fills: FRONDS,
    lines: [
      'M41 86 C43.5 68 47 52 50 36', 'M53 86 C54 68 56.5 52 58.5 36',
      'M44 72 L53.5 71', 'M46.5 56 L55.5 55',
      'M54 30 C46 20 32 18 18 29', 'M54 30 C50 16 58 8 70 6', 'M54 30 C64 22 78 22 86 33',
      'M54 30 C46 33 38 41 36 54', 'M54 30 C62 34 70 42 72 54',
    ],
    shine: [],
  },
  {
    id: 'mallige', label: 'Mysuru mallige', region: 'Karnataka', fill: 'yellow',
    note: 'Jasmine flower and buds, the way it is strung for the hair.',
    fills: [...flowerPetals(38, 52, -90, 23, 7.5)],
    lines: [
      ...flowerPetals(38, 52, -90, 23, 7.5),
      'M54 62 C63 58 69 50 71 34',
      'M71 34 C67 28 68.5 20 72 16 C75.5 20 76.5 28 71 34 Z',
    ],
    shine: [],
  },
  {
    id: 'masala-dosa', label: 'Masala dosa', region: 'Bengaluru', fill: 'yellow',
    note: 'Rolled dosa on a banana leaf, with a katori of sambar.',
    fills: [
      'M16 56 L76 56 C80 56 80 68 76 68 L16 68 C10 68 10 56 16 56 Z',
      'M27 30 C27 39 32 43 40 43 C48 43 53 39 53 30 Z',
    ],
    lines: [
      'M8 50 L74 50 C84 50 90 56 90 64 C90 72 84 78 74 78 L8 78 Z',
      'M16 56 L76 56', 'M76 68 L16 68', 'M16 56 C10 56 10 68 16 68',
      ellipse(76, 62, 3.6, 6),
      ellipse(40, 30, 13, 3.5), 'M27 30.5 C27 39 32 43 40 43 C48 43 53 39 53 30.5',
      'M40 22 C37.5 19.5 42.5 17.5 40 13.5',
    ],
    shine: ['M24 59.5 L44 59.5'],
  },
  {
    id: 'gopuram', label: 'Gopuram', region: 'South India', fill: 'red',
    note: 'Temple tower in tiers under a barrel vault.',
    fills: ['M22 80 L31.5 30 C31.5 21 64.5 21 64.5 30 L74 80 Z'],
    lines: [
      'M16 80.5 L80 80.5', 'M23 80 L31.5 31', 'M73 80 L64.5 31',
      'M26.4 62 L69.6 62', 'M29.4 46 L66.6 46',
      'M30 31 C30 20.5 66 20.5 66 31 Z',
      'M40 22 L40 15', 'M48 20.5 L48 12', 'M56 22 L56 15',
      'M42 80 L42 74 C42 67 54 67 54 74 L54 80',
    ],
    shine: ['M34 35 L30.5 54'],
  },
  {
    id: 'kuthu-vilakku', label: 'Kuthu vilakku', region: 'South India', fill: 'yellow',
    note: 'The brass lamp lit to open an event. Three wicks.',
    fills: [
      'M26 82 L70 82 C70 75 61 71 48 71 C35 71 26 75 26 82 Z',
      'M25 41 C27 48 37 50.5 48 50.5 C59 50.5 69 48 71 41 Z',
      'M30 36 C25.5 31.5 26.5 25 30 18 C33.5 25 34.5 31.5 30 36 Z',
      'M48 33 C43.5 28 44.5 20 48 12 C51.5 20 52.5 28 48 33 Z',
      'M66 36 C61.5 31.5 62.5 25 66 18 C69.5 25 70.5 31.5 66 36 Z',
    ],
    lines: [
      'M26 82 L70 82 C70 75 61 71 48 71 C35 71 26 75 26 82 Z',
      'M44 71 L44 51', 'M52 71 L52 51',
      'M25 41 C27 48 37 50.5 48 50.5 C59 50.5 69 48 71 41 Z',
      'M30 36 C25.5 31.5 26.5 25 30 18 C33.5 25 34.5 31.5 30 36 Z',
      'M48 33 C43.5 28 44.5 20 48 12 C51.5 20 52.5 28 48 33 Z',
      'M66 36 C61.5 31.5 62.5 25 66 18 C69.5 25 70.5 31.5 66 36 Z',
    ],
    shine: ['M33 77.5 C37 75.5 40 75 43 75'],
  },
  {
    id: 'laptop-code', label: 'Laptop, code', region: 'Tech', fill: 'cyan',
    note: 'Open laptop with a code tag on screen.',
    fills: ['M22 56 L22 22 C22 20 23.5 19 26 19 L70 19 C72.5 19 74 20 74 22 L74 56 Z', 'M13 64 L83 64 L78 72 L18 72 Z'],
    lines: [
      'M22 56 L22 22 C22 20 23.5 19 26 19 L70 19 C72.5 19 74 20 74 22 L74 56 Z',
      'M13 64 L83 64 L78 72 L18 72 Z',
      'M40 30 L32 37.5 L40 45', 'M56 30 L64 37.5 L56 45', 'M51 28 L45 47',
    ],
    shine: ['M27 25 L27 34'],
  },
  {
    id: 'git-branch', label: 'Branch and merge', region: 'Tech', fill: 'teal',
    note: 'A branch leaving main and merging back. Open source in one line.',
    fills: [circle(30, 20, 7.5), circle(30, 76, 7.5), circle(66, 34, 7.5)],
    lines: [
      circle(30, 20, 7.5), circle(30, 76, 7.5), circle(66, 34, 7.5),
      'M30 27.5 L30 68.5',
      'M66 41.5 C66 56 48 54 34 64',
    ],
    shine: [],
  },
  {
    id: 'terminal', label: 'Terminal', region: 'Tech', fill: 'red',
    note: 'A prompt waiting for the next command.',
    fills: ['M14 26 C14 22.5 16.5 20 20 20 L76 20 C79.5 20 82 22.5 82 26 L82 70 C82 73.5 79.5 76 76 76 L20 76 C16.5 76 14 73.5 14 70 Z'],
    lines: [
      'M14 26 C14 22.5 16.5 20 20 20 L76 20 C79.5 20 82 22.5 82 26 L82 70 C82 73.5 79.5 76 76 76 L20 76 C16.5 76 14 73.5 14 70 Z',
      'M14 32 L82 32',
      'M27 45 L37 52.5 L27 60', 'M43 62 L58 62',
    ],
    shine: ['M19 39 L19 51'],
  },
  {
    id: 'app-module', label: 'App module', region: 'Tech', fill: 'red',
    note: 'A puzzle piece. Every Odoo app is a module that clicks into the rest.',
    fills: ['M22 36 L39 36 C36 31 37 23 45 22 C53 21 56 30 52 36 L70 36 L70 51 C75 48 83 49 84 56 C85 63 76 66 70 62 L70 80 L22 80 Z'],
    lines: ['M22 36 L39 36 C36 31 37 23 45 22 C53 21 56 30 52 36 L70 36 L70 51 C75 48 83 49 84 56 C85 63 76 66 70 62 L70 80 L22 80 Z'],
    shine: ['M27 42 L27 54'],
  },
];
