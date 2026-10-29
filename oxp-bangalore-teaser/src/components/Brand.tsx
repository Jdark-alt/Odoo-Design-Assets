// The Odoo Experience India brand parts, redrawn from the design system's own
// path data (src/brand/*.json was extracted from its component bundle).
import React from 'react';
import { COLORS, PaletteName } from '../config';
import logo from '../brand/logo.json';
import marks from '../brand/marks.json';
import doodles from '../brand/doodles.json';
import apps from '../brand/apps.json';

type MarkData = { vb: number[]; d: string[] };
type DoodleData = { label: string; fill: string; fills: string[]; lines: string[]; shine: string[] };
type AppData = { label: string; svg: string };

export const MARKS = marks as Record<string, MarkData>;
export const DOODLES = doodles as Record<string, DoodleData>;
export const APPS = apps as Record<string, AppData>;

export const palette = (c: PaletteName | string) => (COLORS as Record<string, string>)[c] ?? c;

/** Official Odoo wordmark. Negative (all white) on night and purple grounds. Never recoloured. */
export const Logo: React.FC<{ height: number; variant?: 'negative' | 'color'; style?: React.CSSProperties }> = ({ height, variant = 'negative', style }) => (
  <svg viewBox="0 0 621 196" height={height} width={(height * 621) / 196} style={{ display: 'block', overflow: 'visible', ...style }} aria-label="Odoo">
    <path d={logo.doo} fill={variant === 'color' ? COLORS.logoGray : COLORS.white} />
    <path d={logo.o} fill={variant === 'color' ? COLORS.purple : COLORS.white} />
  </svg>
);
export const LOGO_RATIO = 621 / 196;

/**
 * Official graphic element (highlight, underline, arrow, pop, star, heart...).
 * `reveal` wipes it in from the left (0..1); `stretch` lets bars fit a word.
 */
export const Mark: React.FC<{
  name: string;
  color?: PaletteName | string;
  width?: number;
  height?: number;
  reveal?: number;
  revealFrom?: 'left' | 'center' | 'bottom';
  stretch?: boolean;
  style?: React.CSSProperties;
}> = ({ name, color = 'yellow', width, height, reveal = 1, revealFrom = 'left', stretch = false, style }) => {
  const m = MARKS[name];
  if (!m) return null;
  const [vx, vy, vw, vh] = m.vb;
  const w = width ?? (height ? (height * vw) / vh : vw);
  const h = height ?? (width ? (width * vh) / vw : vh);
  const id = `clip-${name}-${Math.round(w)}-${Math.round(h)}-${Math.round(reveal * 1000)}`;
  const r = Math.max(0, Math.min(1, reveal));
  const clip =
    revealFrom === 'left'
      ? { x: vx - 2, y: vy - 2, width: (vw + 4) * r, height: vh + 4 }
      : revealFrom === 'bottom'
        ? { x: vx - 2, y: vy + vh + 2 - (vh + 4) * r, width: vw + 4, height: (vh + 4) * r }
        : { x: vx + vw / 2 - ((vw + 4) * r) / 2, y: vy - 2, width: (vw + 4) * r, height: vh + 4 };
  return (
    <svg
      viewBox={m.vb.join(' ')}
      width={w}
      height={h}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      {r < 1 ? (
        <defs>
          <clipPath id={id}>
            <rect {...clip} />
          </clipPath>
        </defs>
      ) : null}
      <g clipPath={r < 1 ? `url(#${id})` : undefined}>
        {m.d.map((d, i) => (
          <path key={i} d={d} fill={palette(color)} />
        ))}
      </g>
    </svg>
  );
};

/** A doodle from the Odoo Experience India set (night ink). */
export const Doodle: React.FC<{ name: string; size: number; style?: React.CSSProperties }> = ({ name, size, style }) => {
  const d = DOODLES[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <g transform="translate(4 4)" fill={palette(d.fill)}>
        {d.fills.map((x, i) => (
          <path key={i} d={x} />
        ))}
      </g>
      <g fill="none" stroke={COLORS.white} strokeWidth={2} strokeLinecap="round">
        {d.shine.map((x, i) => (
          <path key={i} d={x} />
        ))}
      </g>
      <g fill="none" stroke={COLORS.white} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
        {d.lines.map((x, i) => (
          <path key={i} d={x} />
        ))}
      </g>
    </svg>
  );
};

/** Official app icon on a white tile with the night tile shadow. */
export const AppTile: React.FC<{ app: string; size: number; style?: React.CSSProperties }> = ({ app, size, style }) => {
  const a = APPS[app];
  if (!a) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: COLORS.white,
        boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
    >
      <div
        style={{ width: size * 0.64, height: size * 0.64 }}
        dangerouslySetInnerHTML={{ __html: a.svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ') }}
      />
    </div>
  );
};
