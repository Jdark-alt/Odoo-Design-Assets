import { Easing } from 'remotion';
import { CUES, FONTS, b } from '../config';
import { Layout } from '../lib/layout';
import { baselineFrac, eArms, measure100 } from '../lib/fonts';
import { E, prog } from '../lib/motion';
import { INDIA_RATIO } from '../components/Graphics';
import { LOGO_RATIO } from '../components/Brand';

/** Inter's baseline inside a line-height:1 box (KText), as a fraction of the size. */
export const INTER_BASE = 0.8633;

/**
 * Scene 1 layout: "India loves" on top, the map in the middle, "the" and the
 * Odoo Experience lockup underneath. The lockup is the widest line: the anchor.
 */
export const loveLayout = (L: Layout) => {
  const { P, X, Y } = L;
  const sIndia = P(118);
  const sLoves = P(146);
  const sThe = P(66);
  const lockMaxW = L.wide ? L.box.w * 0.5 : L.box.w;
  const lockUnit = LOGO_RATIO + 0.5 + (measure100('Experience.', 700, FONTS.sans, -0.02) / 100) * 0.98;
  const lockH = Math.min(P(112), lockMaxW / lockUnit);
  const yTop = Y(L.wide ? 0.03 : 0.03);
  const lovesTop = yTop + INTER_BASE * sIndia - baselineFrac(FONTS.hand) * sLoves;
  const xLoves = X(0) + (measure100('India ', 700, FONTS.sans, -0.03) / 100) * sIndia;

  const mapTop = Y(L.wide ? 0.04 : 0.17);
  const mapBottom = Y(L.wide ? 0.98 : 0.78);
  const mapH = mapBottom - mapTop;
  const mapW = mapH * INDIA_RATIO;
  const mapX = L.wide ? L.box.x + L.box.w - mapW : L.box.x + (L.box.w - mapW) / 2 + P(20);

  const yThe = Y(L.wide ? 0.7 : 0.79);
  const yLock = Y(L.wide ? 0.78 : 0.86);
  const xE = X(0) + lockH * LOGO_RATIO + lockH * 0.5;
  const sizeE = lockH * 0.98;
  const topE = yLock + lockH - INTER_BASE * sizeE;
  return { sIndia, sLoves, sThe, lockH, yTop, lovesTop, xLoves, mapTop, mapH, mapW, mapX, yThe, yLock, xE, sizeE, topE };
};

/**
 * The camera move from Scene 1 into the "E" of "Experience": the E ends up
 * filling most of the frame, centred, and Scene 2 cuts the copy out of it.
 */
export const diveCamera = (L: Layout) => {
  const lay = loveLayout(L);
  const a = eArms();
  const baseE = lay.topE + INTER_BASE * lay.sizeE;
  const c = { x: lay.xE + ((a.left + a.right) / 2) * lay.sizeE, y: baseE + ((a.top + a.bottom) / 2) * lay.sizeE };
  const capPx = (a.bottom - a.top) * lay.sizeE;
  const Z = (L.box.h * (L.wide ? 0.86 : 0.74)) / capPx;
  const T = { x: L.X(0.5), y: L.Y(0.5) };
  /** pen origin, baseline and size of the giant E once the camera has landed */
  const giant = { x: T.x + (lay.xE - c.x) * Z, baseline: T.y + (baseE - c.y) * Z, size: lay.sizeE * Z, arms: a };
  const accel = Easing.bezier(0.6, 0, 0.92, 0.45);
  const at = (f: number) => {
    const push = prog(f, b(CUES.drop.push), b(CUES.drop.dive) - b(CUES.drop.push), E.inOutSoft);
    const z1 = 1 + 0.08 * push;
    const k = prog(f, b(CUES.drop.dive), b(CUES.drop.drop) - b(CUES.drop.dive), accel);
    const z = Math.exp(Math.log(z1) + (Math.log(Z) - Math.log(z1)) * k);
    const kt = prog(f, b(CUES.drop.dive), b(CUES.drop.drop) - b(CUES.drop.dive), E.inOut);
    const px = c.x + (T.x - c.x) * kt;
    const py = c.y + (T.y - c.y) * kt;
    return { z, px, py, k, transform: `translate(${px}px, ${py}px) scale(${z}) translate(${-c.x}px, ${-c.y}px)` };
  };
  return { c, T, Z, giant, at };
};

/** Where Scene 3 types "But this time,". */
export const teaseType = (L: Layout) => ({ x: L.X(0.0), y: L.Y(0.15), size: L.P(62) });

/** Scene 3's Vidhana Soudha crop; Scene 6 pulls back from exactly here. */
export const teaseMonument = (L: Layout) => {
  const width = L.W * (L.wide ? 1.25 : 2.1);
  return { width, domeX: L.X(L.wide ? 0.7 : 0.66), domeY: L.Y(L.wide ? 0.34 : 0.3), opacity: 0.3 };
};

/** The metro-line route that Scene 6 rides. */
export const routeLine = (L: Layout) => ({ y: L.Y(L.wide ? 0.5 : 0.415), thickness: L.P(10) });
