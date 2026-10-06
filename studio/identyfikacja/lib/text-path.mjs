import * as fontkit from 'fontkit';
import { fitContour } from './curve-fit.mjs';

const fixed = (value, digits) => {
  const text = value.toFixed(digits);
  return text.includes('.') ? text.replace(/0+$/, '').replace(/\.$/, '') : text;
};

export const loadFont = (file, axes) => {
  const base = fontkit.openSync(file);
  if (axes && Object.keys(axes).length > 0 && base.variationAxes && Object.keys(base.variationAxes).length > 0) {
    return base.getVariation(axes);
  }
  return base;
};

export const layoutText = (font, text, { size, tracking = 0, kern = {}, features = {}, trackingUnit = 'em' } = {}) => {
  const scale = size / font.unitsPerEm;
  const run = font.layout(text, features);
  const trackPx = trackingUnit === 'em' ? tracking * size : tracking;
  const chars = [...text];
  const glyphs = [];
  let pen = 0;
  run.glyphs.forEach((glyph, index) => {
    const position = run.positions[index];
    const x = pen + position.xOffset * scale;
    const y = -position.yOffset * scale;
    const advance = position.xAdvance * scale;
    glyphs.push({ glyph, x, y, advance, char: chars[index] ?? '' });
    let adjust = trackPx;
    const next = chars[index + 1];
    if (next !== undefined) {
      const pair = chars[index] + next;
      if (kern[pair] !== undefined) adjust += (kern[pair] / 1000) * size;
    }
    pen += advance + adjust;
  });
  const width = glyphs.length === 0 ? 0 : pen - trackPx;
  return { glyphs, width, scale, size, ascent: font.ascent * scale, descent: font.descent * scale, capHeight: (font.capHeight ?? 0) * scale, xHeight: (font.xHeight ?? 0) * scale };
};

export const commandsToPath = (commands, map, digits = 2, minSegment = 0) => {
  let last = null;
  const point = (x, y) => {
    const [mx, my] = map(x, y);
    return [mx, my];
  };
  const text = ([x, y]) => `${fixed(x, digits)} ${fixed(y, digits)}`;
  const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < minSegment;
  let out = '';
  for (const { command, args } of commands) {
    if (command === 'moveTo') {
      last = point(args[0], args[1]);
      out += `M${text(last)}`;
    } else if (command === 'lineTo') {
      const end = point(args[0], args[1]);
      if (minSegment > 0 && near(last, end)) continue;
      out += `L${text(end)}`;
      last = end;
    } else if (command === 'quadraticCurveTo') {
      const control = point(args[0], args[1]);
      const end = point(args[2], args[3]);
      if (minSegment > 0 && near(last, end) && near(last, control)) continue;
      out += `Q${text(control)} ${text(end)}`;
      last = end;
    } else if (command === 'bezierCurveTo') {
      const c1 = point(args[0], args[1]);
      const c2 = point(args[2], args[3]);
      const end = point(args[4], args[5]);
      if (minSegment > 0 && near(last, end) && near(last, c1) && near(last, c2)) continue;
      out += `C${text(c1)} ${text(c2)} ${text(end)}`;
      last = end;
    } else out += 'Z';
  }
  return out;
};

export const fittedPath = (commands, map, { digits = 1, error = 0.12 } = {}) => {
  const contours = [];
  let current = null;
  let start = null;
  let pen = null;
  const mapped = (x, y) => map(x, y);
  for (const { command, args } of commands) {
    if (command === 'moveTo') {
      current = { start: mapped(args[0], args[1]), segments: [] };
      contours.push(current);
      pen = current.start;
      start = pen;
    } else if (command === 'lineTo') {
      const p1 = mapped(args[0], args[1]);
      current.segments.push({ type: 'L', p0: pen, p1 });
      pen = p1;
    } else if (command === 'quadraticCurveTo') {
      const c1 = mapped(args[0], args[1]);
      const p1 = mapped(args[2], args[3]);
      current.segments.push({ type: 'Q', p0: pen, c1, p1 });
      pen = p1;
    } else if (command === 'bezierCurveTo') {
      const c1 = mapped(args[0], args[1]);
      const c2 = mapped(args[2], args[3]);
      const p1 = mapped(args[4], args[5]);
      current.segments.push({ type: 'C', p0: pen, c1, c2, p1 });
      pen = p1;
    } else if (command === 'closePath' && current && pen && start && (pen[0] !== start[0] || pen[1] !== start[1])) {
      current.segments.push({ type: 'L', p0: pen, p1: start });
      pen = start;
    }
  }
  const text = ([x, y]) => `${fixed(x, digits)} ${fixed(y, digits)}`;
  return contours
    .filter(contour => contour.segments.length > 0)
    .map(contour => {
      const parts = fitContour(contour.segments, { error });
      return `M${text(contour.start)}${parts.map(part => (part.type === 'L' ? `L${text(part.p1)}` : `C${text(part.c1)} ${text(part.c2)} ${text(part.p1)}`)).join('')}Z`;
    })
    .join('');
};

export const lineToPath = (layout, { x = 0, y = 0, digits = 2, jitter, minSegment = 0, fit = 0 } = {}) => {
  const { scale } = layout;
  return layout.glyphs
    .map(({ glyph, x: gx, y: gy }, index) => {
      const ox = x + gx;
      const oy = y + gy;
      const map = (px, py) => {
        const base = [ox + px * scale, oy - py * scale];
        return jitter ? jitter(base, index) : base;
      };
      return fit ? fittedPath(glyph.path.commands, map, { digits, error: fit }) : commandsToPath(glyph.path.commands, map, digits, minSegment);
    })
    .join('');
};

export const ringToPath = (layout, { cx, cy, radius, startAngle = -90, inside = false, digits = 2, fit = 0 }) => {
  const { scale } = layout;
  const total = layout.width;
  const startRad = (startAngle * Math.PI) / 180;
  const direction = inside ? -1 : 1;
  return layout.glyphs
    .map(({ glyph, x, advance }) => {
      const center = x + advance / 2;
      const angle = startRad + direction * ((center - total / 2) / radius);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const rotation = angle + (inside ? -Math.PI / 2 : Math.PI / 2);
      const rc = Math.cos(rotation);
      const rs = Math.sin(rotation);
      const originX = cx + radius * cos;
      const originY = cy + radius * sin;
      const map = (px, py) => {
        const lx = px * scale - advance / 2;
        const ly = -py * scale;
        return [originX + lx * rc - ly * rs, originY + lx * rs + ly * rc];
      };
      return fit ? fittedPath(glyph.path.commands, map, { digits, error: fit }) : commandsToPath(glyph.path.commands, map, digits);
    })
    .join('');
};

export const ringGlyphs = (layout, { cx, cy, radius, startAngle = -90, digits = 1, error = 0.15 }) => {
  const { scale } = layout;
  const total = layout.width;
  const startRad = (startAngle * Math.PI) / 180;
  const defs = new Map();
  const uses = [];
  for (const { glyph, x, advance, char } of layout.glyphs) {
    if (char === ' ') continue;
    if (!defs.has(char)) {
      const map = (px, py) => [px * scale - advance / 2, -py * scale];
      defs.set(char, fittedPath(glyph.path.commands, map, { digits, error }));
    }
    const angle = startRad + (x + advance / 2 - total / 2) / radius;
    uses.push({
      char,
      x: Number((cx + radius * Math.cos(angle)).toFixed(digits)),
      y: Number((cy + radius * Math.sin(angle)).toFixed(digits)),
      rotation: Number((((angle + Math.PI / 2) * 180) / Math.PI).toFixed(2)),
    });
  }
  return { defs: [...defs.entries()].map(([char, d], index) => ({ id: `g${index}`, char, d })), uses };
};

export const textBounds = layout => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { glyph, x, y } of layout.glyphs) {
    const box = glyph.path.bbox;
    if (!Number.isFinite(box.minX)) continue;
    minX = Math.min(minX, x + box.minX * layout.scale);
    maxX = Math.max(maxX, x + box.maxX * layout.scale);
    minY = Math.min(minY, y - box.maxY * layout.scale);
    maxY = Math.max(maxY, y - box.minY * layout.scale);
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};
