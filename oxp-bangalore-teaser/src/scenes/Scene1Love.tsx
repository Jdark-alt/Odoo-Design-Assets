// Scene 1 (0:00-0:06): "India loves the Odoo Experience."
// The map draws itself, hearts rise from cities, pins from across India gather
// into a heart over Gujarat, and the Odoo Experience lockup lands as the anchor.
// Over its last second the camera dives into the "E" of "Experience" (Scene 2).
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, pop, prog, punch, rng, tw } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { LOGO_RATIO, Logo, Mark } from '../components/Brand';
import { INDIA_CITIES, INDIA_VB, IndiaMap } from '../components/Graphics';
import { diveCamera, loveLayout } from './shared';

const C = CUES.love;
const HOME = 'gandhinagar'; // Odoo Experience's usual home in Gujarat
const HEART_CITIES = ['delhi', 'mumbai', 'kolkata', 'chennai', 'hyderabad', 'jaipur', 'lucknow', 'kochi', 'guwahati', 'bhopal', 'nagpur', 'patna', 'bhubaneswar', 'srinagar', 'goa', 'pune', 'visakhapatnam', 'chandigarh'];
const PIN_CITIES = Object.keys(INDIA_CITIES).filter((c) => c !== HOME && c !== 'ahmedabad');

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
  if (f >= b(CUES.drop.drop)) return null;

  // the camera: a gentle push, then the dive into the E (Scene 2 lands it)
  const diving = f >= b(CUES.drop.push);
  const others = 1 - prog(f, b(CUES.drop.dive), 6, E.inSoft); // everything but the lockup clears

  // ---- map ----
  const { mapW, mapH, mapX, mapTop } = lay;
  const toMap = (c: string) => {
    const p = INDIA_CITIES[c];
    return { x: (p[0] / INDIA_VB[2]) * mapW, y: (p[1] / INDIA_VB[3]) * mapH };
  };
  const fIndia = b(C.india);
  const draw = tw(f, fIndia, b(C.mapDone), 0, 1, E.inOut);
  const fill = tw(f, fIndia + 12, b(C.mapDone) + 10, 0, 0.6, E.inOutSoft);
  const mapIn = pop(f, fIndia, { damping: 16, stiffness: 120 });
  const mapScale = mix(1.06, 1, mapIn) * (1 + 0.03 * prog(f, fIndia, 150, E.inOutSoft));
  const home = toMap(HOME);

  const wLoves = textWidth('loves', lay.sLoves, 700, 'hand');
  const hold = drift(f, P(4), 120, 2);

  return (
    <div style={{ position: 'absolute', inset: 0, transform: diving ? cam.at(f).transform : undefined, transformOrigin: '0 0' }}>
      {/* ------------------------------------------------ India map */}
      <div
        style={{
          position: 'absolute',
          left: mapX,
          top: mapTop,
          width: mapW,
          height: mapH,
          transform: `scale(${mapScale}) translateY(${drift(f, P(4), 140, 7)}px)`,
          transformOrigin: `${(home.x / mapW) * 100}% ${(home.y / mapH) * 100}%`,
          opacity: others,
        }}
      >
        <IndiaMap width={mapW} draw={draw} fill={fill} strokeWidth={P(3)} />
        <Hearts f={f} toMap={toMap} size={P(30)} rise={P(150)} />
        <HeartOfPins f={f} toMap={toMap} home={home} dot={P(9)} width={P(120)} />
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
              const p = pop(f, fIndia + i * 2, { damping: 11, stiffness: 230, mass: 0.7 });
              return {
                transform: `translateY(${(1 - p) * -lay.sIndia * 0.6}px) scale(${mix(1.5, 1, p)}) rotate(${(1 - p) * (i % 2 ? 9 : -9)}deg)`,
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
            <Mark name="underline-line" color="yellow" width={wLoves} height={lay.sLoves * 0.1} stretch reveal={prog(f, b(C.loves) + 4, 8, E.inOut)} />
          </div>
          <KText
            text="loves"
            size={lay.sLoves}
            family="hand"
            weight={700}
            color={COLORS.yellow}
            charStyle={({ i }) => {
              const p = pop(f, b(C.loves) + i * 1.4, { damping: 11, stiffness: 240, mass: 0.6 });
              return { transform: `translateY(${(1 - p) * P(40)}px) scale(${mix(0.4, 1, p)}) rotate(${(1 - p) * -12}deg)`, opacity: Math.min(1, p * 4) };
            }}
          />
        </div>
      </At>

      {/* ------------------------------------------------ "the" */}
      <At x={X(0)} y={lay.yThe + hold * 0.3}>
        <div style={{ ...lineMask(lay.sThe), opacity: others }}>
          <KText text="the" size={lay.sThe} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, b(C.the) + i * 1.2, 11)} />
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
  const wipe = prog(f, start, 11, E.out);
  const slide = (1 - prog(f, start, 16, E.out)) * -logoH * 0.9;
  const width = wLogo + gap + textWidth('Experience.', size, 700, 'sans', -0.02);
  return (
    <div style={{ position: 'relative', width, height: logoH * 1.2, clipPath: `inset(-20% ${(1 - wipe) * 100}% -40% -5%)`, transform: `translateX(${slide}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${punch(f, start + 2, 0.08, 6)})`, transformOrigin: '0% 100%' }}>
        <Logo height={logoH} />
      </div>
      <div style={{ position: 'absolute', left: wLogo + gap, top: logoH - size * 0.863 }}>
        <KText
          text="Experience."
          size={size}
          weight={700}
          tracking={-0.02}
          charStyle={({ i }) => {
            const p = prog(f, start + 2 + i * 0.9, 12, E.back);
            return { transform: `translateX(${(1 - p) * size * 0.9}px)`, opacity: Math.min(1, p * 2) };
          }}
        />
      </div>
    </div>
  );
};

/** Hearts rising from cities across the map. */
const Hearts: React.FC<{ f: number; toMap: (c: string) => { x: number; y: number }; size: number; rise: number }> = ({ f, toMap, size, rise: riseBy }) => {
  const r = useMemo(() => rng(11), []);
  const spec = useMemo(() => HEART_CITIES.map((c, i) => ({ c, i, s: 0.6 + r() * 0.7, sway: r() * Math.PI * 2, delay: r() * 22, col: i % 3 === 0 ? 'yellow' : 'red' })), [r]);
  return (
    <>
      {spec.map(({ c, i, s, sway, delay, col }) => {
        const t0 = b(C.loves) + 1 + delay;
        const t = f - t0;
        if (t < 0 || t > 46) return null;
        const p = Math.min(1, t / 46);
        const pos = toMap(c);
        const y = pos.y - riseBy * (1 - Math.pow(1 - p, 2));
        const x = pos.x + Math.sin(sway + t * 0.18) * size * 0.4;
        const o = Math.min(1, t / 4) * (1 - Math.max(0, (t - 26) / 20));
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s * pop(f, t0, { damping: 9, stiffness: 300 })})`, opacity: o }}>
            <Mark name="heart" color={col} height={size} />
          </div>
        );
      })}
    </>
  );
};


/** Pins pop up across India, then gather into a heart of dots over Gujarat. */
const HeartOfPins: React.FC<{ f: number; toMap: (c: string) => { x: number; y: number }; home: { x: number; y: number }; dot: number; width: number }> = ({
  f,
  toMap,
  home,
  dot,
  width,
}) => {
  const spec = useMemo(() => {
    // points spaced evenly along a heart outline
    const n = PIN_CITIES.length;
    const curve = (t: number) => ({
      x: 16 * Math.pow(Math.sin(t), 3),
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    });
    const dense = Array.from({ length: 2000 }, (_, i) => curve((i / 2000) * Math.PI * 2));
    const lens = [0];
    for (let i = 1; i < dense.length; i++) lens.push(lens[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
    const total = lens[lens.length - 1];
    const slots: { x: number; y: number }[] = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const target = (k / n) * total;
      while (j < lens.length - 1 && lens[j] < target) j++;
      slots.push({ x: dense[j].x / 32, y: (dense[j].y - 2.5) / 32 });
    }
    const r = rng(5);
    // each city takes the nearest free slot by angle, so paths don't cross much
    const order = PIN_CITIES.map((c, i) => ({ c, i, a: Math.atan2(toMap(c).y - home.y, toMap(c).x - home.x) })).sort((p, q) => p.a - q.a);
    const slotOrder = slots.map((s, i) => ({ s, i, a: Math.atan2(s.y, s.x) })).sort((p, q) => p.a - q.a);
    return order.map((o, k) => ({
      c: o.c,
      i: o.i,
      slot: slotOrder[k].s,
      appear: r() * 9,
      travel: 15 + r() * 7,
      lag: r() * 6,
      col: o.i % 7 === 0 ? COLORS.yellow : o.i % 11 === 0 ? COLORS.teal : COLORS.white,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home.x, home.y]);
  const fP = b(C.pins);
  const fC = b(C.converge);
  // the heart beats once on each of the last four beats of the scene
  let beat = 1;
  for (const hb of C.heartbeats) {
    const t = f - b(hb);
    if (t >= 0 && t < 15) beat += 0.14 * Math.exp(-t / 3) + 0.07 * (t >= 4 ? Math.exp(-(t - 4) / 3) : 0);
  }
  const formed = prog(f, fC + 20, 10, E.out);
  return (
    <div style={{ position: 'absolute', left: home.x, top: home.y, width: 0, height: 0, transform: `scale(${beat})` }}>
      {/* soft glow once the heart has formed */}
      <div
        style={{
          position: 'absolute',
          left: -width * 0.8,
          top: -width * 0.8,
          width: width * 1.6,
          height: width * 1.6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)',
          opacity: formed,
        }}
      />
      {spec.map(({ c, i, appear, travel, lag, slot, col }) => {
        const start = fP + appear;
        if (f < start) return null;
        const a0 = toMap(c);
        const a = { x: a0.x - home.x, y: a0.y - home.y };
        const target = { x: slot.x * width, y: slot.y * width };
        const pAt = (ff: number) => prog(ff, fC + lag, travel, E.inOutSoft);
        const pos = (ff: number) => {
          const k = pAt(ff);
          const mx = (a.x + target.x) / 2 + (a.y - target.y) * 0.16;
          const my = (a.y + target.y) / 2 - (a.x - target.x) * 0.16;
          const u = 1 - k;
          return { x: u * u * a.x + 2 * u * k * mx + k * k * target.x, y: u * u * a.y + 2 * u * k * my + k * k * target.y };
        };
        const p = pos(f);
        const s = pop(f, start, { damping: 10, stiffness: 320 });
        const moving = pAt(f) > 0.02 && pAt(f) < 0.98;
        return (
          <React.Fragment key={i}>
            {moving
              ? [3, 6].map((lagF, j) => {
                  const q = pos(f - lagF);
                  return (
                    <div
                      key={j}
                      style={{ position: 'absolute', left: q.x, top: q.y, width: dot * (0.8 - j * 0.2), height: dot * (0.8 - j * 0.2), borderRadius: '50%', background: col, opacity: 0.3 - j * 0.12, transform: 'translate(-50%,-50%)' }}
                    />
                  );
                })
              : null}
            <div
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: dot,
                height: dot,
                borderRadius: '50%',
                background: col,
                boxShadow: `0 0 ${dot * 1.2}px ${dot * 0.2}px rgba(255,255,255,0.4)`,
                transform: `translate(-50%,-50%) scale(${s})`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
