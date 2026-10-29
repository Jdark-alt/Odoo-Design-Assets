// Scene 2 (0:06-0:08.5): "So we are back." takes the whole frame on the drop.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CUES, FONTS, FRAMES_PER_BEAT, b } from '../config';
import { useLayout } from '../lib/layout';
import { fitSize } from '../lib/fonts';
import { E, drift, mix, onBeats, pop, prog, punch, rng } from '../lib/motion';
import { KText, layoutChars, textWidth } from '../components/KText';
import { At, SceneWindow } from '../components/Scene';
import { teaseType } from './shared';

const C = CUES.drop;

// ink ascent of each line (fraction of the font size): caps, x-height, ascenders
const LINES = [
  { text: 'So we', weight: 700, asc: 0.73, from: -1 },
  { text: 'are', weight: FONTS.weight.light, asc: 0.55, from: 1 },
  { text: 'back.', weight: 700, asc: 0.76, from: -1 },
];
const TRACK = -0.03;

export const Scene2Drop: React.FC = () => (
  <SceneWindow id="drop">
    <Drop />
  </SceneWindow>
);

const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const fDrop = b(C.drop);
  const fCollapse = Math.round(b(C.collapse));
  const fHandoff = b(CUES.tease.butThisTime);
  if (f < fDrop || f >= fHandoff) return null;

  // fit each line edge to edge
  let sizes = LINES.map((l) => fitSize(l.text, L.box.w, l.weight, FONTS.sans, TRACK));
  const gap = 0.1;
  const inkH = (ss: number[]) => ss.reduce((acc, s, i) => acc + LINES[i].asc * s, 0) + gap * (ss[0] + ss[1]);
  const maxH = L.box.h * 0.94;
  if (inkH(sizes) > maxH) {
    const k = maxH / inkH(sizes);
    sizes = sizes.map((s) => s * k);
  }
  let base = L.box.y + (L.box.h - inkH(sizes)) / 2;
  const tops = sizes.map((s, i) => {
    base += LINES[i].asc * s + (i > 0 ? gap * sizes[i - 1] : 0);
    return base - 0.863 * s; // KText box top, from the baseline
  });

  // the drop: hard scale punch, lines slam in from alternating sides
  const slam = pop(f, fDrop, { damping: 15, stiffness: 300, mass: 0.55 });
  const settle = 1 - prog(f, fCollapse - 8, 8, E.inOut);
  const blockScale = mix(1.5, 1, slam) * (1 + 0.035 * prog(f, fDrop + 6, fCollapse - fDrop - 6, E.inOutSoft) * settle) * onBeats(f, b(C.pulses[0]), fCollapse - 6, FRAMES_PER_BEAT, 0.02, 3);
  const rot = drift(f, 0.6, 50, 4) * settle;

  const r = rng(9);
  const seeds = Array.from({ length: 16 }, () => r());
  const tgt = teaseType(L);
  const fly = prog(f, fCollapse + 2, fHandoff - fCollapse - 2, E.inOut);

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${blockScale}) rotate(${rot}deg)`, transformOrigin: '50% 50%' }}>
      {LINES.map((l, i) => {
        const p = prog(f, fDrop + i, 6, E.out);
        const xOff = (1 - p) * l.from * L.W * 0.7;
        const lp = punch(f, b(C.pulses[i]), 0.07, 3);
        const w = textWidth(l.text, sizes[i], l.weight, 'sans', TRACK);
        const lx = L.box.x + (L.box.w - w) / 2;
        const chars = layoutChars(l.text, sizes[i], l.weight, 'sans', TRACK).chars;
        return (
          <At key={i} x={lx} y={tops[i]}>
            <div style={{ transform: `translateX(${xOff}px) skewX(${(1 - p) * -l.from * 22}deg) scale(${lp})`, transformOrigin: '50% 60%' }}>
              <KText
                text={l.text}
                size={sizes[i]}
                weight={l.weight}
                tracking={TRACK}
                charStyle={({ i: ci, ch }) => {
                  if (i === 2 && ch === '.') {
                    // the full stop survives the collapse and flies to Scene 3's cursor
                    const cx = lx + chars[ci].x;
                    const s = mix(1, tgt.size / sizes[i], fly);
                    return {
                      transformOrigin: '0 0',
                      transform: `translate(${(tgt.x - cx) * fly}px, ${(tgt.y - tops[i]) * fly}px) scale(${s})`,
                    };
                  }
                  const k = prog(f, fCollapse + seeds[(ci + i * 5) % 16] * 3, 5, E.in);
                  return { transform: `scale(${1 - k}) translateY(${k * sizes[i] * 0.2}px)`, opacity: 1 - k };
                }}
              />
            </div>
          </At>
        );
      })}
    </div>
  );
};
