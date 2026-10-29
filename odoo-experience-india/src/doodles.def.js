// Odoo Experience India — doodle set.
// Drawn on a 96 x 96 grid in the Odoo doodle language: a hand-drawn ink outline,
// a flat palette fill offset down-right, and a short white shine inside.
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
const flowerPetals = (cx, cy, rot, len, w) => [0, 72, 144, 216, 288].map((d) => petal(cx, cy, d + rot, 2.5, len, w));

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
      'M33 24.5 L35.8 56.5', 'M63 24.5 L60.2 56.5',
      ellipse(48, 60, 28, 6),
      'M20 60.5 C21 70 27 76.5 38 77 L58 77 C69 76.5 75 70 76 60.5',
      'M42 16 C38.5 12.5 45.5 10.5 42 5.5', 'M54 16 C50.5 12.5 57.5 10.5 54 5.5',
    ],
    shine: ['M38.5 31 L39.8 49'],
  },
  {
    id: 'auto-rickshaw', label: 'Auto-rickshaw', region: 'Bengaluru', fill: 'teal',
    note: 'Side view, facing right. Meter down.',
    fills: ['M14 62 L14 34 C14 24 20 19.5 30 19.5 L62 19.5 C68 19.5 72 22.5 74 27.5 L78 44 L84.5 52 C86.5 55 85.5 60.5 81.5 62 Z'],
    lines: [
      'M14 61 L14 34 C14 24 20 19.5 30 19.5 L62 19.5 C68 19.5 72 22.5 74 27.5 L78 44',
      'M78 44 L84.5 52 C86.5 55 85.5 60.5 81.5 62 L34 62',
      'M20 62 L14 62',
      'M22 50 L22 30 C22 27.5 23.5 26.5 26 26.5 L50 26.5 L50 50',
      'M56 26.5 L66 26.5 L71.5 44 L56 44 Z',
      'M14 52 L56 52',
      circle(27, 65, 7), circle(72, 65, 7),
    ],
    shine: ['M19 31 C19 27 21 25 24 24.5'],
  },
  {
    id: 'vidhana-soudha', label: 'Vidhana Soudha', region: 'Bengaluru', fill: 'cyan',
    note: 'Central dome, colonnade and steps, simplified to a doodle.',
    fills: ['M14 72 L14 42 L36 42 L36 36 C37 26 59 26 60 36 L60 42 L82 42 L82 72 Z'],
    lines: [
      'M38 36 C38.5 27.5 57.5 27.5 58 36', 'M48 28.5 L48 20', circle(48, 17.5, 2.5),
      'M35.5 36.5 L60.5 36.5', 'M37 36.5 L37 42', 'M59 36.5 L59 42',
      'M12 42.5 L84 42.5', 'M16 43 L16 72', 'M80 43 L80 72',
      'M18 42 C18.5 35.5 25.5 35.5 26 42', 'M70 42 C70.5 35.5 77.5 35.5 78 42',
      'M28 49 L28 67', 'M38 49 L38 67', 'M48 49 L48 67', 'M58 49 L58 67', 'M68 49 L68 67',
      'M10 72.5 L86 72.5', 'M15 78 L81 78',
    ],
    shine: ['M41 34 C42 31.5 44 30.5 46 30'],
  },
  {
    id: 'namma-metro', label: 'Namma Metro', region: 'Bengaluru', fill: 'purple',
    note: 'Front of a metro car. The Purple Line is already on brand.',
    fills: ['M26 70 L26 28 C26 19 32 14 41 14 L55 14 C64 14 70 19 70 28 L70 70 C70 73 68 75 65 75 L31 75 C28 75 26 73 26 70 Z'],
    lines: [
      'M26 70 L26 28 C26 19 32 14 41 14 L55 14 C64 14 70 19 70 28 L70 70 C70 73 68 75 65 75 L31 75 C28 75 26 73 26 70 Z',
      'M31.5 24.5 C31.5 21.5 33 20.5 36 20.5 L60 20.5 C63 20.5 64.5 21.5 64.5 24.5 L64.5 40 L31.5 40 Z',
      'M26 47.5 L70 47.5', 'M26 52.5 L70 52.5',
      circle(35, 61.5, 3.2), circle(61, 61.5, 3.2),
      'M31 75.5 L31 81', 'M65 75.5 L65 81', 'M14 82.5 L82 82.5',
    ],
    shine: ['M35 25 L35 35'],
  },
  {
    id: 'coconut-palm', label: 'Coconut palm', region: 'South India', fill: 'teal',
    note: 'Leaning trunk, six fronds, two coconuts.',
    fills: [
      'M54 32 C46 22 32 20 18 30 C32 28 44 30 54 32 Z',
      'M54 32 C50 18 58 10 70 8 C64 16 60 24 54 32 Z',
      'M54 32 C64 24 78 24 86 34 C76 30 64 30 54 32 Z',
      'M54 32 C46 34 38 42 36 54 C42 44 48 38 54 32 Z',
      'M54 32 C62 36 70 44 72 54 C66 46 60 40 54 32 Z',
      'M54 32 C46 20 40 12 30 8 C40 14 48 22 54 32 Z',
    ],
    lines: [
      'M44 86 C46 68 49.5 52 51.5 38', 'M52.5 86 C53.5 68 55.5 52 57 38',
      'M45.5 76 L52.5 75', 'M47 66 L53.5 65', 'M48.5 56 L54.5 55', 'M50 46 L55.5 45',
      'M54 32 C46 22 32 20 18 30 C32 28 44 30 54 32 Z',
      'M54 32 C50 18 58 10 70 8 C64 16 60 24 54 32 Z',
      'M54 32 C64 24 78 24 86 34 C76 30 64 30 54 32 Z',
      'M54 32 C46 34 38 42 36 54 C42 44 48 38 54 32 Z',
      'M54 32 C62 36 70 44 72 54 C66 46 60 40 54 32 Z',
      'M54 32 C46 20 40 12 30 8 C40 14 48 22 54 32 Z',
      circle(50.5, 38, 3.4), circle(57.5, 39, 3.4),
    ],
    shine: [],
  },
  {
    id: 'mallige', label: 'Mysuru mallige', region: 'Karnataka', fill: 'yellow',
    note: 'Jasmine flower and buds, the way it is strung for the hair.',
    fills: [...flowerPetals(38, 52, -90, 21, 6.5)],
    lines: [
      ...flowerPetals(38, 52, -90, 21, 6.5),
      circle(38, 52, 3.2),
      'M52 62 C62 58 68 50 70 34',
      'M70 34 C66 28 67.5 20 71 16 C74.5 20 75.5 28 70 34 Z',
      'M63 53 C69 51.5 75 47.5 80 42.5 C78.5 49 73 53 63 53 Z',
    ],
    shine: [],
  },
  {
    id: 'masala-dosa', label: 'Masala dosa', region: 'Bengaluru', fill: 'yellow',
    note: 'Rolled dosa on a banana leaf, sambar and chutney in katoris.',
    fills: [
      'M16 53 L78 53 C82 53 82 65 78 65 L16 65 C10 65 10 53 16 53 Z',
      'M15 30 C15 38 19.5 42 26 42 C32.5 42 37 38 37 30 Z',
      'M45 30 C45 38 49.5 42 56 42 C62.5 42 67 38 67 30 Z',
    ],
    lines: [
      'M8 46 L74 46 C84 46 90 52 90 60 C90 68 84 74 74 74 L8 74 Z',
      'M8 49.5 L52 49.5',
      'M16 53 L78 53', 'M16 65 L78 65', 'M16 53 C10 53 10 65 16 65',
      ellipse(78, 59, 3.6, 6),
      'M31 56 L33.5 62', 'M45 56 L47.5 62', 'M59 56 L61.5 62',
      'M26 70.5 L29 68', 'M42 70.5 L45 68', 'M58 70.5 L61 68',
      ellipse(26, 30, 11, 3), 'M15 30.5 C15 38 19.5 42 26 42 C32.5 42 37 38 37 30.5',
      ellipse(56, 30, 11, 3), 'M45 30.5 C45 38 49.5 42 56 42 C62.5 42 67 38 67 30.5',
      'M56 22 C53.5 19.5 58.5 17.5 56 13.5',
    ],
    shine: ['M24 56.5 L40 56.5'],
  },
  {
    id: 'gopuram', label: 'Gopuram', region: 'South India', fill: 'red',
    note: 'Temple tower in tiers, finials on the barrel vault.',
    fills: ['M22 80 L31.5 30 C31.5 21 64.5 21 64.5 30 L74 80 Z'],
    lines: [
      'M17 80.5 L79 80.5', 'M23 80 L31.5 31', 'M73 80 L64.5 31',
      'M25.6 66 L70.4 66', 'M28.1 53 L67.9 53', 'M30.3 41 L65.7 41',
      'M30 31 C30 20.5 66 20.5 66 31 Z',
      'M40 22.5 L40 17.5', 'M48 21 L48 14.5', 'M56 22.5 L56 17.5',
      'M42 80 L42 74 C42 68 54 68 54 74 L54 80',
    ],
    shine: ['M33.5 34 L29.5 56'],
  },
  {
    id: 'kuthu-vilakku', label: 'Kuthu vilakku', region: 'South India', fill: 'yellow',
    note: 'The brass lamp lit to open an event. Three wicks.',
    fills: [
      'M28 82 L68 82 C68 76 60 72 48 72 C36 72 28 76 28 82 Z',
      'M27 40 C29 46 38 48.5 48 48.5 C58 48.5 67 46 69 40 Z',
      'M32 36 C28.5 32.5 29.5 27 32 22 C34.5 27 35.5 32.5 32 36 Z',
      'M48 33 C44 28.5 45 22 48 15.5 C51 22 52 28.5 48 33 Z',
      'M64 36 C60.5 32.5 61.5 27 64 22 C66.5 27 67.5 32.5 64 36 Z',
    ],
    lines: [
      'M28 82 L68 82 C68 76 60 72 48 72 C36 72 28 76 28 82 Z',
      'M45.5 72 L45.5 49', 'M50.5 72 L50.5 49',
      ellipse(48, 62, 6, 2.4),
      'M27 40 C29 46 38 48.5 48 48.5 C58 48.5 67 46 69 40 Z',
      'M32 36 C28.5 32.5 29.5 27 32 22 C34.5 27 35.5 32.5 32 36 Z',
      'M48 33 C44 28.5 45 22 48 15.5 C51 22 52 28.5 48 33 Z',
      'M64 36 C60.5 32.5 61.5 27 64 22 C66.5 27 67.5 32.5 64 36 Z',
    ],
    shine: ['M34 77 C37 75.5 40 75 43 75'],
  },
  {
    id: 'laptop-code', label: 'Laptop, code', region: 'Tech', fill: 'cyan',
    note: 'Open laptop with a code tag on screen.',
    fills: ['M22 56 L22 22 C22 20 23.5 19 26 19 L70 19 C72.5 19 74 20 74 22 L74 56 Z', 'M14 60 L82 60 L78 68 C77 69.5 76 70 74 70 L22 70 C20 70 19 69.5 18 68 Z'],
    lines: [
      'M22 56 L22 22 C22 20 23.5 19 26 19 L70 19 C72.5 19 74 20 74 22 L74 56',
      'M14 60 L82 60 L78 68 C77 69.5 76 70 74 70 L22 70 C20 70 19 69.5 18 68 Z',
      'M20 56.5 L76 56.5',
      'M42 60.5 L44 63.5 L52 63.5 L54 60.5',
      'M40 30 L32 37.5 L40 45', 'M56 30 L64 37.5 L56 45', 'M51 28 L45 47',
    ],
    shine: ['M27 24 L27 34'],
  },
  {
    id: 'git-branch', label: 'Branch and merge', region: 'Tech', fill: 'teal',
    note: 'A branch leaving main and merging back. Open source in one line.',
    fills: [circle(30, 20, 7), circle(30, 76, 7), circle(66, 34, 7)],
    lines: [
      circle(30, 20, 7), circle(30, 76, 7), circle(66, 34, 7),
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
      'M14 31.5 L82 31.5',
      circle(21, 25.8, 1.5), circle(27, 25.8, 1.5), circle(33, 25.8, 1.5),
      'M26 44 L36 51.5 L26 59', 'M42 61 L57 61',
    ],
    shine: ['M19 38 L19 50'],
  },
  {
    id: 'app-module', label: 'App module', region: 'Tech', fill: 'red',
    note: 'A puzzle piece. Every Odoo app is a module that clicks into the rest.',
    fills: ['M22 36 L39 36 C36 31 37 23 45 22 C53 21 56 30 52 36 L70 36 L70 51 C75 48 83 49 84 56 C85 63 76 66 70 62 L70 80 L22 80 Z'],
    lines: ['M22 36 L39 36 C36 31 37 23 45 22 C53 21 56 30 52 36 L70 36 L70 51 C75 48 83 49 84 56 C85 63 76 66 70 62 L70 80 L22 80 Z'],
    shine: ['M27 42 L27 54'],
  },
];
