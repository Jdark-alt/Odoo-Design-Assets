// Scene 5 (0:17-0:23): rapid fire, one item per beat, then "So" "much" "more."
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, FRAMES_PER_BEAT, b } from '../config';
import { Layout, useLayout } from '../lib/layout';
import { fitSize } from '../lib/fonts';
import { E, drift, mix, onBeats, pop, prog, punch } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { AppTile, Logo, Mark } from '../components/Brand';
import { Burst, Kolam, Rays } from '../components/Graphics';
import { routeLine } from './shared';

const C = CUES.rapid;
const BEAT = FRAMES_PER_BEAT;

export const Scene5RapidFire: React.FC = () => (
  <SceneWindow id="rapid">
    <Rapid />
  </SceneWindow>
);

type ItemProps = { f: number; f0: number; L: Layout };

/** snap in (spring), hold, snap out over the last 3 frames of the beat */
const env = (f: number, f0: number, len = BEAT) => ({
  on: f >= f0 - 2 && f < f0 + len,
  inP: pop(f, f0, { damping: 16, stiffness: 520, mass: 0.4 }),
  outP: prog(f, f0 + len - 3, 3, E.in),
});

const Rapid: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const LEAD = 4; // items snap in just before the beat so they land on it
  const [i0, i1, i2, i3, i4, i5] = C.items.map((x) => b(x) - LEAD);
  return (
    <>
      <Odoo20 f={f} f0={i0} L={L} />
      <LiveDemos f={f} f0={i1} L={L} />
      <SuccessStories f={f} f0={i2} L={L} />
      <ExpertSessions f={f} f0={i3} L={L} />
      <Networking f={f} f0={i4} L={L} />
      <Community f={f} f0={i5} L={L} />
      <And f={f} f0={b(C.and) - 2} L={L} />
      <Hit f={f} f0={b(C.so)} L={L} word="So" level={0} />
      <Hit f={f} f0={b(C.much)} L={L} word="much" level={1} />
      <More f={f} f0={b(C.more)} L={L} />
    </>
  );
};

// ---------------------------------------------------------------- Odoo 20
const Odoo20: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  if (!on) return null;
  const { P, X, Y } = L;
  const wipeIn = prog(f, f0 - 2, 5, E.out);
  const s20 = Math.min(P(700), fitSize('20', L.box.w * 0.95, 700, FONTS.sans, -0.04), L.box.h * 0.72);
  const logoH = P(128);
  const k = mix(1.35, 1, inP);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: COLORS.purple, clipPath: `inset(${(1 - wipeIn) * 100}% 0 ${outP * 100}% 0)` }} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${k}) rotate(${-3 + drift(f, 0.6, 20, 2)}deg) translateY(${-outP * L.H * 0.25}px)`, transformOrigin: '40% 50%', opacity: 1 - outP }}>
        <At x={X(0.01)} y={Y(L.wide ? 0.04 : 0.1)}>
          <Logo height={logoH} />
        </At>
        <At x={X(0) - s20 * 0.04} y={Y(L.wide ? 0.04 : 0.1) + logoH * 1.15}>
          <KText
            text="20"
            size={s20}
            weight={700}
            tracking={-0.04}
            charStyle={({ i }) => {
              const p = pop(f, f0 + i * 1.5, { damping: 12, stiffness: 360, mass: 0.5 });
              return { transform: `translateY(${(1 - p) * s20 * 0.5}px) scale(${mix(0.6, 1, p)})`, opacity: p > 0.02 ? 1 : 0 };
            }}
          />
        </At>
        <At x={X(0) + textWidth('20', s20, 700, 'sans', -0.04) - s20 * 0.08} y={Y(L.wide ? 0.04 : 0.1) + logoH * 1.2}>
          <div style={{ transform: `scale(${pop(f, f0 + 3, { damping: 9, stiffness: 300 })}) rotate(14deg)` }}>
            <Mark name="sparkle-1" color="yellow" height={P(130)} />
          </div>
        </At>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Live demos
const APPS_LIVE = [
  { app: 'sales', x: 0.0, y: 0.56, r: -8 },
  { app: 'crm', x: 0.24, y: 0.68, r: 6 },
  { app: 'inventory', x: 0.5, y: 0.6, r: -4 },
  { app: 'website', x: 0.06, y: 0.81, r: 7 },
  { app: 'point-of-sale', x: 0.38, y: 0.85, r: -6 },
];
const LiveDemos: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = P(178);
  const wLive = textWidth('Live', s, 700, 'sans', -0.02);
  const dot = P(40);
  const blink = 0.55 + 0.45 * Math.cos(((f - f0) / 6) * Math.PI);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `scale(${1 - outP * 0.12})`, transformOrigin: '60% 40%' }}>
      <At x={X(0.3)} y={Y(0.08)}>
        <div style={{ transform: `translateX(${(1 - inP) * L.W * 0.5}px) rotate(-4deg)`, transformOrigin: '0% 100%' }}>
          <div style={{ position: 'relative' }}>
            <KText text="Live" size={s} weight={700} tracking={-0.02} />
            <div style={{ position: 'absolute', left: wLive + P(26), top: s * 0.3, width: dot, height: dot, borderRadius: '50%', background: COLORS.red, transform: `scale(${pop(f, f0 + 2, { damping: 8, stiffness: 400 }) * (0.9 + 0.1 * blink)})` }} />
          </div>
          <div style={{ marginTop: s * 0.02, ...lineMask(s) }}>
            <KText text="demos" size={s} weight={FONTS.weight.light} tracking={-0.02} charStyle={({ i }) => ({ transform: `translateY(${(1 - prog(f, f0 + i * 0.5, 5, E.out)) * 150}%)` })} />
          </div>
        </div>
      </At>
      {APPS_LIVE.map((a, i) => {
        const p = pop(f, f0 + i * 0.7, { damping: 11, stiffness: 460, mass: 0.4 });
        return (
          <At key={a.app} x={X(a.x)} y={Y(a.y)}>
            <div style={{ transform: `scale(${p}) rotate(${a.r + (1 - p) * 30}deg)` }}>
              <AppTile app={a.app} size={P(150)} />
            </div>
          </At>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Success stories
const SuccessStories: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = Math.min(P(176), fitSize('Success', L.box.w * 0.8, 700, FONTS.sans, -0.02));
  const y0 = Y(L.wide ? 0.42 : 0.56);
  const wSucc = textWidth('Success', s, 700, 'sans', -0.02);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `translateX(${-outP * P(120)}px)` }}>
      <At x={X(0)} y={y0}>
        <div style={{ transform: `translateY(${(1 - inP) * P(320)}px) rotate(3deg)`, transformOrigin: '0% 0%' }}>
          <KText text="Success" size={s} weight={700} tracking={-0.02} />
          <div style={{ marginLeft: s * 0.55, marginTop: -s * 0.02 }}>
            <KText
              text="stories"
              size={s}
              weight={FONTS.weight.light}
              tracking={-0.02}
              charStyle={({ i }) => {
                const p = prog(f, f0 + 1 + i * 0.4, 5, E.out);
                return { transform: `translateY(${(1 - p) * s * 0.6}px)`, opacity: p };
              }}
            />
          </div>
        </div>
      </At>
      <At x={X(0) + wSucc + P(18)} y={y0 - P(70)}>
        <div style={{ transform: `scale(${pop(f, f0 + 2, { damping: 8, stiffness: 320 })}) rotate(${-10 + (f - f0) * 1.5}deg)` }}>
          <Mark name="star" color="yellow" height={P(116)} />
        </div>
      </At>
      <At x={X(0) + wSucc - P(40)} y={y0 - P(250)}>
        <div style={{ transform: 'rotate(8deg)' }}>
          <Mark name="arrow-curve-up" color="yellow" height={P(170)} reveal={prog(f, f0 + 1, 7, E.out)} revealFrom="bottom" />
        </div>
      </At>
    </div>
  );
};

// ---------------------------------------------------------------- Expert sessions
const ExpertSessions: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = P(104);
  const h = P(206);
  const left = X(0.04);
  const top = Y(L.wide ? 0.38 : 0.36);
  const slide = (1 - inP) * (L.W - left);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `rotate(-2deg) translateY(${outP * P(80)}px)`, transformOrigin: '50% 50%' }}>
      <div
        style={{
          position: 'absolute',
          left: left + slide,
          top,
          width: L.W - left + P(60),
          height: h,
          background: COLORS.purple,
          borderRadius: `${h / 2}px 0 0 ${h / 2}px`,
        }}
      />
      <At x={left + slide + P(78)} y={top + (h - s) / 2 + s * 0.02}>
        <div style={{ display: 'flex', ...lineMask(s) }}>
          <KText text="Expert " size={s} weight={700} tracking={-0.01} charStyle={({ i }) => ({ transform: `translateY(${(1 - prog(f, f0 + 1 + i * 0.3, 5, E.out)) * 150}%)` })} />
          <KText text="sessions" size={s} weight={FONTS.weight.light} charStyle={({ i }) => ({ transform: `translateY(${(1 - prog(f, f0 + 2 + i * 0.3, 5, E.out)) * 150}%)` })} />
        </div>
      </At>
    </div>
  );
};

// ---------------------------------------------------------------- Networking: one line, every dot
const NET = [
  [0.06, 0.48],
  [0.3, 0.41],
  [0.52, 0.53],
  [0.86, 0.44],
  [0.74, 0.68],
  [0.46, 0.74],
  [0.16, 0.69],
  [0.3, 0.9],
  [0.62, 0.92],
  [0.92, 0.86],
];
const catmull = (pts: number[][]) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const Networking: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  const pts = useMemo(() => NET.map(([x, y]) => [L.X(x), L.Y(L.wide ? 0.2 + y * 0.8 : y)]), [L]);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = Math.min(P(170), fitSize('Networking', L.box.w * 0.98, 700, FONTS.sans, -0.02));
  const draw = prog(f, f0, 9, E.inOut);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `scale(${1 + outP * 0.1})` }}>
      <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d={catmull(pts)} fill="none" stroke={COLORS.teal} strokeWidth={P(7)} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {pts.map((p, i) => {
          const reach = prog(f, f0 + (i / (pts.length - 1)) * 9 - 1, 4, E.back);
          return <circle key={i} cx={p[0]} cy={p[1]} r={P(15) * reach} fill={COLORS.white} />;
        })}
      </svg>
      <At x={X(0) - s * 0.02} y={Y(L.wide ? 0.02 : 0.14)}>
        <div style={{ transform: `scale(${mix(1.25, 1, inP)})`, transformOrigin: '0% 50%', ...lineMask(s) }}>
          <KText text="Networking" size={s} weight={700} tracking={-0.02} charStyle={({ i }) => ({ transform: `translateY(${(1 - prog(f, f0 + i * 0.3, 5, E.out)) * 150}%)` })} />
        </div>
      </At>
    </div>
  );
};

// ---------------------------------------------------------------- Community (the Caveat word, circled)
const Community: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = Math.min(fitSize('community', L.box.w * 0.78, 700, FONTS.hand), P(260));
  const w = textWidth('community', s, 700, 'hand');
  const x = X(0.5) - w / 2 + P(10);
  const y = Y(L.wide ? 0.4 : 0.47);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `translateY(${-outP * P(100)}px)` }}>
      <At x={x} y={y}>
        <div style={{ position: 'relative', transform: `rotate(-4deg) scale(${mix(0.7, 1, inP)})`, transformOrigin: '50% 50%' }}>
          <div style={{ position: 'absolute', left: -0.24 * s, top: -0.08 * s, width: w + 0.48 * s, height: s * 1.16 }}>
            <Mark name="circle-bold" color="teal" width={w + 0.48 * s} height={s * 1.16} stretch reveal={prog(f, f0 + 1, 7, E.inOut)} />
          </div>
          <KText
            text="community"
            size={s}
            family="hand"
            weight={700}
            color={COLORS.yellow}
            charStyle={({ i }) => {
              const p = pop(f, f0 + i * 0.35, { damping: 11, stiffness: 460, mass: 0.4 });
              return { transform: `translateY(${(1 - p) * s * 0.4}px) scale(${mix(0.3, 1, p)})`, opacity: Math.min(1, p * 4) };
            }}
          />
        </div>
      </At>
      <At x={x + w + P(10)} y={y - P(40)}>
        <div style={{ transform: `scale(${pop(f, f0 + 4, { damping: 8, stiffness: 300 })}) rotate(12deg)` }}>
          <Mark name="heart" color="red" height={P(80)} />
        </div>
      </At>
    </div>
  );
};

// ---------------------------------------------------------------- "and": a breath
const And: React.FC<ItemProps> = ({ f, f0, L }) => {
  if (f < f0 - 1 || f > f0 + BEAT) return null;
  const { P, X, Y } = L;
  const s = P(50);
  const w = textWidth('and', s, FONTS.weight.light, 'sans');
  const p = pop(f, f0, { damping: 14, stiffness: 420, mass: 0.4 });
  const out = prog(f, f0 + 6, 3, E.in);
  const inhale = prog(f, f0 + 4, BEAT - 3, E.inSoft);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: X(0.5),
          top: Y(0.5),
          width: L.W * 1.2,
          height: L.W * 1.2,
          marginLeft: -L.W * 0.6,
          marginTop: -L.W * 0.6,
          borderRadius: '50%',
          border: `${P(2)}px solid rgba(255,255,255,0.5)`,
          transform: `scale(${mix(1, 0.02, inhale)})`,
          opacity: inhale > 0 && inhale < 1 ? 0.6 * Math.sin(inhale * Math.PI) : 0,
        }}
      />
      <At x={X(0.5) - w / 2} y={Y(0.5) - s / 2}>
        <div style={{ transform: `scale(${p * (1 - out * 0.6)})`, opacity: 1 - out }}>
          <KText text="and" size={s} weight={FONTS.weight.light} />
        </div>
      </At>
    </>
  );
};

// ---------------------------------------------------------------- So / much: hard hits, each bigger
const Hit: React.FC<ItemProps & { word: string; level: number }> = ({ f, f0, L, word, level }) => {
  if (f < f0 || f >= f0 + BEAT) return null;
  const { P, X, Y } = L;
  const s =
    level === 0
      ? Math.min(P(600), fitSize(word, L.box.w * 0.72, 700, FONTS.sans, -0.04), L.box.h * 0.75)
      : Math.min(fitSize(word, L.box.w, 700, FONTS.sans, -0.04), L.box.h * 0.75);
  const w = textWidth(word, s, 700, 'sans', -0.04);
  const slam = prog(f, f0, 4, E.out);
  const ring = punch(f, f0 + 4, level === 0 ? 0.05 : 0.07, 4);
  const from = level === 0 ? 2.6 : 3.4;
  const out = prog(f, f0 + BEAT - 3, 3, E.in);
  const x = level === 0 ? X(0.02) : L.box.x + (L.box.w - w) / 2;
  const y = level === 0 ? Y(L.wide ? 0.08 : 0.2) : L.box.y + (L.box.h - s * 0.8) / 2 - s * 0.12;
  return (
    <At x={x} y={y}>
      <div
        style={{
          transform: `scale(${mix(from, 1, slam) * ring * (1 + out * 0.5)}) rotate(${(1 - slam) * (level === 0 ? -8 : 6)}deg)`,
          transformOrigin: '50% 55%',
          opacity: 1 - out,
          filter: out > 0 ? `blur(${out * P(14)}px)` : undefined,
        }}
      >
        <KText text={word} size={s} weight={700} tracking={-0.04} />
      </div>
    </At>
  );
};

// ---------------------------------------------------------------- more. : the biggest moment
const More: React.FC<ItemProps> = ({ f, f0, L }) => {
  const fEnd = b(CUES.outro.onTour);
  if (f < f0 || f > fEnd + 2) return null;
  const { P, X, Y } = L;
  const s = Math.min(fitSize('more.', L.box.w, 700, FONTS.sans, -0.04), L.box.h * 0.6);
  const w = textWidth('more.', s, 700, 'sans', -0.04);
  const x = L.box.x + (L.box.w - w) / 2;
  const y = L.box.y + (L.box.h - s * 0.75) / 2 - s * 0.14;
  const cx = x + w / 2;
  const cy = y + s * 0.55;
  const slam = prog(f, f0, 5, E.out);
  const ring = punch(f, f0 + 5, 0.08, 5);
  const zoom = 1 + 0.07 * prog(f, f0 + 4, fEnd - f0 - 20, E.inOutSoft);
  const beats = onBeats(f, b(C.more + 1), b(C.settle) + 2, BEAT, 0.035, 3);
  const leave = prog(f, b(C.settle) - 2, 12, E.inSoft);

  // purple ground collapses into Scene 6's metro line
  const r = routeLine(L);
  const fold = prog(f, b(C.settle) + 1, fEnd - b(C.settle) + 1, E.inOut);
  const top = mix(0, r.y - r.thickness / 2, fold);
  const bottom = mix(L.H, r.y + r.thickness / 2, fold);

  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, width: L.W, height: bottom - top, background: COLORS.purple }} />
      <div style={{ position: 'absolute', left: 0, top, width: L.W, height: bottom - top, overflow: 'hidden', opacity: 1 - leave }}>
        <div style={{ position: 'absolute', left: cx, top: cy, transform: `translate(-50%, -50%) scale(${zoom * 1.05})`, opacity: 0.2 }}>
          <Kolam cols={5} rows={6} pitch={Math.min(P(160), (L.H * 0.9) / 13)} draw={prog(f, f0 + 2, 26, E.inOut)} dots={prog(f, f0, 10)} stroke={0.12} />
        </div>
      </div>
      <Rays x={cx} y={cy} start={f0} count={22} r0={w * 0.42} r1={Math.max(L.W, L.H) * 0.75} color={COLORS.white} width={P(12)} dur={18} rings={3} seed={13} />
      <Rays x={cx} y={cy} start={f0 + 2} count={12} r0={w * 0.4} r1={Math.max(L.W, L.H) * 0.5} color={COLORS.yellow} width={P(9)} dur={16} rings={0} seed={21} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - leave, transform: `scale(${1 - leave * 0.35})`, transformOrigin: `${(cx / L.W) * 100}% ${(cy / L.H) * 100}%` }}>
        <At x={x} y={y}>
          <div style={{ transform: `scale(${mix(5, 1, slam) * ring * zoom * beats}) rotate(${(1 - slam) * -10}deg)`, transformOrigin: '50% 55%' }}>
            <KText text="more." size={s} weight={700} tracking={-0.04} />
          </div>
        </At>
        <At x={x - P(70)} y={y - P(90)}>
          <div style={{ transform: `scale(${pop(f, f0 + 4, { damping: 9, stiffness: 260 })}) rotate(-24deg)` }}>
            <Mark name="pop-fan" color="yellow" width={P(200)} />
          </div>
        </At>
        <At x={x + w - P(30)} y={y + s * 0.72}>
          <div style={{ transform: `scale(${pop(f, f0 + 6, { damping: 9, stiffness: 260 })}) rotate(${150 + drift(f, 6, 40, 4)}deg)` }}>
            <Mark name="pop-fan" color="teal" width={P(170)} />
          </div>
        </At>
        <At x={x + w - P(10)} y={y - P(40)}>
          <div style={{ transform: `scale(${pop(f, f0 + 8, { damping: 9, stiffness: 260 })}) rotate(${10 + (f - f0) * 0.8}deg)` }}>
            <Mark name="star" color="yellow" height={P(86)} />
          </div>
        </At>
      </div>
      <Burst x={cx} y={cy} start={f0} count={160} seed={44} speed={P(58)} scale={L.s * 1.35} gravity={0.75} />
      <Burst x={cx} y={cy} start={b(C.more + 1)} count={40} seed={45} speed={P(36)} scale={L.s * 1.1} gravity={0.6} marks={['star', 'sparkle-1', 'heart']} />
    </>
  );
};

