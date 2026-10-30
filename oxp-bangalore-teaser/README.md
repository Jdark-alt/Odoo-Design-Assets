# Odoo Experience Bangalore: teaser

A 21-second kinetic typography teaser for Odoo India, built in Remotion. Odoo Experience goes on tour, and the first stop is Bangalore. The primary format is LinkedIn portrait (1080 x 1350, 4:5, 30 fps, H.264). Square (1:1) and landscape (16:9) render from the same scenes.

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

`npm run audio` rebuilds both audio tracks: the music edit (`npm run music`, cut from `assets/audio/open-invitation.mp3`; needs `ffmpeg`, or uses Remotion's own) and the sound effects (`npm run sfx`).

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
| `assets/audio/open-invitation.mp3` | The source music track (120 BPM, 65 s) |
| `public/audio/` | `music-edit.wav` (the 21 s edit of the track) and `sfx.wav` (sound effects), 24-bit WAV |
| `scripts/edit-music.ts` | Cuts the music edit from the source on bar lines, following `MUSIC_EDIT` in the config |
| `scripts/make-sfx.ts` | Sound effects, placed only where the picture moves |
| `scripts/dsp.ts` | Shared synthesis, filter, reverb and mastering helpers |
| `MUSIC_PROMPT.md` | The prompt the music was generated from (Gemini / Lyria) |
| `scripts/cue-sheet.ts` | Prints the audio cue points as a table |
| `scripts/stills.ts`, `scripts/sheet.sh` | Render review stills and contact sheets |

## Music

The music is an edit of "Open Invitation" (AI-generated with the prompt in [MUSIC_PROMPT.md](MUSIC_PROMPT.md)), at 120 BPM with its first downbeat at 1.831 s. `MUSIC_EDIT` in `src/config.ts` lists the cut: each segment starts on a source beat and lands on a video beat, and `scripts/edit-music.ts` joins them with 12 ms equal-power crossfades that end on the beat, so transients stay intact.

| Video | Source | What |
| --- | --- | --- |
| 0:00–0:06 | 0:03.8–0:09.8 | Intro, swell, first drop on the whiteout ("So We Are Back!") |
| 0:06–0:09 | 0:26.8–0:29.8 | Drumless breakdown under the tease |
| 0:09–0:16.5 | 0:37.8–0:45.3 | The stop, then the chorus drop on "you" and the montage |
| 0:16.5–0:21 | 0:53.3–0:57.8 | Last chorus bar, final hit on the end card, ring-out |

To use another track, put it in `assets/audio/`, set `MUSIC_SOURCE` (file, BPM, first downbeat) and the `from` beats in `MUSIC_EDIT`, then run `npm run audio`. Every picture cue is in beats on the same 120 BPM grid (1 beat = 0.5 s = 15 frames).

## Layout

Scenes are authored on a 920 x 1190 design box, the 4:5 frame inside an 80 px safe area. Positions are fractions of the safe area and sizes scale with it, so all text and key graphics stay at least 80 px from every edge in every format. The 4:5 version is the art-directed one. 1:1 and 16:9 render correctly and are worth a short art-direction pass before they're published.
