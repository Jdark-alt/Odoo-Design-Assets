// Scene 4 (0:09-0:12): "We are bringing the Odoo Community Days to you."
// Hierarchy: "you" is the only highlighted word (Caveat on the official yellow
// bar); the Odoo Community Days lockup is the anchor of the sentence; the rest
// is quiet. Pops and confetti come out of "you" itself.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, pop, prog } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { Logo, Mark } from '../components/Brand';
import { Burst } from '../components/Graphics';
import { rise } from './Scene1Love';
import { cdLockup, cdUnit } from './shared';

const C = CUES.reveal;
const LINE1 = [
  { text: 'We', cue: C.we },
  { text: 'are', cue: C.are },
  { text: 'bringing', cue: C.bringing },
  { text: 'the', cue: C.the },
];

export const Scene4Reveal: React.FC = () => (
  <SceneWindow id="reveal">
    <Reveal />
  </SceneWindow>
);

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P } = L;
  const fOdoo = b(C.communityDays);
  const fTo = b(C.to);
  const fYou = b(C.you);
  const fEnd = b(CUES.rapid.items[0]);
  const out = prog(f, fEnd - 4, 5, E.in);

  // ---- sizes: line 1 quiet, lockup the anchor, "you" the hero ----
  const s1 = P(80);
  const W1 = FONTS.weight.regular;
  const wSpace = textWidth(' ', s1, W1);
  const lineW = (L.wide ? 0.62 : 1) * L.box.w;
  const lk = Math.min(P(106), lineW / cdUnit());
  const cd = cdLockup(lk);
  const sYou = Math.min(P(340), L.box.h * 0.3);
  const wYou = textWidth('you', sYou, 700, 'hand');
  const pad = 0.14 * sYou; // highlight bar overhang (the kit's HighlightWord)
  const barW = wYou + pad * 2;
  const barH = sYou * 0.98;

  const blockH = s1 * 1.4 + cd.base2 + lk * 0.45 + sYou * 1.05;
  const y1 = L.box.y + (L.box.h - blockH) / 2 - P(10);
  const y2 = y1 + s1 * 1.4;
  const y3 = y2 + cd.base2 + lk * 0.45;
  // line 1 and the lockup start centred on their own and lift as "you" lands
  const h12 = s1 * 1.4 + cd.height;
  const lift = (L.box.y + (L.box.h - h12) / 2 - y1) * (1 - prog(f, fYou - 3, 10, E.out));
  // everything centred on the vertical axis; "to" follows "Days" on its line
  const wDays = textWidth('Days', cd.s, 700, 'sans', -0.02);
  const w2 = Math.max(cd.width, cd.xWord + wDays + textWidth(' to', cd.s, FONTS.weight.light));
  const x2 = (L.W - w2) / 2;
  const youX = (L.W - barW) / 2;

  // "you": centre of the word, for the pops and confetti
  const cx = youX + barW / 2;
  const cy = y3 + sYou * 0.55;
  const barP = prog(f, fYou, 6, E.out);
  const youPop = pop(f, fYou, { damping: 13, stiffness: 240, mass: 0.6 });
  const hold = 1 + 0.02 * prog(f, fYou + 8, fEnd - fYou - 8, E.inOutSoft);

  // line 1 word positions
  let xw = 0;
  const words = LINE1.map((w) => {
    const x = xw;
    xw += textWidth(w.text, s1, W1) + wSpace;
    return { ...w, x };
  });
  const w1 = xw - wSpace;
  const x1 = (L.W - w1) / 2;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `scale(${(1 + out * 0.12) * hold})`, transformOrigin: `${(cx / L.W) * 100}% ${(cy / L.H) * 100}%` }}>
      {/* line 1: supporting words, each landing on its beat */}
      <At x={x1} y={y1 + lift + drift(f, P(3), 100, 1)}>
        <div style={{ position: 'relative', height: s1, width: w1 }}>
          {words.map((w, wi) => (
            <div key={w.text} style={{ position: 'absolute', left: w.x, top: 0, ...(wi === 1 || wi === 3 ? lineMask(s1) : null) }}>
              <KText
                text={w.text}
                size={s1}
                weight={W1}
                charStyle={({ i }) => {
                  const f0 = b(w.cue);
                  if (wi === 0) {
                    // "We" slams in from the left
                    const p = prog(f, f0 + i, 8, E.out);
                    return { transform: `translateX(${(1 - p) * -L.W * 0.4}px) skewX(${(1 - p) * 22}deg)`, opacity: p > 0.02 ? 1 : 0 };
                  }
                  if (wi === 2) {
                    // "bringing" slides in from the right, letter by letter
                    const p = prog(f, f0 + i * 0.6, 6, E.out);
                    return { transform: `translateX(${(1 - p) * L.W * 0.7}px) skewX(${(1 - p) * -18}deg)`, opacity: p > 0.02 ? 1 : 0 };
                  }
                  return rise(f, f0 + i * 1.2, 9);
                }}
              />
            </div>
          ))}
        </div>
      </At>

      {/* the anchor: logo + Community / Days, then a quiet "to" */}
      <At x={x2} y={y2 + lift + drift(f, P(3), 100, 2)}>
        <div style={{ position: 'relative', height: cd.height, width: w2 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${mix(0.6, 1, pop(f, fOdoo, { damping: 13, stiffness: 260, mass: 0.6 }))})`, transformOrigin: '0% 100%', opacity: Math.min(1, prog(f, fOdoo, 3) * 1.5) }}>
            <Logo height={lk} />
          </div>
          <div style={{ position: 'absolute', left: cd.xWord, top: cd.top1, ...lineMask(cd.s) }}>
            <KText text="Community" size={cd.s} weight={700} tracking={-0.02} charStyle={({ i }) => rise(f, fOdoo + 2 + i * 0.7, 10)} />
          </div>
          <div style={{ position: 'absolute', left: cd.xWord, top: cd.top2, ...lineMask(cd.s) }}>
            <KText text="Days" size={cd.s} weight={700} tracking={-0.02} charStyle={({ i }) => rise(f, fOdoo + 6 + i * 0.8, 10)} />
          </div>
          <div style={{ position: 'absolute', left: cd.xWord + wDays, top: cd.top2, ...lineMask(cd.s) }}>
            <KText text=" to" size={cd.s} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, fTo + i, 10)} />
          </div>
        </div>
      </At>

      {/* confetti starts behind the bar, so it comes out of the word */}
      <Burst
        x={cx}
        y={cy}
        start={fYou + 1}
        count={70}
        seed={30}
        speed={P(30)}
        scale={L.s}
        gravity={0.45}
        spawnW={barW * 0.8}
        spawnH={barH * 0.5}
        colors={['yellow', 'teal', 'cyan', 'red', 'white']}
        marks={['star', 'sparkle-1', 'heart']}
      />
      {/* line 3: "you", the only highlighted word */}
      {f >= fYou - 1 ? (
        <At x={youX} y={y3}>
          <div style={{ position: 'relative', width: barW, height: sYou }}>
            <div style={{ position: 'absolute', left: 0, top: sYou * 0.08, transform: `scaleY(${mix(0.3, 1, youPop)})`, transformOrigin: '50% 60%' }}>
              <Mark name="highlight-bar-3" color="yellow" width={barW} height={barH} stretch reveal={barP} />
            </div>
            <div style={{ position: 'absolute', left: pad, top: -sYou * 0.02 }}>
              <KText
                text="you"
                size={sYou}
                family="hand"
                weight={700}
                color={COLORS.textBlack}
                charStyle={({ i }) => {
                  const p = pop(f, fYou + 1 + i * 1.6, { damping: 11, stiffness: 260, mass: 0.6 });
                  return { transform: `translateY(${(1 - p) * sYou * 0.18}px) scale(${mix(0.4, 1, p)})`, opacity: Math.min(1, p * 3) };
                }}
              />
            </div>
            {/* pops anchored on the bar's corners, springing out of the word */}
            <Corner f={f} start={fYou + 3} x={pad * 0.2} y={sYou * 0.12} origin="100% 100%" rotate={-28} dx={-1} dy={-1}>
              <Mark name="pop-fan" color="teal" width={sYou * 0.5} />
            </Corner>
            <Corner f={f} start={fYou + 5} x={barW - pad * 0.3} y={sYou * 0.1} origin="0% 100%" rotate={22} dx={0} dy={-1}>
              <Mark name="sparkle-1" color="yellow" height={sYou * 0.34} />
            </Corner>
            <Corner f={f} start={fYou + 7} x={barW - pad * 0.1} y={sYou * 0.96} origin="0% 0%" rotate={12} dx={0} dy={0}>
              <Mark name="star" color="yellow" height={sYou * 0.2} />
            </Corner>
          </div>
        </At>
      ) : null}

    </div>
  );
};

/** An official pop pinned to a corner of the word: it grows out from that corner. */
const Corner: React.FC<{ f: number; start: number; x: number; y: number; origin: string; rotate: number; dx: number; dy: number; children: React.ReactNode }> = ({
  f,
  start,
  x,
  y,
  origin,
  rotate,
  dx,
  dy,
  children,
}) => {
  const p = pop(f, start, { damping: 12, stiffness: 220, mass: 0.6 });
  const wobble = drift(f, 3, 60, start);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
      <div
        style={{
          position: 'absolute',
          transform: `translate(${dx * 100}%, ${dy * 100}%) rotate(${rotate + wobble}deg) scale(${p})`,
          transformOrigin: origin,
          opacity: Math.min(1, p * 3),
        }}
      >
        {children}
      </div>
    </div>
  );
};
