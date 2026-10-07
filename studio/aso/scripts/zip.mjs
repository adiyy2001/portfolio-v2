import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { humanBytes } from '../lib/files.mjs';
import { buildZip } from '../lib/zip.mjs';

export const runZip = app => {
  const result = buildZip(app);
  console.log(`zip: ${result.entries} files, ${humanBytes(result.bytes)}`);
  return result;
};

if (import.meta.main) {
  const { slug } = requireSlug();
  runZip(loadApp(slug));
}
