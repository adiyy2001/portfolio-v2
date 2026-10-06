import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, svgDocument } from '../../lib/svg.mjs';
import { cap, defsMarkup, gap, lockups } from './logo-parts.mjs';

const brand = loadBrand('rzut');
const file = names('rzut');
const { pub } = brand.paths;
const c = brand.colors;

const color = lockups({ square: c.kobalt, word: c.czern, label: c.grafit });
const mono = lockups({ square: '#000000', word: '#000000', label: '#000000' });
const negative = lockups({ square: c.kobalt, word: c.biel, label: c.szary });

const write = (path, set, key, label) => {
  const { viewBox, body, defs } = set[key];
  writeFile(join(pub, path), `${optimizeSvg(svgDocument({ viewBox, body, defs, title: `Rzut, ${label}` }))}\n`);
};

write(file.logoSvg('primary'), color, 'primary', 'wersja główna');
write(file.logoSvg('symbol'), color, 'symbol', 'sygnet');
write(file.logoSvg('horizontal'), color, 'horizontal', 'wersja pozioma');
write(file.logoSvg('vertical'), color, 'vertical', 'wersja pionowa');
write(file.logoSvg('mono-black'), mono, 'primary', 'wersja czarna');
write(file.logoSvg('negative'), negative, 'primary', 'negatyw');

const favicon = svgDocument({ viewBox: [0, 0, cap, cap], body: color.symbol.body, title: 'Rzut' });
writeFile(join(pub, file.favicon), `${optimizeSvg(favicon)}\n`);
console.log('logos written');

const { word, caption, defs } = color.parts;
const motion = {
  square: color.symbol.body.match(/d="([^"]+)"/)[1],
  letters: word.parts,
  defs: defsMarkup(defs),
  captionLines: caption.lines,
  captionFill: c.grafit,
  cap,
  gap,
};
writeFile(join(brand.paths.site, 'motion-data.json'), `${JSON.stringify(motion)}\n`);
