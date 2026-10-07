export const colors = {
  mgla: '#F5EBDD',
  swit: '#F4CDA5',
  dal: '#AFC3CB',
  grzbiet: '#6E8F9B',
  las: '#2E5446',
  glab: '#17302A',
  laka: '#A7BF73',
  znak: '#C8352B',
  slonce: '#F2A93B',
  biel: '#FFFDF8',
};

export const mulberry = seed => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const f = value => (Math.round(value * 10) / 10).toString();

export const smoothPath = (points, tension = 0.5) => {
  if (points.length < 2) return '';
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const k = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
};

export const area = (points, bottom, tension) => {
  const first = points[0];
  const last = points[points.length - 1];
  return `${smoothPath(points, tension)}L${f(last[0])},${f(bottom)}L${f(first[0])},${f(bottom)}Z`;
};

export const ridgePoints = ({ seed, from, to, base, amp, step, peaks = [] }) => {
  const rand = mulberry(seed);
  const points = [];
  for (let x = from; x <= to + step; x += step) {
    const jitter = (rand() - 0.5) * amp * 0.9;
    let y = base + Math.sin(x / 190 + seed) * amp * 0.55 + Math.sin(x / 83 + seed * 1.7) * amp * 0.3 + jitter;
    for (const peak of peaks) {
      const d = Math.abs(x - peak.x) / peak.width;
      if (d < 1) y -= peak.height * (1 - d) ** 1.4;
    }
    points.push([Math.min(x, to + step), y]);
  }
  return points;
};

export const yAt = (points, x) => {
  for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x0, y0] = points[i - 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
  }
  return points[points.length - 1][1];
};

export const tree = (x, y, h, tone = 0) => {
  const w = h * 0.52;
  const left = tone ? colors.glab : colors.las;
  const right = tone ? '#10241F' : colors.glab;
  return `<path d="M${f(x)},${f(y - h)}L${f(x - w / 2)},${f(y)}L${f(x)},${f(y)}Z" fill="${left}"/><path d="M${f(x)},${f(y - h)}L${f(x + w / 2)},${f(y)}L${f(x)},${f(y)}Z" fill="${right}"/>`;
};

export const forest = ({ seed, from, to, line, count, minH, maxH, depth = 30, tone = 0 }) => {
  const rand = mulberry(seed);
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const x = from + rand() * (to - from);
    const y = yAt(line, x) + rand() * depth;
    items.push({ x, y, h: minH + rand() * (maxH - minH) });
  }
  return items
    .sort((a, b) => a.y - b.y)
    .map(item => tree(item.x, item.y, item.h, tone))
    .join('');
};

export const cloud = (x, y, w, opacity = 0.92) => {
  const h = w * 0.28;
  return `<g opacity="${opacity}"><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(h / 2)}" fill="${colors.biel}"/><ellipse cx="${f(x - w * 0.16)}" cy="${f(y - h * 0.42)}" rx="${f(w * 0.2)}" ry="${f(h * 0.5)}" fill="${colors.biel}"/><ellipse cx="${f(x + w * 0.1)}" cy="${f(y - h * 0.55)}" rx="${f(w * 0.24)}" ry="${f(h * 0.62)}" fill="${colors.biel}"/></g>`;
};

export const windLine = (x, y, w, amp = 10) =>
  `<path d="M${f(x)},${f(y)}c${f(w * 0.25)},${f(-amp)} ${f(w * 0.45)},${f(amp)} ${f(w * 0.7)},0s${f(w * 0.2)},${f(-amp * 0.8)} ${f(w * 0.3)},${f(-amp * 0.2)}" fill="none" stroke="${colors.biel}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;

export const trailPath = (points, width = 4.5) => {
  const d = smoothPath(points, 0.55);
  return `<path d="${d}" fill="none" stroke="${colors.biel}" stroke-width="${f(width * 2.3)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${colors.znak}" stroke-width="${f(width)}" stroke-linecap="round" stroke-linejoin="round"/>`;
};

export const signMark = (x, y, w = 16) =>
  `<g transform="translate(${f(x)} ${f(y)})"><rect x="${f(-w / 2)}" y="${f(-w * 0.45)}" width="${f(w)}" height="${f(w * 0.9)}" fill="${colors.biel}"/><rect x="${f(-w / 2)}" y="${f(-w * 0.15)}" width="${f(w)}" height="${f(w * 0.3)}" fill="${colors.znak}"/></g>`;

export const summitPole = (x, y, h) =>
  `<path d="M${f(x)},${f(y)}V${f(y - h)}" stroke="${colors.glab}" stroke-width="${f(h * 0.06)}" stroke-linecap="round"/><path d="M${f(x)},${f(y - h)}h${f(h * 0.42)}l${f(-h * 0.1)},${f(h * 0.13)} ${f(h * 0.1)},${f(h * 0.13)}h${f(-h * 0.42)}Z" fill="${colors.znak}"/><rect x="${f(x)}" y="${f(y - h + h * 0.09)}" width="${f(h * 0.37)}" height="${f(h * 0.08)}" fill="${colors.biel}"/>`;

export const svgOpen = (width, height, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"${extra}>`;
