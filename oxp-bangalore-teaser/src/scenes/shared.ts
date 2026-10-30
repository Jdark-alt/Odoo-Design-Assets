import { Easing } from 'remotion';
import { CUES, FONTS, b } from '../config';
import { Layout } from '../lib/layout';
import { baselineFrac, glyphStem, measure100 } from '../lib/fonts';
import { E, prog } from '../lib/motion';
import { INDIA_RATIO } from '../components/Graphics';
import { LOGO_RATIO } from '../components/Brand';

/** Inter's baseline inside a line-height:1 box (KText), as a fraction of the size. */
export const INTER_BASE = 0.8633;

/**
 * The Odoo Community Days lockup: the logo, then "Community" at the kit's
 * spacing (gap = half the logo height, word at 0.98x the logo height), and
 * "Days" on a second line aligned under "Community" (the way the kit's
 * EventLockup sets its city line). Distances in px for a logo of height lk.
 */
export const cdUnit = () => LOGO_RATIO + 0.5 + (measure100('Community', 700, FONTS.sans, -0.02) / 100) * 0.98;
export const cdLockup = (lk: number) => {
  const s = lk * 0.98;
  const xWord = lk * (LOGO_RATIO + 0.5);
  const w1 = (measure100('Community', 700, FONTS.sans, -0.02) / 100) * s;
  const base1 = lk; // row 1 sits on the logo's baseline
  const base2 = base1 + s * 1.06;
  return { s, xWord, w1, width: xWord + w1, base1, base2, top1: base1 - INTER_BASE * s, top2: base2 - INTER_BASE * s, height: base2 + 0.26 * s };
};

/**
 * Scene 1 layout: "India loves" on top, the map in the middle, "the" and the
 * Odoo Community Days lockup underneath. The lockup is the anchor.
 */
export const loveLayout = (L: Layout) => {
  const { P, X, Y } = L;
  const sIndia = P(118);
  const sLoves = P(146);
  const sThe = P(66);
  const lockMaxW = L.wide ? L.box.w * 0.5 : L.box.w;
  const lockH = Math.min(P(104), lockMaxW / cdUnit());
  const cd = cdLockup(lockH);
  const yTop = Y(0.03);
  const lovesTop = yTop + INTER_BASE * sIndia - baselineFrac(FONTS.hand) * sLoves;
  const xLoves = X(0) + (measure100('India ', 700, FONTS.sans, -0.03) / 100) * sIndia;

  const yLock = L.box.y + L.box.h - cd.height;
  const yThe = yLock - sThe * 1.12;
  const mapTop = Y(L.wide ? 0.04 : 0.15);
  const mapBottom = L.wide ? Y(0.98) : yThe - P(6);
  const mapH = mapBottom - mapTop;
  const mapW = mapH * INDIA_RATIO;
  const mapX = L.wide ? L.box.x + L.box.w - mapW : L.box.x + (L.box.w - mapW) / 2 + P(20);

  // the D of "Days": where the camera dives in
  const xD = X(0) + cd.xWord;
  const baseD = yLock + cd.base2;
  return { sIndia, sLoves, sThe, lockH, cd, yTop, lovesTop, xLoves, mapTop, mapH, mapW, mapX, yThe, yLock, xD, baseD, sizeD: cd.s };
};

/**
 * The camera move from Scene 1 into the stem of the "D" of "Days": it eases
 * in, then dives until the stem's white fills the whole frame on the drop.
 * Scene 1 draws the start of the move; Scene 2 takes over at HANDOFF_Z.
 */
export const HANDOFF_Z = 7;
export const diveCamera = (L: Layout) => {
  const lay = loveLayout(L);
  const st = glyphStem('D');
  const S = lay.sizeD;
  const c = { x: lay.xD + ((st.left + st.right) / 2) * S, y: lay.baseD + ((st.top + st.bottom) / 2) * S };
  const Z = Math.max((L.W * 1.1) / ((st.right - st.left) * S), (L.H * 1.1) / ((st.bottom - st.top) * S));
  const T = { x: L.W / 2, y: L.H / 2 };
  const accel = Easing.bezier(0.55, 0, 0.9, 0.5);
  const at = (f: number) => {
    const push = prog(f, b(CUES.drop.push), b(CUES.drop.dive) - b(CUES.drop.push), E.inOutSoft);
    const z1 = 1 + 0.08 * push;
    const span = b(CUES.drop.whiteout) - b(CUES.drop.dive);
    const k = prog(f, b(CUES.drop.dive), span, accel);
    const z = Math.exp(Math.log(z1) + (Math.log(Z) - Math.log(z1)) * k);
    const kt = prog(f, b(CUES.drop.dive), span * 0.7, E.inOut);
    const px = c.x + (T.x - c.x) * kt;
    const py = c.y + (T.y - c.y) * kt;
    /** S1 coordinates -> screen */
    const map = (x: number, y: number) => ({ x: px + (x - c.x) * z, y: py + (y - c.y) * z });
    return { z, px, py, k, map, transform: `translate(${px}px, ${py}px) scale(${z}) translate(${-c.x}px, ${-c.y}px)` };
  };
  return { c, T, Z, at, lay, stem: st };
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
