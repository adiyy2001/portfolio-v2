import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras } from '../../../../sites/src/identyfikacja/rzut/content.ts';

export const brand = loadBrand('rzut');
export const file = names('rzut');
export const c = brand.colors;
export { content, contact, extras };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const logo = variant => readPub(file.logoSvg(variant));
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;

export const tint = (svg, map) =>
  Object.entries(map).reduce((acc, [from, to]) => acc.replaceAll(`fill="${from}"`, `fill="${to}"`), svg);

const original = { square: '#1f4bff', word: '#0a0a0a', label: '#5a5a57' };
export const logoColors = (variant, { square = c.kobalt, word = c.czern, label = c.grafit } = {}) => {
  const svg = logo(variant);
  const map = {
    [original.square]: square.toLowerCase(),
    [original.word]: word.toLowerCase(),
    [original.label]: label.toLowerCase(),
    '#bdbdb9': label.toLowerCase(),
    '#fff': word.toLowerCase(),
  };
  return Object.entries(map).reduce((acc, [from, to]) => acc.replaceAll(`fill="${from}"`, `fill="${to}"`), svg);
};

export const sized = (svg, style) => svg.replace('<svg ', `<svg style="${style}" `);

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:400 17px/1.5 'Rzut Sans',system-ui,sans-serif;color:var(--czern);background:var(--biel);font-feature-settings:'kern'}
h1,h2,h3,p{margin:0}
.cn{font-family:'Rzut Condensed','Rzut Sans',sans-serif;font-variant-numeric:tabular-nums}
.lbl{font:700 1em/1.2 'Rzut Condensed',sans-serif;letter-spacing:.07em;text-transform:uppercase}
`;
