import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { colorSets, faviconMarkup, lockups } from './logo-parts.mjs';

const brand = loadBrand('wolnobieg');
const file = names('wolnobieg');
const { pub } = brand.paths;
const sets = colorSets(brand.colors);
const color = lockups(sets.color);
const mono = lockups(sets.mono);
const negative = lockups(sets.negative);

const write = (path, set, key, label) => {
  const { viewBox, body } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, title: `Wolnobieg, ${label}` }), { precision: 1 })}\n`);
};

write(file.logoSvg('primary'), color, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), color, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), color, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), color, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const favicon = svgDocument({ viewBox: [0, 0, 400, 400], body: faviconMarkup(sets.color), title: 'Wolnobieg' });
writeFile(join(pub, file.favicon), `${optimizeSvg(favicon, { precision: 1 })}\n`);
console.log('logos written');
