import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

export const icons = {
  bilet: ['M3 7h18v3.5a1.5 1.5 0 0 0 0 3V17H3v-3.5a1.5 1.5 0 0 0 0-3Z', 'M15 8.5v1.5M15 11.25v1.5M15 14v1.5'],
  scena: ['M3 17.5h18V21H3Z', 'M12 3v7', 'M12 10l-5 7.5M12 10l5 7.5'],
  glosnik: ['M6 3h12v18H6Z', 'M12 11.5a3.5 3.5 0 1 0 .01 0Z', 'M12 6.6h.01'],
  sluchawki: ['M4 15v-3a8 8 0 0 1 16 0v3', 'M4 14h3.5v6H4Z', 'M16.5 14H20v6h-3.5Z'],
  fala: ['M2 12q2.5-8 5 0t5 0t5 0t5 0'],
  nic: ['M4 4c9 0 4 8 8 8s-1 8 8 8', 'M3 4h2M19 20h2'],
  szpula: ['M5 3h14v3H5Z', 'M5 18h14v3H5Z', 'M8 6h8v12H8Z', 'M8 9.5l8 2M8 13.5l8 2'],
  krosno: ['M3 4h18v16H3Z', 'M8 4v16M12 4v16M16 4v16', 'M3 9h9M12 12h9M3 15h9'],
  projektor: ['M3 8h14v8H3Z', 'M17 10.5l4-2v7l-4-2', 'M8 12a2 2 0 1 0 .01 0Z', 'M6 16v3M14 16v3'],
  pinezka: ['M12 21l-6-9.5a6.5 6.5 0 1 1 12 0Z', 'M12 8.5a2.5 2.5 0 1 0 .01 0Z'],
  zegar: ['M3 3h18v18H3Z', 'M12 7v5.5h4'],
  wejscie: ['M6 21V4h10v17', 'M3 21h18', 'M12.5 12.5h1'],
};

export const iconLabels = { glosnik: 'głośnik', sluchawki: 'słuchawki', wejscie: 'wejście' };

export const iconLabel = name => iconLabels[name] ?? name;

const attrs = 'fill="none" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter"';

export const iconSvg = (name, stroke = c.atrament) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${attrs} stroke="${stroke}" role="img"><title>${name}</title>${icons[name].map(d => `<path d="${d}"/>`).join('')}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${icons[name].map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `${optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" ${attrs} stroke="${c.atrament}">${symbols}</svg>`)}\n`);
};
