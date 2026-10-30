// Scene 2 (0:06-0:08.5): "So we are back."
// The camera has dived into the "E" of "Experience" (Scene 1). On the drop the
// giant letter fills the frame and the copy is cut out of its three arms, one
// line per arm, with soft out-of-focus pins drifting behind for depth. Then the
// camera flies through the gap between the arms into the dark of Scene 3.
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, SCENES, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, pop, prog, rng } from '../lib/motion';
import { layoutChars } from '../components/KText';
import { SceneWindow } from '../components/Scene';
import { diveCamera, loveLayout } from './shared';

const C = CUES.drop;
const LINES = [
  { text: 'So we', weight: 700 },
  { text: 'are', weight: FONTS.weight.light },
  { text: 'back.', weight: 700 },
];

export const Scene2Drop: React.FC = () => (
  <SceneWindow id="drop">
    <Drop />
  </SceneWindow>
);

const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cam = diveCamera(L);
  const lay = loveLayout(L);
  const fDrop = b(C.drop);
  const fExit = Math.round(b(C.exit));
  const fEnd = b(SCENES.tease.start);
  const bokeh = useMemo(() => {
    const r = rng(17);
    const cols = [COLORS.white, COLORS.white, COLORS.white, COLORS.yellow, COLORS.teal];
    return Array.from({ length: 16 }, () => ({ x: r(), y: r(), s: 0.02 + r() * 0.09, o: 0.08 + r() * 0.2, col: cols[Math.floor(r() * cols.length)], depth: 0.3 + r() * 0.7, ph: r() * 6 }));
  }, []);
  if (f < fDrop || f > fEnd + 1) return null;

  const g = cam.giant;
  const a = g.arms;
  const S = g.size;
  // the whole word, at the same size and spacing as Scene 1's "Experience."
  const chars = layoutChars('Experience.', lay.sizeE, 700, 'sans', -0.02).chars;
  const k = S / lay.sizeE;

  // hit settle on landing, then a slow push (no beat pulses here)
  const settle = mix(1.025, 1, pop(f, fDrop, { damping: 18, stiffness: 260, mass: 0.6 }));
  const push = 1 + 0.035 * prog(f, fDrop + 4, fExit - fDrop - 4, E.inOutSoft);

  // exit: fly through the gap between the middle and bottom arms
  const gap = { x: g.x + (a.stemRight + (a.arms[1].right - a.stemRight) * 0.45) * S, y: g.baseline + ((a.arms[1].bottom + a.arms[2].top) / 2) * S };
  const fly = prog(f, fExit, fEnd - fExit, E.in);
  const flyZ = Math.exp(Math.log(10) * fly);
  const camT = `translate(${gap.x}px, ${gap.y}px) scale(${flyZ}) translate(${-gap.x}px, ${-gap.y}px) translate(${cam.T.x}px, ${cam.T.y}px) scale(${settle * push}) translate(${-cam.T.x}px, ${-cam.T.y}px)`;

  // copy cut out of each arm: cap height ~58% of the arm, left-aligned inside the stem
  const lines = LINES.map((l, i) => {
    const arm = a.arms[Math.min(i, a.arms.length - 1)];
    const thick = (arm.bottom - arm.top) * S;
    let size = (thick * 0.6) / 0.727;
    const x0 = g.x + a.left * S + thick * 0.42;
    const maxW = g.x + arm.right * S - x0 - thick * 0.35;
    const w = layoutChars(l.text, size, l.weight, 'sans', -0.02).width;
    if (w > maxW) size *= maxW / w;
    const baseline = g.baseline + ((arm.top + arm.bottom) / 2) * S + 0.727 * size * 0.5;
    const clip = { x: g.x + a.left * S - 4, y: g.baseline + arm.top * S, w: (arm.right - a.left) * S + 8, h: thick };
    const p = prog(f, fDrop + 2 + i * 3, 9, E.out);
    return { ...l, size, x0, baseline, clip, dy: (1 - p) * thick * 1.05 };
  });

  const maskId = 'drop-cut';
  return (
    <div style={{ position: 'absolute', inset: 0, transform: camT, transformOrigin: '0 0', opacity: 1 - prog(f, fEnd - 3, 3) }}>
      {/* out-of-focus pins drifting behind the letter */}
      {bokeh.map((p, i) => {
        const o = p.o * prog(f, fDrop, 10, E.out);
        const x = p.x * L.W + drift(f, L.P(30) * p.depth, 80, i);
        const y = p.y * L.H - (f - fDrop) * 0.6 * p.depth + drift(f, L.P(20), 70, i + 9);
        const d = p.s * L.W;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - d / 2,
              top: y - d / 2,
              width: d,
              height: d,
              borderRadius: '50%',
              background: p.col,
              opacity: o,
              filter: `blur(${d * 0.18}px)`,
              transform: `scale(${1 + (push - 1) * p.depth * 2})`,
            }}
          />
        );
      })}
      <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          {lines.map((l, i) => (
            <clipPath key={i} id={`${maskId}-arm${i}`} clipPathUnits="userSpaceOnUse">
              <rect x={l.clip.x} y={l.clip.y} width={l.clip.w} height={l.clip.h} />
            </clipPath>
          ))}
          <mask id={maskId} maskUnits="userSpaceOnUse" x={-L.W} y={-L.H} width={L.W * 4} height={L.H * 4}>
            <rect x={-L.W} y={-L.H} width={L.W * 4} height={L.H * 4} fill="white" />
            {lines.map((l, i) => (
              <g key={i} clipPath={`url(#${maskId}-arm${i})`}>
                <text
                  x={l.x0}
                  y={l.baseline + l.dy}
                  fontFamily={FONTS.sans}
                  fontWeight={l.weight}
                  fontSize={l.size}
                  letterSpacing={`${-0.02 * l.size}px`}
                  fill="black"
                >
                  {l.text}
                </text>
              </g>
            ))}
          </mask>
        </defs>
        <g mask={`url(#${maskId})`} fill={COLORS.white} fontFamily={FONTS.sans} fontWeight={700}>
          {chars.map((c) =>
            c.ch === ' ' ? null : (
              <text key={c.i} x={g.x + c.x * k} y={g.baseline} fontSize={S}>
                {c.ch}
              </text>
            ),
          )}
        </g>
      </svg>
    </div>
  );
};
