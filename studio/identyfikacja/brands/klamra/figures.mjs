import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, viewBoxOf } from '../../lib/svg.mjs';
import { brand, c, logo } from './theme.mjs';
import { kerning, wordmark, wordmarkPlain } from './logo-parts.mjs';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg, { precision: 1 })}\n`);

const rough = (points, jitter = 1.4, seed = 3) => {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647 - 0.5;
  };
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x + rand() * jitter).toFixed(1)} ${(y + rand() * jitter).toFixed(1)}`).join('');
};

const sketch = `fill="none" stroke="${c.atrament}" stroke-width="7" stroke-linecap="butt" stroke-linejoin="miter"`;

export const buildFigures = () => {
  figure(
    'direction-k.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="14" y="14" width="172" height="172" fill="${c.cytryna}"/><path ${sketch} d="${rough([[62, 44], [62, 156]], 2, 4)}"/><path ${sketch} d="${rough([[136, 44], [118, 44], [118, 74], [96, 100], [118, 126], [118, 156], [136, 156]], 2, 8)}" transform="translate(-14 0)"/><path ${sketch} stroke-dasharray="2 10" d="M30 100H170"/></svg>`,
  );

  const plain = wordmarkPlain(32);
  const cursorWidth = 11;
  const word = wordmark(32, { x: 100 - (plain.width + 4 + cursorWidth) / 2, y: 122 });
  figure(
    'direction-terminal.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="12" y="46" width="176" height="108" fill="${c.biel}" stroke="${c.atrament}" stroke-width="7"/><path d="M12 46h176v18H12Z" fill="${c.atrament}"/><path fill="${c.atrament}" d="${word.d}"/><rect x="${(100 + (plain.width + 4 + cursorWidth) / 2 - cursorWidth).toFixed(1)}" y="96" width="${cursorWidth}" height="28" fill="${c.roz}" stroke="${c.atrament}" stroke-width="3"/></svg>`,
  );

  figure('direction-klamry.svg', logo('symbol').replace('<svg ', '<svg width="200" height="200" '));

  const plainWord = wordmarkPlain(120);
  const kernedTracked = wordmark(120, { x: 10, y: 150 });
  const baseline = 150;
  const capLine = baseline - 120 * 0.7;
  const lines = w => `<g stroke="${c.kamien}" stroke-width="1" fill="none" stroke-dasharray="4 4"><path d="M0 ${baseline}H${w}M0 ${capLine}H${w}"/></g>`;
  const width = Math.ceil(Math.max(plainWord.width, kernedTracked.width) + 40);
  const shifted = wordmarkPlain(120);
  figure('wordmark-default.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines(width)}<g transform="translate(10 150)"><path fill="${c.grafit}" d="${shifted.d}"/></g></svg>`);
  figure('wordmark-kerned.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines(width)}<path fill="${c.atrament}" d="${kernedTracked.d}"/></svg>`);

  const primary = logo('primary');
  const [, , pw, ph] = viewBoxOf(primary);
  const unit = 40;
  const inner = `<g transform="translate(${unit} ${unit})">${primary.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '')}</g>`;
  const total = [pw + unit * 2, ph + unit * 2];
  const bandPath = `M0 0H${total[0]}V${total[1]}H0ZM${unit} ${unit}V${total[1] - unit}H${total[0] - unit}V${unit}Z`;
  const tick = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total[0]} ${total[1]}"><path fill="${c.niebo}" fill-opacity=".55" fill-rule="evenodd" d="${bandPath}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.grafit}" stroke-width="1.5" stroke-dasharray="6 5"/>${inner}<g stroke="${c.atrament}" stroke-width="2" fill="none">${tick(0, unit / 2, unit, unit / 2)}${tick(0, unit / 2 - 6, 0, unit / 2 + 6)}${tick(unit, unit / 2 - 6, unit, unit / 2 + 6)}${tick(total[0] - unit, unit / 2, total[0], unit / 2)}${tick(total[0] - unit, unit / 2 - 6, total[0] - unit, unit / 2 + 6)}${tick(total[0], unit / 2 - 6, total[0], unit / 2 + 6)}${tick(total[0] / 2, total[1] - unit, total[0] / 2, total[1])}${tick(total[0] / 2 - 6, total[1] - unit, total[0] / 2 + 6, total[1] - unit)}${tick(total[0] / 2 - 6, total[1], total[0] / 2 + 6, total[1])}</g></svg>`,
  );
  return { kerning, unit };
};
