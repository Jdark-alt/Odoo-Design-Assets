// Prints the audio cue points from src/config.ts as a Markdown table.
//   npx tsx scripts/cue-sheet.ts
import { AUDIO_CUES, BPM, FPS, b, sec } from '../src/config';

const ts = (beat: number) => {
  const s = sec(beat);
  return `0:${s.toFixed(2).padStart(5, '0')}`;
};
console.log(`| Time | Beat | Frame (${FPS} fps) | Type | Cue |`);
console.log('| --- | --- | --- | --- | --- |');
for (const c of AUDIO_CUES) {
  const span = c.to !== undefined ? ` to ${ts(c.to)}` : '';
  console.log(`| ${ts(c.beat)}${span} | ${c.beat} | ${b(c.beat)} | ${c.kind} | ${c.label} |`);
}
console.log(`\n${BPM} BPM, 1 beat = ${60 / BPM}s = ${(FPS * 60) / BPM} frames.`);
