import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { dayOf, days, grid, markBody, primaryLockup, stageOf, stages } from '../../../../sites/src/identyfikacja/nosna/lib/field.ts';
import { brand, c, logo } from './theme.mjs';
import { kerning, primaryWord, wordmark } from './logo-parts.mjs';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg, { precision: 1 })}\n`);
const sketch = `fill="none" stroke="${c.atrament}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;

const sine = (x0, x1, y, amp, cycles, phase = 0, steps = 40) => {
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    d += `${i === 0 ? 'M' : 'L'}${(x0 + (x1 - x0) * t).toFixed(1)} ${(y - amp * Math.sin(2 * Math.PI * cycles * t + phase)).toFixed(1)}`;
  }
  return d;
};

export const buildFigures = () => {
  const threads = [0, 1, 2, 3].map(i => `<path ${sketch} stroke-width="2.4" d="${sine(14, 186, 60 + i * 26, 11 - i * 1.5, 2 + i * 0.8, i)}"/>`).join('');
  figure('direction-nitki.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${sketch} stroke-width="2" d="M6 100H194"/>${threads}<path ${sketch} stroke="${c.piatek}" d="M14 160H186"/></svg>`);

  const plain = wordmark(34, { x: 0, y: 0 }, {});
  const x0 = 100 - plain.width / 2;
  const sketchWord = wordmark(34, { x: x0, y: 126 }, {});
  figure(
    'direction-akcent.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="${c.atrament}" d="${sketchWord.d}"/><path ${sketch} stroke="${c.piatek}" stroke-width="3.5" d="M${x0 + 38} 82q6-18 15-6t14-12"/></svg>`,
  );

  const mark = primaryLockup({ day: 'piatek', stage: 'przedzalnia', bpm: 100 }, { thread: c.piatek, ink: c.atrament }, primaryWord());
  const pad = 20;
  figure('direction-nosna.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${mark.viewBox[2] + pad * 2} ${mark.viewBox[3] + pad * 2}">${mark.body}</svg>`);

  const base = wordmark(120, { x: 0, y: 0 }, {});
  const kerned = wordmark(120, { x: 0, y: 0 }, kerning);
  const width = Math.ceil(Math.max(base.width, kerned.width) + 24);
  const lines = `<g stroke="${c.piatek}" stroke-width="0.8" fill="none" stroke-dasharray="4 4"><path d="M0 150H${width}M0 ${150 - 120 * 0.64}H${width}"/></g>`;
  const plainDraw = wordmark(120, { x: 12, y: 150 }, {});
  const kernDraw = wordmark(120, { x: 12, y: 150 }, kerning);
  figure('wordmark-default.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines}<path fill="${c.grafit}" d="${plainDraw.d}"/></svg>`);
  figure('wordmark-kerned.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines}<path fill="none" stroke="${c.piatek}" stroke-width="1.6" d="${plainDraw.d}"/><path fill="${c.atrament}" d="${kernDraw.d}"/></svg>`);

  const unit = 76;
  const word = primaryWord();
  const lock = primaryLockup({ day: 'piatek', stage: 'przedzalnia', bpm: 100 }, { thread: c.piatek, ink: c.atrament }, word);
  const [, , pw, ph] = lock.viewBox;
  const total = [pw + unit * 2, ph + unit * 2];
  const band = `M0 0H${total[0]}V${total[1]}H0ZM${unit} ${unit}V${total[1] - unit}H${total[0] - unit}V${unit}Z`;
  const tick = (x, y, horizontal) => (horizontal ? `M${x} ${y - 6}V${y + 6}` : `M${x - 6} ${y}H${x + 6}`);
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total[0]} ${total[1]}"><path fill="${c.piatek}" fill-opacity=".18" fill-rule="evenodd" d="${band}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.piatek}" stroke-width="2" stroke-dasharray="7 6"/><g transform="translate(${unit} ${unit})">${lock.body}</g><g stroke="${c.atrament}" stroke-width="2" fill="none"><path d="M0 ${unit / 2}H${unit}${tick(0, unit / 2, true)}${tick(unit, unit / 2, true)}"/><path d="M${total[0] - unit} ${unit / 2}H${total[0]}${tick(total[0] - unit, unit / 2, true)}${tick(total[0], unit / 2, true)}"/><path d="M${total[0] / 2} ${total[1] - unit}V${total[1]}${tick(total[0] / 2, total[1] - unit, false)}${tick(total[0] / 2, total[1], false)}"/></g></svg>`,
  );

  const cell = (variant, x, y) => `<g transform="translate(${x} ${y})">${markBody(variant, { thread: dayOf(variant.day).color, ink: c.atrament })}</g>`;
  const cellW = 640;
  const cellH = 290;
  const gridCells = grid.map((variant, i) => cell(variant, 36 + (i % 4) * cellW, 20 + Math.floor(i / 4) * cellH)).join('');
  figure('grid-12.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cellW * 4 + 40} ${cellH * 3 + 20}">${gridCells}</svg>`);

  const envelope = days.map(day => {
    const pts = Array.from({ length: 61 }, (_, k) => {
      const u = k / 60;
      return `${k === 0 ? 'M' : 'L'}${(u * 300).toFixed(1)} ${(80 - 70 * Math.sin(Math.PI * Math.pow(u, day.skew))).toFixed(1)}`;
    }).join('');
    return `<path d="${pts}" fill="none" stroke="${day.color}" stroke-width="4"/>`;
  });
  figure('days-envelope.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 90"><path d="M0 80H300" stroke="${c.atrament}" stroke-width="2" fill="none"/>${envelope.join('')}</svg>`);
  return { stages: stages.map(stage => stageOf(stage.id).name) };
};
