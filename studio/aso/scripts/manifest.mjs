import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { readJson } from '../lib/files.mjs';
import { buildManifest } from '../lib/manifest.mjs';

export const runManifest = async app => {
  const fontsFile = join(app.paths.out, 'fonts.json');
  const fonts = existsSync(fontsFile) ? readJson(fontsFile) : [];
  const manifest = await buildManifest(app, fonts);
  console.log(`manifest: ${manifest.files.length} files, ${manifest.totalHuman}`);
  return manifest;
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runManifest(loadApp(slug));
}
