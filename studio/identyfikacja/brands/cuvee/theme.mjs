import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrand } from '../../lib/brand.mjs';
import { names } from '../../lib/convention.mjs';
import { pinnedFaceCss } from '../../lib/fonts.mjs';
import { content, contact, extras, grapes, vintages } from '../../../../sites/src/identyfikacja/cuvee/content.ts';
import { lockups } from './logo-parts.mjs';

export const brand = loadBrand('cuvee');
export const file = names('cuvee');
export const c = brand.colors;
export { content, contact, extras, grapes, vintages };

export const fontCss = () => pinnedFaceCss(brand, { mode: 'data' });
export const readPub = path => readFileSync(join(brand.paths.pub, path), 'utf8');
export const dataUri = (svg, type = 'image/svg+xml') => `data:${type};charset=utf-8,${encodeURIComponent(svg)}`;

export const schemes = {
  color: { ink: c.czern, accent: c.mosiadz, small: c.czern },
  negative: { ink: c.kosc, accent: c.mosiadz, small: c.kosc },
  mono: { ink: '#000000', accent: '#000000', small: '#000000' },
  ivoryOnly: { ink: c.kosc, accent: c.kosc, small: c.kosc },
};

export const logoMarkup = (variant, scheme = 'color', style = '') => {
  const set = lockups(schemes[scheme]);
  const { viewBox, body } = set[variant];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}" style="display:block;${style}">${body}</svg>`;
};

export const logoUri = (variant, scheme = 'color') => dataUri(logoMarkup(variant, scheme));

export const baseCss = () => `
${fontCss()}
:root{${brand.palette.map(entry => `--${entry.id}:${entry.hex};`).join('')}}
*{box-sizing:border-box}
body{margin:0;font:400 17px/1.6 'Cuvee Text',Georgia,serif;color:var(--czern);background:var(--kosc);font-feature-settings:'kern','liga','onum'}
h1,h2,h3{font-family:'Cuvee Display',Georgia,serif;font-weight:300;margin:0}
p{margin:0}
.caps{font-family:'Cuvee Display',Georgia,serif;font-weight:400;font-variant-caps:all-small-caps;letter-spacing:.22em;font-feature-settings:'smcp','c2sc','kern'}
`;
