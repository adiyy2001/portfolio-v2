import { listFlag, requireSlug } from '../lib/args.mjs';
import { prepareFonts } from './fonts.mjs';
import { render } from './render.mjs';
import { encode } from './encode.mjs';
import { sheets } from './sheets.mjs';
import { validate } from './validate.mjs';
import { manifest } from './manifest.mjs';

const steps = ['fonts', 'render', 'encode', 'sheets', 'validate', 'manifest'];
const { slug, flags } = requireSlug();
const wanted = listFlag(flags.only, steps);
const started = Date.now();

if (wanted.includes('fonts')) await prepareFonts(slug);
if (wanted.includes('render')) await render(slug, { concurrency: Number(flags.concurrency ?? 3) });
if (wanted.includes('encode')) await encode(slug);
if (wanted.includes('sheets')) console.log((await sheets(slug)).join('\n'));
let pass = true;
if (wanted.includes('validate')) {
  const report = await validate(slug);
  for (const c of report.checks.filter(item => !item.pass)) console.log(`FAIL ${c.name}: ${c.detail}`);
  pass = report.pass;
}
if (wanted.includes('manifest')) await manifest(slug);
console.log(`${slug}: ${pass ? 'pipeline passed' : 'pipeline finished with failed checks'} in ${Math.round((Date.now() - started) / 1000)} s`);
process.exit(pass ? 0 : 1);
