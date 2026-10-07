import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { brand, c } from './theme.mjs';

const fieldPath = fileURLToPath(new URL('../../../../sites/src/identyfikacja/nosna/lib/field.ts', import.meta.url));
const wordPath = fileURLToPath(new URL('../../../../sites/src/identyfikacja/nosna/word-data.json', import.meta.url));
const field = stripTypeScriptTypes(readFileSync(fieldPath, 'utf8'));
const word = JSON.parse(readFileSync(wordPath, 'utf8'));

const script = `${field}
const WORD = ${JSON.stringify(word)};
const INK = '${c.kosc}';
const GROUND = '${c.atrament}';
const clamp01 = v => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const toLinear = v => (v / 255 <= 0.04045 ? v / 255 / 12.92 : Math.pow((v / 255 + 0.055) / 1.055, 2.4));
const toByte = v => {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
};
const toOklch = hex => {
  const [r, g, b] = rgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
};
const fromOklch = ([L, C, h]) => {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(toByte);
};
const mix = (a, b, t) => {
  const from = toOklch(a);
  const to = toOklch(b);
  let dh = to[2] - from[2];
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  const midHue = ((from[2] + dh / 2) * 180 / Math.PI + 360) % 360;
  if (midHue > 50 && midHue < 170) dh += dh > 0 ? -2 * Math.PI : 2 * Math.PI;
  return '#' + fromOklch([lerp(from[0], to[0], t), lerp(from[1], to[1], t), from[2] + dh * t]).map(v => v.toString(16).padStart(2, '0')).join('');
};
const base = paramsOf(primaryVariant);
const dayList = days.map(day => ({ color: day.color, skew: day.skew }));
const cycleKeys = [base.cycles, 5.4, 3.4, base.cycles];
const keyTimes = [1100, 1700, 2100, 2900];
const segment = (ms) => {
  if (ms <= keyTimes[0]) return { i: 0, t: 0 };
  for (let i = 0; i < keyTimes.length - 1; i += 1) {
    if (ms <= keyTimes[i + 1]) return { i, t: easeInOut((ms - keyTimes[i]) / (keyTimes[i + 1] - keyTimes[i])) };
  }
  return { i: keyTimes.length - 2, t: 1 };
};
const dayKeys = [dayList[0], dayList[1], dayList[2], dayList[0]];
const geo = geometry;
const offset = geo.height + wordGap - WORD.top;
const lockHeight = Math.ceil(geo.height + wordGap + (WORD.bottom - WORD.top));
const scale = 840 / geo.width;
const stage = document.getElementById('stage');
stage.setAttribute('viewBox', '0 0 ' + geo.width + ' ' + lockHeight);
stage.style.width = '840px';
stage.style.height = lockHeight * scale + 'px';
stage.style.left = '120px';
stage.style.top = (1080 - lockHeight * scale) / 2 + 'px';
const carrier = document.getElementById('carrier');
const ring = document.getElementById('ring');
const threads = document.getElementById('threads');
const wordEl = document.getElementById('word');
wordEl.setAttribute('d', WORD.d);
window.__duration = 3000;
window.__seek = ms => {
  const draw = easeOut(clamp01(ms / 500));
  carrier.style.strokeDashoffset = String(geo.carrierEnd * (1 - draw));
  const pop = easeOut(clamp01((ms - 350) / 350));
  ring.style.transform = 'scale(' + pop + ')';
  const grow = easeOut(clamp01((ms - 300) / 900));
  const seg = segment(ms);
  const a = dayKeys[seg.i];
  const b = dayKeys[seg.i + 1];
  const total = clamp01((ms - keyTimes[0]) / (keyTimes[3] - keyTimes[0]));
  const params = {
    ...base,
    cycles: lerp(lerp(1.6, cycleKeys[0], grow), lerp(cycleKeys[seg.i], cycleKeys[seg.i + 1], seg.t), ms < keyTimes[0] ? 0 : 1),
    skew: ms < keyTimes[0] ? base.skew : lerp(a.skew, b.skew, seg.t),
    phase: base.phase + Math.PI * 2 * easeInOut(total),
  };
  const color = ms < keyTimes[0] ? a.color : mix(a.color, b.color, clamp01((seg.t - 0.42) / 0.16));
  const built = composeParams(params, grow);
  threads.setAttribute('opacity', grow > 0.01 ? '1' : '0');
  threads.innerHTML = built.map(item => '<path fill="none" stroke="' + color + '" stroke-width="' + item.width + '" stroke-linejoin="round" d="' + item.d + '"/>').join('');
  const reveal = easeOut(clamp01((ms - 2300) / 600));
  wordEl.setAttribute('opacity', String(reveal));
  wordEl.setAttribute('transform', 'translate(0 ' + (offset + (1 - reveal) * 30) + ')');
};
window.__seek(0);
`;

const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Nośna, animacja znaku</title>
<style>html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:${c.atrament}}svg{position:absolute;overflow:visible}</style></head>
<body><svg id="stage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
<path id="carrier" fill="none" stroke="${c.kosc}" stroke-width="9" d="M0 130H560" stroke-dasharray="560" stroke-dashoffset="560"/>
<circle id="ring" cx="578" cy="130" r="16" fill="none" stroke="${c.kosc}" stroke-width="8" style="transform-box:fill-box;transform-origin:center"/>
<g id="threads"></g>
<path id="word" fill="${c.kosc}" d=""/>
</svg>
<script type="module">
${script}</script></body></html>
`;

writeFileSync(join(brand.paths.src, 'animation.html'), html);
console.log('animation.html written');
