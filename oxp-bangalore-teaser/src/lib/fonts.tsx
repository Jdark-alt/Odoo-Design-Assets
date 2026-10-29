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
