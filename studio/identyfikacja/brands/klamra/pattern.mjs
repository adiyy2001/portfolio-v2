import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

export const tile = 160;

const shadowed = (shape, shadowShape) => `${shadowShape}${shape}`;

export const patternBody = ({ ink = c.atrament, lemon = c.cytryna, pink = c.roz, mint = c.mieta, sky = c.niebo } = {}) => {
  const stroke = `stroke="${ink}" stroke-width="4" stroke-linejoin="miter"`;
  const square = shadowed(
    `<rect x="14" y="14" width="46" height="46" fill="${lemon}" ${stroke}/>`,
    `<rect x="21" y="21" width="46" height="46" fill="${ink}"/>`,
  );
  const circle = shadowed(
    `<circle cx="118" cy="40" r="23" fill="${pink}" ${stroke}/>`,
    `<circle cx="125" cy="47" r="23" fill="${ink}"/>`,
  );
  const triangle = shadowed(
    `<polygon points="14,142 60,142 37,100" fill="${mint}" ${stroke}/>`,
    `<polygon points="21,149 67,149 44,107" fill="${ink}"/>`,
  );
  const plusPoints = '98,102 110,102 110,90 126,90 126,102 138,102 138,118 126,118 126,130 110,130 110,118 98,118';
  const plus = shadowed(
    `<polygon points="${plusPoints}" fill="${sky}" ${stroke}/>`,
    `<polygon points="${plusPoints}" transform="translate(7 7)" fill="${ink}"/>`,
  );
  return `${square}${circle}${triangle}${plus}`;
};

export const patternSvg = options =>
  optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}">${patternBody(options)}</svg>`, { precision: 1 });

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
