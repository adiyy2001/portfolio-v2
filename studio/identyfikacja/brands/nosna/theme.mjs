import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras } from '../../../../sites/src/identyfikacja/nosna/content.ts';

export const brand = loadBrand('nosna');
export const file = names('nosna');
export const c = brand.colors;
export { content, contact, extras };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const logo = variant => readPub(file.logoSvg(variant));
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;
export const recolor = (svg, map) => Object.entries(map).reduce((acc, [from, to]) => acc.replaceAll(from, to), svg);
export const sized = (svg, style) => svg.replace('<svg ', `<svg style="${style}" `);

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:500 17px/1.55 'Nosna Display',system-ui,sans-serif;color:var(--atrament);background:var(--kosc)}
h1,h2,h3,p{margin:0}
h1,h2,h3{font-family:'Nosna Display',system-ui,sans-serif;font-weight:800;line-height:1.05}
.mono{font-family:'Nosna Mono',ui-monospace,monospace;font-weight:500}
`;

export const scene = (body, { width, height, css = '', background = c.kosc }) =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${background}}${css}</style><body>${body}</body></html>`;
