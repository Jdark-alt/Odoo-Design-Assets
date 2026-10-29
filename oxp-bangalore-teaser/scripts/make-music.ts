// Generates the placeholder soundtrack (120 BPM, F minor) from the cue sheet in
// src/config.ts, so every hit lands on the visuals. Pure DSP, no samples.
//   npm run music  ->  public/audio/oxp-teaser-120bpm.wav
// Replace the WAV with a licensed track for release; keep the cue points.
import fs from 'fs';
import path from 'path';
import { BPM, CUES, FPS, TOTAL_BEATS, sec } from '../src/config';

const SR = 48000;
const DUR = sec(TOTAL_BEATS);
const N = Math.ceil(DUR * SR);
const S = (beat: number) => Math.round(sec(beat) * SR);
const SPB = 60 / BPM;

// ---------------------------------------------------------------- utilities
let seed = 1234567;
const rnd = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296) * 2 - 1;
};
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
type Bus = { L: Float32Array; R: Float32Array };
const bus = (): Bus => ({ L: new Float32Array(N), R: new Float32Array(N) });
const add = (b: Bus, i: number, v: number, pan = 0) => {
  if (i < 0 || i >= N) return;
  const a = ((pan + 1) * Math.PI) / 4;
  b.L[i] += v * Math.cos(a);
  b.R[i] += v * Math.sin(a);
};
const polyblep = (t: number, dt: number) => {
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
/** Zavalishin TPT state-variable filter; returns [low, band, high]. */
class SVF {
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

const drums = bus(); // kick goes to its own bus for sidechain
const kickBus = bus();
const bass = bus();
const synth = bus();
const fx = bus();
const send = bus(); // reverb send
const kicks: number[] = [];

// ---------------------------------------------------------------- drums
const kick = (beat: number, gain = 1, soft = false) => {
  const i0 = S(beat);
  kicks.push(i0);
  const len = Math.floor(SR * 0.5);
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    const f = 44 + (soft ? 90 : 150) * Math.exp(-t / 0.032);
    ph += (2 * Math.PI * f) / SR;
    const env = (t < 0.004 ? t / 0.004 : 1) * Math.exp(-t / (soft ? 0.18 : 0.24));
    let v = Math.sin(ph) * env;
    if (!soft && n < SR * 0.004) v += rnd() * 0.35 * (1 - n / (SR * 0.004));
    v = Math.tanh(v * 1.8) * gain * 0.85;
    add(kickBus, i0 + n, v, 0);
  }
};
const clap = (beat: number, gain = 1, pan = 0) => {
  const i0 = S(beat);
  const f = new SVF();
  const len = Math.floor(SR * 0.35);
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    let env = 0;
    for (const o of [0, 0.009, 0.018, 0.027]) if (t >= o) env = Math.max(env, Math.exp(-(t - o) / 0.007));
    env = Math.max(env, t > 0.027 ? 0.55 * Math.exp(-(t - 0.027) / 0.13) : 0);
    const [, bp] = f.run(rnd(), 1400, 0.9);
    const v = bp * env * gain * 0.9;
    add(drums, i0 + n, v, pan);
    add(send, i0 + n, v * 0.35, pan);
  }
};
const hat = (beat: number, gain = 1, open = false, pan = 0) => {
  const i0 = S(beat);
  const f = new SVF();
  const len = Math.floor(SR * (open ? 0.35 : 0.08));
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    const env = Math.exp(-t / (open ? 0.12 : 0.022));
    const [, , hp] = f.run(rnd(), 8000, 0.8);
    add(drums, i0 + n, hp * env * gain * 0.5, pan);
  }
};
const tick = (beat: number, gain = 1, pan = 0) => {
  const i0 = S(beat);
  const f = new SVF();
  for (let n = 0; n < SR * 0.02; n++) {
    const t = n / SR;
    const [, bp] = f.run(rnd(), 5200, 3);
    add(drums, i0 + n, bp * Math.exp(-t / 0.004) * gain, pan);
  }
};
const snareRoll = (from: number, to: number, gain = 1) => {
  // accelerating hits
  let t = from;
  let step = 0.25;
  while (t < to - 0.01) {
    const k = (t - from) / (to - from);
    clap(t, gain * (0.25 + 0.75 * k), (k - 0.5) * 0.4);
    t += step;
    step = Math.max(1 / 16, step * 0.78);
  }
};

// ---------------------------------------------------------------- tonal
const CH: Record<string, number[]> = {
  Fm: [53, 56, 60, 65, 68],
  Db: [49, 56, 61, 65, 68],
  Ab: [51, 56, 60, 63, 68],
  Eb: [51, 55, 58, 63, 67],
  Cm: [48, 55, 60, 63, 67],
};
const ROOT: Record<string, number> = { Fm: 29, Db: 25, Ab: 32, Eb: 27, Cm: 24 };

/** supersaw chord: stab (short) or pad (long), lowpassed */
const saws = (beat: number, lenBeats: number, chord: string, gain: number, opts: { attack?: number; release?: number; cutoff?: number; cutEnv?: number; octave?: number; spread?: number } = {}) => {
  const { attack = 0.003, release = 0.18, cutoff = 2400, cutEnv = 3000, octave = 0, spread = 0.18 } = opts;
  const i0 = S(beat);
  const lenS = sec(lenBeats) - sec(0);
  const total = Math.floor((lenS + release) * SR);
  const notes = CH[chord].map((m) => m + 12 * octave);
  const voices: { f: number; ph: number; pan: number }[] = [];
  for (const m of notes)
    for (let v = 0; v < 7; v++) {
      const det = ((v - 3) / 3) * spread;
      voices.push({ f: mtof(m + det), ph: Math.abs(rnd()), pan: ((v - 3) / 3) * 0.7 });
    }
  const fL = new SVF();
  const fR = new SVF();
  const norm = 1 / Math.sqrt(voices.length);
  for (let n = 0; n < total; n++) {
    const t = n / SR;
    const env = (t < attack ? t / attack : 1) * (t > lenS ? Math.exp(-(t - lenS) / (release / 3)) : 1);
    if (env < 1e-4 && t > lenS) break;
    let l = 0;
    let r = 0;
    for (const vo of voices) {
      const dt = vo.f / SR;
      vo.ph += dt;
      if (vo.ph >= 1) vo.ph -= 1;
      const s = 2 * vo.ph - 1 - polyblep(vo.ph, dt);
      l += s * (1 - vo.pan) * 0.5;
      r += s * (1 + vo.pan) * 0.5;
    }
    const fc = cutoff + cutEnv * Math.exp(-t / 0.12);
    const [ll] = fL.run(l * norm, fc, 0.9);
    const [rr] = fR.run(r * norm, fc, 0.9);
    const i = i0 + n;
    if (i >= N) break;
    synth.L[i] += ll * env * gain;
    synth.R[i] += rr * env * gain;
    send.L[i] += ll * env * gain * 0.3;
    send.R[i] += rr * env * gain * 0.3;
  }
};

const sub = (beat: number, lenBeats: number, midi: number, gain: number) => {
  const i0 = S(beat);
  const len = Math.floor((sec(lenBeats) - sec(0)) * SR);
  const f = mtof(midi);
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    ph += (2 * Math.PI * f) / SR;
    const env = Math.min(1, t / 0.006) * Math.min(1, (len - n) / (SR * 0.02));
    const v = Math.tanh((Math.sin(ph) + 0.25 * Math.sin(2 * ph)) * 1.4) * env * gain;
    add(bass, i0 + n, v, 0);
  }
};
const reese = (beat: number, lenBeats: number, midi: number, gain: number, cutoff = 520) => {
  const i0 = S(beat);
  const len = Math.floor((sec(lenBeats) - sec(0)) * SR);
  const f1 = mtof(midi) * 0.997;
  const f2 = mtof(midi) * 1.004;
  let p1 = 0;
  let p2 = 0.37;
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    p1 += f1 / SR;
    if (p1 >= 1) p1 -= 1;
    p2 += f2 / SR;
    if (p2 >= 1) p2 -= 1;
    const s = 2 * p1 - 1 - polyblep(p1, f1 / SR) + (2 * p2 - 1 - polyblep(p2, f2 / SR));
    const env = Math.min(1, t / 0.004) * Math.min(1, (len - n) / (SR * 0.015));
    const [lp] = flt.run(s * 0.5, cutoff + 900 * Math.exp(-t / 0.06), 1.2);
    add(bass, i0 + n, Math.tanh(lp * 1.5) * env * gain, 0);
  }
};
const pluck = (beat: number, midi: number, gain: number, cutoff: number, pan = 0) => {
  const i0 = S(beat);
  const len = Math.floor(SR * 0.22);
  const f = mtof(midi);
  let ph = Math.abs(rnd());
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    ph += f / SR;
    if (ph >= 1) ph -= 1;
    const sq = (ph < 0.5 ? 1 : -1) * 0.6 + (2 * ph - 1) * 0.4;
    const [lp] = flt.run(sq, cutoff * (0.4 + 1.6 * Math.exp(-t / 0.04)), 1.6);
    const v = lp * Math.exp(-t / 0.07) * gain;
    add(synth, i0 + n, v, pan);
    add(send, i0 + n, v * 0.4, pan);
  }
};

// ---------------------------------------------------------------- fx
const impact = (beat: number, gain = 1, size = 1) => {
  const i0 = S(beat);
  const len = Math.floor(SR * 1.6 * size);
  let ph = 0;
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    const f = 32 + 110 * Math.exp(-t / (0.09 * size));
    ph += (2 * Math.PI * f) / SR;
    const boom = Math.sin(ph) * Math.exp(-t / (0.55 * size));
    const [lp] = flt.run(rnd(), 900, 0.7);
    const thump = lp * Math.exp(-t / 0.05) * 1.4;
    const v = Math.tanh((boom + thump) * 1.6) * gain;
    add(fx, i0 + n, v, 0);
    add(send, i0 + n, v * 0.25, 0);
  }
};
const crash = (beat: number, gain = 1, lenS = 1.8) => {
  const i0 = S(beat);
  const fL = new SVF();
  const fR = new SVF();
  const partials = [3150, 4320, 5170, 6630, 7240, 8910].map((f) => ({ f, ph: Math.abs(rnd()) }));
  for (let n = 0; n < SR * lenS; n++) {
    const t = n / SR;
    const env = Math.exp(-t / (lenS * 0.35));
    let metal = 0;
    for (const p of partials) {
      p.ph += p.f / SR;
      metal += p.ph % 1 < 0.5 ? 1 : -1;
    }
    const [, , hl] = fL.run(rnd() + metal * 0.05, 5200, 0.7);
    const [, , hr] = fR.run(rnd() + metal * 0.05, 5200, 0.7);
    const i = i0 + n;
    if (i >= N) break;
    fx.L[i] += hl * env * gain * 0.35;
    fx.R[i] += hr * env * gain * 0.35;
    send.L[i] += hl * env * gain * 0.12;
    send.R[i] += hr * env * gain * 0.12;
  }
};
const riser = (from: number, to: number, gain = 1, pitched = true) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const fL = new SVF();
  const fR = new SVF();
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const fc = 250 * Math.pow(9000 / 250, k * k);
    const [, bl] = fL.run(rnd(), fc, 2.2);
    const [, br] = fR.run(rnd(), fc, 2.2);
    ph += mtof(53 + 24 * k * k) / SR;
    const saw = pitched ? (2 * (ph % 1) - 1) * 0.12 : 0;
    const env = Math.pow(k, 2.2) * gain;
    const i = i0 + n;
    fx.L[i] += (bl + saw) * env;
    fx.R[i] += (br + saw) * env;
    send.L[i] += bl * env * 0.3;
    send.R[i] += br * env * 0.3;
  }
};
const whoosh = (from: number, to: number, gain = 1, down = false) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const fc = down ? 7000 * Math.pow(160 / 7000, k) : 300 * Math.pow(6000 / 300, Math.sin((k * Math.PI) / 2));
    const [, bp] = flt.run(rnd(), fc, 1.6);
    const env = Math.sin(Math.PI * Math.pow(k, down ? 0.5 : 1.3)) * gain;
    add(fx, i0 + n, bp * env, (k - 0.5) * (down ? -0.6 : 0.6));
    add(send, i0 + n, bp * env * 0.3, 0);
  }
};
const reverseCymbal = (to: number, beats: number, gain = 1) => {
  const i0 = S(to - beats);
  const len = S(to) - i0;
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const [, , hp] = flt.run(rnd(), 4500, 0.7);
    add(fx, i0 + n, hp * Math.pow(k, 3) * gain * 0.5, 0);
  }
};
const shimmer = (beat: number, beats: number, gain = 1) => {
  // bright noise sparkles for confetti
  for (let j = 0; j < 40; j++) {
    const at = beat + Math.abs(rnd()) * beats;
    const i0 = S(at);
    const flt = new SVF();
    const fc = 6000 + Math.abs(rnd()) * 6000;
    const pan = rnd() * 0.9;
    const g = gain * (1 - (at - beat) / beats) * 0.4;
    for (let n = 0; n < SR * 0.04; n++) {
      const [, bp] = flt.run(rnd(), fc, 6);
      add(fx, i0 + n, bp * Math.exp(-n / (SR * 0.008)) * g, pan);
      add(send, i0 + n, bp * Math.exp(-n / (SR * 0.008)) * g * 0.6, pan);
    }
  }
};
const drone = (from: number, to: number, gain = 1) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const fl = new SVF();
  const vs = [29, 36, 41.07, 40.93].map((m) => ({ f: mtof(m), ph: Math.abs(rnd()) }));
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const t = n / SR;
    let s = 0;
    for (const v of vs) {
      v.ph += v.f / SR;
      if (v.ph >= 1) v.ph -= 1;
      s += 2 * v.ph - 1;
    }
    const [lp] = fl.run(s * 0.25, 140 + 420 * k + 60 * Math.sin(t * 1.3), 1.1);
    const env = Math.min(1, k * 6) * Math.min(1, (1 - k) * 12) * gain;
    add(synth, i0 + n, lp * env, Math.sin(t * 0.7) * 0.3);
    add(send, i0 + n, lp * env * 0.4, 0);
  }
};
const heartbeat = (beat: number, gain = 1) => {
  for (const [o, g] of [
    [0, 1],
    [0.22, 0.55],
  ]) {
    const i0 = S(beat + o);
    let ph = 0;
    for (let n = 0; n < SR * 0.3; n++) {
      const t = n / SR;
      ph += (2 * Math.PI * (48 + 40 * Math.exp(-t / 0.03))) / SR;
      add(kickBus, i0 + n, Math.sin(ph) * Math.exp(-t / 0.11) * g * gain * 0.75, 0);
    }
  }
};

// ---------------------------------------------------------------- arrangement
const L = CUES.love;
const D = CUES.drop;
const T = CUES.tease;
const R = CUES.reveal;
const F = CUES.rapid;
const O = CUES.outro;
const chordAt = (beat: number, plan: [number, string][]) => {
  let c = plan[0][1];
  for (const [bt, ch] of plan) if (beat >= bt) c = ch;
  return c;
};
const groove = (from: number, to: number, o: { clap?: boolean; hats16?: boolean; open?: boolean; kickGain?: number; soft?: boolean } = {}) => {
  for (let bt = Math.ceil(from); bt < to; bt++) {
    kick(bt, o.kickGain ?? 1, o.soft);
    if (o.clap && bt % 2 === 1) clap(bt, 0.55);
  }
  for (let x = from; x < to - 0.01; x += o.hats16 ? 0.25 : 0.5) {
    const off = Math.abs((x % 1) - 0.5) < 0.01;
    if (o.open && off) hat(x, 0.45, true, 0.2);
    else hat(x, off ? 0.55 : 0.3, false, x % 0.5 === 0.25 ? -0.25 : 0.15);
  }
};
const bassline = (from: number, to: number, plan: [number, string][], gain: number, type: 'sub' | 'reese' | 'both' = 'sub', step = 0.5) => {
  for (let x = from; x < to - 0.01; x += step) {
    const c = chordAt(x, plan);
    if (Math.abs(x % 1) < 0.01 && type !== 'reese') continue; // leave the downbeat to the kick
    if (type !== 'reese') sub(x, step * 0.92, ROOT[c] + 12, gain);
    if (type !== 'sub') reese(x, step * 0.9, ROOT[c] + 12, gain * 0.7);
  }
};

// Scene 1: intro build, energy from the first frame
const introPlan: [number, string][] = [
  [0, 'Fm'],
  [4, 'Db'],
  [8, 'Ab'],
  [10, 'Eb'],
];
groove(0, 12, { clap: false, hats16: false });
for (let bt = 4; bt < 12; bt += 2) clap(bt + 1, 0.5);
for (let x = 8; x < 12; x += 0.25) if (x % 0.5 === 0.25) hat(x, 0.25, false, -0.3);
bassline(2, 12, introPlan, 0.32);
for (let x = 0; x < 12; x += 0.25) {
  const c = chordAt(x, introPlan);
  const notes = CH[c];
  const idx = Math.round(x * 4) % 4;
  pluck(x, notes[[1, 2, 3, 4][idx]] + 12, 0.11 + 0.04 * (x / 12), 600 + 4200 * Math.pow(x / 12, 1.6), idx % 2 ? 0.35 : -0.35);
}
crash(L.everyYear, 0.7);
saws(L.everyYear, 0.5, 'Fm', 0.28);
impact(L.india, 0.65, 0.8);
saws(L.india, 0.75, 'Fm', 0.32, { octave: 0 });
saws(L.loves, 0.5, 'Db', 0.26);
saws(L.lovesPulse2, 0.5, 'Db', 0.22);
whoosh(L.toGather, L.converge + 1.1, 0.5);
saws(L.forThe, 0.5, 'Ab', 0.2);
impact(L.odooExperience, 0.55, 0.8);
crash(L.odooExperience, 0.55);
saws(L.odooExperience, 1, 'Ab', 0.3);

// Scene 2: thin into a riser, then the drop
riser(D.slowdown - 2, D.drop - 0.06, 0.55);
reverseCymbal(D.drop - 0.06, 1, 0.9);
impact(D.drop, 1.0, 1.25);
crash(D.drop, 0.9, 2.4);
groove(D.drop, D.collapse, { clap: true, hats16: true, open: true });
const dropPlan: [number, string][] = [
  [13, 'Fm'],
  [15, 'Db'],
];
bassline(D.drop, D.collapse, dropPlan, 0.3, 'both', 0.25);
for (let x = D.drop; x < D.collapse; x += 0.5) saws(x + 0.0, 0.32, chordAt(x, dropPlan), x === D.drop ? 0.42 : 0.26, { cutoff: 1800 });
whoosh(D.collapse, T.butThisTime, 0.55, true);

// Scene 3: near silence, a low pulse, a dark drone, typing ticks
for (let bt = T.monumentStart + 1; bt < R.we - 1; bt++) heartbeat(bt, bt >= 23 ? 0.85 : 0.6);
drone(T.monumentStart, R.we, 0.32);
for (let c = 0; c < 'But this time,'.length; c++) tick(T.butThisTime + (4 + c * 2) / 15, 0.35, ((c % 5) - 2) * 0.1);
for (let c = 0; c < 10; c++) tick(T.different + (c * 2.4) / 15, 0.18, 0.2);
riser(T.different + 1.5, R.we - 0.06, 0.45, false);
snareRoll(R.we - 1, R.we - 0.06, 0.55);

// Scene 4: energy back, words on beats, the hero hit
const revealPlan: [number, string][] = [
  [26, 'Db'],
  [28, 'Eb'],
  [30, 'Fm'],
  [32, 'Ab'],
];
impact(R.we, 0.85, 1);
crash(R.we, 0.7);
groove(R.we, 29.5, { clap: true, hats16: true });
groove(R.toYou, F.items[0], { clap: true, hats16: true, open: true });
bassline(R.we, 29.5, revealPlan, 0.3, 'both');
bassline(R.toYou, F.items[0], revealPlan, 0.3, 'both');
for (const w of [R.we, R.are, R.bringing, R.the, R.odooExperience]) saws(w, 0.4, chordAt(w, revealPlan), 0.24);
reverseCymbal(R.toYou - 0.04, 0.5, 0.8);
impact(R.toYou, 1.0, 1.15);
crash(R.toYou, 0.85, 2.2);
saws(R.toYou, 1.5, 'Fm', 0.36, { cutoff: 2600, release: 0.5 });
shimmer(R.toYou, 2.5, 0.8);
saws(R.toYou + 2, 2, 'Ab', 0.16, { attack: 0.02, cutoff: 1600, cutEnv: 800 });

// Scene 5: rapid fire, a stab on every item, then three hard hits
const rapidPlan: [number, string][] = [
  [34, 'Db'],
  [36, 'Eb'],
  [38, 'Fm'],
];
impact(F.items[0], 0.8, 0.9);
crash(F.items[0], 0.6);
groove(F.items[0], F.and, { clap: true, hats16: true, open: true });
bassline(F.items[0], F.and, rapidPlan, 0.3, 'both', 0.25);
F.items.forEach((it, i) => saws(it, 0.35, chordAt(it, rapidPlan), 0.24 + i * 0.012, { octave: i >= 3 ? 1 : 0, cutoff: 2000 + i * 300 }));
tick(F.and, 0.5);
snareRoll(F.and + 0.25, F.so - 0.04, 0.5);
riser(F.and, F.so - 0.04, 0.4);
impact(F.so, 0.8, 0.9);
saws(F.so, 0.6, 'Fm', 0.3, { octave: -1 });
crash(F.so, 0.45, 1);
impact(F.much, 0.92, 1.05);
saws(F.much, 0.6, 'Ab', 0.32);
crash(F.much, 0.6, 1.2);
impact(F.more, 1.15, 1.4);
crash(F.more, 1.0, 2.6);
saws(F.more, 2, 'Fm', 0.4, { octave: 1, release: 0.8, cutoff: 2800 });
saws(F.more, 2, 'Fm', 0.22, { octave: 0, release: 0.8 });
shimmer(F.more, 3, 1);
groove(F.more + 1, F.settle + 0.5, { clap: true, hats16: true, open: true });
bassline(F.more, F.settle + 0.5, [[43, 'Fm']], 0.3, 'both');
whoosh(F.settle, O.onTour, 0.55, true);

// Scene 6: confident, softer; resolves under the lockup
const outroPlan: [number, string][] = [
  [46, 'Db'],
  [48, 'Eb'],
  [50, 'Fm'],
  [52, 'Db'],
  [54, 'Ab'],
];
groove(O.onTour, O.lockup, { soft: true, kickGain: 0.7, hats16: false });
for (let bt = O.onTour + 1; bt < O.lockup; bt += 2) clap(bt, 0.28);
bassline(O.onTour, O.lockup, outroPlan, 0.24);
for (const [bt, c] of outroPlan.slice(0, 4)) saws(bt, 2, c, 0.15, { attack: 0.05, release: 0.6, cutoff: 1300, cutEnv: 900 });
for (let x = O.onTour; x < O.lockup; x += 0.25) {
  const notes = CH[chordAt(x, outroPlan)];
  const idx = Math.round(x * 4) % 4;
  pluck(x, notes[[2, 3, 4, 3][idx]] + 12, 0.07, 2200, idx % 2 ? 0.4 : -0.4);
}
impact(O.bangalore, 0.55, 0.9);
crash(O.bangalore, 0.35, 1.6);
kick(O.lockup, 0.8, true);
impact(O.lockup, 0.4, 1.2);
saws(O.lockup, TOTAL_BEATS - O.lockup - 1.5, 'Ab', 0.24, { attack: 0.08, release: 2.2, cutoff: 1500, cutEnv: 1200 });
sub(O.lockup, 4, ROOT.Ab + 12, 0.26);

// ---------------------------------------------------------------- mix
// sidechain: bass and synths duck under every kick
const duck = new Float32Array(N).fill(1);
for (const k of kicks)
  for (let n = 0; n < SR * 0.3; n++) {
    const i = k + n;
    if (i >= N) break;
    const t = n / SR;
    const d = 1 - 0.65 * (t < 0.004 ? t / 0.004 : Math.exp(-(t - 0.004) / 0.09));
    duck[i] = Math.min(duck[i], d);
  }

// Freeverb-style reverb on the send bus
const reverb = (inp: Bus) => {
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
    const room = 0.86;
    const damp = 0.35;
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
const wet = reverb(send);

const outL = new Float32Array(N);
const outR = new Float32Array(N);
for (let n = 0; n < N; n++) {
  const d = duck[n];
  outL[n] = kickBus.L[n] + drums.L[n] * 0.9 + bass.L[n] * d + synth.L[n] * (0.35 + 0.65 * d) + fx.L[n] + wet.L[n] * 1.1 * (0.5 + 0.5 * d);
  outR[n] = kickBus.R[n] + drums.R[n] * 0.9 + bass.R[n] * d + synth.R[n] * (0.35 + 0.65 * d) + fx.R[n] + wet.R[n] * 1.1 * (0.5 + 0.5 * d);
}
// gentle high-pass on the master to clear DC / rumble below 25 Hz
const hpL = new SVF();
const hpR = new SVF();
for (let n = 0; n < N; n++) {
  outL[n] = hpL.run(outL[n], 25, 0.7)[2];
  outR[n] = hpR.run(outR[n], 25, 0.7)[2];
}
// glue: soft clip, then a smooth peak limiter and normalise to -1 dBFS
// drive from a high percentile (not the single loudest impact) so the mix stays dense
const samples: number[] = [];
for (let n = 0; n < N; n += 7) samples.push(Math.max(Math.abs(outL[n]), Math.abs(outR[n])));
samples.sort((a, b) => a - b);
const p998 = samples[Math.floor(samples.length * 0.998)];
const drive = 1.05 / p998;
for (let n = 0; n < N; n++) {
  outL[n] = Math.tanh(outL[n] * drive);
  outR[n] = Math.tanh(outR[n] * drive);
}
const look = Math.round(SR * 0.003);
const gainArr = new Float32Array(N).fill(1);
const ceil = 0.89; // -1 dBFS
for (let n = 0; n < N; n++) {
  const a = Math.max(Math.abs(outL[n]), Math.abs(outR[n]));
  if (a > ceil) {
    const g = ceil / a;
    for (let k = Math.max(0, n - look); k <= n; k++) gainArr[k] = Math.min(gainArr[k], g);
  }
}
let gs = 1;
for (let n = 0; n < N; n++) {
  gs = Math.min(gainArr[n], gs + (1 - gs) * 0.0008);
  outL[n] *= gs;
  outR[n] *= gs;
}
// fade the last half second so the end card hold is clean
const fadeN = Math.round(SR * 0.6);
for (let n = 0; n < fadeN; n++) {
  const g = Math.pow(1 - n / fadeN, 2);
  outL[N - fadeN + n] *= g;
  outR[N - fadeN + n] *= g;
}

// ---------------------------------------------------------------- write 24-bit WAV
const outFile = path.resolve('public/audio/oxp-teaser-120bpm.wav');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
const bytes = 3;
const data = Buffer.alloc(N * 2 * bytes);
for (let n = 0; n < N; n++)
  for (const [c, arr] of [
    [0, outL],
    [1, outR],
  ] as const) {
    const v = Math.max(-1, Math.min(1, arr[n]));
    const iv = Math.round(v * 8388607);
    data.writeIntLE(iv, (n * 2 + c) * bytes, bytes);
  }
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2 * bytes, 28);
header.writeUInt16LE(2 * bytes, 32);
header.writeUInt16LE(bytes * 8, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
fs.writeFileSync(outFile, Buffer.concat([header, data]));
console.log(`wrote ${outFile} (${DUR.toFixed(2)}s, ${BPM} BPM, ${FPS} fps grid, beat = ${SPB}s)`);
