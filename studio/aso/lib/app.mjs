import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appPaths, languages } from './paths.mjs';
import { readJson } from './files.mjs';

const required = ['slug', 'name', 'styleId', 'style', 'format', 'themeColor', 'palette', 'fonts', 'category'];

export const loadApp = slug => {
  const paths = appPaths(slug);
  if (!existsSync(paths.appJson)) throw new Error(`missing ${paths.appJson}`);
  const data = readJson(paths.appJson);
  for (const key of required) {
    if (data[key] === undefined) throw new Error(`${paths.appJson}: missing "${key}"`);
  }
  if (data.slug !== slug) throw new Error(`${paths.appJson}: slug "${data.slug}" does not match the folder`);
  if (!['png', 'jpg'].includes(data.format)) throw new Error(`${paths.appJson}: format must be png or jpg`);
  const copy = {};
  for (const lang of languages) {
    const file = join(paths.copyDir, `${lang}.json`);
    if (!existsSync(file)) throw new Error(`missing ${file}`);
    copy[lang] = readJson(file);
  }
  return { ...data, ipad: Boolean(data.ipad), copy, paths };
};
