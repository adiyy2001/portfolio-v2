import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, viewBoxOf } from '../../lib/svg.mjs';
import { layoutText, lineToPath, loadFont } from '../../lib/text-path.mjs';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { brand, c, logo } from './theme.mjs';
import { canonicalSeed, faviconMarkup, kerning, lockups, stampParts, wordmark } from './logo-parts.mjs';
import { stamp } from '../../../../sites/src/identyfikacja/skibka/lib/stamp.ts';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg)}\n`);
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
  const glyphS = layoutText(display(), 'S', { size: 82 });
  const sPath = lineToPath(glyphS, { x: 100 - glyphS.width / 2, y: 148, digits: 1 });
  const slice = 'M48 174V98C30 94 26 62 42 46C58 30 84 34 100 40C116 34 142 30 158 46C174 62 170 94 152 98V174Z';
  const crumbs = [[74, 84], [126, 80], [112, 112], [82, 118], [140, 116], [66, 150], [136, 156]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${c.zyto}"/>`)
    .join('');
  figure(
    'direction-kromka.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${sketchStyle} d="${slice}"/><path ${sketchStyle} stroke-width="2" stroke-dasharray="1 7" transform="translate(100 108) scale(.82) translate(-100 -108)" d="${slice}"/>${crumbs}<path fill="${c.zyto}" d="${sPath}"/></svg>`,
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
  const sLayout = layoutText(display(), 'S', { size: 134 });
  const sScale = unit / sLayout.capHeight;
  const sBlock = (cx, cy) => {
    const d = lineToPath(sLayout, { x: 0, y: 0, digits: 1 });
    return `<g transform="translate(${(cx - (sLayout.width * sScale) / 2).toFixed(1)} ${(cy + unit / 2).toFixed(1)}) scale(${sScale.toFixed(4)})"><path fill="${c.skorka}" d="${d}"/></g>`;
  };
  const mid = [total[0] / 2, total[1] / 2];
  const tick = 7;
  const dim = (x1, y1, x2, y2) => {
    const horizontal = y1 === y2;
    const ends = horizontal ? `M${x1} ${y1 - tick}V${y1 + tick}M${x2} ${y2 - tick}V${y2 + tick}` : `M${x1 - tick} ${y1}H${x1 + tick}M${x2 - tick} ${y2}H${x2 + tick}`;
    return `M${x1} ${y1}L${x2} ${y2}${ends}`;
  };
  const dims = [
    dim(mid[0] + unit * 0.7, 0, mid[0] + unit * 0.7, unit),
    dim(mid[0] + unit * 0.7, total[1] - unit, mid[0] + unit * 0.7, total[1]),
    dim(0, mid[1] + unit * 0.5 + 22, unit, mid[1] + unit * 0.5 + 22),
    dim(total[0] - unit, mid[1] + unit * 0.5 + 22, total[0], mid[1] + unit * 0.5 + 22),
  ].join('');
  const blocks = [sBlock(mid[0], unit / 2), sBlock(mid[0], total[1] - unit / 2), sBlock(unit / 2, mid[1]), sBlock(total[0] - unit / 2, mid[1])].join('');
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 ${total[0] + 12} ${total[1] + 12}"><path fill="${c.kraft}" fill-opacity=".55" fill-rule="evenodd" d="${bandPath}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.skorka}" stroke-width="1.5" stroke-dasharray="6 5"/>${inner}${blocks}<path d="${dims}" stroke="${c.zyto}" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
  );

  const parts = stampParts(canonicalSeed);
  const set = lockups({ ink: c.skorka, wordInk: c.zyto, loafInk: c.skorka }, parts);
  const labelFont = loadFont(join(fontsSrcRoot(), 'karla', 'Karla[wght].ttf'), { wght: 700 });
  const label = (text, x, y, size, color) => {
    const layout = layoutText(labelFont, text, { size });
    return `<path fill="${color}" d="${lineToPath(layout, { x: x - layout.width / 2, y, digits: 1 })}"/>`;
  };
  const sizes = [
    { x: 100, width: 16, art: `<g transform="scale(${16 / 400})">${faviconMarkup(c.skorka, c.skorka)}</g>`, height: 16, a: '16 px, 6 mm', b: 'sygnet uproszczony' },
    { x: 290, width: 48, art: `<g transform="scale(${48 / stamp.size})">${set.symbol.body}</g>`, height: 48, a: '48 px, 18 mm', b: 'pełna pieczątka' },
    { x: 480, width: 120, art: `<g transform="scale(${120 / set.primary.viewBox[2]})">${set.primary.body}</g>`, height: (120 * set.primary.viewBox[3]) / set.primary.viewBox[2], a: '120 px, 32 mm', b: 'logo główne, szerokość' },
  ];
  const baseline = 72;
  const items = sizes
    .map(item => {
      const left = item.x - item.width / 2;
      const top = baseline - item.height;
      const bar = `M${left} ${baseline + 12}H${left + item.width}M${left} ${baseline + 8}V${baseline + 16}M${left + item.width} ${baseline + 8}V${baseline + 16}`;
      return `<g transform="translate(${left} ${top})">${item.art}</g><path d="${bar}" stroke="${c.skorka}" stroke-width="1.2" fill="none"/>${label(item.a, item.x, baseline + 42, 20, c.zyto)}${label(item.b, item.x, baseline + 66, 17, c.popiol)}`;
    })
    .join('');
  figure('minimum-sizes.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590 160">${items}</svg>`);
  return { unit, kerning };
};
