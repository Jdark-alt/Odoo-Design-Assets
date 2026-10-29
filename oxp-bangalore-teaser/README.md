# Odoo Experience Bangalore: teaser

A 30-second kinetic typography teaser for Odoo India, built in Remotion. Odoo Experience goes on tour, and the first stop is Bangalore. The primary format is LinkedIn portrait (1080 x 1350, 4:5, 30 fps, H.264). Square (1:1) and landscape (16:9) render from the same scenes.

Preview: [`renders/oxp-bangalore-teaser-4x5.mp4`](renders/oxp-bangalore-teaser-4x5.mp4)

The style follows the **Odoo Experience India** design system: the night ground, Primary Purple, Inter Light/Regular/Bold, and Caveat Bold for one highlighted word at a time with an official graphic element. It also uses the kolam, the pulli dot grid, the metro-line route, the Bengaluru doodles, the official highlights, pops and app icons, and the Odoo wordmark. See [NOTES.md](NOTES.md) for what came from the brand kit, what was drawn for this video, and the audio cue points.

## Run it

```bash
npm install
```

```bash
npm run studio
```

```bash
npm run render
```

`npm run render` writes `out/oxp-bangalore-teaser-4x5.mp4`. `npm run render:1x1` and `npm run render:16x9` render the other formats. If Remotion can't download its headless browser, point it at a local Chrome or Chromium:

```bash
REMOTION_CHROME=/path/to/chrome-headless-shell npm run render
```

`npm run music` regenerates the placeholder soundtrack from the cue sheet (see below).

## Where things are

| Path | What |
| --- | --- |
| `src/config.ts` | **The one config file**: BPM, beat grid offset, every scene and cue time (in beats), audio cue points, camera shakes and flashes, colours, fonts, formats, safe area, optional end-card date line |
| `src/Root.tsx` | Compositions: `Teaser-4x5`, `Teaser-1x1`, `Teaser-16x9` (master) and `Scene1-love` to `Scene6-outro` (each scene on its own) |
| `src/Master.tsx` | Master timeline: night ground, scenes, shake, flashes, grain, music |
| `src/scenes/` | One component per scene; `shared.ts` holds the framings that hand off between scenes |
| `src/components/` | `KText` (per-character kinetic type with real kerning), brand parts (`Logo`, `Mark`, `Doodle`, `AppTile`), graphics (`IndiaMap`, `Monument`, `Kolam`, `Burst`, `Rays`, `PulliPulse`, ground and grain) |
| `src/brand/` | Brand data extracted from the design system (logo, marks, doodles, app icons), the India outline and the Vidhana Soudha line art |
| `public/brand/` | Inter and Caveat (variable woff2) and the night ground image from the design system |
| `public/audio/` | Generated placeholder track (24-bit WAV) |
| `scripts/make-music.ts` | Procedural soundtrack built from the cue sheet |
| `scripts/cue-sheet.ts` | Prints the audio cue points as a table |
| `scripts/stills.ts`, `scripts/sheet.sh` | Render review stills and contact sheets |

## Re-syncing to a real track

All timing is in beats on a 120 BPM grid (1 beat = 0.5 s = 15 frames).

1. Set `BPM` in `src/config.ts` to the track's tempo.
2. If the track's first downbeat isn't at 0:00, set `BEAT_OFFSET_FRAMES`.
3. Move any cue in `CUES` that should land on a different musical moment (the drop, the hero hit, the three "So much more" hits). Scenes, shakes and flashes follow automatically.
4. Swap `public/audio/oxp-teaser-120bpm.wav` for the licensed track, or change the file name in `src/Master.tsx`.

## Layout

Scenes are authored on a 920 x 1190 design box, the 4:5 frame inside an 80 px safe area. Positions are fractions of the safe area and sizes scale with it, so all text and key graphics stay at least 80 px from every edge in every format. The 4:5 version is the art-directed one. 1:1 and 16:9 render correctly and are worth a short art-direction pass before they're published.
