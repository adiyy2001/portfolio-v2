import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

export const icons = {
  rzut: ['M3 3h18v18H3Z', 'M3 13h7M14 13h7', 'M13 13v8'],
  przekroj: ['M3 21v-4h4v-4h4V9h4V5h6v16Z', 'M15 21l6-6', 'M11 21l6-6'],
  elewacja: ['M3 9h18v12H3Z', 'M3 9l9-6 9 6', 'M6 12h3v3H6Z', 'M15 12h3v3h-3Z', 'M10 21v-5h4v5'],
  wymiar: ['M3 5v14', 'M21 5v14', 'M3 12h18', 'M3 12l3-3', 'M3 12l3 3', 'M21 12l-3-3', 'M21 12l-3 3'],
  siatka: ['M3 3h18v18H3Z', 'M9 3v18', 'M15 3v18', 'M3 9h18', 'M3 15h18'],
  dzialka: ['M4 6l12-3 5 8-4 10H4Z', 'M9 10h6v6H9Z'],
  dom: ['M4 21V11l8-7 8 7v10Z', 'M10 21v-6h4v6'],
  schody: ['M3 21v-4h4v-4h4V9h4V5h6v16Z'],
  okno: ['M4 3h16v18H4Z', 'M12 3v18', 'M4 12h16'],
  drzwi: ['M6 21V3h12v18', 'M3 21h18', 'M14 11v3'],
  adres: ['M12 22 5 12V7l3-4h8l3 4v5Z', 'M10 7h4v4h-4Z'],
  telefon: ['M7 2h10v20H7Z', 'M7 5h10', 'M10 19h4'],
};

const attrs = stroke => `fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"`;

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
