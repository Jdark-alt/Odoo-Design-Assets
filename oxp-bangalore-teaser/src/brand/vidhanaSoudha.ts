// Vidhana Soudha, Bengaluru: front elevation as single-weight line art.
// Drawn for this video (not part of the brand kit). Each stroke carries a
// [start, end] window on a 0..1 trace clock, so the drawing can stop part-way
// (Scene 3 tease, ~55%: dome and central columns) and finish later (Scene 6).

export type MonumentStroke = { d: string; t: [number, number] };

export const MONUMENT_VIEWBOX = { w: 1200, h: 760 };
// Where the central dome sits, as a fraction of the viewBox (used to frame crops).
export const MONUMENT_DOME = { x: 600 / 1200, y: 200 / 760 };

const CX = 600;
const mirror = (d: string) =>
  d.replace(/([MLHVCQASTZmlhvcqastz])([^MLHVCQASTZmlhvcqastz]*)/g, (_, cmd: string, args: string) => {
    const n = args.trim().length ? args.trim().split(/[\s,]+/).map(Number) : [];
    const fx = (x: number) => +(2 * CX - x).toFixed(2);
    switch (cmd) {
      case 'H':
        return 'H' + n.map(fx).join(' ');
      case 'V':
      case 'v':
        return cmd + n.join(' ');
      case 'A': {
        // rx ry rot large sweep x y -> flip sweep, mirror x
        const out: number[] = [];
        for (let i = 0; i < n.length; i += 7) out.push(n[i], n[i + 1], n[i + 2], n[i + 3], n[i + 4] ? 0 : 1, fx(n[i + 5]), n[i + 6]);
        return 'A' + out.join(' ');
      }
      case 'h':
        return 'h' + n.map((v) => -v).join(' ');
      case 'Z':
      case 'z':
        return cmd;
      default: {
        if (cmd === cmd.toLowerCase()) {
          // relative coords other than h/v: negate x components
          return cmd + n.map((v, i) => (i % 2 === 0 ? -v : v)).join(' ');
        }
        return cmd + n.map((v, i) => (i % 2 === 0 ? fx(v) : v)).join(' ');
      }
    }
  });

const strokes: MonumentStroke[] = [];
const add = (d: string, t0: number, t1: number) => strokes.push({ d, t: [t0, t1] });
const addSym = (d: string, t0: number, t1: number) => {
  add(d, t0, t1);
  add(mirror(d), t0, t1);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---- 1. Main dome (the first thing to appear) ----
add('M515 262 C515 192 548 144 600 128 C652 144 685 192 685 262', 0.0, 0.1);
add('M600 128 C589 162 577 210 572 262', 0.04, 0.12);
add('M600 128 C611 162 623 210 628 262', 0.04, 0.12);
add('M600 128 C574 150 549 200 543 262', 0.06, 0.14);
add('M600 128 C626 150 651 200 657 262', 0.06, 0.14);
add('M503 262 H697 M510 272 H690', 0.08, 0.15);
// lantern, finial and the lion capital on top
add('M588 128 V112 H612 V128 M585 112 Q600 92 615 112', 0.1, 0.16);
add('M600 97 V78 M591 78 H609 M593 78 Q600 62 607 78', 0.12, 0.18);

// ---- 2. Drum with arched windows ----
addSym('M530 272 V330', 0.14, 0.2);
[556, 578, 600, 622, 644].forEach((x, i) =>
  add(`M${x - 6} 320 V298 A6 6 0 0 1 ${x + 6} 298 V320`, 0.16 + i * 0.012, 0.22 + i * 0.012),
);
add('M518 330 H682', 0.2, 0.26);

// ---- 3. Attic over the portico, with its two small domes ----
add('M488 356 V336 H712 V356', 0.22, 0.28);
[510, 540, 570, 630, 660, 690].forEach((x, i) =>
  add(`M${x - 6} 352 V342 H${x + 6} V352 Z`, 0.24 + i * 0.008, 0.29 + i * 0.008),
);
addSym('M452 356 C452 334 462 322 470 318 C478 322 488 334 488 356 M470 318 V304', 0.25, 0.32);

// ---- 4. Portico entablature ----
add('M408 356 H792', 0.28, 0.33);
add('M416 366 H784 M416 366 V388 M784 366 V388 M424 388 H776', 0.3, 0.36);

// ---- 5. Twelve granite columns, centre outwards ----
const cols = Array.from({ length: 12 }, (_, i) => lerp(440, 760, i / 11));
const order = [...cols].sort((a, b) => Math.abs(a - CX) - Math.abs(b - CX));
order.forEach((x, i) => {
  const t0 = 0.32 + Math.floor(i / 2) * 0.034;
  add(`M${(x - 8).toFixed(1)} 388 h16 v6 h-16 Z M${(x - 5).toFixed(1)} 394 V586 M${(x + 5).toFixed(1)} 394 V586 M${(x - 8).toFixed(1)} 586 h16 v6 h-16 Z`, t0, t0 + 0.07);
});
add('M418 592 H782', 0.5, 0.56);

// ---- 6. Grand staircase ----
addSym('M428 592 L378 720', 0.55, 0.6);
for (let i = 1; i <= 12; i++) {
  const y = 592 + i * 10;
  const k = (y - 592) / 128;
  const xl = lerp(428, 378, k);
  add(`M${xl.toFixed(1)} ${y} H${(2 * CX - xl).toFixed(1)}`, 0.56 + i * 0.007, 0.6 + i * 0.007);
}

// ---- 7. Wings: rooflines and floor bands ----
addSym('M408 372 H140 M416 382 H140', 0.58, 0.66);
addSym('M408 388 V720', 0.6, 0.66);
addSym('M140 472 H408 M140 560 H408', 0.62, 0.7);

// windows, three storeys, one compound path per row
const winXs = Array.from({ length: 8 }, (_, i) => 168 + i * 31);
const archRow = (y0: number, y1: number, w: number) =>
  winXs.map((x) => `M${x - w / 2} ${y1} V${y0 + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y0 + w / 2} V${y1}`).join(' ');
addSym(archRow(400, 452, 14), 0.66, 0.76);
addSym(archRow(488, 542, 14), 0.7, 0.8);
addSym(archRow(578, 650, 18), 0.74, 0.84);

// central bay of each wing, crowned by a small dome
addSym('M246 372 V346 H304 V372', 0.7, 0.76);
addSym('M252 346 C252 322 266 310 275 306 C284 310 298 322 298 346 M275 306 V290', 0.72, 0.8);

// ---- 8. Corner towers with chhatri domes ----
addSym('M140 720 V340 M80 720 V340 M72 340 H148', 0.78, 0.86);
addSym('M88 340 V312 M102 340 V312 M118 340 V312 M132 340 V312 M80 312 H140', 0.82, 0.88);
addSym('M84 312 C84 290 100 278 110 274 C120 278 136 290 136 312 M110 274 V258', 0.84, 0.92);
addSym('M103 420 V388 A7 7 0 0 1 117 388 V420 M103 520 V488 A7 7 0 0 1 117 488 V520 M103 640 V600 A7 7 0 0 1 117 600 V640', 0.86, 0.94);

// ---- 9. Plinth and ground ----
addSym('M60 700 H378', 0.9, 0.97);
add('M40 720 H1160', 0.92, 1.0);

export const MONUMENT_STROKES: MonumentStroke[] = strokes;
