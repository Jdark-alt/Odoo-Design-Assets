// Scene 6 (0:16.5-0:21): "The Odoo Community Days is on tour." / "Next stop: Bangalore." / end card.
// The Odoo Community Days lockup is the anchor from start to finish. A metro
// line (the brand's route motif) carries the tour to the Bangalore stop, the
// Vidhana Soudha completes its trace, then the extra words fall away: the
// lockup settles, "bangalore" glides into place under it, and the date and
// venue (END_CARD) arrive last, at the bottom.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, END_CARD, FONTS, MONUMENT_TEASE, b } from '../config';
import { useLayout } from '../lib/layout';
import { baselineFrac } from '../lib/fonts';
import { E, drift, mix, pop, prog, tw } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { Doodle, Logo, Mark } from '../components/Brand';
import { Kolam, MONUMENT_RATIO, Monument } from '../components/Graphics';
import { MONUMENT_DOME } from '../brand/vidhanaSoudha';
import { cdLockup, cdUnit, routeLine, teaseMonument } from './shared';

const C = CUES.outro;
const STATIONS = 6; // the last one is Bangalore

export const Scene6Outro: React.FC = () => (
  <SceneWindow id="outro">
    <Outro />
  </SceneWindow>
);

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P, X, Y } = L;
  const f0 = b(C.onTour);
  const fNext = b(C.nextStop);
  const fBang = b(C.bangalore);
  const fLock = b(C.lockup);
  const fDetails = b(C.details);

  // words that aren't the brand or the city leave before the end card
  const leave = prog(f, fLock - 8, 10, E.inSoft);
  const settle = prog(f, fLock - 4, 20, E.inOut); // lockup and city glide to the centred end card
  const hold = drift(f, P(3), 150, 12);

  // ---- the anchor: logo + Community / Days, as wide as the safe area allows ----
  const lk = Math.min(P(106), (L.box.w * (L.wide ? 0.6 : 1)) / cdUnit());
  const cd = cdLockup(lk);

  // ---- phase A layout (on tour) ----
  const sThe = P(60);
  const sTour = P(70);
  const sNext = P(46);
  const sCityA = Math.min(P(200), L.box.h * 0.17);
  const yTheA = Y(L.wide ? 0.0 : 0.04);
  const yLockA = yTheA + sThe * 1.3;
  const yTourA = yLockA + cd.base2 + lk * 0.3;
  const r = routeLine(L);
  const yNext = r.y + P(48);
  const yCityA = yNext + sNext * 1.25;

  // ---- end card layout: centred; lockup, then a larger "bangalore", then the date and venue at the bottom ----
  const lockW = cd.width;
  const sCityB = Math.min(lk * 1.6, P(190));
  const yLockB = Y(L.wide ? 0.12 : 0.27);
  const yCityB = yLockB + cd.base2 + lk * 0.16;
  const xCityB = (L.W - textWidth('bangalore', sCityB, 700, 'hand')) / 2;
  const sDate = P(56);
  const sVenue = P(42);
  const yVenue = L.box.y + L.box.h - sVenue * 1.02;
  const yDate = yVenue - sDate * 1.32;
  const raise = L.box.y + L.box.h - yDate + P(36); // the monument makes room for the date and venue

  const yLock = mix(yLockA, yLockB, settle);
  const xLock = mix(X(0), (L.W - lockW) / 2, settle);
  const cityX = mix(X(0), xCityB, settle);
  const cityY = mix(yCityA, yCityB, settle);
  const citySize = mix(sCityA, sCityB, settle);
  const wCity = textWidth('bangalore', citySize, 700, 'hand');

  // ---- route line and stations ----
  const gap = P(L.wide ? 330 : 250);
  const travel = (STATIONS - 1) * gap * tw(f, f0 + 4, fBang, 0, 1, E.inOut);
  const stopX = X(0.035);
  const routeIn = prog(f, f0 - 2, 14, E.out);

  // ---- Vidhana Soudha: pull back from the Scene 3 crop while the trace completes ----
  const crop = teaseMonument(L);
  const fullW = Math.min(L.box.w, L.box.h * (L.wide ? 0.62 : 0.5) * MONUMENT_RATIO);
  const fullH = fullW / MONUMENT_RATIO;
  const full = { width: fullW, domeX: X(0.5), domeY: L.box.y + L.box.h - fullH + fullH * MONUMENT_DOME.y };
  const pull = prog(f, b(C.monumentStart), b(C.monumentEnd) - b(C.monumentStart) - 6, E.inOut);
  const mW = Math.exp(mix(Math.log(crop.width), Math.log(full.width), pull));
  const mDomeX = mix(crop.domeX, full.domeX, pull);
  const mDomeY = mix(crop.domeY, full.domeY, pull);
  const mH = mW / MONUMENT_RATIO;
  const trace = tw(f, b(C.monumentStart) + 2, b(C.monumentEnd), MONUMENT_TEASE, 1, E.inOut);
  const mOpacity = tw(f, b(C.monumentStart) + 2, b(C.monumentStart) + 18, 0, 0.34, E.in) * mix(1, 0.6, settle);

  const kolamPitch = P(72);
  const endIn = prog(f, fLock + 2, 26, E.outSoft);

  return (
    <>
      {/* Vidhana Soudha */}
      {f >= b(C.monumentStart) - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: mDomeX - mW * MONUMENT_DOME.x,
            top: mDomeY - mH * MONUMENT_DOME.y,
            opacity: mOpacity,
            transform: `translateY(${-settle * raise}px) scale(${mix(1, 0.8, settle)})`,
            transformOrigin: '50% 100%',
          }}
        >
          <Monument width={mW} progress={trace} strokeWidth={P(2.3)} />
        </div>
      ) : null}

      {/* kolam on the end card: one line, every dot, bleeding off the corner */}
      {f >= fLock ? (
        <div style={{ position: 'absolute', left: L.W - 6 * kolamPitch * 0.6, top: -P(170), opacity: 0.7 * endIn }}>
          <Kolam cols={5} rows={6} pitch={kolamPitch} draw={prog(f, fLock + 2, 72, E.inOut)} dots={prog(f, fLock, 18)} stroke={0.14} />
        </div>
      ) : null}

      {/* metro line */}
      <div style={{ position: 'absolute', left: 0, top: r.y - r.thickness / 2, width: L.W, height: r.thickness, background: COLORS.purple, clipPath: `inset(0 ${(1 - routeIn) * 100}% 0 0)`, opacity: 1 - leave }} />
      {Array.from({ length: STATIONS }, (_, k) => {
        const x = stopX + k * gap - travel;
        if (x < -P(80) || x > L.W + P(80)) return null;
        const isStop = k === STATIONS - 1;
        const appear = pop(f, f0 + 2 + k * 2, { damping: 11, stiffness: 300 });
        const arrive = isStop ? pop(f, fBang - 2, { damping: 9, stiffness: 220 }) : 0;
        const rad = isStop ? mix(P(18), P(26), arrive) : P(16);
        const ringP = isStop ? prog(f, fBang, 24, E.out) : 0;
        return (
          <React.Fragment key={k}>
            {isStop && f >= fBang ? (
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: r.y,
                  width: rad * 2,
                  height: rad * 2,
                  marginLeft: -rad,
                  marginTop: -rad,
                  borderRadius: '50%',
                  border: `${P(3)}px solid ${COLORS.white}`,
                  transform: `scale(${mix(1, 3.2, ringP)})`,
                  opacity: (1 - ringP) * (1 - leave),
                }}
              />
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: x,
                top: r.y,
                width: rad * 2,
                height: rad * 2,
                marginLeft: -rad,
                marginTop: -rad,
                borderRadius: '50%',
                background: COLORS.white,
                border: `${P(isStop ? 6 : 5)}px solid ${COLORS.purple}`,
                boxSizing: 'border-box',
                transform: `scale(${appear})`,
                opacity: 1 - leave,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* "The" ... "is on tour." (they leave before the end card) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - leave, transform: `translateY(${-leave * P(30) + hold}px)` }}>
        <At x={X(0)} y={yTheA}>
          <div style={lineMask(sThe)}>
            <KText text="The" size={sThe} weight={FONTS.weight.light} charStyle={({ i }) => glide(f, f0 + i * 1.2)} />
          </div>
        </At>
        <At x={X(0)} y={yTourA}>
          <div style={{ display: 'flex', ...lineMask(sTour) }}>
            <KText text="is on " size={sTour} weight={FONTS.weight.light} charStyle={({ i }) => glide(f, f0 + 14 + i)} />
            <KText text="tour." size={sTour} weight={700} tracking={-0.01} charStyle={({ i }) => glide(f, f0 + 19 + i * 1.2)} />
          </div>
        </At>
        <At x={X(0)} y={yNext}>
          <div style={{ clipPath: `inset(-20% ${(1 - prog(f, fNext, 10, E.out)) * 100}% -40% 0)` }}>
            <KText text="Next stop:" size={sNext} weight={700} tracking={-0.01} />
          </div>
        </At>
      </div>

      {/* the anchor: Odoo Community Days lockup, present from the first beat to the last frame */}
      <At x={xLock} y={yLock + hold * (1 - settle)}>
        <div style={{ position: 'relative', height: cd.height, width: cd.width }}>
          <div style={{ position: 'absolute', left: 0, top: 0, clipPath: `inset(-10% ${(1 - prog(f, f0 + 4, 16, E.outSoft)) * 100}% -10% 0)` }}>
            <Logo height={lk} />
          </div>
          <div style={{ position: 'absolute', left: cd.xWord, top: cd.top1, ...lineMask(cd.s) }}>
            <KText text="Community" size={cd.s} weight={700} tracking={-0.02} charStyle={({ i }) => glide(f, f0 + 8 + i)} />
          </div>
          <div style={{ position: 'absolute', left: cd.xWord, top: cd.top2, ...lineMask(cd.s) }}>
            <KText text="Days" size={cd.s} weight={700} tracking={-0.02} charStyle={({ i }) => glide(f, f0 + 12 + i)} />
          </div>
        </div>
      </At>

      {/* the location: "bangalore" in Caveat on a straight brush line */}
      {f >= fBang - 1 ? (
        <At x={cityX} y={cityY}>
          <div style={{ position: 'relative', width: wCity, height: citySize }}>
            <div style={{ position: 'absolute', left: citySize * 0.02, top: baselineFrac(FONTS.hand) * citySize + citySize * 0.08, width: wCity }}>
              <Mark name="underline-line" color="yellow" width={wCity} height={citySize * 0.1} stretch reveal={prog(f, fBang + 8, 10, E.inOut)} />
            </div>
            <KText
              text="bangalore"
              size={citySize}
              family="hand"
              weight={700}
              color={COLORS.yellow}
              charStyle={({ i }) => {
                const p = prog(f, fBang + i * 1.4, 16, E.outSoft);
                return { transform: `translateY(${(1 - p) * citySize * 0.3}px)`, opacity: p };
              }}
            />
          </div>
        </At>
      ) : null}

      {/* on tour: an auto-rickshaw (Bengaluru doodle) rides above the line, then leaves with the extras */}
      {f >= f0 && leave < 1 ? (
        <At x={X(L.wide ? 0.82 : 0.74) - travelBob(f)} y={r.y - P(L.wide ? 150 : 140)}>
          <div
            style={{
              opacity: 1 - leave,
              transform: `scale(${pop(f, f0 + 10, { damping: 12, stiffness: 220, mass: 0.6 })}) translateY(${Math.abs(Math.sin((f - f0) * 0.55)) * -P(5)}px) rotate(${Math.sin((f - f0) * 0.55) * 1.5}deg)`,
              transformOrigin: '50% 100%',
            }}
          >
            <Doodle name="auto-rickshaw" size={P(150)} />
          </div>
        </At>
      ) : null}

      {/* date and venue, bottom centre, last */}
      {[
        { text: END_CARD.dateLine, size: sDate, y: yDate, weight: 700, color: COLORS.white, tracking: -0.01, at: fDetails },
        { text: END_CARD.detailLine, size: sVenue, y: yVenue, weight: FONTS.weight.regular, color: COLORS.inkMuted, tracking: 0, at: fDetails + 6 },
      ].map((l) => {
        if (!l.text || f < l.at - 1) return null;
        const p = prog(f, l.at, 18, E.outSoft);
        return (
          <At key={l.text} x={(L.W - textWidth(l.text, l.size, l.weight, 'sans', l.tracking)) / 2} y={l.y}>
            <div style={{ opacity: p, transform: `translateY(${(1 - p) * P(12)}px)` }}>
              <KText text={l.text} size={l.size} weight={l.weight} tracking={l.tracking} color={l.color} />
            </div>
          </At>
        );
      })}
    </>
  );
};

/** a little forward-and-back sway while the stations glide past */
const travelBob = (f: number) => Math.sin(f * 0.09) * 6;

const glide = (f: number, start: number): React.CSSProperties => {
  const p = prog(f, start, 18, E.outSoft);
  return { transform: `translateY(${(1 - p) * 140}%)` };
};
