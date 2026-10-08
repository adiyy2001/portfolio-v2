const pools = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digit: '0123456789',
  symbol: '#$!%&*?@+=<>/',
} as const;

const base: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

const poolOf = (ch: string) => {
  const lower = ch.toLowerCase();
  if (/[0-9]/.test(ch)) return pools.digit;
  if (/[a-ząćęłńóśźż]/.test(lower) || base[lower]) return ch === lower ? pools.lower : pools.upper;
  if (/[#$!%&*?@+=<>/^~]/.test(ch)) return pools.symbol;
  return null;
};

export const hash = (...values: number[]) => {
  let h = 2166136261;
  for (const v of values) {
    h ^= v + 0x9e3779b9 + (h << 6) + (h >>> 2);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};

export interface ScrambleOptions {
  step?: number;
  min?: number;
  max?: number;
  rate?: number;
  seed?: number;
}

export type GlyphState = 'hidden' | 'cycling' | 'done';

export interface Glyph {
  ch: string;
  state: GlyphState;
}

const defaults = { step: 2, min: 6, max: 10, rate: 2, seed: 7 };

export const cycleLength = (i: number, opts: ScrambleOptions = {}) => {
  const o = { ...defaults, ...opts };
  return o.min + (hash(o.seed, i, 31) % (o.max - o.min + 1));
};

export const scrambleGlyphs = (text: string, frame: number, start: number, opts: ScrambleOptions = {}): Glyph[] => {
  const o = { ...defaults, ...opts };
  return [...text].map((ch, i) => {
    const begin = start + i * o.step;
    const pool = poolOf(ch);
    if (frame < begin) return { ch, state: 'hidden' };
    if (!pool) return { ch, state: 'done' };
    const settle = begin + cycleLength(i, o);
    if (frame >= settle) return { ch, state: 'done' };
    const tick = Math.floor((frame - begin) / o.rate);
    const pick = pool[hash(o.seed, i, tick) % pool.length];
    return { ch: pick === ch ? pool[(pool.indexOf(pick) + 1) % pool.length] : pick, state: 'cycling' };
  });
};

export const settledAt = (text: string, start: number, opts: ScrambleOptions = {}) => {
  const o = { ...defaults, ...opts };
  return [...text].reduce((last, ch, i) => {
    const begin = start + i * o.step;
    return Math.max(last, poolOf(ch) ? begin + cycleLength(i, o) : begin);
  }, start);
};
