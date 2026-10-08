import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import rough from 'roughjs';

const require = createRequire(import.meta.url);

const gen = rough.generator();

const attrs = (p, extra = '') => `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill ?? 'none'}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

const optionsOf = s => ({
  roughness: s.rough ?? 1.1,
  bowing: s.bow ?? 1,
  stroke: s.stroke ?? 'none',
  strokeWidth: s.width ?? 3,
  seed: s.seed ?? 1,
  disableMultiStroke: s.single ?? false,
  ...(s.fill ? { fill: s.fill, fillStyle: s.fillStyle ?? 'solid', hachureGap: s.gap ?? 5, hachureAngle: s.angle ?? -41, fillWeight: s.fillWeight ?? 1.4 } : {}),
  preserveVertices: s.preserve ?? false,
});

const drawable = s => {
  const o = optionsOf(s);
  if (s.t === 'line') return gen.line(s.x1, s.y1, s.x2, s.y2, o);
  if (s.t === 'ellipse') return gen.ellipse(s.cx, s.cy, s.w, s.h, o);
  if (s.t === 'rect') return gen.rectangle(s.x, s.y, s.w, s.h, o);
  if (s.t === 'curve') return gen.curve(s.pts, o);
  if (s.t === 'linear') return gen.linearPath(s.pts, o);
  if (s.t === 'polygon') return gen.polygon(s.pts, o);
  if (s.t === 'path') return gen.path(s.d, o);
  if (s.t === 'arc') return gen.arc(s.cx, s.cy, s.w, s.h, s.from, s.to, false, o);
  throw new Error(`unknown ink shape ${s.t}`);
};

export const inkShapes = (shapes, extra = '') =>
  shapes
    .flatMap(s => gen.toPaths(drawable(s)).map(p => attrs(p, extra)))
    .join('');

export const arrowHead = (x, y, angle, { size = 14, spread = 30, stroke, width = 3, seed = 1 } = {}) => {
  const r = d => (d * Math.PI) / 180;
  const a = r(angle + 180 - spread);
  const b = r(angle + 180 + spread);
  return [
    { t: 'line', x1: x, y1: y, x2: x + size * Math.cos(a), y2: y + size * Math.sin(a), stroke, width, seed, single: true, rough: 0.6 },
    { t: 'line', x1: x, y1: y, x2: x + size * Math.cos(b), y2: y + size * Math.sin(b), stroke, width, seed: seed + 1, single: true, rough: 0.6 },
  ];
};

export const svgLayer = (w, h, inner, { className = '', style = '' } = {}) =>
  `<svg class="m-layer ${className}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;left:0;top:0;overflow:visible;pointer-events:none;${style}" aria-hidden="true">${inner}</svg>`;

let roughSource;

export const roughScript = () => {
  roughSource ??= readFileSync(require.resolve('roughjs/bundled/rough.js'), 'utf8');
  return roughSource;
};

function pageInk(cfg) {
  window.wzReady = (async () => {
    await Promise.all(cfg.fonts.map(spec => document.fonts.load(spec)));
    await document.fonts.ready;
    const gen = rough.generator();
    const layers = { ink: document.getElementById('ink'), hl: document.getElementById('hl') };
    const rad = d => (d * Math.PI) / 180;
    const turn = (x, y, a) => [x * Math.cos(rad(a)) - y * Math.sin(rad(a)), x * Math.sin(rad(a)) + y * Math.cos(rad(a))];
    const anchor = spec => {
      const el = document.querySelector(spec.q);
      if (!el) throw new Error(`ink target ${spec.q} missing`);
      const r = el.getBoundingClientRect();
      const k = spec.k ?? 1;
      const w = el.offsetWidth !== undefined ? el.offsetWidth * k : r.width;
      const h = el.offsetHeight !== undefined ? el.offsetHeight * k : r.height;
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w, h, a: spec.a ?? 0 };
    };
    const point = spec => {
      if (spec.x !== undefined) return [spec.x, spec.y];
      const b = anchor(spec);
      const sx = { left: -1, right: 1 }[spec.side] ?? 0;
      const sy = { top: -1, bottom: 1 }[spec.side] ?? 0;
      const gap = spec.gap ?? 0;
      const [ox, oy] = turn(sx * (b.w / 2 + gap) + (spec.dx ?? 0), sy * (b.h / 2 + gap) + (spec.dy ?? 0), b.a);
      return [b.cx + ox, b.cy + oy];
    };
    const opts = m => ({
      roughness: m.rough ?? 1.1,
      bowing: m.bow ?? 1,
      stroke: m.color,
      strokeWidth: m.width ?? 3,
      seed: m.seed ?? 1,
      disableMultiStroke: m.single ?? false,
    });
    const put = (layer, drawables, transform) => {
      const html = drawables
        .flatMap(d => gen.toPaths(d))
        .map(p => `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill || 'none'}" stroke-linecap="round" stroke-linejoin="round"/>`)
        .join('');
      layer.insertAdjacentHTML('beforeend', transform ? `<g transform="${transform}">${html}</g>` : html);
    };
    const head = (x, y, angle, m) => {
      const size = m.head ?? 15;
      const spread = 28;
      return [angle + 180 - spread, angle + 180 + spread].map((a, i) =>
        gen.line(x, y, x + size * Math.cos(rad(a)), y + size * Math.sin(rad(a)), { ...opts(m), seed: (m.seed ?? 1) + 7 + i, disableMultiStroke: true, roughness: 0.5 }),
      );
    };
    for (const place of cfg.places ?? []) {
      const el = document.getElementById(place.id);
      const [x, y] = point(place.to);
      el.style.left = `${x - el.offsetWidth / 2}px`;
      el.style.top = `${y - el.offsetHeight / 2}px`;
    }
    for (const m of cfg.marks) {
      if (m.t === 'arrow') {
        const [ax, ay] = point(m.from);
        const [bx, by] = point(m.to);
        const len = Math.hypot(bx - ax, by - ay);
        const nx = -(by - ay) / len;
        const ny = (bx - ax) / len;
        const bend = (m.bend ?? 0.18) * len;
        const mx = (ax + bx) / 2 + nx * bend;
        const my = (ay + by) / 2 + ny * bend;
        const angle = (Math.atan2(by - my, bx - mx) * 180) / Math.PI;
        put(layers.ink, [gen.curve([[ax, ay], [mx, my], [bx, by]], { ...opts(m), disableMultiStroke: true }), ...head(bx, by, angle, m)]);
        continue;
      }
      const b = anchor(m);
      const transform = b.a ? `rotate(${b.a} ${b.cx} ${b.cy})` : '';
      const px = m.padX ?? m.pad ?? 10;
      const py = m.padY ?? m.pad ?? 10;
      if (m.t === 'circle') {
        put(layers.ink, [gen.ellipse(b.cx + (m.dx ?? 0), b.cy + (m.dy ?? 0), b.w * (m.grow ?? 1.1) + px * 2, b.h * (m.grow ?? 1.1) + py * 2, opts(m))], transform);
      } else if (m.t === 'box') {
        put(layers.ink, [gen.rectangle(b.cx - b.w / 2 - px, b.cy - b.h / 2 - py, b.w + px * 2, b.h + py * 2, opts(m))], transform);
      } else if (m.t === 'underline') {
        const ext = m.ext ?? 6;
        const y = b.cy + b.h / 2 + (m.off ?? 3);
        const tilt = m.tilt ?? 1.5;
        const lines = [gen.line(b.cx - b.w / 2 - ext, y + tilt, b.cx + b.w / 2 + ext, y - tilt, { ...opts(m), disableMultiStroke: true })];
        if (m.double) lines.push(gen.line(b.cx - b.w / 2 - ext + 6, y + (m.gap ?? 6) + tilt, b.cx + b.w / 2 + ext - 2, y + (m.gap ?? 6) - 0.5, { ...opts(m), seed: (m.seed ?? 1) + 3, disableMultiStroke: true }));
        put(layers.ink, lines, transform);
      } else if (m.t === 'highlight') {
        const l = b.cx - b.w / 2 - px;
        const r = b.cx + b.w / 2 + px;
        const t = b.cy - b.h / 2 - py;
        const btm = b.cy + b.h / 2 + py;
        const shape = gen.polygon(
          [
            [l + 3, t + 2],
            [r, t - 1],
            [r - 2, btm - 1],
            [l, btm + 2],
          ],
          { roughness: 0.9, bowing: 0.6, seed: m.seed ?? 1, stroke: 'none', fill: m.color, fillStyle: 'solid' },
        );
        put(layers.hl, [shape], transform);
      }
    }
  })();
}

export const inkScript = cfg => `<script>${roughScript()}</script><script>(${pageInk.toString()})(${JSON.stringify(cfg)})</script>`;
