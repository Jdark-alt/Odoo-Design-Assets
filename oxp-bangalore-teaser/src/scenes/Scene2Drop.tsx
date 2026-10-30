// Scene 2 (0:03.75-0:06): "So We Are Back!"
// The camera keeps diving into the stem of the "D" of "Days" (picked up from
// Scene 1). As the stem's white takes over the screen on the
// drop, "So We Are Back!" pops up as negative space cut out of it. Then the
// camera zooms into that negative space (the stem of the B), into Scene 3.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, SCENES, b } from '../config';
import { useLayout } from '../lib/layout';
import { glyphStem } from '../lib/fonts';
import { E, mix, pop, prog } from '../lib/motion';
import { layoutChars, textWidth } from '../components/KText';
import { SceneWindow } from '../components/Scene';
import { Logo } from '../components/Brand';
import { HANDOFF_Z, diveCamera } from './shared';
import { Easing } from 'remotion';

const C = CUES.drop;

export const Scene2Drop: React.FC = () => (
  <SceneWindow id="drop">
    <Drop />
  </SceneWindow>
);

const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P } = L;
  const cam = diveCamera(L);
  const view = cam.at(f);
  const fWhite = b(C.whiteout);
  const fExit = b(C.exit);
  const fEnd = b(SCENES.tease.start);
  if (f < b(C.dive) || view.z < HANDOFF_Z || f >= fEnd) return null;

  // ---- the stem of the D (and the rest of the lockup), drawn in screen space ----
  const { lay, stem: st } = cam;
  const S = lay.sizeD;
  const p0 = view.map(lay.xD + st.left * S, lay.baseD + st.top * S);
  const p1 = view.map(lay.xD + st.right * S, lay.baseD + st.bottom * S);
  const stemRect = { x: p0.x, y: p0.y, width: p1.x - p0.x, height: p1.y - p0.y };
  const rows = [
    { text: 'Community', base: lay.yLock + lay.cd.base1 },
    { text: 'Days.', base: lay.baseD },
  ].flatMap((r) => layoutChars(r.text, S, 700, 'sans', -0.02).chars.map((c) => ({ ...c, key: `${r.text}${c.i}`, at: view.map(lay.xD + c.x, r.base) })));
  const logoAt = view.map(lay.xD - lay.cd.xWord, lay.yLock);
  const white = f >= fWhite;

  // ---- "So We Are Back!" as negative space, centred ----
  const s1 = P(112);
  const s2 = Math.min(P(250), (L.box.w * 0.9) / (textWidth('Back!', 100, 700, 'sans', -0.03) / 100));
  const w1 = textWidth('So We Are', s1, 700, 'sans', -0.02);
  const w2 = textWidth('Back!', s2, 700, 'sans', -0.03);
  const cap1 = 0.727 * s1;
  const cap2 = 0.727 * s2;
  const gapY = s1 * 0.32;
  const blockH = cap1 + gapY + cap2;
  const base1 = L.H / 2 - blockH / 2 + cap1;
  const base2 = base1 + gapY + cap2;
  const x1 = (L.W - w1) / 2;
  const x2 = (L.W - w2) / 2;
  const words = pop(f, b(C.words), { damping: 13, stiffness: 240, mass: 0.6 });
  const wordsScale = mix(0.72, 1, words);

  // hold: a slow push; exit: zoom into the stem of the B (negative space)
  const hold = 1 + 0.03 * prog(f, fWhite, fExit - fWhite, E.inOutSoft);
  const stB = glyphStem('B');
  const stemW = (stB.right - stB.left) * s2;
  const focus = { x: x2 + ((stB.left + stB.right) / 2) * s2, y: base2 + ((stB.top + stB.bottom) / 2) * s2 };
  const k = prog(f, fExit, fEnd - fExit, Easing.bezier(0.6, 0, 0.95, 0.4));
  const zoom = Math.exp(Math.log(Math.max(2, (L.H * 1.4) / stemW)) * k);
  const scene = `translate(${focus.x} ${focus.y}) scale(${zoom * hold}) translate(${-focus.x} ${-focus.y})`;
  const pop1 = `translate(${L.W / 2} ${L.H / 2}) scale(${wordsScale}) translate(${-L.W / 2} ${-L.H / 2})`;

  const maskId = 'back-cut';
  return (
    <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden' }}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-L.W * 50} y={-L.H * 50} width={L.W * 100} height={L.H * 100}>
          <rect x={-L.W * 50} y={-L.H * 50} width={L.W * 100} height={L.H * 100} fill="white" />
          {f >= b(C.words) ? (
            <g transform={pop1} fill="black" fontFamily={FONTS.sans} fontWeight={700} opacity={Math.min(1, words * 2)}>
              <text x={x1} y={base1} fontSize={s1} letterSpacing={`${-0.02 * s1}px`}>
                So We Are
              </text>
              <text x={x2} y={base2} fontSize={s2} letterSpacing={`${-0.03 * s2}px`}>
                Back!
              </text>
            </g>
          ) : null}
        </mask>
      </defs>
      <g transform={scene} mask={`url(#${maskId})`} fill={COLORS.white}>
        {white ? (
          <rect x={-L.W * 50} y={-L.H * 50} width={L.W * 100} height={L.H * 100} />
        ) : (
          <>
            <rect {...stemRect} />
            {view.z < 40 ? (
              <>
                <g transform={`translate(${logoAt.x} ${logoAt.y})`}>
                  <Logo height={lay.lockH * view.z} />
                </g>
                {rows.map((c) => (
                  <text key={c.key} x={c.at.x} y={c.at.y} fontSize={S * view.z} fontFamily={FONTS.sans} fontWeight={700}>
                    {c.ch}
                  </text>
                ))}
              </>
            ) : null}
          </>
        )}
      </g>
    </svg>
  );
};
