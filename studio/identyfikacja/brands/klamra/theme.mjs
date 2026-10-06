import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras } from '../../../../sites/src/identyfikacja/klamra/content.ts';

export const brand = loadBrand('klamra');
export const file = names('klamra');
export const c = brand.colors;
export { content, contact, extras };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const logo = variant => readPub(file.logoSvg(variant));
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;
export const logoImg = (variant, style = '') => `<img src="${dataUri(logo(variant))}" alt="" style="display:block;${style}">`;

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:500 17px/1.5 'Klamra Text',system-ui,sans-serif;color:var(--atrament);background:var(--biel)}
h1,h2,h3,h4,p,ul,ol,dl,dd,figure{margin:0}
h1,h2,h3{font-family:'Klamra Display',system-ui,sans-serif;font-weight:900}
ul,ol{padding:0;list-style:none}
.mono{font-family:'Klamra Mono',monospace;font-weight:700}
`;
