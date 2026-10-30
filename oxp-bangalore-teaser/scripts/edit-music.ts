// Cuts the music bed for the video from MUSIC_SOURCE, following MUSIC_EDIT in
// src/config.ts: each segment starts on a source beat and lands on a video
// beat, with a short equal-power crossfade placed just before the beat so the
// transients stay intact.
//   npm run music  ->  public/audio/music-edit.wav
import { execFileSync } from 'child_process';
import path from 'path';
import { MUSIC_EDIT, MUSIC_SOURCE, sec } from '../src/config';
import { N, SR, master, writeWav } from './dsp';

const decode = (file: string) => {
  const args = ['-v', 'error', '-i', file, '-ac', '2', '-ar', String(SR), '-f', 'f32le', '-'];
  let buf: Buffer;
  try {
    buf = execFileSync('ffmpeg', args, { maxBuffer: 1 << 30 });
  } catch {
    // Remotion ships its own ffmpeg
    buf = execFileSync('npx', ['remotion', 'ffmpeg', ...args], { maxBuffer: 1 << 30 });
  }
  const f = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  const n = f.length / 2;
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    L[i] = f[2 * i];
    R[i] = f[2 * i + 1];
  }
  return { L, R, n };
};

const src = decode(path.resolve(MUSIC_SOURCE.file));
const beatSec = 60 / MUSIC_SOURCE.bpm;
const srcAt = (beat: number) => Math.round((MUSIC_SOURCE.firstDownbeatSec + beat * beatSec) * SR);
const PRE = Math.round(0.012 * SR); // crossfade length, ending on the beat

const outL = new Float32Array(N);
const outR = new Float32Array(N);
MUSIC_EDIT.forEach((seg, k) => {
  const v0 = Math.round(sec(seg.at) * SR);
  const v1 = k + 1 < MUSIC_EDIT.length ? Math.round(sec(MUSIC_EDIT[k + 1].at) * SR) : N;
  const s0 = srcAt(seg.from);
  const first = k === 0;
  const last = k + 1 === MUSIC_EDIT.length;
  // write from PRE before the segment's beat (fade in) to PRE before the next cut (fade out)
  const start = first ? v0 : v0 - PRE;
  const end = last ? N : v1;
  for (let i = start; i < end; i++) {
    const si = s0 + (i - v0);
    if (si < 0 || si >= src.n || i < 0 || i >= N) continue;
    let g = 1;
    if (!first && i < v0) g *= Math.sin(((i - start) / PRE) * (Math.PI / 2)); // fade in
    if (!last && i >= v1 - PRE) g *= Math.cos(((i - (v1 - PRE)) / PRE) * (Math.PI / 2)); // fade out
    outL[i] += src.L[si] * g;
    outR[i] += src.R[si] * g;
  }
});
// the source is mastered hot; leave headroom for the effects and keep its dynamics
master(outL, outR, { percentileGain: 0.8, ceiling: 0.84, fadeOutSec: 0.8, saturate: false });
console.log('wrote', writeWav('public/audio/music-edit.wav', outL, outR));
for (const s of MUSIC_EDIT) console.log(`  video ${sec(s.at).toFixed(2)}s <- source ${(MUSIC_SOURCE.firstDownbeatSec + s.from * beatSec).toFixed(3)}s (${s.beats} beats): ${s.note}`);
