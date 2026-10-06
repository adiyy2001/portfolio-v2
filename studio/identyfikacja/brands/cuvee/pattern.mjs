import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg } from '../../lib/svg.mjs';
import { brand, c, file } from './theme.mjs';

export const tile = 120;

export const patternSvg = ({ line = c.mgla, dot = c.mosiadz } = {}) =>
  optimizeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}"><path fill="none" stroke="${line}" stroke-width="0.8" d="M0 60L60 0M0 120L120 0M60 120L120 60M0 0L120 120M0 60L60 120M60 0L120 60"/><circle cx="60" cy="60" r="2.2" fill="${dot}"/></svg>`,
    { precision: 1 },
  );

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
