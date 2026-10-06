import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, viewBoxOf } from '../../lib/svg.mjs';
import { layoutText, lineToPath, loadFont } from '../../lib/text-path.mjs';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { brand, c, logo } from './theme.mjs';
import { kerning, wordmark } from './logo-parts.mjs';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg, { precision: 1 })}\n`);
const display = () => loadFont(join(fontsSrcRoot(), 'youngserif', 'YoungSerif-Regular.ttf'));

const rough = (points, jitter = 1.2, seed = 3) => {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647 - 0.5;
  };
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x + rand() * jitter).toFixed(1)} ${(y + rand() * jitter).toFixed(1)}`).join('');
};

const sketchStyle = `fill="none" stroke="${c.zyto}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;

export const buildFigures = () => {
  const glyphS = layoutText(display(), 'S', { size: 96 });
  const sPath = lineToPath(glyphS, { x: 66, y: 126, digits: 1 });
  figure(
    'direction-kromka.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${sketchStyle} d="${rough([[48, 172], [48, 98], [30, 90], [28, 58], [44, 38], [76, 30], [124, 30], [156, 38], [172, 58], [170, 90], [152, 98], [152, 172], [48, 172]], 2.2, 5)}"/><path ${sketchStyle} stroke-width="2" d="${sPath}"/></svg>`,
  );

  const grains = [
    [100, 112, -1],
    [100, 112, 1],
    [100, 80, -1],
    [100, 80, 1],
    [100, 50, 0],
  ];
  const earGrains = grains
    .map(([x, y, side]) => `<ellipse cx="${x + side * 15}" cy="${y - 14}" rx="7" ry="17" transform="rotate(${side * 38} ${x + side * 15} ${y - 14})"/>`)
    .join('');
  const word = wordmark(46, 0, { x: 100 - wordmark(46).width / 2, y: 178 });
  figure(
    'direction-klos.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${sketchStyle} d="${rough([[100, 150], [100, 56]], 2, 9)}"/><g ${sketchStyle} stroke-width="2.4">${earGrains}</g><path fill="${c.zyto}" d="${word.d}"/></svg>`,
  );

  const stampSvg = logo('symbol').replace('<svg ', '<svg width="200" height="200" ');
  figure('direction-stamp.svg', stampSvg);

  const plain = (() => {
    const font = display();
    const layout = layoutText(font, 'Skibka', { size: 120 });
    return { d: lineToPath(layout, { x: 10, y: 150, digits: 1, fit: 0.3 }), width: layout.width };
  })();
  const adjusted = wordmark(120, 0, { x: 10, y: 150 });
  const lines = w => `<g stroke="${c.skorka}" stroke-width="0.8" fill="none"><path d="M0 150H${w}M0 ${150 - 120 * 0.69}H${w}M0 ${150 - 120 * 0.5}H${w}" stroke-dasharray="4 4"/></g>`;
  const width = Math.ceil(Math.max(plain.width, adjusted.width) + 24);
  figure('wordmark-default.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines(width)}<path fill="${c.popiol}" d="${plain.d}"/></svg>`);
  figure('wordmark-kerned.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${lines(width)}<path fill="${c.zyto}" d="${adjusted.d}"/></svg>`);

  const primary = logo('primary');
  const [, , pw, ph] = viewBoxOf(primary);
  const unit = Math.round(wordmark(134).capHeight);
  const inner = `<g transform="translate(${unit} ${unit})">${primary.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '')}</g>`;
  const total = [pw + unit * 2, ph + unit * 2];
  const bandPath = `M0 0H${total[0]}V${total[1]}H0ZM${unit} ${unit}V${total[1] - unit}H${total[0] - unit}V${unit}Z`;
  const marks = [
    `<rect x="${total[0] - unit - 30}" y="${total[1] - unit + 8}" width="${unit}" height="${unit - 16}" fill="none"/>`,
  ].join('');
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total[0]} ${total[1]}"><path fill="${c.kraft}" fill-opacity=".55" fill-rule="evenodd" d="${bandPath}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.skorka}" stroke-width="1.5" stroke-dasharray="6 5"/>${marks}${inner}<g stroke="${c.zyto}" stroke-width="1.5" fill="none"><path d="M${unit} ${unit / 2}H0M0 ${unit / 2 - 6}V${unit / 2 + 6}M${unit} ${unit / 2 - 6}V${unit / 2 + 6}"/><path d="M${total[0] - unit} ${unit / 2}H${total[0]}M${total[0] - unit} ${unit / 2 - 6}V${unit / 2 + 6}M${total[0]} ${unit / 2 - 6}V${unit / 2 + 6}"/><path d="M${total[0] / 2 + 40} ${total[1] - unit}V${total[1]}M${total[0] / 2 + 34} ${total[1] - unit}H${total[0] / 2 + 46}M${total[0] / 2 + 34} ${total[1]}H${total[0] / 2 + 46}"/></g></svg>`,
  );
  return { unit, kerning };
};
