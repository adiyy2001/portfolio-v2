import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { dayOf, grid, primaryLockup, variantFile, variantName } from '../../../../sites/src/identyfikacja/nosna/lib/field.ts';
import { faviconMarkup } from './favicon-art.mjs';
import { lockups, primaryWord } from './logo-parts.mjs';

const brand = loadBrand('nosna');
const file = names('nosna');
const c = brand.colors;
const { pub } = brand.paths;

const color = lockups({ thread: c.piatek, ink: c.atrament });
const mono = lockups({ thread: '#000000', ink: '#000000' });
const negative = lockups({ thread: c.piatek, ink: c.kosc });

const write = (path, set, key, label) => {
  const { viewBox, body } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, title: `Nośna, ${label}` }), { precision: 1 })}\n`);
};

write(file.logoSvg('primary'), color, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), color, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), color, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), color, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const word = primaryWord();
for (const variant of grid) {
  const lock = primaryLockup(variant, { thread: dayOf(variant.day).color, ink: c.atrament }, word);
  writeFile(join(pub, 'logo', variantFile(variant)), `${optimizeSvg(svgDocument({ viewBox: lock.viewBox, body: lock.body, title: `Nośna, ${variantName(variant)}` }), { precision: 1 })}\n`);
}

const favicon = svgDocument({ viewBox: [0, 0, 64, 64], body: faviconMarkup(c.atrament, c.piatek, c.kosc), title: 'Nośna' });
writeFile(join(pub, file.favicon), `${optimizeSvg(favicon, { precision: 1 })}\n`);

writeFile(join(brand.paths.site, 'word-data.json'), `${JSON.stringify(word)}\n`);
console.log('logos written');
