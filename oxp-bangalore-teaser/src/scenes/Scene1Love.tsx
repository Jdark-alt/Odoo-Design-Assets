// Scene 1 (0:00-0:06): "Every year," / "India loves to gather" / "for the Odoo Experience."
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, FRAMES_PER_BEAT, b } from '../config';
import { useLayout } from '../lib/layout';
import { E, drift, mix, onBeats, pop, prog, punch, rng, tw } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { LOGO_RATIO, Logo, Mark } from '../components/Brand';
import { INDIA_CITIES, INDIA_RATIO, INDIA_VB, IndiaMap } from '../components/Graphics';

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
  const { P, X, Y } = L;

  // ---- slowdown into the drop (Scene 2's first half-second) ----
  const fSlow = b(CUES.drop.slowdown);
  const fDrop = b(CUES.drop.drop);
  const slow = tw(f, fSlow, fDrop - 2, 0, 1, E.inOutSoft);
  const suck = tw(f, fDrop - 5, fDrop, 0, 1, E.in);
  const sceneScale = mix(1, 0.93, slow) * mix(1, 0.35, suck);
  const sceneOpacity = mix(1, 0.6, slow) * (1 - suck);

  // ---- map stage ----
  const mapH = Math.min(L.box.h * 0.83, (L.box.w * (L.wide ? 0.46 : 1)) / INDIA_RATIO);
  const mapW = mapH * INDIA_RATIO;
  const mapX = L.box.x + L.box.w - mapW;
  const mapY = L.box.y + (L.box.h - mapH) * (L.wide ? 0.5 : 0.62);
  const toMap = (c: string) => {
    const p = INDIA_CITIES[c];
    return { x: (p[0] / INDIA_VB[2]) * mapW, y: (p[1] / INDIA_VB[3]) * mapH };
  };
  const fIndia = b(C.india);
  const draw = tw(f, fIndia - 2, b(C.mapDone), 0, 1, E.inOut);
  const fill = tw(f, fIndia + 10, b(C.mapDone) + 6, 0, 0.82, E.inOutSoft);
  const mapIn = pop(f, fIndia - 2, { damping: 16, stiffness: 120 });
  const mapScale = mix(1.08, 1, mapIn) * (1 + 0.035 * prog(f, fIndia, 160, E.inOutSoft)) * punch(f, b(C.loves), 0.012, 5);
  const home = toMap(HOME);

  // ---- text sizes ----
  const sEvery = P(60);
  const sIndia = P(300);
  const sLoves = P(230);
  const sGather = P(132);
  const sFor = P(58);
  const lockH = P(98);
  const wEvery = textWidth('Every ', sEvery, FONTS.weight.light);
  const wTo = textWidth('to ', sGather, FONTS.weight.light);
  const wIndia = textWidth('India', sIndia, 700, 'sans', -0.03);
  const wLoves = textWidth('loves', sLoves, 700, 'hand');

  const yEvery = Y(0.02);
  const yIndia = Y(0.075);
  const yLoves = yIndia + sIndia * 0.86;
  const yGather = Y(0.56);
  const yFor = Y(0.745);
  const yLock = Y(0.8);
  const xLoves = X(0) + Math.min(wIndia * 0.42, L.box.w - wLoves - P(140));

  const hold = drift(f, P(5), 120, 2);
  const everyMove = prog(f, fIndia - 5, 11, E.inOut);

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${sceneScale})`, opacity: sceneOpacity, transformOrigin: '50% 50%' }}>
      {/* ------------------------------------------------ India map */}
      <div
        style={{
          position: 'absolute',
          left: mapX,
          top: mapY,
          width: mapW,
          height: mapH,
          transform: `scale(${mapScale}) translateY(${drift(f, P(4), 140, 7)}px)`,
          transformOrigin: `${(home.x / mapW) * 100}% ${(home.y / mapH) * 100}%`,
          opacity: tw(f, fIndia - 2, fIndia + 4, 0, 1),
        }}
      >
        <IndiaMap width={mapW} draw={draw} fill={fill} strokeWidth={P(3.2)} />
        <Hearts f={f} toMap={toMap} size={P(34)} rise={P(170)} />
        <Pins f={f} toMap={toMap} home={home} dot={P(13)} />
      </div>

      {/* ------------------------------------------------ "Every year," */}
      <At x={X(0.035)} y={mix(Y(L.wide ? 0.42 : 0.38), yEvery, everyMove) + hold}>
        <div style={{ display: 'flex', transform: `scale(${mix(1.75, 1, everyMove) * punch(f, b(C.everyYear) + 2, 0.22, 5) * punch(f, b(C.everyYear + 1), 0.07, 4)})`, transformOrigin: '0% 0%', ...lineMask(sEvery) }}>
          <KText text="Every " size={sEvery} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, b(C.everyYear) + i * 1.2, 11)} />
          <KText text="year," size={sEvery} weight={700} charStyle={({ i }) => rise(f, b(C.everyYear) + 5 + i * 1.2, 11)} style={{ marginLeft: 0 }} />
        </div>
      </At>

      {/* ------------------------------------------------ "India" */}
      <At x={X(0) - sIndia * 0.03} y={yIndia + hold * 0.6}>
        <KText
          text="India"
          size={sIndia}
          weight={700}
          tracking={-0.03}
          charStyle={({ i }) => {
            const p = pop(f, fIndia + i * 2, { damping: 11, stiffness: 210, mass: 0.8 });
            return {
              transform: `translateY(${(1 - p) * -sIndia * 0.55}px) scale(${mix(1.6, 1, p)}) rotate(${(1 - p) * (i % 2 ? 9 : -9)}deg)`,
              opacity: Math.min(1, p * 3),
            };
          }}
        />
      </At>

      {/* ------------------------------------------------ "loves" + heart */}
      <At x={xLoves} y={yLoves + hold * 0.4}>
        <div style={{ position: 'relative' }}>
          <KText
            text="loves"
            size={sLoves}
            family="hand"
            weight={700}
            color={COLORS.yellow}
            charStyle={({ i }) => {
              const p = pop(f, b(C.loves) + i * 1.6, { damping: 10, stiffness: 230, mass: 0.6 });
              return { transform: `translateY(${(1 - p) * P(50)}px) scale(${mix(0.3, 1, p)}) rotate(${(1 - p) * -14}deg)`, opacity: Math.min(1, p * 4) };
            }}
          />
          <div style={{ position: 'absolute', left: sLoves * 0.02, top: sLoves * 0.86, width: wLoves - sLoves * 0.04 }}>
            <Mark name="underline-scribble" color="yellow" width={wLoves - sLoves * 0.04} height={sLoves * 0.24} stretch reveal={prog(f, b(C.loves) + 5, 9, E.inOut)} />
          </div>
          {/* the pulsing heart (official Odoo heart pop) */}
          <div
            style={{
              position: 'absolute',
              left: wLoves + P(26),
              top: sLoves * 0.1,
              transform: `scale(${pop(f, b(C.loves) + 3, { damping: 9, stiffness: 260 }) * punch(f, b(C.lovesPulse2), 0.32, 4) * onBeats(f, b(C.toGather), b(CUES.drop.slowdown), FRAMES_PER_BEAT, 0.1)}) rotate(${-8 + drift(f, 4, 60, 3)}deg)`,
              transformOrigin: '50% 60%',
            }}
          >
            <Mark name="heart" color="red" height={P(118)} />
          </div>
        </div>
      </At>

      {/* ------------------------------------------------ "to gather" */}
      <At x={X(0)} y={yGather + hold * 0.3}>
        <div style={{ display: 'flex' }}>
          <div style={lineMask(sGather)}>
            <KText text="to " size={sGather} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, b(C.toGather) + i * 1.5, 12)} />
          </div>
          <Gather f={f} size={sGather} x0={wTo} />
        </div>
      </At>

      {/* ------------------------------------------------ "for the" */}
      <At x={X(0)} y={yFor + hold * 0.2}>
        <div style={lineMask(sFor)}>
          <KText text="for the" size={sFor} weight={FONTS.weight.light} charStyle={({ i }) => rise(f, b(C.forThe) + i * 1.1, 11)} />
        </div>
      </At>

      {/* ------------------------------------------------ Odoo Experience. */}
      <At x={X(0)} y={yLock + hold * 0.1}>
        <Lockup f={f} start={b(C.odooExperience)} logoH={lockH} />
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

/** "gather": letters start scattered and converge, like people coming together. */
const Gather: React.FC<{ f: number; size: number; x0: number }> = ({ f, size }) => {
  const scatter = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: 6 }, () => ({ dx: (r() - 0.5) * 2, dy: (r() - 0.5) * 2, rot: (r() - 0.5) * 80 }));
  }, []);
  return (
    <KText
      text="gather"
      size={size}
      weight={700}
      tracking={-0.02}
      charStyle={({ i }) => {
        const s = scatter[i];
        const p = pop(f, b(C.toGather) + 3 + i * 1.5, { damping: 13, stiffness: 140, mass: 0.9 });
        return {
          transform: `translate(${(1 - p) * s.dx * size * 2.2}px, ${(1 - p) * s.dy * size * 1.6}px) rotate(${(1 - p) * s.rot}deg) scale(${mix(0.4, 1, p)})`,
          opacity: Math.min(1, p * 2.5),
        };
      }}
    />
  );
};

/** Hearts rising from cities across the map. */
const Hearts: React.FC<{ f: number; toMap: (c: string) => { x: number; y: number }; size: number; rise: number }> = ({ f, toMap, size, rise: riseBy }) => {
  const r = useMemo(() => rng(11), []);
  const spec = useMemo(() => HEART_CITIES.map((c, i) => ({ c, i, s: 0.6 + r() * 0.7, sway: r() * Math.PI * 2, delay: r() * 22, col: i % 3 === 0 ? 'yellow' : 'red' })), [r]);
  return (
    <>
      {spec.map(({ c, i, s, sway, delay, col }) => {
        const t0 = b(C.loves) + 2 + delay;
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

/** Pins pop up across India, then converge on Gujarat into one cluster. */
const Pins: React.FC<{ f: number; toMap: (c: string) => { x: number; y: number }; home: { x: number; y: number }; dot: number }> = ({ f, toMap, home, dot }) => {
  const spec = useMemo(() => {
    const r = rng(5);
    return PIN_CITIES.map((c, i) => {
      // phyllotaxis slot in the final cluster
      const a = i * 2.39996;
      const rad = Math.sqrt(i + 1) * 0.62;
      const col = i % 7 === 0 ? COLORS.yellow : i % 11 === 0 ? COLORS.teal : COLORS.white;
      return { c, i, appear: r() * 9, travel: 14 + r() * 8, lag: r() * 6, slot: { x: Math.cos(a) * rad, y: Math.sin(a) * rad }, col };
    });
  }, []);
  const fG = b(C.toGather);
  const fC = b(C.converge);
  const ringP = prog(f, fC + 22, 26, E.out);
  return (
    <>
      {/* landing ring at home */}
      {f >= fC + 20 ? (
        <div
          style={{
            position: 'absolute',
            left: home.x,
            top: home.y,
            width: dot * 9,
            height: dot * 9,
            borderRadius: '50%',
            border: `${Math.max(1.5, dot * 0.22)}px solid ${COLORS.white}`,
            transform: `translate(-50%,-50%) scale(${mix(0.3, 2.4, ringP)})`,
            opacity: (1 - ringP) * 0.9,
          }}
        />
      ) : null}
      {spec.map(({ c, i, appear, travel, lag, slot, col }) => {
        const start = fG + appear;
        if (f < start) return null;
        const a = toMap(c);
        const target = { x: home.x + slot.x * dot * 1.25, y: home.y + slot.y * dot * 1.25 };
        const pAt = (ff: number) => prog(ff, fC + lag, travel, E.inOutSoft);
        const pos = (ff: number) => {
          const k = pAt(ff);
          // slight arc on the way in
          const mx = (a.x + target.x) / 2 + (a.y - target.y) * 0.18;
          const my = (a.y + target.y) / 2 - (a.x - target.x) * 0.18;
          const u = 1 - k;
          return { x: u * u * a.x + 2 * u * k * mx + k * k * target.x, y: u * u * a.y + 2 * u * k * my + k * k * target.y };
        };
        const p = pos(f);
        const s = pop(f, start, { damping: 10, stiffness: 320 });
        const moving = pAt(f) > 0.02 && pAt(f) < 0.98;
        const pulseK = 1 + 0.25 * Math.exp(-Math.max(0, f - b(C.forThe)) / 5) * (f >= b(C.forThe) ? 1 : 0) + 0.25 * Math.exp(-Math.max(0, f - b(C.odooExperience)) / 5) * (f >= b(C.odooExperience) ? 1 : 0);
        return (
          <React.Fragment key={i}>
            {moving
              ? [3, 6, 9].map((lagF, j) => {
                  const q = pos(f - lagF);
                  return (
                    <div
                      key={j}
                      style={{ position: 'absolute', left: q.x, top: q.y, width: dot * (0.8 - j * 0.18), height: dot * (0.8 - j * 0.18), borderRadius: '50%', background: col, opacity: 0.35 - j * 0.1, transform: 'translate(-50%,-50%)' }}
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
                boxShadow: `0 0 ${dot * 1.4}px ${dot * 0.3}px rgba(255,255,255,0.45)`,
                transform: `translate(-50%,-50%) scale(${s * pulseK})`,
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
