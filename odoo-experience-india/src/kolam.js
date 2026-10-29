// Kolam (pulli kolam / sikku) generator.
// A grid of cols x rows dots (pulli). One or more continuous lines weave between
// them on the diagonals and loop around a dot wherever they meet the border or a
// mirror. Coordinates are lattice units: dots sit at odd (x, y); 1 unit = half
// the dot pitch. With no mirrors and coprime cols/rows, the result is one line.
function kolam(cols, rows, mirrors) {
  const W = 2 * cols, H = 2 * rows;
  const mir = new Set((mirrors || []).map((p) => p[0] + ',' + p[1]));
  const reflects = (x, y) => x === 0 || x === W || y === 0 || y === H || mir.has(x + ',' + y);
  const segKey = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) ? a + '|' + b : b + '|' + a;
  const seen = new Set();
  const curves = [];
  // every diagonal segment between lattice points with x+y odd, inside the box
  const starts = [];
  for (let x = 0; x <= W; x++) for (let y = 0; y <= H; y++) {
    if ((x + y) % 2 !== 1) continue;
    for (const d of [[1, 1], [1, -1]]) {
      const q = [x + d[0], y + d[1]];
      if (q[0] < 0 || q[0] > W || q[1] < 0 || q[1] > H) continue;
      starts.push([[x, y], d]);
    }
  }
  for (const [p0, d0] of starts) {
    if (seen.has(segKey(p0, [p0[0] + d0[0], p0[1] + d0[1]]))) continue;
    let p = p0, d = d0;
    const pts = [];
    for (let guard = 0; guard < 100000; guard++) {
      const q = [p[0] + d[0], p[1] + d[1]];
      seen.add(segKey(p, q));
      let nd = d.slice();
      const isRef = reflects(q[0], q[1]);
      if (isRef) { if (q[0] % 2 === 0) nd[0] = -nd[0]; else nd[1] = -nd[1]; }
      pts.push({ p: q, din: d, dout: nd, ref: isRef });
      p = q; d = nd;
      if (p[0] === p0[0] && p[1] === p0[1] && d[0] === d0[0] && d[1] === d0[1]) break;
    }
    curves.push(pts);
  }
  const f = (n) => Math.round(n * 1000) / 1000;
  const R = Math.SQRT1_2;
  const paths = curves.map((pts) => {
    const k = pts.length;
    const mid = (i) => { const a = pts[(i + k) % k].p, b = pts[(i + 1 + k) % k].p; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    let s = `M${f(mid(k - 1)[0])} ${f(mid(k - 1)[1])}`;
    for (let i = 0; i < k; i++) {
      const m = mid(i), t = pts[i];
      if (t.ref) {
        const cross = t.din[0] * t.dout[1] - t.din[1] * t.dout[0];
        s += `A${f(R)} ${f(R)} 0 0 ${cross > 0 ? 1 : 0} ${f(m[0])} ${f(m[1])}`;
      } else s += `L${f(m[0])} ${f(m[1])}`;
    }
    return s + 'Z';
  });
  const dots = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) dots.push([2 * i + 1, 2 * j + 1]);
  return { w: W, h: H, paths, dots };
}

// SVG string. unit = px per lattice unit. opts: {line, dot, stroke, dotR, pad}
function kolamSVG(k, unit, opts) {
  const o = Object.assign({ line: '#FFFFFF', dot: '#FFFFFF', stroke: 0.2, dotR: 0.16, pad: 1 }, opts || {});
  const W = (k.w + 2 * o.pad) * unit, H = (k.h + 2 * o.pad) * unit;
  const g = `translate(${o.pad * unit} ${o.pad * unit}) scale(${unit})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<g transform="${g}">` +
    `<g fill="none" stroke="${o.line}" stroke-width="${o.stroke}" stroke-linecap="round" stroke-linejoin="round">${k.paths.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    (o.dot ? `<g fill="${o.dot}">${k.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${o.dotR}"/>`).join('')}</g>` : '') +
    `</g></svg>`;
}

if (typeof module !== 'undefined') module.exports = { kolam, kolamSVG };
