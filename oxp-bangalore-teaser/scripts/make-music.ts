// Placeholder music bed: a friendly, upbeat house groove in F major at 120 BPM,
// arranged on the cue sheet in src/config.ts. Pure DSP, no samples.
//   npm run music  ->  public/audio/music-placeholder.wav
// For release, swap in a generated or licensed track (see MUSIC_PROMPT.md) and
// point MUSIC in src/config.ts at it. The sound effects live on their own track.
import { BPM, CUES, TOTAL_BEATS } from '../src/config';
import { N, S, SR, SVF, add, bus, dur, master, mtof, polyblep, reseed, reverb, rnd, writeWav } from './dsp';

reseed(20261030);
const drums = bus();
const kickBus = bus();
const bassBus = bus();
const keys = bus();
const send = bus();
const kicks: number[] = [];

// ---------------------------------------------------------------- drums (soft, round)
const kick = (beat: number, gain = 1) => {
  const i0 = S(beat);
  kicks.push(i0);
  let ph = 0;
  for (let n = 0; n < SR * 0.4; n++) {
    const t = n / SR;
    ph += (2 * Math.PI * (48 + 85 * Math.exp(-t / 0.028))) / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.17);
    add(kickBus, i0 + n, Math.tanh(Math.sin(ph) * env * 1.3) * gain * 0.8, 0);
  }
};
const clap = (beat: number, gain = 1, pan = 0) => {
  const i0 = S(beat);
  const f = new SVF();
  for (let n = 0; n < SR * 0.3; n++) {
    const t = n / SR;
    let env = 0;
    for (const o of [0, 0.008, 0.016]) if (t >= o) env = Math.max(env, Math.exp(-(t - o) / 0.006));
    env = Math.max(env, t > 0.016 ? 0.45 * Math.exp(-(t - 0.016) / 0.1) : 0);
    const [, bp] = f.run(rnd(), 1600, 0.8);
    const v = bp * env * gain * 0.6;
    add(drums, i0 + n, v, pan);
    add(send, i0 + n, v * 0.5, pan);
  }
};
const shaker = (beat: number, gain = 1, pan = 0) => {
  const i0 = S(beat);
  const f = new SVF();
  for (let n = 0; n < SR * 0.07; n++) {
    const t = n / SR;
    const env = Math.min(1, t / 0.008) * Math.exp(-t / 0.025);
    const [, , hp] = f.run(rnd(), 7000, 0.7);
    add(drums, i0 + n, hp * env * gain * 0.32, pan);
  }
};
const openHat = (beat: number, gain = 1) => {
  const i0 = S(beat);
  const f = new SVF();
  for (let n = 0; n < SR * 0.22; n++) {
    const t = n / SR;
    const [, , hp] = f.run(rnd(), 8500, 0.7);
    add(drums, i0 + n, hp * Math.exp(-t / 0.07) * gain * 0.22, 0.2);
  }
};

// ---------------------------------------------------------------- harmony (F major)
const CH: Record<string, number[]> = {
  F: [57, 60, 65, 69, 72],
  C: [55, 60, 64, 67, 72],
  Dm: [57, 62, 65, 69, 74],
  Bb: [58, 62, 65, 70, 74],
  Gm: [55, 58, 62, 67, 70],
};
const ROOT: Record<string, number> = { F: 41, C: 36, Dm: 38, Bb: 34, Gm: 43 };
type Plan = [number, string][];
const chordAt = (beat: number, plan: Plan) => {
  let c = plan[0][1];
  for (const [bt, ch] of plan) if (beat >= bt - 1e-6) c = ch;
  return c;
};

/** warm house chord: detuned saws through a soft low-pass, with a quick filter blip */
const chord = (beat: number, beats: number, name: string, gain: number, o: { attack?: number; release?: number; cutoff?: number; env?: number; detune?: number } = {}) => {
  const { attack = 0.004, release = 0.12, cutoff = 1500, env = 1800, detune = 0.09 } = o;
  const i0 = S(beat);
  const len = dur(beats);
  const voices: { f: number; ph: number; pan: number }[] = [];
  for (const m of CH[name])
    for (let v = 0; v < 3; v++) voices.push({ f: mtof(m + (v - 1) * detune), ph: Math.abs(rnd()), pan: (v - 1) * 0.5 });
  const fl = new SVF();
  const fr = new SVF();
  const norm = 1 / Math.sqrt(voices.length);
  for (let n = 0; n < (len + release) * SR; n++) {
    const t = n / SR;
    const a = (t < attack ? t / attack : 1) * (t > len ? Math.exp(-(t - len) / (release / 3)) : 1);
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
    const fc = cutoff + env * Math.exp(-t / 0.08);
    const i = i0 + n;
    if (i >= N) break;
    const L = fl.run(l * norm, fc, 0.8)[0] * a * gain;
    const R = fr.run(r * norm, fc, 0.8)[0] * a * gain;
    keys.L[i] += L;
    keys.R[i] += R;
    send.L[i] += L * 0.35;
    send.R[i] += R * 0.35;
  }
};
/** bouncy bass: sine + a little square, short notes */
const bass = (beat: number, beats: number, midi: number, gain: number) => {
  const i0 = S(beat);
  const len = dur(beats) * SR;
  const f = mtof(midi);
  let ph = 0;
  const lp = new SVF();
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    ph += f / SR;
    const sq = (ph % 1) < 0.5 ? 1 : -1;
    const s = Math.sin(2 * Math.PI * ph) + 0.25 * lp.run(sq, 600 + 900 * Math.exp(-t / 0.05), 0.8)[0];
    const env = Math.min(1, t / 0.004) * Math.min(1, (len - n) / (SR * 0.02)) * (0.75 + 0.25 * Math.exp(-t / 0.08));
    add(bassBus, i0 + n, Math.tanh(s * 1.1) * env * gain, 0);
  }
};
/** bright, rounded pluck for the arpeggio */
const pluck = (beat: number, midi: number, gain: number, cutoff: number, pan = 0) => {
  const i0 = S(beat);
  const f = mtof(midi);
  let ph = Math.abs(rnd());
  const flt = new SVF();
  for (let n = 0; n < SR * 0.3; n++) {
    const t = n / SR;
    ph += f / SR;
    if (ph >= 1) ph -= 1;
    const s = (2 * ph - 1) * 0.6 + Math.sin(2 * Math.PI * ph) * 0.4;
    const v = flt.run(s, cutoff * (0.35 + 1.4 * Math.exp(-t / 0.05)), 1.1)[0] * Math.exp(-t / 0.11) * gain;
    add(keys, i0 + n, v, pan);
    add(send, i0 + n, v * 0.45, pan);
  }
};
/** soft airy pad for the breakdown */
const pad = (beat: number, beats: number, name: string, gain: number) => {
  chord(beat, beats, name, gain, { attack: 0.35, release: 1.2, cutoff: 900, env: 200, detune: 0.14 });
};
/** a gentle filtered-noise lift into a section */
const lift = (from: number, to: number, gain: number) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const fl = new SVF();
  const fr = new SVF();
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const fc = 400 * Math.pow(6000 / 400, k);
    const e = Math.pow(k, 2) * gain;
    const i = i0 + n;
    keys.L[i] += fl.run(rnd(), fc, 1.4)[1] * e;
    keys.R[i] += fr.run(rnd(), fc, 1.4)[1] * e;
  }
};

// ---------------------------------------------------------------- arrangement
const L = CUES.love;
const D = CUES.drop;
const T = CUES.tease;
const R = CUES.reveal;
const F = CUES.rapid;
const O = CUES.outro;

/** the groove: kick, offbeat bass and chords, clap on 2 and 4, shaker */
const groove = (from: number, to: number, plan: Plan, o: { clap?: boolean; shaker16?: boolean; kickGain?: number; chordGain?: number; bassGain?: number; arp?: number; open?: boolean } = {}) => {
  const { clap: claps = true, shaker16 = true, kickGain = 1, chordGain = 0.2, bassGain = 0.3, arp = 0, open = false } = o;
  for (let bt = Math.ceil(from - 1e-6); bt < to - 1e-6; bt++) {
    kick(bt, kickGain);
    if (claps && Math.round(bt) % 2 === 1) clap(bt, 0.55, 0.05);
  }
  for (let x = from; x < to - 1e-6; x += shaker16 ? 0.25 : 0.5) {
    const off = Math.abs((x % 1) - 0.5) < 1e-6;
    shaker(x, off ? 0.9 : 0.45, off ? 0.25 : -0.2);
    if (open && off) openHat(x, 0.8);
  }
  for (let x = Math.floor(from) + 0.5; x < to - 1e-6; x += 1) {
    if (x < from) continue;
    const c = chordAt(x, plan);
    chord(x, 0.32, c, chordGain); // offbeat house stab
    bass(x, 0.42, ROOT[c], bassGain);
    bass(x + 0.25, 0.2, ROOT[c] + 12, bassGain * 0.45);
  }
  if (arp > 0) arpeggio(from, to, plan, arp);
};
const arpeggio = (from: number, to: number, plan: Plan, gain: number) => {
  for (let x = from; x < to - 1e-6; x += 0.25) {
    const notes = CH[chordAt(x, plan)];
    const idx = Math.round(x * 4) % 4;
    pluck(x, notes[[2, 3, 4, 3][idx]] + 12, gain, 2600, idx % 2 ? 0.35 : -0.35);
  }
};

// Scene 1: the groove from the first frame
const intro: Plan = [
  [0, 'F'],
  [2, 'C'],
  [4, 'Dm'],
  [6, 'Bb'],
  [8, 'F'],
  [10, 'C'],
];
groove(0, D.dive, intro, { clap: true, shaker16: false, arp: 0 });
for (let x = 4.25; x < D.dive - 1e-6; x += 0.5) shaker(x, 0.4, -0.2);
arpeggio(4, D.dive, intro, 0.06);
chord(L.india, 1, 'F', 0.22, { release: 0.4 });
// Scene 2 entry: drums drop for the dive, a gentle lift, then the full groove on the drop
lift(D.push, D.drop - 0.05, 0.35);
chord(D.dive, 0.5, 'C', 0.14, { attack: 0.08, cutoff: 900, env: 2600 });
const dropPlan: Plan = [
  [13, 'F'],
  [15, 'C'],
];
chord(D.drop, 1, 'F', 0.26, { release: 0.5 });
groove(D.drop, D.exit, dropPlan, { open: true, arp: 0.07 });
// Scene 3: breakdown, soft pads and a quiet pulse, building back in
const tease: Plan = [
  [17, 'Dm'],
  [19.5, 'Bb'],
  [22, 'F'],
  [24, 'C'],
];
for (const [bt, c] of tease) pad(bt, (tease.find(([b2]) => b2 > bt)?.[0] ?? R.we) - bt, c, 0.12);
for (let bt = T.monumentStart + 1; bt < R.we; bt++) bass(bt, 0.2, ROOT[chordAt(bt, tease)], 0.12);
for (let x = 24; x < R.we - 1e-6; x += 0.5) shaker(x, 0.3 + 0.5 * ((x - 24) / 2));
lift(24.5, R.we - 0.05, 0.3);
// Scene 4: the groove returns; a half-beat breath before "you"
const reveal: Plan = [
  [26, 'Bb'],
  [28, 'C'],
  [30, 'F'],
  [32, 'C'],
];
groove(R.we, 29.5, reveal, { arp: 0.06 });
chord(R.you, 1.5, 'F', 0.26, { release: 0.6 });
groove(R.you, F.items[0], reveal, { open: true, arp: 0.07 });
// Scene 5: rapid fire, full groove
const rapid: Plan = [
  [34, 'Dm'],
  [36, 'Bb'],
  [38, 'F'],
  [40, 'C'],
  [42, 'Bb'],
];
groove(F.items[0], O.onTour, rapid, { open: true, arp: 0.075 });
// Scene 6: lighter, warm; resolves to F under the end card
const outro: Plan = [
  [44, 'Bb'],
  [46, 'C'],
  [48, 'Dm'],
  [50, 'Bb'],
  [52, 'F'],
];
groove(O.onTour, O.lockup, outro, { clap: false, shaker16: false, kickGain: 0.75, chordGain: 0.16, bassGain: 0.24, arp: 0.05 });
for (let bt = O.nextStop + 1; bt < O.lockup; bt += 2) clap(bt, 0.4);
kick(O.lockup, 0.7);
chord(O.lockup, TOTAL_BEATS - O.lockup - 2, 'F', 0.2, { attack: 0.02, release: 1.6, cutoff: 1400, env: 1200 });
bass(O.lockup, 3, ROOT.F, 0.24);
for (let x = O.lockup; x < TOTAL_BEATS - 2; x += 0.5) {
  const k = 1 - (x - O.lockup) / (TOTAL_BEATS - 2 - O.lockup);
  pluck(x, CH.F[[2, 3, 4, 3][Math.round(x * 2) % 4]] + 12, 0.05 * k, 2200, x % 1 ? 0.3 : -0.3);
}

// ---------------------------------------------------------------- mix
const duck = new Float32Array(N).fill(1);
for (const k of kicks)
  for (let n = 0; n < SR * 0.25; n++) {
    const i = k + n;
    if (i >= N) break;
    const t = n / SR;
    duck[i] = Math.min(duck[i], 1 - 0.45 * (t < 0.004 ? t / 0.004 : Math.exp(-(t - 0.004) / 0.09)));
  }
const wet = reverb(send, 0.82, 0.4);
const outL = new Float32Array(N);
const outR = new Float32Array(N);
for (let n = 0; n < N; n++) {
  const d = duck[n];
  outL[n] = kickBus.L[n] + drums.L[n] + bassBus.L[n] * d + keys.L[n] * (0.45 + 0.55 * d) + wet.L[n];
  outR[n] = kickBus.R[n] + drums.R[n] + bassBus.R[n] * d + keys.R[n] * (0.45 + 0.55 * d) + wet.R[n];
}
master(outL, outR, { percentileGain: 0.95 });
console.log('wrote', writeWav('public/audio/music-placeholder.wav', outL, outR), `(${BPM} BPM, F major)`);
