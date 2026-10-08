import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { writeFile } from '../lib/files.mjs';
import { buildFonts } from '../lib/fonts.mjs';
import { fetchFamily } from '../lib/fontsrc.mjs';

export const runFonts = async app => {
  for (const font of app.fonts) await fetchFamily(font.dir, [font.file]);
  const built = await buildFonts(app);
  writeFile(join(app.paths.out, 'fonts.json'), JSON.stringify(built, null, 2));
  console.log(`fonts: ${built.length} faces for ${app.slug}`);
  return built;
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runFonts(loadApp(slug));
}
