// Scene 1 (0:00-0:04): "India loves the Odoo Experience."
// Quick: the map draws itself, hearts pop up across India, a glowing pin drops
// onto Gujarat, and the Odoo Experience lockup lands as the anchor. Then the
// camera dives into the bottom stroke of the "E" of "Experience" (Scene 2).
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, pop, prog, punch, rng, tw } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { LOGO_RATIO, Logo, Mark } from '../components/Brand';
import { INDIA_CITIES, INDIA_VB, IndiaMap } from '../components/Graphics';
import { HANDOFF_Z, diveCamera, loveLayout } from './shared';

const C = CUES.love;
const HOME = 'gandhinagar'; // Odoo Experience's usual home in Gujarat
const HEART_CITIES = Object.keys(INDIA_CITIES).filter((c) => !['gandhinagar', 'ahmedabad', 'vadodara', 'rajkot', 'surat'].includes(c));

export const Scene1Love: React.FC = () => (
  <SceneWindow id="love">
    <Love />
  </SceneWindow>
);

const Love: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { P, X } = L;
  const lay = loveLayout(L);
  const cam = diveCamera(L);
  const view = cam.at(f);
  if (f >= b(CUES.drop.dive) && view.z >= HANDOFF_Z) return null; // Scene 2 has the camera now

  const diving = f >= b(CUES.drop.push);
  const others = 1 - prog(f, b(CUES.drop.dive), 5, E.inSoft); // everything but the lockup clears

  // ---- map ----
  const { mapW, mapH, mapX, mapTop } = lay;
  const toMap = (c: string) => {
    const p = INDIA_CITIES[c];
    return { x: (p[0] / INDIA_VB[2]) * mapW, y: (p[1] / INDIA_VB[3]) * mapH };
  };
  const fIndia = b(C.india);
  const draw = tw(f, fIndia, b(C.mapDone), 0, 1, E.inOut);
  const fill = tw(f, fIndia + 8, b(C.mapDone) + 8, 0, 0.6, E.inOutSoft);
  const mapIn = pop(f, fIndia, { damping: 16, stiffness: 150 });
  const mapScale = mix(1.06, 1, mapIn) * (1 + 0.025 * prog(f, fIndia, 100, E.inOutSoft));
  const home = toMap(HOME);

  const wLoves = textWidth('loves', lay.sLoves, 700, 'hand');
  const hold = drift(f, P(3), 100, 2);

  return (
    <div style={{ position: 'absolute', inset: 0, transform: diving ? view.transform : undefined, transformOrigin: '0 0' }}>
      {/* ------------------------------------------------ India map */}
      <div
        style={{
          position: 'absolute',
          left: mapX,
          top: mapTop,
          width: mapW,
          height: mapH,
          transform: `scale(${mapScale})`,
          transformOrigin: `${(home.x / mapW) * 100}% ${(home.y / mapH) * 100}%`,
          opacity: others,
        }}
      >
        <IndiaMap width={mapW} draw={draw} fill={fill} strokeWidth={P(3)} />
        <Hearts f={f} toMap={toMap} size={P(30)} />
        <GujaratPin f={f} at={home} size={P(58)} />
      </div>

      {/* ------------------------------------------------ "India" */}
      <At x={X(0) - lay.sIndia * 0.03} y={lay.yTop + hold}>
        <div style={{ opacity: others }}>
          <KText
            text="India"
            size={lay.sIndia}
            weight={700}
            tracking={-0.03}
            charStyle={({ i }) => {
              const p = pop(f, fIndia + i * 1.2, { damping: 13, stiffness: 300, mass: 0.6 });
              return {
                transform: `translateY(${(1 - p) * -lay.sIndia * 0.5}px) scale(${mix(1.4, 1, p)}) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg)`,
                opacity: Math.min(1, p * 3),
              };
            }}
          />
        </div>
      </At>

      {/* ------------------------------------------------ "loves": Caveat, on a straight brush line */}
      <At x={lay.xLoves} y={lay.lovesTop + hold}>
        <div style={{ position: 'relative', opacity: others }}>
          <div style={{ position: 'absolute', left: lay.sLoves * 0.02, top: lay.sLoves * 0.86, width: wLoves }}>
            <Mark name="underline-line" color="yellow" width={wLoves} height={lay.sLoves * 0.1} stretch reveal={prog(f, b(C.loves) + 3, 6, E.inOut)} />
          </div>
          <KText
            text="loves"
            size={lay.sLoves}
            family="hand"
            weight={700}
            color={COLORS.yellow}
            charStyle={({ i }) => {
              const p = pop(f, b(C.loves) + i * 0.9, { damping: 12, stiffness: 320, mass: 0.5 });
              return { transform: `translateY(${(1 - p) * P(34)}px) scale(${mix(0.4, 1, p)}) rotate(${(1 - p) * -12}deg)`, opacity: Math.min(1, p * 4) };
            }}
          />
        </div>
      </At>

      {/* ------------------------------------------------ "the" */}
      <At x={X(0)} y={lay.yThe}>
        <div style={{ ...lineMask(lay.sThe), opacity: others }}>
          <KText text="the" size={lay.sThe} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, b(C.the) + i, 7)} />
        </div>
      </At>

      {/* ------------------------------------------------ Odoo Experience. (the anchor) */}
      <At x={X(0)} y={lay.yLock}>
        <Lockup f={f} start={b(C.odooExperience)} logoH={lay.lockH} />
      </At>
    </div>
  );
};

/** Mask-rise for one character (fast in, soft settle). */
export const rise = (f: number, start: number, dur: number, dist = 1.5): React.CSSProperties => {
  const p = prog(f, start, dur, E.out);
  return { transform: `translateY(${(1 - p) * dist * 100}%)` };
};

/** Logo + "Experience." with a sweeping wipe (the brand emphasis). */
const Lockup: React.FC<{ f: number; start: number; logoH: number }> = ({ f, start, logoH }) => {
  const gap = logoH * 0.5;
  const size = logoH * 0.98;
  const wLogo = logoH * LOGO_RATIO;
  const wipe = prog(f, start, 8, E.out);
  const slide = (1 - prog(f, start, 12, E.out)) * -logoH * 0.9;
  const width = wLogo + gap + textWidth('Experience.', size, 700, 'sans', -0.02);
  return (
    <div style={{ position: 'relative', width, height: logoH * 1.2, clipPath: `inset(-20% ${(1 - wipe) * 100}% -40% -5%)`, transform: `translateX(${slide}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${punch(f, start + 2, 0.08, 5)})`, transformOrigin: '0% 100%' }}>
        <Logo height={logoH} />
      </div>
      <div style={{ position: 'absolute', left: wLogo + gap, top: logoH - size * 0.863 }}>
        <KText
          text="Experience."
          size={size}
          weight={700}
          tracking={-0.02}
          charStyle={({ i }) => {
            const p = prog(f, start + 1 + i * 0.6, 9, E.back);
            return { transform: `translateX(${(1 - p) * size * 0.9}px)`, opacity: Math.min(1, p * 2) };
          }}
        />
      </div>
    </div>
  );
};

/** Hearts pop up all over the map (the kit's official heart pop). */
const Hearts: React.FC<{ f: number; toMap: (c: string) => { x: number; y: number }; size: number }> = ({ f, toMap, size }) => {
  const spec = useMemo(() => {
    const r = rng(11);
    return HEART_CITIES.map((c, i) => ({ c, i, s: 0.55 + r() * 0.7, delay: r() * 20, life: 26 + r() * 14, col: i % 3 === 0 ? 'yellow' : 'red', tilt: (r() - 0.5) * 30 }));
  }, []);
  return (
    <>
      {spec.map(({ c, i, s, delay, life, col, tilt }) => {
        const t0 = b(C.loves) + delay;
        const t = f - t0;
        if (t < 0 || t > life) return null;
        const pos = toMap(c);
        const p = pop(f, t0, { damping: 9, stiffness: 320 });
        const o = Math.min(1, t / 3) * (1 - Math.max(0, (t - life + 10) / 10));
        return (
          <div key={i} style={{ position: 'absolute', left: pos.x, top: pos.y - (t / life) * size * 1.4, transform: `translate(-50%,-50%) scale(${s * p}) rotate(${tilt}deg)`, opacity: o }}>
            <Mark name="heart" color={col} height={size} />
          </div>
        );
      })}
    </>
  );
};

/** A glowing location pin drops onto Gujarat and pulses on the beat. */
const GujaratPin: React.FC<{ f: number; at: { x: number; y: number }; size: number }> = ({ f, at, size }) => {
  const f0 = b(C.pin);
  if (f < f0 - 2) return null;
  const drop = pop(f, f0, { damping: 11, stiffness: 260, mass: 0.6 });
  const y = (1 - drop) * -size * 2.2;
  const w = size * 0.74;
  const rings = [f0 + 6, ...C.pinPulses.map((x) => b(x))].map((t) => (f >= t ? Math.min(1, (f - t) / 18) : -1));
  return (
    <div style={{ position: 'absolute', left: at.x, top: at.y, width: 0, height: 0 }}>
      {/* pulse rings on the ground */}
      {rings.map((k, i) =>
        k >= 0 && k < 1 ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -size * 0.5,
              top: -size * 0.18,
              width: size,
              height: size * 0.36,
              borderRadius: '50%',
              border: `${Math.max(1.5, size * 0.045)}px solid ${COLORS.yellow}`,
              transform: `scale(${mix(0.3, 2.6, E.out(k))})`,
              opacity: (1 - k) * 0.9,
            }}
          />
        ) : null,
      )}
      {/* soft glow */}
      <div
        style={{
          position: 'absolute',
          left: -size * 1.1,
          top: -size * 1.6,
          width: size * 2.2,
          height: size * 2.2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,177,48,0.45) 0%, rgba(251,177,48,0.12) 40%, rgba(251,177,48,0) 70%)',
          opacity: prog(f, f0 + 2, 10),
        }}
      />
      {/* the pin: white teardrop with a yellow core */}
      <svg
        width={w}
        height={size}
        viewBox="0 0 74 100"
        style={{ position: 'absolute', left: -w / 2, top: -size + y, overflow: 'visible', opacity: Math.min(1, drop * 3), transform: `scale(${mix(1.15, 1, drop)}, ${mix(0.85, 1, drop)})`, transformOrigin: '50% 100%' }}
      >
        <path d="M37 98 C30 84 4 60 4 36 C4 17 19 3 37 3 C55 3 70 17 70 36 C70 60 44 84 37 98 Z" fill={COLORS.white} />
        <circle cx={37} cy={36} r={14} fill={COLORS.yellow} />
      </svg>
    </div>
  );
};
