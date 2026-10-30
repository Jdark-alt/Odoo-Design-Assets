# Notes: assets, audio cue points, decisions

## Revision 2 (feedback round 1)

- **Scene 1** now reads "India loves the Odoo Experience.". "India loves" sits on top, the map is in the middle, and the Odoo Experience lockup is the widest line at the bottom: the anchor. "loves" is Caveat on the official straight `underline-line` (the dense scribble is gone). Pins from across India gather into a small **heart of dots** over Gujarat, which beats on the last four beats. The map fill is lighter, so the night ground shows through.
- **Scene 2** has no full-screen text and no purple flash. The camera eases in, then dives into the "E" of "Experience". The giant E fills the frame, and "So we / are / back." is **cut out of its three arms**, with soft out-of-focus pins drifting behind for depth. No beat pulses, just a slow push. The camera then flies through the gap between the arms into Scene 3.
- **Scene 3** visuals are unchanged. The keystrokes are softer, and "different." gets a soft airy swell (no clicks).
- **Scene 4** puts "We are bringing the" on top, then **Odoo Experience** (the anchor) followed by a quiet "to", then **"you"** as the only highlighted word (Caveat on the official yellow bar). The pops are pinned to the bar's corners and grow out of it, and the confetti starts behind the word.
- **Scene 5** keeps the montage as it was. "Networking" now shows people (avatars joined by one teal line and a few links). **"And so much more."** is a single quiet line on the beat, with no purple background and no hits.
- **Scene 6**: the Odoo Experience lockup is on screen from the first beat to the last frame. "The" and "is on tour." are small, an auto-rickshaw doodle rides above the metro line, and "bangalore" lands in Caveat on the straight brush line. For the end card, the extra words fall away, "bangalore" glides into place under "Experience", and **"Coming soon."** fades in last and smallest.
- **Sound**: the music bed and the effects are now separate tracks. The placeholder music is a friendlier major-key house groove. Effects only play where the picture moves. A Gemini prompt for the music bed is in [MUSIC_PROMPT.md](MUSIC_PROMPT.md).
- **Purple**: no full-frame purple overlays remain except the half-second "Odoo 20" card from the montage. Purple stays in the map fill, the "Expert sessions" pill and the thin metro line.

## From the brand kit (used as-is)

Everything below comes from the **Odoo Experience India** design system (the artifact this video was briefed against), which was built from the Odoo brand assets folder.

- **Odoo wordmark**, negative (all white) on the night ground. Path data from the kit's `Logo` component.
- **Night ground** `night-ground.jpg`, scaled to cover and never rebuilt as a gradient.
- **Fonts**: Inter (Light 300, Regular 400, Bold 700) and Caveat Bold (lowercase only), from the kit's font files.
- **Colours**: Primary Purple `#714B67`, white ink, and the four additional colours (yellow, teal, cyan, red), used only for highlights, pops, doodle fills, confetti, avatar rings and accent lines.
- **Official graphic elements** (kit `Mark` set): `underline-line` ("loves", "bangalore"), `highlight-bar-3` (behind "you", text kept dark), `circle-bold` ("community"), `heart`, `star`, `sparkle-1`, `pop-fan`, `arrow-curve-up`.
- **Caveat words, each with its graphic element**: "loves", "you", "community", "bangalore".
- **Event lockup**: logo + "Experience" (Inter Bold at 0.98x the logo height, gap = half the logo height, the logo's safe zone) + city in Caveat under "Experience", as the kit's `EventLockup` is built.
- **Kolam**: the kit's own generator (5 x 6 grid, one continuous line), drawing once over 2.4 s on the end card's corner.
- **Pulli** dot-grid texture, flashing on the first two kicks.
- **Metro route motif** (kit `RouteAgenda`): a Primary Purple line with white-disc stations.
- **Doodles**: `auto-rickshaw` (Bengaluru set, night ink), riding the route in Scene 6.
- **App icons** on white tiles with the night tile shadow: Sales, CRM, Inventory, Website, Point of Sale ("Live demos").

## Made for this video

- **India outline** (`src/brand/india.json`): built from Natural Earth 1:10m Admin 0, **India point-of-view** dataset (public domain), so the boundary matches India's official map, including all of Jammu & Kashmir, Ladakh and Arunachal Pradesh. Andaman & Nicobar and Lakshadweep are included.
- **Vidhana Soudha line art** (`src/brand/vidhanaSoudha.ts`): front elevation with the dome, lantern and lion capital, drum, twelve columns, grand staircase, three-storey wings, wing domes and corner chhatris. Each stroke has its own slot on a 0..1 trace clock (Scene 3 stops at 48%; Scene 6 completes it).
- **The "E" cutout** (Scene 2): the real Inter Bold "E", with its stem and arms measured from the glyph's pixels at render time, so the copy always sits inside the arms.
- **Heart of pins**: the kit's official heart pop rising from 18 cities, then 43 city pins arranged evenly along a heart outline over Gandhinagar.
- **People avatars** for "Networking": a head and shoulders in a night-frame disc, ringed in palette colours.
- **Confetti**: palette pieces mixed with the kit's star, sparkle and heart pops.
- **Grain**: fine animated noise so the dark gradients don't band after H.264 compression.
- **Placeholder music and sound effects** (see below).

## Audio cue points

Two tracks are mixed in the video:
- `public/audio/music-placeholder.wav`: a friendly house groove in F major at 120 BPM, about -11 LUFS on its own.
- `public/audio/sfx.wav`: the sound effects.

Both are generated from these cues (`npm run audio`). To use a generated or licensed music bed instead, see [MUSIC_PROMPT.md](MUSIC_PROMPT.md) and the README.

| Time | Beat | Frame (30 fps) | Type | Cue |
| --- | --- | --- | --- | --- |
| 0:00.00 to 0:06.00 | 0 | 0 | section | Intro: friendly groove from the first frame |
| 0:00.00 | 0 | 0 | hit | "India" lands (soft thump) |
| 0:01.50 | 3 | 45 | pop | "loves": hearts rise (light pops) |
| 0:02.50 | 5 | 75 | pop | Pins appear across India |
| 0:03.00 to 0:03.65 | 6 | 90 | whoosh | Pins gather into a heart over Gujarat (soft air) |
| 0:04.50 | 9 | 135 | hit | "Odoo Experience." lands |
| 0:05.75 to 0:06.25 | 11.5 | 173 | lift | Music lifts / thins; camera eases in |
| 0:06.25 to 0:06.50 | 12.5 | 188 | whoosh | Dive into the E |
| 0:06.50 | 13 | 195 | impact | DROP: "So we are back." (full groove) |
| 0:08.25 to 0:08.50 | 16.5 | 248 | whoosh | Fly through the E into the dark |
| 0:08.50 to 0:13.00 | 17 | 255 | section | Tease: near silence, a low pulse |
| 0:08.75 | 17.5 | 263 | tick | Soft keystrokes: "But this time," |
| 0:11.25 to 0:12.75 | 22.5 | 338 | swell | "different." fades up (soft airy swell, no clicks) |
| 0:12.00 to 0:13.00 | 24 | 360 | riser | Gentle build back in |
| 0:13.00 | 26 | 390 | hit | Groove returns: "We are bringing..." |
| 0:14.25 | 28.5 | 428 | hit | "Odoo Experience" |
| 0:15.00 | 30 | 450 | impact | "you": the hero, confetti sparkle |
| 0:17.00 | 34 | 510 | hit | "Odoo 20" |
| 0:17.50 | 35 | 525 | pop | "Live demos" |
| 0:18.00 | 36 | 540 | pop | "Success stories" |
| 0:18.50 | 37 | 555 | pop | "Expert sessions" |
| 0:19.00 | 38 | 570 | pop | "Networking" |
| 0:19.50 | 39 | 585 | pop | "Community" |
| 0:20.00 | 40 | 600 | hit | "And so much more." (one line) |
| 0:22.00 to 0:26.00 | 44 | 660 | section | Outro: warm, lighter groove |
| 0:24.50 | 49 | 735 | hit | "Bangalore" lands |
| 0:26.00 to 0:30.00 | 52 | 780 | section | Resolve: final chord under the lockup, rings out |

120 BPM, 1 beat = 0.5s = 15 frames.

The effects play only where the picture moves:
- a soft thump when "India", "Odoo Experience", "you" and "Bangalore" land
- light pops for the hearts, pins and montage items
- air for the camera dive into the E and the fly-through
- soft keystrokes for "But this time,"
- a breathy swell under "different."
- a small sparkle for "you" and "And so much more."

## Decisions to confirm

- **Bangalore vs Bengaluru.** The brief's copy says "Bangalore", so the video uses it. The kit's lockup default is "bengaluru".
- **"Odoo 20" purple card.** It's the only full-frame purple left (0.5 s, in the montage you approved). It can switch to the night ground if you'd rather have no full-frame purple at all.
- **End-card details.** Space is left under "Coming soon.". Fill `END_CARD.dateLine` / `END_CARD.detailLine` in `src/config.ts` when the date or venue is confirmed.
- **Other formats.** 1:1 and 16:9 render from the same scenes. 4:5 is the art-directed version.
