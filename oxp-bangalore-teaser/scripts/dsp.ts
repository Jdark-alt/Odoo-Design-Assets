// Small DSP toolkit shared by the music and sound-effect generators.
import fs from 'fs';
import path from 'path';
import { TOTAL_BEATS, sec } from '../src/config';

export const SR = 48000;
export const DUR = sec(TOTAL_BEATS);
export const N = Math.ceil(DUR * SR);
/** beat -> sample index */
export const S = (beat: number) => Math.round(sec(beat) * SR);
/** beats -> seconds (duration) */
export const dur = (beats: number) => sec(beats) - sec(0);
export const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

let seed = 1234567;
export const reseed = (s: number) => {
  seed = s >>> 0 || 1;
};
/** seeded white noise, -1..1 */
export const rnd = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296) * 2 - 1;
};

export type Bus = { L: Float32Array; R: Float32Array };
export const bus = (): Bus => ({ L: new Float32Array(N), R: new Float32Array(N) });
export const add = (b: Bus, i: number, v: number, pan = 0) => {
  if (i < 0 || i >= N) return;
  const a = ((pan + 1) * Math.PI) / 4;
  b.L[i] += v * Math.cos(a);
  b.R[i] += v * Math.sin(a);
};
export const polyblep = (t: number, dt: number) => {
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1;
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt;
    return t * t + t + t + 1;
  }
  return 0;
};

/** Zavalishin TPT state-variable filter; run() returns [low, band, high]. */
export class SVF {
  ic1 = 0;
  ic2 = 0;
  run(x: number, fc: number, q = 0.707) {
    const g = Math.tan((Math.PI * Math.min(fc, SR * 0.45)) / SR);
    const k = 1 / q;
    const a1 = 1 / (1 + g * (g + k));
    const a2 = g * a1;
    const a3 = g * a2;
    const v3 = x - this.ic2;
    const v1 = a1 * this.ic1 + a2 * v3;
    const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
    this.ic1 = 2 * v1 - this.ic1;
    this.ic2 = 2 * v2 - this.ic2;
    return [v2, v1, x - k * v1 - v2];
  }
}

/** Freeverb-style stereo reverb (wet only). */
export const reverb = (inp: Bus, room = 0.86, damp = 0.35) => {
  const scale = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((x) => Math.round(x * scale));
  const apT = [556, 441, 341, 225].map((x) => Math.round(x * scale));
  const out = bus();
  for (const [ch, spread] of [
    ['L', 0],
    ['R', 23],
  ] as const) {
    const x = inp[ch];
    const y = out[ch];
    const combs = combT.map((t) => ({ buf: new Float32Array(t + spread), i: 0, lp: 0 }));
    const aps = apT.map((t) => ({ buf: new Float32Array(t + spread), i: 0 }));
    for (let n = 0; n < N; n++) {
      const v = x[n] * 0.015;
      let s = 0;
      for (const c of combs) {
        const o = c.buf[c.i];
        c.lp = o * (1 - damp) + c.lp * damp;
        c.buf[c.i] = v + c.lp * room;
        c.i = (c.i + 1) % c.buf.length;
        s += o;
      }
      for (const a of aps) {
        const o = a.buf[a.i];
        a.buf[a.i] = s + o * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        s = o - s;
      }
      y[n] = s;
    }
  }
  return out;
};

/** High-pass the rumble, soft-saturate from a high percentile, limit to a ceiling. */
export const master = (L: Float32Array, R: Float32Array, opts: { percentileGain?: number; ceiling?: number; fadeOutSec?: number } = {}) => {
  const { percentileGain = 1.0, ceiling = 0.89, fadeOutSec = 0.6 } = opts;
  const hpL = new SVF();
  const hpR = new SVF();
  for (let n = 0; n < N; n++) {
    L[n] = hpL.run(L[n], 28, 0.7)[2];
    R[n] = hpR.run(R[n], 28, 0.7)[2];
  }
  const samples: number[] = [];
  for (let n = 0; n < N; n += 7) samples.push(Math.max(Math.abs(L[n]), Math.abs(R[n])));
  samples.sort((a, b) => a - b);
  const p = samples[Math.floor(samples.length * 0.998)] || 1;
  const drive = percentileGain / p;
  for (let n = 0; n < N; n++) {
    L[n] = Math.tanh(L[n] * drive);
    R[n] = Math.tanh(R[n] * drive);
  }
  const look = Math.round(SR * 0.003);
  const g = new Float32Array(N).fill(1);
  for (let n = 0; n < N; n++) {
    const a = Math.max(Math.abs(L[n]), Math.abs(R[n]));
    if (a > ceiling) for (let k = Math.max(0, n - look); k <= n; k++) g[k] = Math.min(g[k], ceiling / a);
  }
  let gs = 1;
  for (let n = 0; n < N; n++) {
    gs = Math.min(g[n], gs + (1 - gs) * 0.0008);
    L[n] *= gs;
    R[n] *= gs;
  }
  const fadeN = Math.round(SR * fadeOutSec);
  for (let n = 0; n < fadeN; n++) {
    const k = Math.pow(1 - n / fadeN, 2);
    L[N - fadeN + n] *= k;
    R[N - fadeN + n] *= k;
  }
};

/** Write a 24-bit stereo WAV. */
export const writeWav = (file: string, L: Float32Array, R: Float32Array) => {
  const out = path.resolve(file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const bytes = 3;
  const data = Buffer.alloc(N * 2 * bytes);
  for (let n = 0; n < N; n++) {
    data.writeIntLE(Math.round(Math.max(-1, Math.min(1, L[n])) * 8388607), (n * 2) * bytes, bytes);
    data.writeIntLE(Math.round(Math.max(-1, Math.min(1, R[n])) * 8388607), (n * 2 + 1) * bytes, bytes);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2 * bytes, 28);
  h.writeUInt16LE(2 * bytes, 32);
  h.writeUInt16LE(bytes * 8, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, data]));
  return out;
};
