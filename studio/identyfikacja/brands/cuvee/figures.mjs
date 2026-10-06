import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg } from '../../lib/svg.mjs';
import { layoutText, lineToPath, loadFont, textBounds } from '../../lib/text-path.mjs';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { brand, c, logoMarkup } from './theme.mjs';
import { kerning, name, wordTracking, wordmark } from './logo-parts.mjs';

const figure = (fileName, svg) => writeFile(join(brand.paths.pub, 'figures', fileName), `${optimizeSvg(svg, { precision: 1 })}\n`);
const italic = () => loadFont(join(fontsSrcRoot(), 'notoserifdisplay', 'NotoSerifDisplay-Italic[wdth,wght].ttf'), { wght: 300, wdth: 100 });
const roman = () => loadFont(join(fontsSrcRoot(), 'notoserifdisplay', 'NotoSerifDisplay[wdth,wght].ttf'), { wght: 400, wdth: 100 });
const line = `fill="none" stroke="${c.czern}" stroke-width="1.6"`;

const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

export const buildFigures = () => {
  const layout = layoutText(italic(), 'cuvée', { size: 78 });
  const bounds = textBounds(layout);
  const x = 100 - (bounds.minX + bounds.maxX) / 2;
  const d = lineToPath(layout, { x, y: 112, digits: 1, fit: 0.2 });
  figure('direction-kursywa.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="${c.czern}" d="${d}"/><circle cx="${(x + bounds.maxX + 7).toFixed(1)}" cy="112" r="3.6" fill="${c.mosiadz}"/><path ${line} stroke-width="0.8" d="M30 112H170"/></svg>`);

  figure(
    'direction-linia.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${line} stroke-linecap="round" stroke-linejoin="round" d="M42 150C60 96 84 62 112 52c-4 22-14 36-30 54 22-12 44-12 62 6-24 8-46 6-62 14 20 4 40 2 58 14"/><g ${line} stroke-width="1.3"><circle cx="128" cy="96" r="7"/><circle cx="144" cy="104" r="7"/><circle cx="130" cy="114" r="7"/><circle cx="146" cy="124" r="7"/><circle cx="134" cy="134" r="7"/></g></svg>`,
  );

  const primary = logoMarkup('primary', 'color');
  const match = primary.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const pw = Number(match[1]);
  const ph = Number(match[2]);
  const scale = 170 / pw;
  figure(
    'direction-wersalik.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g transform="translate(15 ${(200 - ph * scale) / 2}) scale(${scale})">${inner(primary)}</g></svg>`,
  );

  const size = 120;
  const plain = (() => {
    const layout2 = layoutText(roman(), name, { size, tracking: wordTracking });
    const b = textBounds(layout2);
    return { d: lineToPath(layout2, { x: 12 - b.minX, y: 140, digits: 1, fit: 0.2 }), width: b.width };
  })();
  const kerned = wordmark(size, { origin: { x: 12, y: 140 } });
  const width = Math.ceil(Math.max(plain.width, kerned.width) + 24);
  const guides = `<g stroke="${c.mosiadz}" stroke-width="0.7" fill="none" stroke-dasharray="3 4"><path d="M0 140H${width}M0 ${140 - size * 0.714}H${width}"/></g>`;
  const probe = (d, fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 180">${guides}<path fill="${fill}" d="${d}"/>`;
  figure('wordmark-default.svg', `${probe(plain.d, c.wegiel)}</svg>`);
  figure('wordmark-kerned.svg', `${probe(kerned.d, c.czern)}</svg>`);

  const unit = Math.round(wordmark(120).capHeight);
  const inside = inner(primary);
  const total = [pw + unit * 2, ph + unit * 2];
  const band = `M0 0H${total[0]}V${total[1]}H0ZM${unit} ${unit}V${total[1] - unit}H${total[0] - unit}V${unit}Z`;
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total[0]} ${total[1]}"><path fill="${c.len}" fill-rule="evenodd" d="${band}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.mosiadz}" stroke-width="1" stroke-dasharray="6 5"/><g transform="translate(${unit} ${unit})">${inside}</g><g stroke="${c.czern}" stroke-width="1" fill="none"><path d="M0 ${unit / 2}H${unit}M0 ${unit / 2 - 6}V${unit / 2 + 6}M${unit} ${unit / 2 - 6}V${unit / 2 + 6}"/><path d="M${total[0] - unit} ${unit / 2}H${total[0]}M${total[0] - unit} ${unit / 2 - 6}V${unit / 2 + 6}M${total[0]} ${unit / 2 - 6}V${unit / 2 + 6}"/><path d="M${total[0] / 2} ${total[1] - unit}V${total[1]}M${total[0] / 2 - 6} ${total[1] - unit}H${total[0] / 2 + 6}M${total[0] / 2 - 6} ${total[1]}H${total[0] / 2 + 6}"/></g></svg>`,
  );
  return { unit, kerning };
};
