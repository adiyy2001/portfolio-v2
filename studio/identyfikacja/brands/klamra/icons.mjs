import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

export const icons = {
  kod: ['M10 4H6v6l-3 2 3 2v6h4', 'M14 4h4v6l3 2-3 2v6h-4'],
  terminal: ['M3 4h18v16H3Z', 'M7 9l4 3-4 3', 'M13 15h4'],
  commit: ['M12 8a4 4 0 1 0 .01 0Z', 'M2 12h6', 'M16 12h6'],
  galaz: ['M6 6v12', 'M18 10v2l-6 4H6', 'M6 3.5a2.5 2.5 0 1 0 .01 0Z', 'M6 18.5a2.5 2.5 0 1 0 .01 0Z', 'M18 7.5a2.5 2.5 0 1 0 .01 0Z'],
  blad: ['M9 8h6v9a3 3 0 0 1-6 0Z', 'M10 8V5h4v3', 'M4 10h5', 'M15 10h5', 'M4 15h5', 'M15 15h5'],
  laptop: ['M5 5h14v10H5Z', 'M2 19h20'],
  mentor: ['M3 4h18v12h-9l-5 4v-4H3Z', 'M7 8h10', 'M7 12h6'],
  grupa: ['M8 5.5a2.5 2.5 0 1 0 .01 0Z', 'M3 20v-4h10v4', 'M17 8a2 2 0 1 0 .01 0Z', 'M15 14h6v6'],
  kalendarz: ['M3 5h18v16H3Z', 'M3 10h18', 'M8 3v4', 'M16 3v4', 'M7 14h2', 'M11 14h2', 'M15 14h2', 'M7 17.5h2'],
  projekt: ['M3 4h18v16H3Z', 'M3 9h18', 'M7 13h6', 'M7 16.5h10'],
  certyfikat: ['M3 4h18v12H3Z', 'M7 8h10', 'M7 12h6', 'M14 16l-1 5 3-2 3 2-1-5'],
  kontakt: ['M3 5h18v14H3Z', 'M3 5l9 8 9-8'],
};

const strokeAttrs = 'fill="none" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"';

export const iconSvg = (name, stroke = c.atrament) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${strokeAttrs} stroke="${stroke}" role="img"><title>${name}</title>${icons[name].map(d => `<path d="${d}"/>`).join('')}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${icons[name].map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `${optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" ${strokeAttrs} stroke="${c.atrament}">${symbols}</svg>`)}\n`);
};
