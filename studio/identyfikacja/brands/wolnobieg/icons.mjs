import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { ringPath } from '../../../../sites/src/identyfikacja/wolnobieg/lib/stripes.ts';
import { brand, c, file } from './theme.mjs';

const spokes = (cx, cy, from, to, count, start = 0) =>
  Array.from({ length: count }, (_, i) => {
    const a = ((start + (360 / count) * i) * Math.PI) / 180;
    const f = n => Number(n.toFixed(2));
    return `M${f(cx + Math.cos(a) * from)} ${f(cy + Math.sin(a) * from)}L${f(cx + Math.cos(a) * to)} ${f(cy + Math.sin(a) * to)}`;
  }).join('');
const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
export const icons = {
  rower: {
    accent: 'musztarda',
    shapes: [
      { d: 'M5.5 16.5L10 9H15.5L18.5 16.5M10 9L13 16.5H5.5' },
      { d: 'M15.5 9L14.6 5.5H17.6M8 5.8H12' },
      { d: circle(5.5, 16.5, 3.8), fill: 'accent' },
      { d: circle(18.5, 16.5, 3.8), fill: 'accent' },
    ],
  },
  kolo: {
    accent: 'pomarancz',
    shapes: [
      { d: circle(12, 12, 8.8), fill: 'accent' },
      { d: spokes(12, 12, 2, 8, 6, 30), width: 1.6 },
      { d: circle(12, 12, 2.6), fill: 'solid' },
    ],
  },
  zebatka: {
    accent: 'musztarda',
    shapes: [
      { d: spokes(12, 12, 7, 9.7, 8, 0) },
      { d: circle(12, 12, 6.6), fill: 'accent' },
      { d: circle(12, 12, 2.3), fill: 'solid' },
    ],
  },
  klucz: {
    accent: 'pomarancz',
    shapes: [{ d: 'M15.2 3.8a4.8 4.8 0 0 0-4.5 6.6L4.6 16.5a2.3 2.3 0 0 0 3.2 3.2l6.1-6.1a4.8 4.8 0 0 0 6.6-4.5c0-.6-.1-1.2-.4-1.7l-3.1 3.1-2.6-.7-.7-2.6 3.1-3.1a4.8 4.8 0 0 0-1.6-.3Z', fill: 'accent' }],
  },
  detka: {
    accent: 'pomarancz',
    shapes: [{ d: ringPath(10, 12, 7.8, 3), fill: 'accent', rule: 'evenodd' }, { d: 'M17.8 12H20.3M21 9.4v5.2' }],
  },
  pompka: {
    accent: 'musztarda',
    shapes: [{ d: 'M9.8 7.5h4.4a.8.8 0 0 1 .8.8V18a.8.8 0 0 1-.8.8H9.8a.8.8 0 0 1-.8-.8V8.3a.8.8 0 0 1 .8-.8Z', fill: 'accent' }, { d: 'M12 7.5V3M8 3h8' }, { d: 'M6.5 21h11' }, { d: 'M15 13h2a3 3 0 0 1 3 3v2.5' }],
  },
  lampka: {
    accent: 'musztarda',
    shapes: [
      { d: 'M4.8 7.5h5.4a5 5 0 0 1 0 10H4.8a1.8 1.8 0 0 1-1.8-1.8V9.3a1.8 1.8 0 0 1 1.8-1.8Z', fill: 'accent' },
      { d: 'M18.2 7.6l3-1.6M19 12.5h3M18.2 17.4l3 1.6' },
      { d: 'M7.5 17.5V21M3.5 21H11' },
    ],
  },
  dzwonek: {
    accent: 'pomarancz',
    shapes: [{ d: 'M4.2 16.4a7.8 7.8 0 0 1 15.6 0Z', fill: 'accent' }, { d: 'M12 8.6V5.4M3.5 20h17' }, { d: 'M20 11.2l2-2.2' }],
  },
  kask: {
    accent: 'pomarancz',
    shapes: [{ d: 'M3.8 16.2a8.2 8.2 0 0 1 16.4 0v1.1H3.8Z', fill: 'accent' }, { d: 'M9.2 8.8v3.2M14.8 8.8v3.2' }, { d: 'M7 17.3v3M17 17.3v3' }],
  },
  zegar: {
    accent: 'musztarda',
    shapes: [{ d: circle(12, 12, 8.8), fill: 'accent' }, { d: 'M12 7v5.2l3.6 2.2' }],
  },
  adres: {
    accent: 'pomarancz',
    shapes: [{ d: 'M12 21.5c4.2-4.6 6.5-7.9 6.5-11.2a6.5 6.5 0 0 0-13 0c0 3.3 2.3 6.6 6.5 11.2Z', fill: 'accent' }, { d: circle(12, 10.2, 2), fill: 'solid' }],
  },
  telefon: {
    accent: 'musztarda',
    shapes: [{ d: 'M8 3h8a1.8 1.8 0 0 1 1.8 1.8v14.4A1.8 1.8 0 0 1 16 21H8a1.8 1.8 0 0 1-1.8-1.8V4.8A1.8 1.8 0 0 1 8 3Z', fill: 'accent' }, { d: 'M10.4 17.4h3.2' }],
  },
};

export const iconStroke = 3;

const shapeSvg = (shape, accent, stroke) => {
  const fill = shape.fill === 'accent' ? accent : shape.fill === 'solid' ? stroke : 'none';
  const rule = shape.rule ? ` fill-rule="${shape.rule}"` : '';
  const line = shape.fill === 'solid' ? ' stroke="none"' : shape.width ? ` stroke-width="${shape.width}"` : '';
  return `<path d="${shape.d}" fill="${fill}"${rule}${line}/>`;
};

const body = (name, stroke) => icons[name].shapes.map(shape => shapeSvg(shape, c[icons[name].accent], stroke)).join('');

const attrs = stroke => `stroke="${stroke}" stroke-width="${iconStroke}" stroke-linecap="round" stroke-linejoin="round"`;

export const iconSvg = (name, stroke = c.kakao) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${attrs(stroke)} role="img"><title>${name}</title>${body(name, stroke)}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24" ${attrs(c.kakao)}>${body(name, c.kakao)}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>\n`);
};
