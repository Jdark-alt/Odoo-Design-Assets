// Bakes a hand-drawn wobble into SVG path data using Chromium's path geometry.
// wobbleAll(page, items) -> items with d replaced; items: [{d, amp, seed}]
async function wobbleAll(page, items) {
  return page.evaluate((items) => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    document.body.appendChild(svg);
    function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
    const f = (n) => Math.round(n * 10) / 10;
    function splitSub(d) {
      // split on M commands (all absolute)
      return d.split(/(?=M)/).map((s) => s.trim()).filter(Boolean);
    }
    function one(d, amp, rand) {
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('d', d); svg.appendChild(el);
      const L = el.getTotalLength();
      const closed = /Z\s*$/i.test(d);
      if (L < 7 || amp === 0) { el.remove(); return d; }
      const step = 2.6, n = Math.max(6, Math.ceil(L / step));
      const k1 = Math.max(1, Math.round(L / 45)), k2 = k1 * 2 + 1;
      const p1 = rand() * 6.283, p2 = rand() * 6.283;
      const pts = [];
      const count = closed ? n : n + 1;
      for (let i = 0; i < count; i++) {
        const s = (i / n) * L;
        const p = el.getPointAtLength(Math.min(s, L));
        const q = el.getPointAtLength(Math.min(L, s + 0.6)), o = el.getPointAtLength(Math.max(0, s - 0.6));
        let tx = q.x - o.x, ty = q.y - o.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        let w = Math.sin(6.283 * k1 * s / L + p1) * 0.6 + Math.sin(6.283 * k2 * s / L + p2) * 0.4;
        if (!closed) { const e = Math.min(1, Math.min(s, L - s) / 6); w *= 0.35 + 0.65 * e; }
        pts.push([p.x - ty * w * amp, p.y + tx * w * amp]);
      }
      el.remove();
      // Catmull-Rom to cubic Bezier
      const P = (i) => closed ? pts[(i + pts.length) % pts.length] : pts[Math.max(0, Math.min(pts.length - 1, i))];
      let out = `M${f(P(0)[0])} ${f(P(0)[1])}`;
      const segs = closed ? pts.length : pts.length - 1;
      for (let i = 0; i < segs; i++) {
        const a = P(i - 1), b = P(i), c = P(i + 1), e = P(i + 2);
        const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
        const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
        out += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(c[0])} ${f(c[1])}`;
      }
      return closed ? out + 'Z' : out;
    }
    return items.map((it) => {
      const rand = rng(it.seed);
      return { ...it, d: splitSub(it.d).map((s) => one(s, it.amp, rand)).join('') };
    });
  }, items);
}
module.exports = { wobbleAll };
