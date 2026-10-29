// Scene 3 (0:08.5-0:13): "But this time," (hold) "something is different."
// A thin line half-traces the Vidhana Soudha in the dark: intriguing, not yet readable.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, MONUMENT_TEASE, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, prog, tw } from '../lib/motion';
import { KText, layoutChars } from '../components/KText';
import { inkBox } from '../lib/fonts';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { MONUMENT_RATIO, Monument } from '../components/Graphics';
import { MONUMENT_DOME } from '../brand/vidhanaSoudha';
import { teaseMonument, teaseType } from './shared';

const C = CUES.tease;
const TYPE = 'But this time,';
const FRAMES_PER_CHAR = 2;
const TYPE_DELAY = 4; // the caret forms first, then typing starts

export const Scene3Tease: React.FC = () => (
  <SceneWindow id="tease">
    <Tease />
  </SceneWindow>
);

const Tease: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P, X, Y } = L;
  const fType = b(C.butThisTime);
  const fSome = b(C.something);
  const fDiff = b(C.different);
  const fOut = b(CUES.reveal.we) - 3; // the reveal sweeps the tease away

  // ---- partial Vidhana Soudha, cropped by the frame, low opacity ----
  const m = teaseMonument(L);
  const mH = m.width / MONUMENT_RATIO;
  const trace = tw(f, b(C.monumentStart), b(C.monumentEnd) - 2, 0, MONUMENT_TEASE, E.inOutSoft);
  const dissolve = prog(f, b(CUES.reveal.we), b(CUES.reveal.monumentGone) - b(CUES.reveal.we) + 8, E.out);
  const mScale = 1 + 0.035 * prog(f, b(C.monumentStart), 150, E.inOutSoft) + 0.06 * dissolve;
  const mOpacity = m.opacity * tw(f, b(C.monumentStart), b(C.monumentStart) + 30, 0, 1, E.inOut) * (1 - dissolve);

  // ---- typing ----
  const tt = teaseType(L);
  const typed = f < fType + TYPE_DELAY ? 0 : Math.min(TYPE.length, Math.floor((f - fType - TYPE_DELAY) / FRAMES_PER_CHAR) + 1);
  const lay = layoutChars(TYPE, tt.size, FONTS.weight.regular, 'sans', 0);
  const cursorX = typed >= TYPE.length ? lay.width + tt.size * 0.06 : typed === 0 ? 0 : lay.chars[typed]?.x ?? 0;
  const typeDone = fType + TYPE_DELAY + TYPE.length * FRAMES_PER_CHAR;
  const blinkOn = f < typeDone || Math.floor((f - typeDone) / 7.5) % 2 === 0;
  const cursorO = (f < fSome ? (blinkOn ? 1 : 0) : 1 - prog(f, fSome, 8)) * (f >= fType ? 1 : 0);

  // ---- out: swept upward on the reveal's first beat ----
  const out = prog(f, fOut, 7, E.in);
  const outStyle = (k: number): React.CSSProperties => ({ transform: `translateY(${-out * P(90) * k}px)`, opacity: 1 - out });

  const sSome = P(88);
  const sDiff = P(172);
  const hold = drift(f, P(3), 160, 6);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: m.domeX - m.width * MONUMENT_DOME.x,
          top: m.domeY - mH * MONUMENT_DOME.y,
          transform: `scale(${mScale})`,
          transformOrigin: `${MONUMENT_DOME.x * 100}% ${MONUMENT_DOME.y * 100}%`,
          opacity: mOpacity,
          filter: dissolve > 0 ? `blur(${dissolve * P(10)}px)` : undefined,
          WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 88%)',
          maskImage: 'linear-gradient(to bottom, black 45%, transparent 88%)',
        }}
      >
        <Monument width={m.width} progress={trace} strokeWidth={P(2.4)} />
      </div>

      {/* "But this time," types in, small */}
      <At x={tt.x} y={tt.y + hold}>
        <div style={outStyle(1)}>
          <KText
            text={TYPE}
            size={tt.size}
            weight={FONTS.weight.regular}
            charStyle={({ i }) => {
              const appear = fType + TYPE_DELAY + i * FRAMES_PER_CHAR;
              return { opacity: f >= appear ? 1 : 0, transform: `translateY(${(1 - prog(f, appear, 4, E.out)) * tt.size * 0.12}px)` };
            }}
          />
          {f >= fType ? <Caret f={f} start={fType} x={cursorX} size={tt.size} opacity={cursorO} /> : null}
        </div>
      </At>

      {/* "something is" */}
      <At x={X(0)} y={Y(0.49) + hold * 0.7}>
        <div style={{ ...lineMask(sSome), ...outStyle(1.2) }}>
          <KText
            text="something is"
            size={sSome}
            weight={FONTS.weight.light}
            charStyle={({ i, word }) => {
              const p = prog(f, fSome + word * 12 + i * 1.4, 24, E.outSoft);
              return { transform: `translateY(${(1 - p) * 150}%)` };
            }}
          />
        </div>
      </At>

      {/* "different." reveals slowly, with tension: blur to sharp, letters drawing together */}
      <At x={X(0) - sDiff * 0.02} y={Y(0.575) + hold * 0.5}>
        <div style={outStyle(1.5)}>
          <KText
            text="different."
            size={sDiff}
            weight={700}
            tracking={-0.03}
            charStyle={({ i, n }) => {
              const p = prog(f, fDiff + i * 2.4, 30, E.inOutSoft);
              const spread = (i - (n - 1) / 2) * sDiff * 0.09 * (1 - p);
              return {
                opacity: p,
                filter: p < 1 ? `blur(${(1 - p) * sDiff * 0.08}px)` : undefined,
                transform: `translate(${spread}px, ${(1 - p) * sDiff * 0.18}px) scale(${mix(1.12, 1, p)})`,
              };
            }}
          />
        </div>
      </At>
    </>
  );
};

/** Starts as the full stop of "back." (same ink box) and grows into a caret. */
const Caret: React.FC<{ f: number; start: number; x: number; size: number; opacity: number }> = ({ f, start, x, size, opacity }) => {
  const dot = inkBox('.', size, 700, FONTS.sans);
  const g = prog(f, start, 7, E.out);
  const base = size * 0.863; // baseline inside the KText box
  const w = mix(dot.right - dot.left, size * 0.07, g);
  const h = mix(dot.bottom - dot.top, size * 0.84, g);
  const left = x + mix(dot.left, size * 0.04, g);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: base + mix(dot.bottom, size * 0.1, g) - h,
        width: w,
        height: h,
        borderRadius: Math.min(w, h) * 0.3,
        background: g > 0.5 ? COLORS.yellow : COLORS.white,
        opacity,
      }}
    />
  );
};
