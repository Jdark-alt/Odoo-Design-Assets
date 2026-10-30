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

export type GlyphArms = {
  /** ink box, in ems from the pen origin (x) and baseline (y, negative = up) */
  left: number;
  right: number;
  top: number;
  bottom: number;
  stemRight: number;
  /** horizontal bars of the letter, top to bottom */
  arms: { top: number; bottom: number; right: number }[];
};
let armsCache: GlyphArms | null = null;
/** Measures the stem and the three arms of Inter Bold "E" by scanning its pixels. */
export const eArms = (): GlyphArms => {
  if (armsCache) return armsCache;
  const S = 1000;
  const ox = 200;
  const base = 1100;
  const c = document.createElement('canvas');
  c.width = 1400;
  c.height = 1300;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  g.font = `700 ${S}px Inter`;
  g.fillText('E', ox, base);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const on = (x: number, y: number) => d[(y * c.width + x) * 4 + 3] > 127;
  let minX = c.width;
  let maxX = 0;
  let minY = c.height;
  let maxY = 0;
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++)
      if (on(x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  // stem: the ink run starting at the left edge, measured in the gap under the top arm
  const yGap = Math.round(minY + (maxY - minY) * 0.3);
  let stemR = minX;
  while (stemR < maxX && on(stemR + 1, yGap)) stemR++;
  // arms: ink runs in a column just right of the stem
  const xc = stemR + 6;
  const arms: { top: number; bottom: number; right: number }[] = [];
  let y = minY;
  while (y <= maxY) {
    if (on(xc, y)) {
      const t = y;
      while (y <= maxY && on(xc, y)) y++;
      const bt = y - 1;
      const ym = Math.round((t + bt) / 2);
      let r = xc;
      while (r < maxX && on(r + 1, ym)) r++;
      arms.push({ top: (t - base) / S, bottom: (bt + 1 - base) / S, right: (r + 1 - ox) / S });
    }
    y++;
  }
  armsCache = { left: (minX - ox) / S, right: (maxX + 1 - ox) / S, top: (minY - base) / S, bottom: (maxY + 1 - base) / S, stemRight: (stemR + 1 - ox) / S, arms };
  return armsCache;
};
