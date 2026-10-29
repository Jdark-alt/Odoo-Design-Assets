import { useVideoConfig } from 'remotion';
import { DESIGN_BOX, SAFE_PADDING } from '../config';

export type Layout = {
  W: number;
  H: number;
  pad: number;
  box: { x: number; y: number; w: number; h: number };
  /** design-unit scale: sizes are authored for the 920 x 1190 portrait box */
  s: number;
  /** sizes in design units -> px */
  P: (n: number) => number;
  /** x as a fraction of the safe box -> px */
  X: (fx: number) => number;
  /** y as a fraction of the safe box -> px */
  Y: (fy: number) => number;
  wide: boolean;
  square: boolean;
};

// Everything is positioned relative to the safe area (80px inside every edge),
// so 1:1 and 16:9 render from the same scenes.
export const useLayout = (): Layout => {
  const { width: W, height: H } = useVideoConfig();
  const pad = SAFE_PADDING;
  const box = { x: pad, y: pad, w: W - 2 * pad, h: H - 2 * pad };
  const s = Math.min(box.w / DESIGN_BOX.w, box.h / DESIGN_BOX.h);
  return {
    W,
    H,
    pad,
    box,
    s,
    P: (n) => n * s,
    X: (fx) => box.x + fx * box.w,
    Y: (fy) => box.y + fy * box.h,
    wide: W / H > 1.2,
    square: Math.abs(W / H - 1) < 0.05,
  };
};
