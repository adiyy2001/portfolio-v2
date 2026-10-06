import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras } from '../../../../sites/src/identyfikacja/wolnobieg/content.ts';

export const brand = loadBrand('wolnobieg');
export const file = names('wolnobieg');
export const c = brand.colors;
export { content, contact, extras };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const logo = variant => readPub(file.logoSvg(variant));
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;

export const recolor = (svg, map) =>
  Object.entries(map).reduce((acc, [from, to]) => acc.replaceAll(from.toLowerCase(), to), svg);

export const logoIn = (variant, map = {}, style = '') => {
  const svg = recolor(logo(variant), map);
  return svg.replace('<svg ', `<svg style="display:block;${style}" `);
};

export const wearSvg = ({ seed = 4, size = 360, alpha = 0.5 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.25 0 0 0 0 0.14 0 0 0 0 0.07 0 0 0 9 ${-6.3 + (1 - alpha) * -1}"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

export const wear = options => `url("${dataUri(wearSvg(options))}")`;

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:400 18px/1.5 'Wolnobieg Text',system-ui,sans-serif;color:var(--kakao);background:var(--krem)}
h1,h2,h3{font-family:'Wolnobieg Display',Georgia,serif;font-weight:400;margin:0}
p{margin:0}
`;
