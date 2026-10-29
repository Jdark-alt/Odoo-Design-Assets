// node make-doodles.js <outDir>
// Writes <id>-night.svg (white ink) and <id>-day.svg (Text Black ink) per doodle,
// plus doodles.json (wobbled path data, for the component bundle) and sheet.html.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { wobbleAll } = require('./wobble');
const defs = require('./doodles.def');

const PALETTE = { yellow: '#FBB130', teal: '#00CEB3', cyan: '#1BB6F9', red: '#FC787D', purple: '#714B67', green: '#017E84' };
const INK = { night: '#FFFFFF', day: '#21272B' };
const OFFSET = 4, STROKE = 3.2, SHINE = 2;

function svgFor(dd, ink) {
  const fill = PALETTE[dd.fill];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">` +
    `<title>${dd.label}</title>` +
    `<g transform="translate(${OFFSET} ${OFFSET})" fill="${fill}">${dd.fills.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    (dd.shine.length ? `<g fill="none" stroke="#FFFFFF" stroke-width="${SHINE}" stroke-linecap="round">${dd.shine.map((d) => `<path d="${d}"/>`).join('')}</g>` : '') +
    `<g fill="none" stroke="${ink}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${dd.lines.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `</svg>`;
}

(async () => {
  const out = process.argv[2];
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent('<html><body></body></html>');
  const items = [];
  defs.forEach((dd, i) => {
    dd.fills.forEach((d, j) => items.push({ id: dd.id, kind: 'fills', j, d, amp: 0.35, seed: 1000 + i * 97 + j }));
    dd.lines.forEach((d, j) => items.push({ id: dd.id, kind: 'lines', j, d, amp: 0.45, seed: 2000 + i * 97 + j }));
    dd.shine.forEach((d, j) => items.push({ id: dd.id, kind: 'shine', j, d, amp: 0.2, seed: 3000 + i * 97 + j }));
  });
  const done = await wobbleAll(p, items);
  await b.close();
  const res = defs.map((dd) => {
    const pick = (k) => done.filter((x) => x.id === dd.id && x.kind === k).sort((a, b) => a.j - b.j).map((x) => x.d);
    return { id: dd.id, label: dd.label, region: dd.region, note: dd.note, fill: dd.fill, fills: pick('fills'), lines: pick('lines'), shine: pick('shine') };
  });
  for (const dd of res) {
    fs.writeFileSync(path.join(out, `${dd.id}-night.svg`), svgFor(dd, INK.night));
    fs.writeFileSync(path.join(out, `${dd.id}-day.svg`), svgFor(dd, INK.day));
  }
  fs.writeFileSync(path.join(out, 'doodles.json'), JSON.stringify(res));
  const cell = (dd, t) => `<figure><img src="${dd.id}-${t}.svg"><figcaption>${dd.label}</figcaption></figure>`;
  fs.writeFileSync(path.join(out, 'sheet.html'), `<html><head><style>
  body{margin:0;font:13px Inter,sans-serif}
  .row{display:flex;flex-wrap:wrap;gap:8px;padding:16px}
  .night{background:#0B1120 url(../../dl/bg.jpg) center/cover;color:#fff}
  .day{background:#fff;color:#21272B}
  figure{margin:0;width:150px;text-align:center} img{width:140px;height:140px}
  </style></head><body><div class="row night">${res.map((d) => cell(d, 'night')).join('')}</div>
  <div class="row day">${res.map((d) => cell(d, 'day')).join('')}</div></body></html>`);
  console.log('doodles', res.length);
})();
