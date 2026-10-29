// Render a set of frames to PNG for review: tsx scripts/stills.ts <composition> <outDir> <frame,frame,...>
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

const [compId = 'Teaser-4x5', outDir = 'out/stills', framesArg = '0'] = process.argv.slice(2);
const frames = framesArg.split(',').map(Number);

(async () => {
  const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
  const browserExecutable = process.env.REMOTION_CHROME || null;
  const composition = await selectComposition({ serveUrl, id: compId, inputProps: { music: false }, browserExecutable });
  fs.mkdirSync(outDir, { recursive: true });
  for (const frame of frames) {
    const output = path.join(outDir, `${compId}-${String(frame).padStart(4, '0')}.png`);
    await renderStill({ composition, serveUrl, frame, output, inputProps: { music: false }, browserExecutable, imageFormat: 'png' });
    console.log(output);
  }
})();
