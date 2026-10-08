export interface ScramblePreset {
  id: string;
  label: string;
  step: number;
  min: number;
  max: number;
  rate: number;
}

export const presets: Record<'readable' | 'fast', ScramblePreset> = {
  readable: { id: 'czytelny', label: 'czytelny', step: 2, min: 6, max: 10, rate: 2 },
  fast: { id: 'za-szybki', label: 'za szybki', step: 0.25, min: 1, max: 3, rate: 1 },
};

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = lower.toUpperCase();
const digits = '0123456789';
const symbols = '#$!%&*?@+=<>/';

const poolOf = (ch: string) => {
  if (/[0-9]/.test(ch)) return digits;
  if (/[a-ząćęłńóśźż]/.test(ch)) return lower;
  if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(ch)) return upper;
  if (/[#$!%&*?@+=<>/]/.test(ch)) return symbols;
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

const cycle = (i: number, p: ScramblePreset) => p.min + (hash(7, i, 31) % (p.max - p.min + 1));

export type Glyph = { ch: string; state: 'hidden' | 'cycling' | 'done' };

export const scramble = (text: string, frame: number, p: ScramblePreset): Glyph[] =>
  [...text].map((ch, i) => {
    const begin = i * p.step;
    const pool = poolOf(ch);
    if (frame < begin) return { ch, state: 'hidden' };
    if (!pool) return { ch, state: 'done' };
    if (frame >= begin + cycle(i, p)) return { ch, state: 'done' };
    const tick = Math.floor((frame - begin) / p.rate);
    const pick = pool[hash(7, i, tick) % pool.length];
    return {
      ch: pick === ch ? pool[(pool.indexOf(pick) + 1) % pool.length] : pick,
      state: 'cycling',
    };
  });

export const doneAt = (text: string, p: ScramblePreset) =>
  [...text].reduce((last, ch, i) => Math.max(last, i * p.step + (poolOf(ch) ? cycle(i, p) : 0)), 0);

export const settledShare = (text: string, frame: number, p: ScramblePreset) => {
  const glyphs = scramble(text, frame, p);
  return glyphs.filter(g => g.state === 'done').length / glyphs.length;
};

export const changesPerSecond = (p: ScramblePreset, fps = 30) => fps / p.rate;

export const pulse = (frame: number, period: number, low: number, high: number) =>
  low + (high - low) * (0.5 - 0.5 * Math.cos((2 * Math.PI * frame) / period));
