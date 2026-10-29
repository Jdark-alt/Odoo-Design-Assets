// Scene 4 (0:13-0:17): "We are bringing the Odoo Experience to you."
// Words land on beats; "to you" is the hero, with the brand's highlight bar,
// a confetti burst of palette pieces and official pops, and radiating strokes.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, FRAMES_PER_BEAT, b } from '../config';
import { useLayout } from '../lib/layout';
import { fitSize, measure100 } from '../lib/fonts';
import { E, drift, mix, onBeats, pop, prog, punch } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { LOGO_RATIO, Logo, Mark } from '../components/Brand';
import { Burst, Rays } from '../components/Graphics';
import { rise } from './Scene1Love';

const C = CUES.reveal;

export const Scene4Reveal: React.FC = () => (
  <SceneWindow id="reveal">
    <Reveal />
  </SceneWindow>
);

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P, X, Y } = L;
  const fWe = b(C.we);
  const fAre = b(C.are);
  const fBring = b(C.bringing);
  const fThe = b(C.the);
  const fOdoo = b(C.odooExperience);
  const fHero = b(C.toYou);
  const fEnd = b(CUES.rapid.items[0]);

  // exit: punched away by "Odoo 20"
  const out = prog(f, fEnd - 3, 5, E.in);

  // ---- phase A: the sentence builds ----
  const sWe = P(150);
  const sBring = Math.min(fitSize('bringing', L.box.w * 0.99, 700, FONTS.sans, -0.03), P(260));
  const sThe = P(82);
  const lockH = P(100);
  const wWe = textWidth('We ', sWe, 700, 'sans', -0.02);

  // after the hero lands, phase A compresses to the top as context
  const squeeze = prog(f, fHero - 3, 9, E.out);
  const yA = Y(L.wide ? 0.06 : 0.2);
  const aScale = mix(1, 0.56, squeeze);
  const aY = mix(0, Y(0) - yA, squeeze);
  const aOpacity = mix(1, 0.62, squeeze);

  // ---- phase B: hero "to you" ----
  const k = 1.2; // Caveat runs small: 1.2x the Inter around it
  const padEm = 0.14; // highlight bar overhang, in Caveat ems
  const unitW = measure100('to ', 700, FONTS.sans) / 100 + ((measure100('you', 700, FONTS.hand) / 100) * k + padEm * 2 * k);
  const sTo = Math.min((L.box.w * 0.97) / unitW, P(300));
  const sYou = sTo * k;
  const wToSp = textWidth('to ', sTo, 700, 'sans', -0.02);
  const wYou = textWidth('you', sYou, 700, 'hand');
  const heroW = wToSp + wYou + padEm * 2 * sYou;
  const heroX = L.box.x + (L.box.w - heroW) / 2;
  const heroY = L.wide ? Y(0.5) : Y(0.45);
  const youX = heroX + wToSp + padEm * sYou;
  const youCx = youX + wYou / 2;
  const youCy = heroY + sYou * 0.55;
  const barP = prog(f, fHero, 6, E.out);
  const heroPunch = punch(f, fHero, 0.12, 5) * onBeats(f, fHero + FRAMES_PER_BEAT, fEnd - 4, FRAMES_PER_BEAT, 0.025, 3);

  const holdA = drift(f, P(4), 110, 9);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `scale(${1 + out * 0.25})`, transformOrigin: '50% 55%' }}>
      {/* ------------------------------------------------ phase A */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${aY}px) scale(${aScale})`, transformOrigin: `${(X(0) / L.W) * 100}% ${(yA / L.H) * 100}%`, opacity: aOpacity }}>
        <At x={X(0)} y={yA + holdA}>
          <div style={{ display: 'flex' }}>
            <KText
              text="We"
              size={sWe}
              weight={700}
              tracking={-0.02}
              charStyle={({ i }) => {
                const p = pop(f, fWe + i, { damping: 13, stiffness: 330, mass: 0.5 });
                return { transform: `translateX(${(1 - p) * -L.W * 0.5}px) skewX(${(1 - p) * 25}deg)`, opacity: p > 0.02 ? 1 : 0 };
              }}
            />
            <div style={{ marginLeft: wWe - textWidth('We', sWe, 700, 'sans', -0.02), ...lineMask(sWe) }}>
              <KText
                text="are"
                size={sWe}
                weight={FONTS.weight.light}
                charStyle={({ i }) => {
                  const p = pop(f, fAre + i, { damping: 12, stiffness: 300, mass: 0.5 });
                  return { transform: `translateY(${(1 - p) * -150}%)` };
                }}
              />
            </div>
          </div>
        </At>
        <At x={X(0) - sBring * 0.02} y={yA + sWe * 0.95 + holdA * 0.7}>
          <KText
            text="bringing"
            size={sBring}
            weight={700}
            tracking={-0.03}
            charStyle={({ i }) => {
              const p = pop(f, fBring + i * 1.1, { damping: 13, stiffness: 260, mass: 0.6 });
              return { transform: `translateX(${(1 - p) * L.W * 0.9}px) skewX(${(1 - p) * -18}deg)`, opacity: p > 0.02 ? 1 : 0 };
            }}
          />
        </At>
        <At x={X(0)} y={yA + sWe * 0.95 + sBring * 0.98 + holdA * 0.5}>
          <div style={lineMask(sThe)}>
            <KText text="the" size={sThe} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, fThe + i * 1.2, 9)} />
          </div>
        </At>
        <At x={X(0)} y={yA + sWe * 0.95 + sBring * 0.98 + sThe * 1.05 + holdA * 0.4}>
          <OdooExperience f={f} start={fOdoo} logoH={lockH} />
        </At>
      </div>

      {/* ------------------------------------------------ phase B: radiating shapes behind the hero */}
      <Rays x={youCx} y={youCy} start={fHero} count={16} r0={wYou * 0.55} r1={Math.max(L.W, L.H) * 0.62} color={COLORS.white} width={P(9)} dur={16} rings={2} />
      <Rays x={youCx} y={youCy} start={fHero + 2} count={9} r0={wYou * 0.5} r1={Math.max(L.W, L.H) * 0.4} color={COLORS.yellow} width={P(7)} dur={14} rings={0} seed={8} />

      {f >= fHero - 3 ? (
        <At x={heroX} y={heroY}>
          <div style={{ position: 'relative', width: heroW, height: sYou * 1.1, transform: `scale(${heroPunch})`, transformOrigin: `${((youCx - heroX) / heroW) * 100}% 55%` }}>
            {/* "to" slams in from the left */}
            <div style={{ position: 'absolute', left: 0, top: sYou - sTo * 1.0 - sYou * 0.02 }}>
              <KText
                text="to"
                size={sTo}
                weight={700}
                tracking={-0.02}
                charStyle={({ i }) => {
                  const p = pop(f, fHero - 3 + i, { damping: 14, stiffness: 340, mass: 0.5 });
                  return { transform: `translateX(${(1 - p) * -L.W * 0.6}px)`, opacity: p > 0.02 ? 1 : 0 };
                }}
              />
            </div>
            {/* "you" in Caveat on the official yellow highlight bar, text kept dark */}
            <div style={{ position: 'absolute', left: wToSp, top: 0, width: wYou + padEm * 2 * sYou, height: sYou }}>
              <div style={{ position: 'absolute', left: 0, top: sYou * 0.08, transform: `scaleY(${mix(0.2, 1, pop(f, fHero, { damping: 10, stiffness: 300 }))})`, transformOrigin: '50% 60%' }}>
                <Mark name="highlight-bar-3" color="yellow" width={wYou + padEm * 2 * sYou} height={sYou * 0.98} stretch reveal={barP} />
              </div>
              <div style={{ position: 'absolute', left: padEm * sYou, top: -sYou * 0.02 }}>
                <KText
                  text="you"
                  size={sYou}
                  family="hand"
                  weight={700}
                  color={COLORS.textBlack}
                  charStyle={({ i }) => {
                    const p = pop(f, fHero + 1 + i * 1.5, { damping: 9, stiffness: 320, mass: 0.55 });
                    return { transform: `scale(${mix(0.2, 1, p)}) rotate(${(1 - p) * (i - 1) * 18}deg)`, opacity: Math.min(1, p * 4) };
                  }}
                />
              </div>
            </div>
            {/* official pops at the corners of the word */}
            <div style={{ position: 'absolute', left: wToSp - sYou * 0.28, top: -sYou * 0.42, transform: `scale(${pop(f, fHero + 3, { damping: 10, stiffness: 260 })}) rotate(-20deg)` }}>
              <Mark name="pop-fan" color="teal" width={sYou * 0.6} />
            </div>
            <div style={{ position: 'absolute', left: heroW - sYou * 0.06, top: -sYou * 0.08, transform: `scale(${pop(f, fHero + 5, { damping: 10, stiffness: 260 })}) rotate(${12 + drift(f, 6, 40, 1)}deg)` }}>
              <Mark name="sparkle-1" color="yellow" height={sYou * 0.42} />
            </div>
          </div>
        </At>
      ) : null}

      <Burst x={youCx} y={youCy} start={fHero} count={110} seed={30} speed={P(46)} scale={L.s * 1.25} gravity={0.85} />
      <Burst x={youCx} y={youCy} start={fHero + 15} count={26} seed={31} speed={P(30)} scale={L.s * 1.0} gravity={0.7} marks={['sparkle-1', 'star']} />
    </div>
  );
};

/** Logo + "Experience", sized as the brand lockup (gap = half the logo height). */
export const OdooExperience: React.FC<{ f: number; start: number; logoH: number; period?: boolean }> = ({ f, start, logoH, period = false }) => {
  const gap = logoH * 0.5;
  const size = logoH * 0.98;
  const wLogo = logoH * LOGO_RATIO;
  const word = period ? 'Experience.' : 'Experience';
  const width = wLogo + gap + textWidth(word, size, 700, 'sans', -0.02);
  const logoP = pop(f, start, { damping: 12, stiffness: 260, mass: 0.6 });
  return (
    <div style={{ position: 'relative', width, height: logoH * 1.25 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${mix(0.5, 1, logoP)})`, transformOrigin: '0% 100%', opacity: Math.min(1, logoP * 3) }}>
        <Logo height={logoH} />
      </div>
      <div style={{ position: 'absolute', left: wLogo + gap, top: logoH - size * 0.863, ...lineMask(size) }}>
        <KText text={word} size={size} weight={700} tracking={-0.02} charStyle={({ i }) => rise(f, start + 2 + i * 0.9, 10)} />
      </div>
    </div>
  );
};

