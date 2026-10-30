// Sound effects, on their own track, placed from the cue sheet in src/config.ts.
// Only where the picture moves: soft thumps for landings, light pops for the
// hearts and pins, air for the camera dive, soft keystrokes, a swell for
// "different.", a sparkle for "you".
//   npm run sfx  ->  public/audio/sfx.wav
import { CUES } from '../src/config';
import { N, S, SR, SVF, add, bus, mtof, reseed, reverb, rnd, writeWav } from './dsp';

reseed(777);
const fx = bus();
const send = bus();
const out = (i: number, v: number, pan = 0, wet = 0.2) => {
  add(fx, i, v, pan);
  add(send, i, v * wet, pan);
};

/** soft low thump for a word landing */
const thump = (beat: number, gain = 1) => {
  const i0 = S(beat);
  let ph = 0;
  for (let n = 0; n < SR * 0.35; n++) {
    const t = n / SR;
    ph += (2 * Math.PI * (52 + 60 * Math.exp(-t / 0.04))) / SR;
    out(i0 + n, Math.sin(ph) * Math.min(1, t / 0.004) * Math.exp(-t / 0.12) * gain * 0.55, 0, 0.1);
  }
};
/** small rounded pop (a bubble), pitch rising */
const blip = (beat: number, gain = 1, pitch = 72, pan = 0) => {
  const i0 = S(beat);
  let ph = 0;
  for (let n = 0; n < SR * 0.09; n++) {
    const t = n / SR;
    ph += (2 * Math.PI * mtof(pitch + 10 * Math.min(1, t / 0.03))) / SR;
    out(i0 + n, Math.sin(ph) * Math.min(1, t / 0.002) * Math.exp(-t / 0.025) * gain * 0.22, pan, 0.35);
  }
};
/** airy swish: band-passed noise sweeping up, rounded envelope */
const air = (from: number, to: number, gain = 1, f0 = 300, f1 = 5000, pan0 = -0.3, pan1 = 0.3) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const flt = new SVF();
  for (let n = 0; n < len; n++) {
    const k = n / len;
    const fc = f0 * Math.pow(f1 / f0, k);
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, k * 1.05)), 1.5) * gain;
    out(i0 + n, flt.run(rnd(), fc, 1.2)[1] * env * 0.5, pan0 + (pan1 - pan0) * k, 0.3);
  }
};
/** soft, rounded keystroke */
const key = (beat: number, gain = 1, pan = 0) => {
  const i0 = S(beat);
  const flt = new SVF();
  for (let n = 0; n < SR * 0.03; n++) {
    const t = n / SR;
    out(i0 + n, flt.run(rnd(), 2400, 1.5)[1] * Math.exp(-t / 0.005) * gain * 0.35, pan, 0.25);
  }
};
/** soft swell: an airy pad chord rising from nothing, no transients */
const swell = (from: number, to: number, gain = 1) => {
  const i0 = S(from);
  const len = S(to) - i0;
  const notes = [62, 69, 74, 77].map((m) => ({ f: mtof(m), ph: Math.abs(rnd()) }));
  const fl = new SVF();
  const fn = new SVF();
  for (let n = 0; n < len; n++) {
    const k = n / len;
    let s = 0;
    for (const v of notes) {
      v.ph += v.f / SR;
      s += Math.sin(2 * Math.PI * v.ph) + 0.3 * Math.sin(4 * Math.PI * v.ph);
    }
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, k * 0.85 + 0.0)), 2) * gain;
    const toneV = fl.run(s * 0.18, 500 + 2500 * k, 0.7)[0];
    const breath = fn.run(rnd(), 1800 + 3000 * k, 0.9)[1] * 0.25;
    out(i0 + n, (toneV + breath) * env * 0.5, Math.sin(k * 3) * 0.2, 0.6);
  }
};
/** sparkle: a handful of bright, soft ticks spread over time */
const sparkle = (beat: number, beats: number, gain = 1, count = 18) => {
  for (let j = 0; j < count; j++) {
    const at = beat + Math.abs(rnd()) * beats;
    const i0 = S(at);
    const flt = new SVF();
    const fc = 5000 + Math.abs(rnd()) * 5000;
    const pan = rnd() * 0.8;
    const g = gain * (1 - (at - beat) / beats) * 0.18;
    for (let n = 0; n < SR * 0.05; n++) out(i0 + n, flt.run(rnd(), fc, 7)[1] * Math.exp(-n / (SR * 0.01)) * g, pan, 0.6);
  }
};

const L = CUES.love;
const D = CUES.drop;
const T = CUES.tease;
const R = CUES.reveal;
const F = CUES.rapid;
const O = CUES.outro;

// Scene 1
thump(L.india, 0.7);
for (let j = 0; j < 7; j++) blip(L.loves + 0.15 + j * 0.22, 0.45, 76 + (j % 3) * 3, ((j % 3) - 1) * 0.4);
blip(L.pin, 0.6, 72);
thump(L.pin + 0.15, 0.35);
thump(L.communityDays, 0.5);
// Scene 2: the dive into the D, the whiteout, the zoom into the B
air(D.dive, D.whiteout, 0.7, 250, 6500, -0.1, 0.1);
thump(D.whiteout, 0.8);
blip(D.words + 0.25, 0.4, 79);
air(D.exit, D.exit + 1, 0.55, 4500, 300, 0.1, -0.1);
// Scene 3: soft keystrokes, then a swell under "different." (no clicks)
for (let c = 0; c < 'But this time,'.length; c++) key(T.butThisTime + (3 + c * 1.4) / 15, 0.6 + 0.2 * Math.abs(rnd()), ((c % 5) - 2) * 0.08);
swell(T.different - 0.25, R.we - 0.1, 0.5);
// Scene 4
blip(R.communityDays, 0.35, 77);
blip(R.you, 0.55, 79);
sparkle(R.you, 2, 0.9, 18);
// Scene 5: a light pop per item, a small sparkle for "And so much more!"
F.items.forEach((it, i) => blip(it, 0.4, 72 + i * 2, i % 2 ? 0.25 : -0.25));
sparkle(F.more + 0.1, 1.5, 0.6, 10);
// Scene 6
blip(O.bangalore, 0.45, 76);
sparkle(O.bangalore, 1.2, 0.45, 8);
sparkle(O.details, 1.5, 0.3, 6);

const wet = reverb(send, 0.8, 0.45);
const outL = new Float32Array(N);
const outR = new Float32Array(N);
let peak = 0;
for (let n = 0; n < N; n++) {
  outL[n] = fx.L[n] + wet.L[n];
  outR[n] = fx.R[n] + wet.R[n];
  peak = Math.max(peak, Math.abs(outL[n]), Math.abs(outR[n]));
}
// effects keep their relative levels; scale so the loudest one peaks at -6 dBFS
const g = 0.5 / (peak || 1);
for (let n = 0; n < N; n++) {
  outL[n] *= g;
  outR[n] *= g;
}
console.log('wrote', writeWav('public/audio/sfx.wav', outL, outR));
