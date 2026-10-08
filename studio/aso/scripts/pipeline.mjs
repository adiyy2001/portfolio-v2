import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { runBoard } from './board.mjs';
import { runExport } from './export.mjs';
import { runFonts } from './fonts.mjs';
import { runManifest } from './manifest.mjs';
import { runRender } from './render.mjs';
import { runSeams } from './seams.mjs';
import { runThumbs } from './thumbs.mjs';
import { runValidate } from './validate.mjs';
import { runWeb } from './web.mjs';
import { runZip } from './zip.mjs';

export const steps = ['fonts', 'render', 'export', 'web', 'zip', 'manifest', 'validate', 'board', 'thumbs', 'seams'];

const runners = {
  fonts: app => runFonts(app),
  render: app => runRender(app),
  export: app => runExport(app),
  web: app => runWeb(app),
  zip: app => runZip(app),
  manifest: app => runManifest(app),
  validate: app => runValidate(app),
  board: app => runBoard(app),
  thumbs: app => runThumbs(app),
  seams: app => (app.strip ? runSeams(app) : console.log('seams: not a panorama, skipped')),
};

export const plan = ({ from, only, skip }) => {
  const list = (value, name) => {
    const items = typeof value === 'string' ? value.split(',').filter(Boolean) : [];
    for (const item of items) if (!steps.includes(item)) throw new Error(`unknown step "${item}" in --${name}; steps: ${steps.join(', ')}`);
    return items;
  };
  const onlyList = list(only, 'only');
  const skipList = list(skip, 'skip');
  if (from !== undefined && !steps.includes(from)) throw new Error(`unknown step "${from}" in --from`);
  const start = from ? steps.indexOf(from) : 0;
  return steps.filter((step, i) => i >= start && (onlyList.length === 0 || onlyList.includes(step)) && !skipList.includes(step));
};

if (import.meta.main) {
  const { slug, flags } = requireSlug();
  const app = loadApp(slug);
  const chosen = plan(flags);
  const started = Date.now();
  try {
    for (const step of chosen) {
      const t = Date.now();
      await runners[step](app);
      console.log(`step ${step} done in ${((Date.now() - t) / 1000).toFixed(1)} s`);
    }
  } catch (error) {
    console.error(`pipeline ${slug} failed: ${error.message}`);
    process.exit(1);
  }
  console.log(`pipeline ${slug}: ${chosen.join(', ')} in ${((Date.now() - started) / 1000).toFixed(1)} s`);
}
