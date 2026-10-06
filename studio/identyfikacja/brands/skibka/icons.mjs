import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

export const icons = {
  chleb: ['M3.4 14.6c0-3.7 3.7-6.6 8.6-6.6s8.6 2.9 8.6 6.6c0 1.6-1 2.6-2.5 2.6H5.9c-1.5 0-2.5-1-2.5-2.6Z', 'M9 10.6l1.5 3.1M12.4 10l1.6 3.4M15.8 10.8l1.2 2.4'],
  kromka: ['M6.3 19.5V11C4.3 10.4 3.6 8.9 4.2 7.2 4.9 5.2 7.2 4.2 9.6 4.2h4.8c2.4 0 4.7 1 5.4 3 .6 1.7-.1 3.2-2.1 3.8v8.5Z', 'M9.5 14.2h5'],
  zakwas: ['M8.2 4.6h7.6', 'M9.2 4.6v2.7C7.5 8.2 6.6 9.6 6.6 11.3v7c0 1 .8 1.8 1.8 1.8h7.2c1 0 1.8-.8 1.8-1.8v-7c0-1.7-.9-3.1-2.6-4V4.6', 'M10 14.2h.01M13.6 16.2h.01M12.2 12h.01'],
  maka: ['M8.1 5.8 5.9 9.7C5.3 10.8 5 12 5 13.2v4.8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.8c0-1.2-.3-2.4-.9-3.5l-2.2-3.9', 'M8.3 5.9l.7-1.8h6l.7 1.8c-1.2.8-2.4 1.2-3.7 1.2s-2.5-.4-3.7-1.2Z', 'M9 13.6c1 .8 2 .8 3 0s2-.8 3 0'],
  piec: ['M4.5 20v-8.4a7.5 7.5 0 0 1 15 0V20', 'M3 20h18', 'M8.6 20v-3.6a3.4 3.4 0 0 1 6.8 0V20'],
  zegar: ['M12 4.2a7.8 7.8 0 1 0 .01 0Z', 'M12 8v4.4l3 1.8'],
  torba: ['M6.4 8h11.2l.9 11.5c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5Z', 'M6.4 8l1.3-3.2h8.6L17.6 8', 'M12 12.4a2.4 2.4 0 1 0 .01 0Z'],
  koszyk: ['M3.5 10h17l-1.6 9H5.1Z', 'M8 10l3-5.6M16 10l-3-5.6', 'M9 13v3.6M12 13v3.6M15 13v3.6'],
  noz: ['M20 4.2c-6 .5-11 4.5-15 10.8l4 4c6.4-4 10.4-9 11-14.8Z', 'M5 15l-1.4 5.4L9 19', 'M7.2 16.6l1 .4M9.2 14.6l1 .5M11.4 12.4l1 .5'],
  ziarno: ['M12 3.6c3.6 3.2 5 6.3 5 9.2 0 3.3-2.2 5.3-5 5.3s-5-2-5-5.3c0-2.9 1.4-6 5-9.2Z', 'M12 8.4v9.4'],
  adres: ['M12 21c4-4.5 6-7.7 6-10.5a6 6 0 1 0-12 0c0 2.8 2 6 6 10.5Z', 'M12 8.6a2 2 0 1 0 .01 0Z'],
  telefon: ['M6.6 4h2.9l1.5 3.9-1.9 1.4a10 10 0 0 0 5.6 5.6l1.4-1.9 3.9 1.5v2.9c0 1-.8 1.9-1.9 1.9C11.5 19.3 4.7 12.5 4.7 5.9 4.7 4.8 5.6 4 6.6 4Z'],
};

export const iconSvg = (name, stroke = c.zyto) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" role="img"><title>${name}</title>${icons[name].map(d => `<path d="${d}"/>`).join('')}</svg>`;

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${icons[name].map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `${optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${c.zyto}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${symbols}</svg>`)}\n`);
};
