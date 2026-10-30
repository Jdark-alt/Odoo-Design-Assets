# Notes: assets, audio cue points, decisions

## Revision 3 (feedback round 2): 21 seconds, on "Open Invitation"

- **Length**: 21 s (42 beats at 120 BPM), cut to an edit of the generated track. "you" lands on the chorus drop, and the end card lands on the track's final hit.
- **Scene 1** (0:00–0:04) is much faster:
  - "India" lands on the first frame and "loves" comes in at 0:00.5.
  - Hearts pop up across the map, and a **glowing pin** drops onto Gujarat and pulses on the beat. It replaces the heart of dots.
  - "the Odoo Experience." is in by 0:02.
- **Scene 2** (0:03.25–0:06):
  - The camera dives into the **bottom stroke of the E** of "Experience". As the stroke's white takes over the screen on the drop, **"So We Are Back!"** pops up as negative space cut out of it.
  - The camera then zooms into that negative space (the stem of the B), and Scene 3 starts in the dark.
  - The E is drawn from its measured geometry, so it stays sharp at any zoom.
- **Scene 3** (0:06–0:09) looks the same as before, with its timing compressed.
- **Scene 4** (0:09–0:12) is centred on the vertical axis, with **"you"** centred on the chorus drop.
- **Scene 5** (0:12–0:16.5) sets **"20" in Caveat** (yellow, on a straight brush line) on the Odoo 20 card, and adds the exclamation to **"And so much more!"**.
- **Scene 6** (0:16.5–0:21) ends on a **centred** end card: the lockup, a larger **"bangalore"** in Caveat, and **"Coming soon."** fading in at the bottom centre.

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
- **The "E" dive** (Scene 2): the real Inter Bold "E", with its stem and arms measured from the glyph's pixels at render time. It's drawn as exact rectangles, so the camera can push into the bottom stroke until its white fills the frame.
- **Hearts and the Gujarat pin**: the kit's official heart pop appearing over 40 cities, and a white location pin with a yellow core and a soft glow that drops onto Gandhinagar and pulses.
- **People avatars** for "Networking": a head and shoulders in a night-frame disc, ringed in palette colours.
- **Confetti**: palette pieces mixed with the kit's star, sparkle and heart pops.
- **Grain**: fine animated noise so the dark gradients don't band after H.264 compression.
- **Sound effects** (see below).

## Audio cue points

Two tracks are mixed in the video:
- `public/audio/music-edit.wav`: the 21 s edit of "Open Invitation". See the README for the edit list.
- `public/audio/sfx.wav`: the sound effects.

Rebuild both with `npm run audio`.

| Time | Beat | Frame (30 fps) | Type | Cue |
| --- | --- | --- | --- | --- |
| 0:00.00 to 0:02.00 | 0 | 0 | section | Music: intro (soft plucks) |
| 0:00.00 | 0 | 0 | hit | "India" lands (soft thump) |
| 0:00.50 | 1 | 15 | pop | Hearts pop up across the map |
| 0:01.25 | 2.5 | 38 | pop | Glowing pin drops on Gujarat |
| 0:01.75 | 3.5 | 53 | hit | "Odoo Experience." lands |
| 0:02.00 to 0:04.00 | 4 | 60 | lift | Music: the swell builds |
| 0:03.25 to 0:04.00 | 6.5 | 98 | whoosh | Dive into the bottom stroke of the E |
| 0:04.00 | 8 | 120 | impact | Music drop: white takes over, "So We Are Back!" |
| 0:05.50 to 0:06.00 | 11 | 165 | whoosh | Zoom into the negative space |
| 0:06.00 to 0:09.00 | 12 | 180 | cut | Music cut: drumless breakdown |
| 0:06.25 | 12.5 | 188 | tick | Soft keystrokes: "But this time," |
| 0:07.50 to 0:09.00 | 15 | 225 | swell | "different." fades up (soft swell) |
| 0:09.00 | 18 | 270 | cut | Music cut: the stop (sustained hit), then a fill |
| 0:11.00 | 22 | 330 | impact | Music: chorus drop on "you", sparkle |
| 0:12.00 to 0:14.50 | 24 | 360 | pop | Montage: a light pop per item |
| 0:15.00 | 30 | 450 | hit | "And so much more!" |
| 0:16.50 | 33 | 495 | cut | Music cut: last chorus bar with its fill |
| 0:17.88 | 35.75 | 536 | hit | "Bangalore" lands |
| 0:19.00 to 0:21.00 | 38 | 570 | section | Music: final hit, rings out under the end card |

120 BPM, 1 beat = 0.5s = 15 frames.

The effects play only where the picture moves:
- light pops for the hearts, the pin and the montage items
- soft thumps for landings
- air for the dive into the E and the zoom into the B
- soft keystrokes for "But this time,"
- a breathy swell under "different."
- small sparkles for "you", "And so much more!" and "Bangalore"

## Decisions to confirm

- **Bangalore vs Bengaluru.** The brief's copy says "Bangalore", so the video uses it. The kit's lockup default is "bengaluru".
- **"Odoo 20" purple card.** It's the only full-frame purple left (0.5 s). It can switch to the night ground.
- **Music licence.** The music is AI-generated ("Open Invitation"). Check the generator's terms for commercial use before publishing.
- **End-card details.** Space is left under "Coming soon.". Fill `END_CARD.dateLine` / `END_CARD.detailLine` in `src/config.ts` when the date or venue is confirmed.
- **Other formats.** 1:1 and 16:9 render from the same scenes. 4:5 is the art-directed version.
