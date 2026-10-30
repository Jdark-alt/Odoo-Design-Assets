import React, { useMemo } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, FLASHES, SHAKES, b } from '../config';
import india from '../brand/india.json';
import { MONUMENT_STROKES, MONUMENT_VIEWBOX } from '../brand/vidhanaSoudha';
import { MARKS, palette } from './Brand';
import { noise1, rng } from '../lib/motion';

// ---------------------------------------------------------------------------
// Night ground: the brand's background image, never rebuilt as a gradient.
// A fine moving grain keeps the dark gradients from banding in H.264.
// ---------------------------------------------------------------------------
const grainTiles = (() => {
  let tiles: string[] | null = null;
  return () => {
    if (tiles) return tiles;
    tiles = [];
    for (let t = 0; t < 6; t++) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d')!;
      const img = g.createImageData(256, 256);
      const r = rng(1000 + t);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.floor(r() * 255);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      tiles.push(c.toDataURL('image/png'));
    }
    return tiles;
  };
})();

export const Ground: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const frame = useCurrentFrame();
  const tiles = useMemo(() => grainTiles(), []);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.night900 }}>
      <Img src={staticFile('brand/night-ground.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: COLORS.night950, opacity: dim }} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${tiles[frame % tiles.length]})`,
          backgroundSize: '256px 256px',
          opacity: 0.045,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};

/** Grain over everything (so flat purple blocks don't band either). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
  const frame = useCurrentFrame();
  const tiles = useMemo(() => grainTiles(), []);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${tiles[(frame + 3) % tiles.length]})`,
        backgroundSize: '256px 256px',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Camera shake and flashes, driven by the cue sheet in config.ts
// ---------------------------------------------------------------------------
export const useShake = () => {
  const f = useCurrentFrame();
  let x = 0;
  let y = 0;
  let r = 0;
  SHAKES.forEach((s, i) => {
    const t = f - b(s.beat);
    if (t < 0 || t > s.frames) return;
    const k = Math.pow(1 - t / s.frames, 2);
    x += noise1(t * 1.9, i * 3 + 1) * s.amp * k;
    y += noise1(t * 2.3, i * 3 + 2) * s.amp * k;
    r += noise1(t * 1.6, i * 3 + 3) * s.amp * 0.03 * k;
  });
  return { x, y, r };
};

export const Flashes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {FLASHES.map((fl, i) => {
        const t = f - b(fl.beat);
        if (t < 0 || t > fl.frames) return null;
        const o = fl.peak * Math.pow(1 - t / fl.frames, 1.6);
        return <AbsoluteFill key={i} style={{ background: fl.color === 'purple' ? COLORS.purple : COLORS.white, opacity: o, pointerEvents: 'none' }} />;
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// India outline (Natural Earth, India's point of view)
// ---------------------------------------------------------------------------
export const INDIA_VB = india.viewBox as number[];
export const INDIA_CITIES = india.cities as unknown as Record<string, [number, number]>;
export const INDIA_RATIO = INDIA_VB[2] / INDIA_VB[3];

export const IndiaMap: React.FC<{
  width: number;
  draw: number;
  fill: number;
  stroke?: string;
  strokeWidth?: number;
  fillColor?: string;
  style?: React.CSSProperties;
}> = ({ width, draw, fill, stroke = COLORS.white, strokeWidth = 3, fillColor = COLORS.purple, style }) => {
  const h = width / INDIA_RATIO;
  const k = INDIA_VB[2] / width; // viewBox units per px
  return (
    <svg viewBox={INDIA_VB.join(' ')} width={width} height={h} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d={india.mainland} fill={fillColor} opacity={fill} />
      {india.islands.map((is: { d?: string; dot?: number[] }, i: number) =>
        is.d ? <path key={i} d={is.d} fill={fillColor} opacity={fill} /> : null,
      )}
      <path
        d={india.mainland}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth * k}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
      />
      {india.islands.map((is: { d?: string; dot?: number[] }, i: number) => {
        const o = Math.max(0, Math.min(1, (draw - 0.75) / 0.25));
        return is.d ? (
          <path key={i} d={is.d} fill="none" stroke={stroke} strokeWidth={strokeWidth * k * 0.8} strokeLinejoin="round" opacity={o} />
        ) : (
          <circle key={i} cx={is.dot![0]} cy={is.dot![1]} r={strokeWidth * k * 0.9} fill={stroke} opacity={o} />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Vidhana Soudha line art with a 0..1 trace clock
// ---------------------------------------------------------------------------
export const MONUMENT_RATIO = MONUMENT_VIEWBOX.w / MONUMENT_VIEWBOX.h;
export const Monument: React.FC<{
  width: number;
  progress: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ width, progress, strokeWidth = 2.2, color = COLORS.white, style }) => {
  const h = width / MONUMENT_RATIO;
  const k = MONUMENT_VIEWBOX.w / width;
  return (
    <svg viewBox={`0 0 ${MONUMENT_VIEWBOX.w} ${MONUMENT_VIEWBOX.h}`} width={width} height={h} style={{ display: 'block', overflow: 'visible', ...style }}>
      <g fill="none" stroke={color} strokeWidth={strokeWidth * k} strokeLinecap="round" strokeLinejoin="round">
        {MONUMENT_STROKES.map((s, i) => {
          const p = Math.max(0, Math.min(1, (progress - s.t[0]) / (s.t[1] - s.t[0])));
          if (p <= 0) return null;
          return <path key={i} d={s.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Kolam: pulli grid and the line that weaves around it (port of the design
// system's generator). Grids whose sides share no factor give one line.
// ---------------------------------------------------------------------------
export const kolam = (cols: number, rows: number) => {
  const W = 2 * cols;
  const H = 2 * rows;
  const reflects = (x: number, y: number) => x === 0 || x === W || y === 0 || y === H;
  const key = (a: number[], c: number[]) => (a[0] < c[0] || (a[0] === c[0] && a[1] < c[1]) ? `${a}|${c}` : `${c}|${a}`);
  const seen: Record<string, 1> = {};
  const curves: { p: number[]; din: number[]; dout: number[]; ref: boolean }[][] = [];
  for (let x = 0; x <= W; x++)
    for (let y = 0; y <= H; y++) {
      if ((x + y) % 2 !== 1) continue;
      for (const d0 of [
        [1, 1],
        [1, -1],
      ]) {
        const p0 = [x, y];
        const q0 = [x + d0[0], y + d0[1]];
        if (q0[0] < 0 || q0[0] > W || q0[1] < 0 || q0[1] > H || seen[key(p0, q0)]) continue;
        let p = p0;
        let d = d0;
        const pts: { p: number[]; din: number[]; dout: number[]; ref: boolean }[] = [];
        for (let g = 0; g < 100000; g++) {
          const q = [p[0] + d[0], p[1] + d[1]];
          seen[key(p, q)] = 1;
          const nd = d.slice();
          const r = reflects(q[0], q[1]);
          if (r) {
            if (q[0] % 2 === 0) nd[0] = -nd[0];
            else nd[1] = -nd[1];
          }
          pts.push({ p: q, din: d, dout: nd, ref: r });
          p = q;
          d = nd;
          if (p[0] === p0[0] && p[1] === p0[1] && d[0] === d0[0] && d[1] === d0[1]) break;
        }
        curves.push(pts);
      }
    }
  const R = Math.SQRT1_2;
  const f = (n: number) => Math.round(n * 1000) / 1000;
  const paths = curves.map((pts) => {
    const k = pts.length;
    const mid = (i: number) => {
      const a = pts[(i + k) % k].p;
      const c = pts[(i + 1 + k) % k].p;
      return [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
    };
    const m0 = mid(k - 1);
    let s = `M${f(m0[0])} ${f(m0[1])}`;
    for (let i = 0; i < k; i++) {
      const m = mid(i);
      const t = pts[i];
      if (t.ref) {
        const cr = t.din[0] * t.dout[1] - t.din[1] * t.dout[0];
        s += `A${f(R)} ${f(R)} 0 0 ${cr > 0 ? 1 : 0} ${f(m[0])} ${f(m[1])}`;
      } else s += `L${f(m[0])} ${f(m[1])}`;
    }
    return s + 'Z';
  });
  const dots: number[][] = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) dots.push([2 * i + 1, 2 * j + 1]);
  return { w: W, h: H, paths, dots };
};

export const Kolam: React.FC<{
  cols: number;
  rows: number;
  pitch: number;
  draw: number;
  dots?: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
}> = ({ cols, rows, pitch, draw, dots = 1, color = COLORS.white, stroke = 0.16, style }) => {
  const k = useMemo(() => kolam(cols, rows), [cols, rows]);
  const unit = pitch / 2;
  const W = (k.w + 2) * unit;
  const H = (k.h + 2) * unit;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', overflow: 'visible', ...style }}>
      <g transform={`translate(${unit} ${unit}) scale(${unit})`}>
        <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          {k.paths.map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
          ))}
        </g>
        <g fill={color}>
          {k.dots.map((d, i) => {
            const o = Math.max(0, Math.min(1, dots * 1.6 - (i / k.dots.length) * 0.6));
            return <circle key={i} cx={d[0]} cy={d[1]} r={0.16 * o} opacity={o} />;
          })}
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Confetti: brand-coloured pieces and official pops, simulated per frame
// ---------------------------------------------------------------------------
type Piece = { kind: 'rect' | 'dot' | 'mark'; mark?: string; color: string; vx: number; vy: number; spin: number; rot: number; size: number; life: number; drag: number; ox: number; oy: number };

export const Burst: React.FC<{
  x: number;
  y: number;
  start: number;
  count?: number;
  seed?: number;
  speed?: number;
  gravity?: number;
  scale?: number;
  colors?: string[];
  marks?: string[];
  spread?: number;
  angle?: number;
  /** pieces start anywhere inside this box around (x, y), so they come out of a word */
  spawnW?: number;
  spawnH?: number;
}> = ({ x, y, start, count = 60, seed = 1, speed = 38, gravity = 0.9, scale = 1, colors = ['yellow', 'teal', 'cyan', 'red', 'white'], marks = ['star', 'sparkle-1', 'heart'], spread = Math.PI * 2, angle = -Math.PI / 2, spawnW = 0, spawnH = 0 }) => {
  const f = useCurrentFrame();
  const pieces = useMemo<Piece[]>(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => {
      const a = angle + (r() - 0.5) * spread;
      const v = speed * (0.35 + r() * 0.85);
      const ox = (r() - 0.5) * spawnW;
      const oy = (r() - 0.5) * spawnH;
      const roll = r();
      const kind: Piece['kind'] = roll < 0.18 ? 'mark' : roll < 0.62 ? 'rect' : 'dot';
      return {
        kind,
        mark: marks[Math.floor(r() * marks.length)],
        color: palette(colors[Math.floor(r() * colors.length)]),
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        spin: (r() - 0.5) * 30,
        rot: r() * 360,
        size: (kind === 'mark' ? 26 + r() * 22 : kind === 'rect' ? 10 + r() * 12 : 6 + r() * 8) * scale,
        life: 34 + r() * 30,
        drag: 0.86 + r() * 0.06,
        ox,
        oy,
      };
    });
  }, [count, seed, speed, colors, marks, spread, angle, scale, spawnW, spawnH]);
  const t = f - start;
  if (t < 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none' }}>
      {pieces.map((p, i) => {
        if (t > p.life) return null;
        // closed-form motion with drag and gravity
        const dk = Math.pow(p.drag, t);
        const k = (1 - dk) / (1 - p.drag);
        const px = x + p.ox + p.vx * k * scale;
        const py = y + p.oy + p.vy * k * scale + gravity * scale * (t * t * 0.18);
        const o = Math.min(1, (p.life - t) / 10);
        const rot = p.rot + p.spin * t;
        const flip = Math.cos((t + i) * 0.35);
        const common: React.CSSProperties = {
          position: 'absolute',
          left: px,
          top: py,
          opacity: o,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scaleY(${p.kind === 'rect' ? flip : 1})`,
        };
        if (p.kind === 'mark') {
          const m = MARKS[p.mark!];
          return (
            <svg key={i} viewBox={m.vb.join(' ')} width={p.size} height={p.size} style={common}>
              {m.d.map((d, j) => (
                <path key={j} d={d} fill={p.color} />
              ))}
            </svg>
          );
        }
        return (
          <div
            key={i}
            style={{
              ...common,
              width: p.kind === 'rect' ? p.size * 0.5 : p.size,
              height: p.kind === 'rect' ? p.size : p.size,
              borderRadius: p.kind === 'dot' ? '50%' : 2,
              background: p.color,
            }}
          />
        );
      })}
    </div>
  );
};

/** Radiating strokes and rings from a point (the pop-fan idea, at scale). */
export const Rays: React.FC<{ x: number; y: number; start: number; count?: number; r0?: number; r1?: number; color?: string; width?: number; dur?: number; rings?: number; seed?: number }> = ({
  x,
  y,
  start,
  count = 14,
  r0 = 120,
  r1 = 520,
  color = COLORS.white,
  width = 8,
  dur = 16,
  rings = 2,
  seed = 3,
}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > dur + 10) return null;
  const r = rng(seed);
  const rays = Array.from({ length: count }, (_, i) => ({ a: (i / count) * Math.PI * 2 + (r() - 0.5) * 0.25, len: 0.6 + r() * 0.5 }));
  const k = 1 - Math.pow(1 - Math.min(1, t / dur), 3);
  const fade = Math.max(0, 1 - Math.max(0, t - dur * 0.45) / (dur * 0.75));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={1} height={1}>
      {rays.map((ray, i) => {
        const a = r0 + (r1 - r0) * k * ray.len;
        const bb = r0 + (r1 - r0) * Math.max(0, k - 0.35) * ray.len;
        return (
          <line
            key={i}
            x1={x + Math.cos(ray.a) * bb}
            y1={y + Math.sin(ray.a) * bb}
            x2={x + Math.cos(ray.a) * a}
            y2={y + Math.sin(ray.a) * a}
            stroke={color}
            strokeWidth={width * (1 - k * 0.5)}
            strokeLinecap="round"
            opacity={fade}
          />
        );
      })}
      {Array.from({ length: rings }, (_, i) => {
        const kk = Math.max(0, Math.min(1, (t - i * 3) / (dur + 4)));
        const e = 1 - Math.pow(1 - kk, 3);
        return kk > 0 ? (
          <circle key={`r${i}`} cx={x} cy={y} r={r0 * 0.8 + (r1 * 1.15 - r0 * 0.8) * e} fill="none" stroke={color} strokeWidth={width * 0.5 * (1 - e)} opacity={(1 - e) * 0.9} />
        ) : null;
      })}
    </svg>
  );
};

/** Pulli (dot grid) texture that flashes on chosen beats, fading toward the edges. */
export const PulliPulse: React.FC<{ beats: number[]; pitch: number }> = ({ beats, pitch }) => {
  const f = useCurrentFrame();
  let o = 0;
  let k = 0;
  for (const bt of beats) {
    const t = f - b(bt);
    if (t >= 0 && t < 30) {
      o += 0.55 * Math.exp(-t / 5);
      k += Math.exp(-t / 4);
    }
  }
  if (o < 0.005) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) ${pitch * 0.07}px, transparent ${pitch * 0.085}px)`,
        backgroundSize: `${pitch}px ${pitch}px`,
        backgroundPosition: 'center',
        opacity: Math.min(0.6, o),
        transform: `scale(${1 + 0.02 * Math.min(1, k)})`,
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 75%)',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 75%)',
        pointerEvents: 'none',
      }}
    />
  );
};
