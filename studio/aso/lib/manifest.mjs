import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import sharp from 'sharp';
import { expectedFiles, groupMeta, groupOrder } from './convention.mjs';
import { bytesOf, humanBytes, walk, writeFile, rel } from './files.mjs';
import { sitesRoot } from './paths.mjs';

const formatsOf = files => {
  const types = [...new Set(files.map(file => file.type.toUpperCase().replace('JPG', 'JPEG')))];
  return types.join(', ');
};

const prettify = async text => {
  const prettier = createRequire(join(sitesRoot, 'package.json'))('prettier');
  const config = (await prettier.resolveConfig(join(sitesRoot, 'public', 'manifest.json'))) ?? {};
  return prettier.format(text, { ...config, plugins: [], overrides: [], parser: 'json' });
};

export const buildManifest = async (app, fontsBuilt = []) => {
  const files = [];
  for (const item of expectedFiles(app)) {
    const full = join(app.paths.exportDir, item.path);
    if (!existsSync(full)) throw new Error(`manifest: ${item.path} is missing, run export first`);
    const entry = { path: item.path, bytes: bytesOf(full), type: item.type, group: item.group };
    if (item.store) entry.store = item.store;
    if (item.lang) entry.lang = item.lang;
    if (item.slot) entry.slot = item.slot;
    if (item.variant) entry.variant = item.variant;
    if (item.width) {
      entry.width = item.width;
      entry.height = item.height;
    }
    files.push(entry);
  }
  const groups = groupOrder
    .map(id => {
      const members = files.filter(file => file.group === id);
      if (members.length === 0) return null;
      return {
        id,
        title: groupMeta[id].title,
        count: members.length,
        bytes: members.reduce((sum, file) => sum + file.bytes, 0),
        formats: formatsOf(members),
        files: members.map(file => file.path),
      };
    })
    .filter(Boolean);
  const webDir = join(app.paths.pub, 'web');
  const web = [];
  for (const full of walk(webDir)) {
    const meta = await sharp(readFileSync(full)).metadata();
    web.push({ path: rel(app.paths.pub, full), bytes: bytesOf(full), width: meta.width, height: meta.height });
  }
  const zipPath = join(app.paths.pub, `${app.slug}-aso.zip`);
  const zip = existsSync(zipPath) ? { path: `${app.slug}-aso.zip`, bytes: bytesOf(zipPath) } : null;
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  const manifest = {
    app: {
      slug: app.slug,
      name: app.name,
      style: app.style,
      styleId: app.styleId,
      category: app.category,
      format: app.format,
      ipad: app.ipad,
    },
    base: `/wzornik/aso/${app.slug}/`,
    totalBytes,
    totalHuman: humanBytes(totalBytes),
    zip,
    groups,
    files,
    web,
    fonts: fontsBuilt.map(({ pinned, ...rest }) => rest),
    palette: app.palette,
  };
  const text = await prettify(JSON.stringify(manifest));
  writeFile(join(app.paths.pub, 'manifest.json'), text);
  return manifest;
};
