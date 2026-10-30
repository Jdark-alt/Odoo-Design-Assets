// Scene 5 (0:17-0:22): rapid fire, one item per beat, then "And so much more." as one quiet line.
import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, CUES, FONTS, FRAMES_PER_BEAT, b } from '../config';
import { Layout, useLayout } from '../lib/layout';
import { fitSize } from '../lib/fonts';
import { E, drift, mix, pop, prog } from '../lib/motion';
import { KText, textWidth } from '../components/KText';
import { At, SceneWindow, lineMask } from '../components/Scene';
import { AppTile, Logo, Mark } from '../components/Brand';

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
      <MoreLine f={f} f0={b(C.more)} L={L} />
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

// ---------------------------------------------------------------- Networking: people, joined by one line
const NET = [
  [0.1, 0.5],
  [0.38, 0.42],
  [0.66, 0.5],
  [0.88, 0.62],
  [0.62, 0.75],
  [0.32, 0.7],
  [0.14, 0.86],
  [0.5, 0.92],
  [0.84, 0.9],
];
const LINKS = [
  [0, 5],
  [1, 4],
  [2, 8],
  [5, 7],
  [3, 8],
  [1, 5],
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
/** A person in a round avatar: the network's nodes. */
const Person: React.FC<{ x: number; y: number; r: number; k: number; ring: string }> = ({ x, y, r, k, ring }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <circle r={r} fill={COLORS.frame} stroke={ring} strokeWidth={r * 0.1} />
    <circle cy={-r * 0.22} r={r * 0.27} fill={COLORS.white} />
    <path d={`M${-r * 0.5} ${r * 0.56} C${-r * 0.5} ${r * 0.08} ${r * 0.5} ${r * 0.08} ${r * 0.5} ${r * 0.56} Z`} fill={COLORS.white} />
  </g>
);
const RINGS = [COLORS.teal, COLORS.yellow, COLORS.cyan, COLORS.red];
const Networking: React.FC<ItemProps> = ({ f, f0, L }) => {
  const { on, inP, outP } = env(f, f0);
  const pts = useMemo(() => NET.map(([x, y]) => [L.X(x), L.Y(L.wide ? 0.12 + y * 0.85 : y)]), [L]);
  if (!on) return null;
  const { P, X, Y } = L;
  const s = Math.min(P(176), fitSize('Networking', L.box.w * 0.98, 700, FONTS.sans, -0.02));
  const draw = prog(f, f0, 9, E.inOut);
  const links = prog(f, f0 + 3, 7, E.out);
  const r = P(44);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - outP, transform: `scale(${1 + outP * 0.08})` }}>
      <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {LINKS.map(([a, c], i) => (
          <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={mix(pts[a][0], pts[c][0], links)} y2={mix(pts[a][1], pts[c][1], links)} stroke={COLORS.white} strokeOpacity={0.3} strokeWidth={P(3)} strokeLinecap="round" />
        ))}
        <path d={catmull(pts)} fill="none" stroke={COLORS.teal} strokeWidth={P(6)} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {pts.map((p, i) => (
          <Person key={i} x={p[0]} y={p[1]} r={r} k={pop(f, f0 + (i / (pts.length - 1)) * 8 - 1, { damping: 11, stiffness: 420, mass: 0.4 })} ring={RINGS[i % RINGS.length]} />
        ))}
      </svg>
      <At x={X(0) - s * 0.02} y={Y(L.wide ? 0.0 : 0.13)}>
        <div style={{ transform: `scale(${mix(1.2, 1, inP)})`, transformOrigin: '0% 50%', ...lineMask(s) }}>
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

// ---------------------------------------------------------------- "And so much more." one line, on the beat
const MoreLine: React.FC<ItemProps> = ({ f, f0, L }) => {
  const fOut = b(C.moreOut);
  if (f < f0 - 5 || f > fOut + 9) return null;
  const { P, X, Y } = L;
  const parts = [
    { text: 'And so much ', weight: FONTS.weight.light },
    { text: 'more.', weight: 700 },
  ];
  const unit = parts.reduce((w, p) => w + textWidth(p.text, 100, p.weight, 'sans', -0.01) / 100, 0);
  const s = Math.min(P(104), (L.box.w * 0.92) / unit);
  const out = prog(f, fOut, 9, E.inSoft);
  const y = Y(0.5) - s * 0.5 + drift(f, P(3), 90, 5);
  let x = X(0);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * P(40)}px)` }}>
      {parts.map((p, j) => {
        const left = x;
        const w = textWidth(p.text, s, p.weight, 'sans', -0.01);
        x += w;
        return (
          <At key={j} x={left} y={y}>
            <div style={lineMask(s)}>
              <KText
                text={p.text}
                size={s}
                weight={p.weight}
                tracking={-0.01}
                charStyle={({ word }) => {
                  // words land just ahead of the beat, one after another
                  const k = prog(f, f0 - 4 + (j === 0 ? word : 3) * 2, 8, E.out);
                  return { transform: `translateY(${(1 - k) * 150}%)` };
                }}
              />
            </div>
            {j === 1 ? (
              <div style={{ position: 'absolute', left: w - s * 0.05, top: -s * 0.05, transform: `scale(${pop(f, f0 + 4, { damping: 11, stiffness: 240 })}) rotate(${14 + drift(f, 4, 50, 2)}deg)`, transformOrigin: '0% 100%' }}>
                <div style={{ transform: 'translateY(-100%)' }}>
                  <Mark name="sparkle-1" color="yellow" height={s * 0.5} />
                </div>
              </div>
            ) : null}
          </At>
        );
      })}
    </div>
  );
};
