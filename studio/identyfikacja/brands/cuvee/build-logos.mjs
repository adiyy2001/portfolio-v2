import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { faviconMarkup, lockups } from './logo-parts.mjs';

const brand = loadBrand('cuvee');
const file = names('cuvee');
const { pub } = brand.paths;
const c = brand.colors;

const color = lockups({ ink: c.czern, accent: c.mosiadz, small: c.czern });
const mono = lockups({ ink: '#000000', accent: '#000000', small: '#000000' });
const negative = lockups({ ink: c.kosc, accent: c.mosiadz, small: c.kosc });

const write = (path, set, key, label) => {
  const { viewBox, body } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, title: `Cuvée, ${label}` }))}\n`);
};

write(file.logoSvg('primary'), color, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), color, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), color, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), color, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const favicon = svgDocument({ viewBox: [0, 0, 200, 200], body: `<circle cx="100" cy="100" r="96" fill="${c.kosc}"/>${faviconMarkup({ ink: c.czern, accent: c.mosiadz })}`, title: 'Cuvée' });
writeFile(join(pub, file.favicon), `${optimizeSvg(favicon)}\n`);
console.log('logos written');
