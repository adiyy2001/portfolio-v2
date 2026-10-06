import { converter, formatHex, parse, wcagContrast } from 'culori';

const toOklch = converter('oklch');
const toRgb = converter('rgb');

const round = (value, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const normalizeHex = hex => formatHex(parse(hex)).toUpperCase();

export const describeColor = hex => {
  const parsed = parse(hex);
  if (!parsed) throw new Error(`cannot parse colour "${hex}"`);
  const rgb = toRgb(parsed);
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  const lch = toOklch(parsed);
  const l = round(lch.l * 100, 1);
  const c = round(lch.c, 3);
  const h = lch.c < 0.004 ? 0 : round(lch.h ?? 0, 1);
  const k = 1 - Math.max(r, g, b) / 255;
  const cyan = k >= 1 ? 0 : (1 - r / 255 - k) / (1 - k);
  const magenta = k >= 1 ? 0 : (1 - g / 255 - k) / (1 - k);
  const yellow = k >= 1 ? 0 : (1 - b / 255 - k) / (1 - k);
  const cmyk = { c: round(cyan * 100), m: round(magenta * 100), y: round(yellow * 100), k: round(k * 100) };
  return {
    hex: normalizeHex(hex),
    rgb: { r, g, b },
    rgbCss: `rgb(${r} ${g} ${b})`,
    oklch: { l, c, h },
    oklchCss: `oklch(${l}% ${c} ${h})`,
    cmykApprox: cmyk,
    cmykApproxText: `C ${cmyk.c} M ${cmyk.m} Y ${cmyk.y} K ${cmyk.k}`,
  };
};

export const contrastRatio = (foreground, background) => round(wcagContrast(foreground, background), 2);

export const requiredRatio = kind => ({ text: 4.5, large: 3, ui: 3, decorative: 0 })[kind];

export const kinds = ['text', 'large', 'ui', 'decorative'];

export const evaluatePair = (pair, colors) => {
  const fg = colors[pair.fg];
  const bg = colors[pair.bg];
  if (!fg || !bg) throw new Error(`contrast pair ${pair.id ?? `${pair.fg}/${pair.bg}`} refers to an unknown colour`);
  const ratio = contrastRatio(fg, bg);
  const required = requiredRatio(pair.kind);
  if (required === undefined) throw new Error(`contrast pair ${pair.id}: unknown kind "${pair.kind}"`);
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'fail';
  return {
    id: pair.id,
    use: pair.use,
    fg: pair.fg,
    bg: pair.bg,
    fgHex: normalizeHex(fg),
    bgHex: normalizeHex(bg),
    kind: pair.kind,
    ratio,
    required,
    level,
    pass: pair.kind === 'decorative' ? true : ratio >= required,
    note: pair.note ?? null,
  };
};
