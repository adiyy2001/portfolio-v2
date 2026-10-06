import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { canonicalSeed, faviconMarkup, lockups, stampParts } from './logo-parts.mjs';

const brand = loadBrand('skibka');
const file = names('skibka');
const { pub } = brand.paths;
const c = brand.colors;
const parts = stampParts(canonicalSeed);

const colorSet = lockups({ ink: c.skorka, wordInk: c.zyto, loafInk: c.skorka }, parts);
const mono = lockups({ ink: '#000000', wordInk: '#000000', loafInk: '#000000' }, parts);
const negative = lockups({ ink: c.maka, wordInk: c.maka, loafInk: c.maka }, parts);

const title = variant => `Skibka, ${variant}`;
const write = (path, set, key, label) => {
  const { viewBox, body } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, title: title(label) }))}\n`);
};

write(file.logoSvg('primary'), colorSet, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), colorSet, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), colorSet, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), colorSet, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const favicon = svgDocument({ viewBox: [0, 0, 400, 400], body: faviconMarkup(c.skorka, c.skorka), title: 'Skibka' });
writeFile(join(pub, file.favicon), `${optimizeSvg(favicon)}\n`);

const staticData = {
  loaf: { body: parts.loaf.body, cuts: parts.loaf.cuts, dots: parts.loaf.dots },
  ring: { d: parts.ring.d },
};
writeFile(join(brand.paths.site, 'stamp-data.json'), `${JSON.stringify(staticData, null, 2)}\n`);
console.log('logos written');
