import { Easing, interpolate, spring } from 'remotion';
import { FPS } from '../config';

// Snappy, premium easing: fast in, soft settle. No linear tweens.
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-like out
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  inOutSoft: Easing.bezier(0.45, 0, 0.25, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inSoft: Easing.bezier(0.5, 0, 0.75, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1), // slight overshoot
  backStrong: Easing.bezier(0.3, 2.1, 0.5, 1),
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Tween a value between two frames. */
export const tw = (f: number, f0: number, f1: number, from: number, to: number, easing: (t: number) => number = E.out) =>
  interpolate(f, [f0, f1], [from, to], { ...clamp, easing });

/** 0..1 progress over `dur` frames from f0. */
export const prog = (f: number, f0: number, dur: number, easing: (t: number) => number = E.out) =>
  dur <= 0 ? (f >= f0 ? 1 : 0) : tw(f, f0, f0 + dur, 0, 1, easing);

/** Multi-stop keyframes with one easing per segment. */
export const keys = (f: number, frames: number[], values: number[], easing: (t: number) => number = E.inOut) =>
  interpolate(f, frames, values, { ...clamp, easing });

/** Spring 0..1 (with natural overshoot) starting at f0. */
export const pop = (f: number, f0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  f < f0
    ? 0
    : spring({ frame: f - f0, fps: FPS, config: { damping: cfg.damping ?? 12, stiffness: cfg.stiffness ?? 190, mass: cfg.mass ?? 0.7 } });

/** Scale punch: jumps to 1 + amp at f0 and rings down to 1. */
export const punch = (f: number, f0: number, amp: number, decay = 6, freq = 0.55) => {
  if (f < f0) return 1;
  const t = f - f0;
  return 1 + amp * Math.exp(-t / decay) * Math.cos(t * freq);
};

/** Short pulse 0..1..0 used for beat accents (attack 1 frame, exp decay). */
export const pulse = (f: number, f0: number, decay = 4) => (f < f0 ? 0 : Math.exp(-(f - f0) / decay));

/** Deterministic smooth noise in -1..1. */
export const noise1 = (x: number, seed = 0) => {
  const s = seed * 12.9898;
  return (
    Math.sin(x * 1.13 + s) * 0.5 +
    Math.sin(x * 2.71 + s * 1.7 + 1.3) * 0.3 +
    Math.sin(x * 5.37 + s * 2.3 + 4.1) * 0.2
  );
};

/** Slow drift for holds: motion that stays alive. */
export const drift = (f: number, amp: number, period = 90, seed = 0) => noise1((f / period) * Math.PI * 2, seed) * amp;

export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Kick-synced pulse on every beat between two frames: returns 1 + amp * decay. */
export const onBeats = (f: number, from: number, to: number, framesPerBeat: number, amp: number, decay = 4) => {
  if (f < from || f > to) return 1;
  const t = (f - from) % framesPerBeat;
  return 1 + amp * Math.exp(-t / decay);
};
