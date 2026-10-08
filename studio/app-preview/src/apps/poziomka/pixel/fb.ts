import { hex } from '../tokens';
import { mini, pixel, type BitmapFont } from './font-data';

export const CLEAR = 255;

const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export const dithered = (x: number, y: number, level: number) => bayer[((y % 4) + 4) % 4][((x % 4) + 4) % 4] < level;

export class FB {
  readonly px: Uint8Array;

  constructor(
    readonly w: number,
    readonly h: number,
    fill = CLEAR,
  ) {
    this.px = new Uint8Array(w * h).fill(fill);
  }

  set(x: number, y: number, c: number) {
    if (c === CLEAR || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y * this.w + x] = c;
  }

  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return CLEAR;
    return this.px[y * this.w + x];
  }

  rect(x: number, y: number, w: number, h: number, c: number) {
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.w, Math.round(x + w));
    const y1 = Math.min(this.h, Math.round(y + h));
    if (c === CLEAR) return;
    for (let yy = y0; yy < y1; yy += 1) this.px.fill(c, yy * this.w + x0, yy * this.w + Math.max(x0, x1));
  }

  outline(x: number, y: number, w: number, h: number, c: number, t = 1) {
    this.rect(x, y, w, t, c);
    this.rect(x, y + h - t, w, t, c);
    this.rect(x, y, t, h, c);
    this.rect(x + w - t, y, t, h, c);
  }

  panel(x: number, y: number, w: number, h: number, fill: number, edge = 0, shade = CLEAR) {
    this.rect(x + 1, y + 1, w - 2, h - 2, fill);
    this.rect(x + 1, y, w - 2, 1, edge);
    this.rect(x + 1, y + h - 1, w - 2, 1, edge);
    this.rect(x, y + 1, 1, h - 2, edge);
    this.rect(x + w - 1, y + 1, 1, h - 2, edge);
    if (shade !== CLEAR) {
      this.rect(x + 1, y + h - 2, w - 2, 1, shade);
      this.rect(x + w - 2, y + 1, 1, h - 3, shade);
    }
  }

  dither(x: number, y: number, w: number, h: number, a: number, b: number, level: number) {
    for (let yy = y; yy < y + h; yy += 1)
      for (let xx = x; xx < x + w; xx += 1) this.set(xx, yy, dithered(xx, yy, level) ? b : a);
  }

  checker(x: number, y: number, w: number, h: number, a: number, b: number) {
    for (let yy = y; yy < y + h; yy += 1)
      for (let xx = x; xx < x + w; xx += 1) this.set(xx, yy, (xx + yy) % 2 === 0 ? a : b);
  }

  sprite(x: number, y: number, art: readonly string[], map: Record<string, number>, opts: { flip?: boolean; scale?: number } = {}) {
    const s = opts.scale ?? 1;
    const w = art[0]?.length ?? 0;
    art.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx += 1) {
        const c = map[row[rx]];
        if (c === undefined || c === CLEAR) continue;
        const sx = opts.flip ? w - 1 - rx : rx;
        this.rect(x + sx * s, y + ry * s, s, s, c);
      }
    });
  }

  blit(src: FB, x: number, y: number, mask?: (sx: number, sy: number) => boolean) {
    for (let sy = 0; sy < src.h; sy += 1) {
      const ty = y + sy;
      if (ty < 0 || ty >= this.h) continue;
      for (let sx = 0; sx < src.w; sx += 1) {
        const c = src.px[sy * src.w + sx];
        if (c === CLEAR) continue;
        if (mask && !mask(sx, sy)) continue;
        this.set(x + sx, ty, c);
      }
    }
  }

  scaled(src: FB, x: number, y: number, s: number) {
    for (let sy = 0; sy < src.h; sy += 1)
      for (let sx = 0; sx < src.w; sx += 1) {
        const c = src.px[sy * src.w + sx];
        if (c !== CLEAR) this.rect(x + sx * s, y + sy * s, s, s, c);
      }
  }

  toRgba(out: Uint8ClampedArray, fallback = 0) {
    const lut = hex.map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
    for (let i = 0; i < this.px.length; i += 1) {
      const c = this.px[i] === CLEAR ? fallback : this.px[i];
      const [r, g, b] = lut[c];
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = 255;
    }
  }
}

export type FontId = 'pixel' | 'mini';

export const fontOf = (id: FontId): BitmapFont => (id === 'pixel' ? pixel : mini);

const glyphOf = (font: BitmapFont, ch: string) => font.glyphs[ch] ?? mini.glyphs[ch] ?? font.glyphs['?'];

export const measure = (text: string, id: FontId = 'mini', scale = 1) => {
  const font = fontOf(id);
  let w = 0;
  for (const ch of text) w += glyphOf(font, ch).a;
  return Math.max(0, w - 1) * scale;
};

export interface TextOpts {
  font?: FontId;
  scale?: number;
  color?: number;
  shadow?: number;
  outline?: number;
  align?: 'left' | 'center' | 'right';
  reveal?: number;
}

export const text = (fb: FB, x: number, y: number, str: string, opts: TextOpts = {}) => {
  const id = opts.font ?? 'mini';
  const font = fontOf(id);
  const s = opts.scale ?? 1;
  const color = opts.color ?? 0;
  const width = measure(str, id, s);
  const cx = opts.align === 'center' ? x - Math.floor(width / 2) : opts.align === 'right' ? x - width : x;
  const base = y + font.cap * s;
  const chars = [...str].slice(0, opts.reveal ?? Infinity);
  const draw = (dx: number, dy: number, c: number) => {
    let px = cx;
    for (const ch of chars) {
      const g = glyphOf(font, ch);
      const top = base - g.y * s;
      for (let r = 0; r < g.h; r += 1)
        for (let q = 0; q < g.w; q += 1)
          if (g.b[r * g.w + q] === '1') fb.rect(px + (g.x + q) * s + dx, top + r * s + dy, s, s, c);
      px += g.a * s;
    }
  };
  if (opts.outline !== undefined)
    for (const [dx, dy] of [
      [-s, 0],
      [s, 0],
      [0, -s],
      [0, s],
      [-s, -s],
      [s, -s],
      [-s, s],
      [s, s],
    ])
      draw(dx, dy, opts.outline);
  if (opts.shadow !== undefined) draw(0, s, opts.shadow);
  draw(0, 0, color);
  return width;
};

export const wrap = (str: string, maxWidth: number, id: FontId = 'mini', scale = 1) => {
  const lines: string[] = [];
  let line = '';
  for (const word of str.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next, id, scale) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};

export const lineHeight = (id: FontId, scale = 1) => (id === 'pixel' ? 17 : 10) * scale;

export const paragraph = (fb: FB, x: number, y: number, str: string, maxWidth: number, opts: TextOpts & { gap?: number } = {}) => {
  const id = opts.font ?? 'mini';
  const s = opts.scale ?? 1;
  const lines = wrap(str, maxWidth, id, s);
  const lh = opts.gap ?? lineHeight(id, s);
  lines.forEach((line, i) => text(fb, x, y + i * lh, line, opts));
  return lines.length * lh;
};

export const balance = (str: string, maxWidth: number, id: FontId = 'mini', scale = 1) => {
  const greedy = wrap(str, maxWidth, id, scale);
  if (greedy.length !== 2) return greedy;
  const words = str.split(' ');
  let best = greedy;
  let bestWidth = Math.max(...greedy.map(line => measure(line, id, scale)));
  for (let i = 1; i < words.length; i += 1) {
    const pair = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
    const width = Math.max(...pair.map(line => measure(line, id, scale)));
    if (width <= maxWidth && width < bestWidth) {
      best = pair;
      bestWidth = width;
    }
  }
  return best;
};
