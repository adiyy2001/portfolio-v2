import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireSlug } from '../lib/args.mjs';
import { brandPaths } from '../lib/paths.mjs';

const { slug, flags } = requireSlug(process.argv.slice(2));
const paths = brandPaths(slug);
const here = fileURLToPath(new URL('.', import.meta.url));

const steps = [
  { id: 'fonts', script: join(here, 'fonts.mjs') },
  { id: 'colors', script: join(here, 'colors.mjs') },
  { id: 'logos', script: join(paths.studio, 'build-logos.mjs'), brand: true },
  { id: 'logo-export', script: join(here, 'logo-export.mjs') },
  { id: 'favicon', script: join(here, 'favicon.mjs') },
  { id: 'logo-test', script: join(here, 'logo-test.mjs') },
  { id: 'assets', script: join(paths.studio, 'build-assets.mjs'), brand: true },
  { id: 'animate', script: join(here, 'animate.mjs') },
  { id: 'brandbook', script: join(paths.studio, 'build-brandbook.mjs'), brand: true },
  { id: 'zip', script: join(here, 'zip.mjs') },
  { id: 'manifest', script: join(here, 'manifest.mjs') },
  { id: 'validate', script: join(here, 'validate.mjs') },
];

let selected = steps;
if (flags.only) {
  const only = String(flags.only).split(',');
  selected = steps.filter(step => only.includes(step.id));
}
if (flags.from) {
  const index = steps.findIndex(step => step.id === flags.from);
  selected = selected.filter(step => steps.indexOf(step) >= index);
}
if (flags.skip) {
  const skip = String(flags.skip).split(',');
  selected = selected.filter(step => !skip.includes(step.id));
}

for (const step of selected) {
  if (step.brand && !existsSync(step.script)) {
    console.log(`-- ${step.id}: no ${step.script.split('/').pop()}, skipped`);
    continue;
  }
  const started = Date.now();
  console.log(`-- ${step.id}`);
  const result = spawnSync(process.execPath, [step.script, slug], { stdio: 'inherit' });
  console.log(`-- ${step.id} ${result.status === 0 ? 'ok' : `failed (${result.status})`} in ${((Date.now() - started) / 1000).toFixed(1)} s`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
