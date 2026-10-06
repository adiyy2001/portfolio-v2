import { arcStripe, discPath } from '../../../../sites/src/identyfikacja/wolnobieg/lib/stripes.ts';
import { c } from './theme.mjs';

export const stripeColors = () => [c.pomarancz, c.musztarda, c.brazowy];

export const cornerArcs = ({ size, corner = 'br', colors = stripeColors(), width, gap, start, round = true }) => {
  const cx = corner.includes('r') ? size : 0;
  const cy = corner.includes('b') ? size : 0;
  const from = corner === 'br' ? 180 : corner === 'bl' ? 270 : corner === 'tl' ? 0 : 90;
  const to = from + 90;
  return colors
    .map((color, index) => `<path fill="${color}" d="${arcStripe(cx, cy, start + index * (width + gap), width, from, to, round)}"/>`)
    .join('');
};

export const arcsSvg = ({ w, h, corner = 'br', colors, width, gap, start, round = true, style = '' }) => {
  const cx = corner.includes('r') ? w : 0;
  const cy = corner.includes('b') ? h : 0;
  const from = corner === 'br' ? 180 : corner === 'bl' ? 270 : corner === 'tl' ? 0 : 90;
  const body = (colors ?? stripeColors())
    .map((color, index) => `<path fill="${color}" d="${arcStripe(cx, cy, start + index * (width + gap), width, from, from + 90, round)}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="${style}" width="${w}" height="${h}">${body}</svg>`;
};

export const sweepSvg = ({ w, h, colors, width, gap, radius, centerX, centerY, from = 200, to = 340, style = '' }) => {
  const body = (colors ?? stripeColors())
    .map((color, index) => `<path fill="${color}" d="${arcStripe(centerX, centerY, radius + index * (width + gap), width, from, to, true)}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="${style}" width="${w}" height="${h}">${body}</svg>`;
};

const wheel = (cx, cy, r, stroke, w) => {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return `M${(cx + Math.cos(a) * 3).toFixed(1)} ${(cy + Math.sin(a) * 3).toFixed(1)}L${(cx + Math.cos(a) * (r - 2)).toFixed(1)} ${(cy + Math.sin(a) * (r - 2)).toFixed(1)}`;
  }).join('');
  return `<g fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"><circle cx="${cx}" cy="${cy}" r="${r}"/><circle cx="${cx}" cy="${cy}" r="${r - 6}" stroke-width="${w / 2}"/><path d="${spokes}" stroke-width="${w / 3}"/></g><path fill="${stroke}" d="${discPath(cx, cy, 4)}"/>`;
};

export const bikeSvg = ({ frame = c.brazowy, tire = c.kakao, accent = c.pomarancz, style = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" style="${style}" width="400" height="240">${wheel(80, 160, 68, tire, 9)}${wheel(320, 160, 68, tire, 9)}<g fill="none" stroke="${frame}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M80 160L150 84H262L206 160H80ZM262 84L320 160M150 84L132 56M262 84L250 50H284"/><path d="M114 50H158" stroke="${accent}" stroke-width="12"/><path d="M206 160L190 190" stroke="${tire}" stroke-width="7"/></g><path fill="${accent}" d="${discPath(206, 160, 13)}"/></svg>`;
