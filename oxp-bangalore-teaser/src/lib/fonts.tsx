import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONTS } from '../config';

let loading: Promise<void> | null = null;
const loadBrandFonts = () => {
  if (!loading) {
    loading = Promise.all(
      Object.entries(FONTS.files).map(async ([family, f]) => {
        const face = new FontFace(family, `url(${staticFile(f.file)}) format('woff2')`, { weight: f.weight, style: 'normal' });
        await face.load();
        document.fonts.add(face);
      }),
    ).then(() => undefined);
  }
  return loading;
};

/** Renders children only once Inter and Caveat are loaded (text is measured). */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Loading Inter and Caveat'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadBrandFonts()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
  return ready ? <>{children}</> : null;
};

// ---- text measurement ------------------------------------------------------
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<string, number>();

/** Width of `text` at 100px (letter-spacing in em, applied per character). */
export const measure100 = (text: string, weight: number, family: string, trackingEm = 0) => {
  const key = `${family}|${weight}|${trackingEm}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} 100px ${family}`;
  const w = ctx!.measureText(text).width + trackingEm * 100 * Math.max(0, text.length - 1);
  cache.set(key, w);
  return w;
};

export const measure = (text: string, size: number, weight: number, family: string, trackingEm = 0) =>
  (measure100(text, weight, family, trackingEm) * size) / 100;

/** Font size that makes `text` exactly `width` wide. */
export const fitSize = (text: string, width: number, weight: number, family: string, trackingEm = 0) =>
  (width / measure100(text, weight, family, trackingEm)) * 100;

/** Ink bounds of `text` (px, relative to the pen origin on the baseline). */
export const inkBox = (text: string, size: number, weight: number, family: string) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px ${family}`;
  const m = ctx!.measureText(text);
  return { left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, top: -m.actualBoundingBoxAscent, bottom: m.actualBoundingBoxDescent };
};

/** Baseline position inside a line-height:1 box, as a fraction of the font size. */
export const baselineFrac = (family: string, weight = 700) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} 100px ${family}`;
  const m = ctx!.measureText('x');
  const asc = m.fontBoundingBoxAscent / 100;
  const desc = m.fontBoundingBoxDescent / 100;
  return (1 - (asc + desc)) / 2 + asc;
};

export type GlyphStem = { left: number; right: number; top: number; bottom: number };
const stemCache = new Map<string, GlyphStem>();
/** The straight left stem of an Inter Bold capital (D, B...), in ems from the pen origin and baseline. */
export const glyphStem = (ch: string): GlyphStem => {
  const hit = stemCache.get(ch);
  if (hit) return hit;
  const S = 1000;
  const ox = 200;
  const base = 1100;
  const c = document.createElement('canvas');
  c.width = 1400;
  c.height = 1300;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  g.font = `700 ${S}px Inter`;
  g.fillText(ch, ox, base);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const on = (x: number, y: number) => d[(y * c.width + x) * 4 + 3] > 127;
  let minX = c.width;
  let minY = c.height;
  let maxY = 0;
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++)
      if (on(x, y)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const ym = Math.round((minY + maxY) / 2);
  let r = minX;
  while (on(r + 1, ym)) r++;
  const out = { left: (minX - ox) / S, right: (r + 1 - ox) / S, top: (minY - base) / S, bottom: (maxY + 1 - base) / S };
  stemCache.set(ch, out);
  return out;
};
