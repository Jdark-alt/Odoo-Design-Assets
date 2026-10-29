# Odoo Experience India: source files

Source for the visual system used by Odoo India's regional Odoo Experience events (first edition: Bengaluru). The full system, with usage rules, components and templates, lives in the design system; this folder holds the parts that were drawn or generated for it, so the web team can rebuild or extend them.

| Path | What it is |
| --- | --- |
| `tokens.css` | Colour, type, spacing and radius tokens as CSS custom properties. Night theme on `:root`, day theme on `[data-theme="day"]`. Fonts load from Google Fonts. |
| `doodles/` | 13 doodles in Odoo's doodle style, each as `-night.svg` (white outline) and `-day.svg` (Text Black outline). |
| `kolam/` | Generated kolam patterns, white (`-night`) and Primary Purple (`-day`), plus the 24px pulli dot tile. |
| `src/doodles.def.js` | Doodle drawings on a 96px grid: fills, outlines and shines. |
| `src/wobble.js`, `src/make-doodles.js` | Bake a hand-drawn wobble into the outlines and write the SVGs. |
| `src/kolam.js` | Kolam generator. `kolam(cols, rows, mirrors)` returns the path data; grids whose sides share no common factor give one continuous line. |

## Rebuilding

Both scripts need Node and Playwright with Chromium.

```bash
node src/make-doodles.js doodles
```

```bash
node -e "const {kolam, kolamSVG} = require('./src/kolam'); console.log(kolamSVG(kolam(5, 6, []), 12, {}))" > kolam/kolam-5x6-single-line-night.svg
```

## Adding a city

Add two to four doodles to `src/doodles.def.js` on the same 96px grid (3.2px outline, fill offset 4px down and right, one palette fill each, ink lines about 8px apart) and rerun `make-doodles.js`. Keep everything else as it is.

Odoo's logo, app icons and official graphic elements are not in this repository; use the originals from Odoo's brand assets.
