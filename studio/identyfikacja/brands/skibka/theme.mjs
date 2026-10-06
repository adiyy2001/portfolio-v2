import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras } from '../../../../sites/src/identyfikacja/skibka/content.ts';

export const brand = loadBrand('skibka');
export const file = names('skibka');
export const c = brand.colors;
export { content, contact, extras };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const logo = variant => readPub(file.logoSvg(variant));
export const fit = (svg, style) => svg.replace('<svg ', `<svg style="${style}" `);
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;

export const grainSvg = ({ alpha = 0.5, frequency = 0.9, seed = 4, rgb = [0.23, 0.19, 0.16], size = 320 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} 1.6 0 0 0 ${-1.6 * (1 - alpha) + 0.1}"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

export const grain = options => `url("${dataUri(grainSvg(options))}")`;

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:400 17px/1.55 'Skibka Text',system-ui,sans-serif;color:var(--zyto);background:var(--maka)}
h1,h2,h3{font-family:'Skibka Display',Georgia,serif;font-weight:400;margin:0}
p{margin:0}
`;
