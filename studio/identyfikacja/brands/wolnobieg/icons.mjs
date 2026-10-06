import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
const spokes = (cx, cy, from, to, count, start = 0) =>
  Array.from({ length: count }, (_, i) => {
    const a = ((start + (360 / count) * i) * Math.PI) / 180;
    const f = n => Number(n.toFixed(2));
    return `M${f(cx + Math.cos(a) * from)} ${f(cy + Math.sin(a) * from)}L${f(cx + Math.cos(a) * to)} ${f(cy + Math.sin(a) * to)}`;
  }).join('');

export const icons = {
  rower: [circle(5.5, 16, 3.5), circle(18.5, 16, 3.5), 'M5.5 16H11.5L9 8H15.5L11.5 16M15.5 8L18.5 16M9 8L5.5 16', 'M7.6 6h3M14.6 5.6h2.6M15.5 8l-.6-2.4'],
  kolo: [circle(12, 12, 8.2), circle(12, 12, 1.6), spokes(12, 12, 1.6, 8.2, 6, 30)],
  zebatka: [circle(12, 12, 6.2), circle(12, 12, 2.4), spokes(12, 12, 6.2, 9, 8, 0)],
  klucz: ['M15.2 4.2a4.6 4.6 0 0 0-4.3 6.1L4.6 16.6a2 2 0 0 0 2.8 2.8l6.3-6.3a4.6 4.6 0 0 0 6.1-4.3c0-.5-.1-1-.3-1.5l-2.9 2.9-2.2-.5-.5-2.2 2.9-2.9a4.6 4.6 0 0 0-1.6-.4Z'],
  detka: [circle(12, 13, 7.8), circle(12, 13, 3.4), 'M12 5.2V3M10.6 3h2.8'],
  pompka: ['M10.5 7h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z', 'M12 7V3.5M8.5 3.5h7', 'M7 21h10M12 18v3', 'M14.5 13.5c2.4 0 4 1.2 4 3.5v2'],
  lampka: ['M8 8h5.5l2.5 4-2.5 4H8a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z', 'M18.4 8.4l2.3-1M18.8 12h3M18.4 15.6l2.3 1', 'M9.5 16v3.5M7 19.5h5'],
  dzwonek: ['M5.5 16.5a6.5 6.5 0 0 1 13 0Z', 'M4 16.5h16', 'M12 10V7.6M10.8 7.6h2.4', 'M10.4 19.2a1.8 1.8 0 0 0 3.2 0'],
  kask: ['M4.2 15.5a7.8 7.8 0 0 1 15.6 0v1.2H4.2Z', 'M9 8.4v4.4M12 7.6v5.2M15 8.4v4.4', 'M7 16.7v2.4M17 16.7v2.4'],
  zegar: [circle(12, 12, 8), 'M12 7.4V12l3.2 2'],
  adres: ['M12 21c4-4.6 6-7.7 6-10.6a6 6 0 0 0-12 0c0 2.9 2 6 6 10.6Z', circle(12, 10.3, 2.2)],
  telefon: ['M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3Z', 'M10.5 18h3'],
};

const attrs = stroke => `fill="none" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"`;

export const iconSvg = (name, stroke = c.kakao) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${attrs(stroke)} role="img"><title>${name}</title>${icons[name].map(d => `<path d="${d}"/>`).join('')}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${icons[name].map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `<svg xmlns="http://www.w3.org/2000/svg" ${attrs(c.kakao)}>${symbols}</svg>\n`);
};
