import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { walk } from '../lib/files.mjs';
import { changedFiles, checkFile, isGuarded } from '../lib/guard.mjs';
import { appPaths, asoRoot, sitesRoot } from '../lib/paths.mjs';

const { positional, flags } = parseArgs();
let files = [];
if (flags.app) {
  const paths = appPaths(flags.app);
  for (const dir of [paths.studio, paths.site, paths.page, paths.pub]) files.push(...walk(dir, isGuarded));
} else if (flags.all) {
  for (const dir of [join(asoRoot, 'lib'), join(asoRoot, 'kit'), join(asoRoot, 'scripts'), join(asoRoot, 'apps'), join(sitesRoot, 'src', 'aso'), join(sitesRoot, 'src', 'pages', 'aso'), join(sitesRoot, 'public', 'aso')]) files.push(...walk(dir, isGuarded));
  files.push(...[join(asoRoot, 'PLAN.md'), join(asoRoot, 'NOTES.md'), join(asoRoot, 'RUN.md')].filter(existsSync));
} else if (positional.length > 0) {
  for (const item of positional) {
    const full = resolve(item);
    if (!existsSync(full)) continue;
    files.push(...(statSync(full).isDirectory() ? walk(full, isGuarded) : isGuarded(full) ? [full] : []));
  }
} else files = changedFiles();

let failures = 0;
for (const file of files) {
  for (const hit of checkFile(file)) {
    failures += 1;
    console.error(`${file}:${hit.line} ${hit.kind}: ${hit.text}`);
  }
}
console.log(`guard: ${files.length} files, ${failures} problems`);
process.exit(failures > 0 ? 1 : 0);
