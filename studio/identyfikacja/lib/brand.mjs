import { existsSync, readFileSync } from 'node:fs';
import { brandPaths } from './paths.mjs';
import { describeColor, evaluatePair, kinds } from './color.mjs';

const required = ['slug', 'name', 'styleId', 'style', 'trade', 'city', 'themeColor', 'palette', 'fonts', 'contrast'];

export const loadBrand = slug => {
  const paths = brandPaths(slug);
  if (!existsSync(paths.brandJson)) throw new Error(`missing ${paths.brandJson}`);
  const data = JSON.parse(readFileSync(paths.brandJson, 'utf8'));
  for (const key of required) {
    if (data[key] === undefined) throw new Error(`${paths.brandJson}: missing "${key}"`);
  }
  if (data.slug !== slug) throw new Error(`${paths.brandJson}: slug "${data.slug}" does not match the folder`);
  const colors = Object.fromEntries(data.palette.map(entry => [entry.id, entry.hex]));
  if (Object.keys(colors).length !== data.palette.length) throw new Error(`${paths.brandJson}: duplicate colour ids`);
  const groups = new Set(data.palette.map(entry => entry.group));
  for (const group of ['primary', 'accent', 'neutral']) {
    if (!groups.has(group)) throw new Error(`${paths.brandJson}: palette has no "${group}" group`);
  }
  const neutrals = data.palette.filter(entry => entry.group === 'neutral').length;
  if (neutrals < 5 || neutrals > 9) throw new Error(`${paths.brandJson}: neutral scale must have 5 to 9 steps, has ${neutrals}`);
  for (const pair of data.contrast) {
    if (!kinds.includes(pair.kind)) throw new Error(`${paths.brandJson}: contrast pair ${pair.id} has kind "${pair.kind}"`);
  }
  return { ...data, colors, paths };
};

export const colorTable = brand =>
  brand.palette.map(entry => ({ ...entry, ...describeColor(entry.hex) }));

export const contrastTable = brand => brand.contrast.map(pair => evaluatePair(pair, brand.colors));
