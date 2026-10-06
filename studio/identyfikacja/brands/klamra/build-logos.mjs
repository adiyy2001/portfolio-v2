import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { appIconParts, colorSets, faviconParts, lockups } from './logo-parts.mjs';

const brand = loadBrand('klamra');
const file = names('klamra');
const { pub } = brand.paths;
const c = brand.colors;
const sets = colorSets(c);

const colorSet = lockups(sets.color, c.atrament);
const mono = lockups(sets.mono, '#000000');
const negative = lockups(sets.negative, c.biel);

const write = (path, set, key, label) => {
  const { viewBox, body } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, title: `Klamra, ${label}` }))}\n`);
};

write(file.logoSvg('primary'), colorSet, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), colorSet, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), colorSet, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), colorSet, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const favicon = faviconParts(sets.color);
writeFile(join(pub, file.favicon), `${optimizeSvg(svgDocument({ viewBox: favicon.viewBox, body: favicon.body, title: 'Klamra' }))}\n`);
const appIcon = appIconParts(sets.color);
writeFile(join(brand.paths.src, 'app-icon.svg'), `${optimizeSvg(svgDocument({ viewBox: appIcon.viewBox, body: appIcon.body, title: 'Klamra' }))}\n`);
console.log('logos written');
