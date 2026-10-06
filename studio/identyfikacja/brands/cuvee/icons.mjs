import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const arcCircle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

export const icons = {
  klucz: [arcCircle(7, 12, 4), 'M11 12h10', 'M17.5 12v3.5', 'M21 12v2.5'],
  lozko: ['M3 5v15', 'M3 15h18v5', 'M3 11h7.5a2.5 2.5 0 0 1 2.5 2.5V15', 'M13 11h8v4'],
  kieliszek: ['M7 3h10v5.5a5 5 0 0 1-10 0Z', 'M12 13.5V20', 'M8 21h8', 'M7 8h10'],
  grono: [arcCircle(8.5, 10, 2.2), arcCircle(13.5, 10, 2.2), arcCircle(11, 14.2, 2.2), arcCircle(16.5, 14.2, 2.2), arcCircle(13.5, 18.2, 2.2), 'M12 3v3.5', 'M12 5h4'],
  butelka: ['M10 3h4v5.5c0 1.8 2.5 2.5 2.5 6V21h-9v-6.5c0-3.5 2.5-4.2 2.5-6Z', 'M7.5 15h9', 'M7.5 18h9'],
  filizanka: ['M4 9h13v4.5A5.5 5.5 0 0 1 11.5 19h-2A5.5 5.5 0 0 1 4 13.5Z', 'M17 10h1.5a2.5 2.5 0 0 1 0 5H17', 'M8 3.5v3', 'M12 3.5v3', 'M3 21.5h15'],
  kapiel: ['M3 12h18v2.5A4.5 4.5 0 0 1 16.5 19h-9A4.5 4.5 0 0 1 3 14.5Z', 'M6 12V6a2 2 0 0 1 4 0', 'M7 19l-1 2.5', 'M17 19l1 2.5'],
  dzwonek: ['M5 17h14', 'M6.5 17a5.5 5.5 0 0 1 11 0', 'M12 8v3.5', 'M10 8h4', 'M4 20h16'],
  parking: ['M4 4h16v16H4Z', 'M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5'],
  schody: ['M3 21h4.5v-4.5H12V12h4.5V7.5H21V3', 'M3 21h18'],
  wzgorze: ['M2 20c4-9 7.5-13 10-13s6 4 10 13', 'M2 20h20', 'M6.5 16.5c3.2-2 7.8-2 11 0', 'M9.5 12.5c1.5-1 3.5-1 5 0'],
  spokoj: ['M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z', 'M15 3.5h4.5L15 8h4.5'],
};

const attrs = stroke => `fill="none" stroke="${stroke}" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="4"`;

export const iconSvg = (name, stroke = c.czern) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${attrs(stroke)} role="img"><title>${name}</title>${icons[name].map(d => `<path d="${d}"/>`).join('')}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${icons[name].map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `${optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" ${attrs(c.czern)}>${symbols}</svg>`)}\n`);
};
