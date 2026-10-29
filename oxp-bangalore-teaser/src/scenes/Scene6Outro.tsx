// Scene 6 (0:23-0:30): "The Odoo Experience is on tour." / "Next stop: Bangalore." / lockup + "Coming soon."
// The purple from "more." becomes a metro line (the brand's route motif); stations
// glide past until the Bangalore stop, while the Vidhana Soudha finishes tracing.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, END_CARD, FONTS, MONUMENT_TEASE, b } from '../config';
import { useLayout } from '../lib/layout';
import { fitSize } from '../lib/fonts';
import { E, drift, mix, pop, prog, tw } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { Doodle, LOGO_RATIO, Logo, Mark } from '../components/Brand';
import { Kolam, MONUMENT_RATIO, Monument } from '../components/Graphics';
import { MONUMENT_DOME } from '../brand/vidhanaSoudha';
import { routeLine, teaseMonument } from './shared';

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
  const fSoon = b(C.comingSoon);

  // everything before the lockup leaves softly
  const leave = prog(f, fLock - 12, 12, E.inSoft);
  const hold = drift(f, P(3), 150, 12);

  // ---- route line and stations ----
  const r = routeLine(L);
  const gap = P(L.wide ? 330 : 250);
  const travel = (STATIONS - 1) * gap * tw(f, f0, fBang, 0, 1, E.inOut);
  const stopX = X(0.035);
  const routeWipe = prog(f, fLock - 4, 16, E.inOut);

  // ---- Vidhana Soudha: pull back from the Scene 3 crop while the trace completes ----
  const crop = teaseMonument(L);
  const fullW = Math.min(L.box.w, (L.box.h * (L.wide ? 0.62 : 0.5)) * MONUMENT_RATIO);
  const fullH = fullW / MONUMENT_RATIO;
  const full = { width: fullW, domeX: X(0.5), domeY: L.box.y + L.box.h - fullH + fullH * MONUMENT_DOME.y };
  const pull = prog(f, b(C.monumentStart), b(C.monumentEnd) - b(C.monumentStart) - 6, E.inOut);
  const mW = Math.exp(mix(Math.log(crop.width), Math.log(full.width), pull));
  const mDomeX = mix(crop.domeX, full.domeX, pull);
  const mDomeY = mix(crop.domeY, full.domeY, pull);
  const mH = mW / MONUMENT_RATIO;
  const trace = tw(f, b(C.monumentStart) + 2, b(C.monumentEnd), MONUMENT_TEASE, 1, E.inOut);
  const mOpacity = tw(f, b(C.monumentStart) - 2, b(C.monumentStart) + 10, 0, 0.36, E.out) * mix(1, 0.55, prog(f, fLock, 20, E.inOut));

  // ---- type sizes ----
  const sThe = P(100);
  const logoH = Math.min(P(106), (L.box.w * 0.98) / (LOGO_RATIO + 0.5 + (textWidth('Experience', 100, 700, 'sans', -0.02) / 100) * 0.98));
  const sExp = logoH * 0.98;
  const sTour = P(128);
  const sNext = P(66);
  const sBang = Math.min(fitSize('Bangalore', L.box.w * 0.98, 700, FONTS.sans, -0.03), P(230));
  const yThe = Y(L.wide ? 0.0 : 0.02);
  const yExp = yThe + sThe * 1.1;
  const yTour = yExp + logoH * 1.3;

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
            transform: `scale(${mix(1, 0.86, prog(f, fLock - 4, 30, E.inOut))})`,
            transformOrigin: '50% 100%',
          }}
        >
          <Monument width={mW} progress={trace} strokeWidth={P(2.3)} />
        </div>
      ) : null}

      {/* metro line: the purple from "more." folded into a track */}
      <div style={{ position: 'absolute', left: 0, top: r.y - r.thickness / 2, width: L.W, height: r.thickness, background: COLORS.purple, clipPath: `inset(0 0 0 ${routeWipe * 100}%)` }} />
      {Array.from({ length: STATIONS }, (_, k) => {
        const x = stopX + k * gap - travel;
        if (x < -P(80) || x > L.W + P(80)) return null;
        const isStop = k === STATIONS - 1;
        const appear = pop(f, f0 + k * 2, { damping: 11, stiffness: 300 });
        const arrive = isStop ? pop(f, fBang - 2, { damping: 9, stiffness: 220 }) : 0;
        const rad = isStop ? mix(P(20), P(30), arrive) : P(19);
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
                  transform: `scale(${mix(1, 3.4, ringP)})`,
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
                border: `${P(isStop ? 7 : 6)}px solid ${COLORS.purple}`,
                boxSizing: 'border-box',
                boxShadow: isStop ? `0 0 0 ${P(5) * arrive}px ${COLORS.white}` : undefined,
                transform: `scale(${appear})`,
                opacity: 1 - leave,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* "The Odoo Experience is on tour." */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - leave, transform: `translateY(${-leave * P(50) + hold}px)` }}>
        <At x={X(0)} y={yThe}>
          <div style={lineMask(sThe)}>
            <KText text="The" size={sThe} weight={FONTS.weight.light} charStyle={({ i }) => glide(f, f0 + i * 1.2)} />
          </div>
        </At>
        <At x={X(0)} y={yExp}>
          <div style={{ position: 'relative', height: logoH * 1.25, width: logoH * LOGO_RATIO + logoH * 0.5 + textWidth('Experience', sExp, 700, 'sans', -0.02) }}>
            <div style={{ position: 'absolute', left: 0, top: 0, clipPath: `inset(-10% ${(1 - prog(f, f0 + 5, 16, E.outSoft)) * 100}% -10% 0)` }}>
              <Logo height={logoH} />
            </div>
            <div style={{ position: 'absolute', left: logoH * LOGO_RATIO + logoH * 0.5, top: logoH - sExp * 0.863, ...lineMask(sExp) }}>
              <KText text="Experience" size={sExp} weight={700} tracking={-0.02} charStyle={({ i }) => glide(f, f0 + 9 + i * 1)} />
            </div>
          </div>
        </At>
        <At x={X(0)} y={yTour}>
          <div style={{ display: 'flex', ...lineMask(sTour) }}>
            <KText text="is on " size={sTour} weight={FONTS.weight.light} charStyle={({ i }) => glide(f, f0 + 16 + i * 1)} />
            <KText text="tour." size={sTour} weight={700} tracking={-0.02} charStyle={({ i }) => glide(f, f0 + 22 + i * 1.2)} />
          </div>
        </At>
      </div>

      {/* "Next stop:" then "Bangalore" */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - leave, transform: `translateY(${-leave * P(40)}px)` }}>
        <At x={X(0)} y={r.y + P(46)}>
          <div style={{ clipPath: `inset(-20% ${(1 - prog(f, fNext, 10, E.out)) * 100}% -40% 0)` }}>
            <KText text="Next stop:" size={sNext} weight={700} tracking={-0.01} color={COLORS.white} />
          </div>
        </At>
        <At x={X(0) - sBang * 0.02} y={r.y + P(46) + sNext * 1.25}>
          <div style={lineMask(sBang)}>
            <KText
              text="Bangalore"
              size={sBang}
              weight={700}
              tracking={-0.03}
              charStyle={({ i }) => {
                const p = prog(f, fBang + i * 1.6, 18, E.outSoft);
                return { transform: `translateY(${(1 - p) * 120}%)` };
              }}
            />
          </div>
        </At>
      </div>

      {/* ---------------- end card ---------------- */}
      {f >= fLock - 2 ? <EndCard f={f} fLock={fLock} fSoon={fSoon} /> : null}
    </>
  );
};

const glide = (f: number, start: number): React.CSSProperties => {
  const p = prog(f, start, 18, E.outSoft);
  return { transform: `translateY(${(1 - p) * 120}%)` };
};

/** Odoo Experience lockup (logo, Experience, city in Caveat on the official scribble) and "Coming soon." */
const EndCard: React.FC<{ f: number; fLock: number; fSoon: number }> = ({ f, fLock, fSoon }) => {
  const L = useLayout();
  const { P, X, Y } = L;
  const lk = Math.min(P(112), (L.box.w * 0.97) / (LOGO_RATIO + 0.5 + textWidth('Experience', 100, 700, 'sans', -0.02) / 100 * 0.98));
  const sWord = lk * 0.98;
  const sCity = lk * 1.08 * 1.2;
  const wLogo = lk * LOGO_RATIO;
  const wCity = textWidth('bangalore', sCity, 700, 'hand');
  const x0 = X(0);
  const y0 = Y(L.wide ? 0.16 : 0.24);
  const fadeIn = prog(f, fLock + 2, 26, E.outSoft);
  const settle = 1 + 0.02 * prog(f, fLock, 90, E.inOutSoft);
  const soonP = prog(f, fSoon, 26, E.outSoft);
  const sSoon = P(88);
  const ySoon = y0 + lk * 1.35 + sCity * 1.1 + P(70);
  const kolamPitch = P(72);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${settle})`, transformOrigin: '30% 45%' }}>
      {/* kolam: one line, every dot; bleeding off the top-right corner */}
      <div style={{ position: 'absolute', left: L.W - 6 * kolamPitch * 0.6, top: -P(170), opacity: 0.75 * fadeIn }}>
        <Kolam cols={5} rows={6} pitch={kolamPitch} draw={prog(f, fLock + 2, 72, E.inOut)} dots={prog(f, fLock, 18)} stroke={0.14} />
      </div>

      <div style={{ position: 'absolute', left: x0, top: y0, opacity: fadeIn, transform: `translateY(${(1 - fadeIn) * P(30)}px)` }}>
        <div style={{ position: 'relative', height: lk }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <Logo height={lk} />
          </div>
          <div style={{ position: 'absolute', left: wLogo + lk * 0.5, top: lk - sWord * 0.863 }}>
            <KText text="Experience" size={sWord} weight={700} tracking={-0.02} />
          </div>
        </div>
        <div style={{ position: 'relative', marginLeft: lk * 3.668, marginTop: lk * 0.04, width: wCity, height: sCity }}>
          <div style={{ position: 'absolute', left: sCity * 0.02, top: sCity * 0.9, width: wCity - sCity * 0.04 }}>
            <Mark name="underline-scribble" color="yellow" width={wCity - sCity * 0.04} height={sCity * 0.26} stretch reveal={prog(f, fLock + 12, 14, E.inOut)} />
          </div>
          <KText
            text="bangalore"
            size={sCity}
            family="hand"
            weight={700}
            color={COLORS.yellow}
            charStyle={({ i }) => {
              const p = pop(f, fLock + 6 + i * 1.2, { damping: 14, stiffness: 200, mass: 0.6 });
              return { transform: `translateY(${(1 - p) * sCity * 0.25}px)`, opacity: Math.min(1, p * 2) };
            }}
          />
        </div>
      </div>

      <At x={x0} y={ySoon}>
        <div style={{ opacity: soonP, transform: `translateY(${(1 - soonP) * P(24)}px)` }}>
          <KText text="Coming soon." size={sSoon} weight={FONTS.weight.light} tracking={mix(0.06, 0, soonP)} />
        </div>
      </At>

      {/* two Bengaluru doodles from the brand set, in the right third, clear of the type */}
      {[
        { name: 'auto-rickshaw', x: L.wide ? 0.7 : L.square ? 0.6 : 0.65, y: L.wide ? 0.42 : L.square ? 0.6 : 0.565, size: P(180), rot: -5, delay: 4 },
        { name: 'filter-coffee', x: L.wide ? 0.86 : 0.85, y: L.wide ? 0.3 : L.square ? 0.52 : 0.47, size: P(132), rot: 6, delay: 9 },
      ].map((d, i) => {
        const p = pop(f, fSoon + d.delay, { damping: 11, stiffness: 220, mass: 0.7 });
        return (
          <At key={d.name} x={X(d.x)} y={Y(d.y) + drift(f, P(6), 70, 20 + i)}>
            <div style={{ transform: `scale(${p}) rotate(${d.rot + (1 - p) * 14 + drift(f, 1.5, 90, 30 + i)}deg)`, transformOrigin: '50% 90%' }}>
              <Doodle name={d.name} size={d.size} />
            </div>
          </At>
        );
      })}

      {/* reserved: date / registration line, filled in from END_CARD when confirmed */}
      {END_CARD.dateLine ? (
        <At x={x0} y={ySoon + sSoon * 1.5}>
          <div style={{ opacity: prog(f, fSoon + 10, 20, E.outSoft) }}>
            <KText text={END_CARD.dateLine} size={P(40)} weight={700} color={COLORS.white} />
          </div>
        </At>
      ) : null}
      {END_CARD.detailLine ? (
        <At x={x0} y={ySoon + sSoon * 1.5 + P(60)}>
          <div style={{ opacity: prog(f, fSoon + 14, 20, E.outSoft) }}>
            <KText text={END_CARD.detailLine} size={P(30)} weight={FONTS.weight.regular} color={COLORS.inkMuted} />
          </div>
        </At>
      ) : null}
    </div>
  );
};
