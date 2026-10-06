import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { zipSync, strToU8 } from 'fflate';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { groupOf, groups, names, zipExcludes } from '../lib/convention.mjs';
import { bytesOf, rel, walk, writeFile } from '../lib/files.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const { pub } = brand.paths;
const file = names(slug);
const root = `${slug}-identyfikacja`;
const include = walk(pub)
  .map(path => rel(pub, path))
  .filter(path => !zipExcludes(path));

const readme = [
  `${brand.name}: identyfikacja wizualna`,
  '',
  `Projekt przykładowy. ${brand.name} to zmyślona firma. Projekt i wykonanie: Adrian Turbiński.`,
  '',
  'Zawartość paczki:',
  ...groups
    .map(group => {
      const members = include.filter(path => groupOf(path) === group.id);
      return members.length === 0 ? null : `  ${group.title}: ${members.length} plików (${[...new Set(members.map(path => path.split('.').pop().toUpperCase()))].join(', ')})`;
    })
    .filter(Boolean),
  '',
  'Logo ma sześć wersji: główną, sygnet, poziomą, pionową, monochromatyczną czarną i negatyw.',
  'Pliki SVG i PDF są wektorowe, pliki PNG mają przezroczyste tło.',
  'Kroje są na licencji SIL OFL, jej tekst leży obok plików krojów.',
  'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk.',
  '',
].join('\n');

const entries = { [`${root}/README.txt`]: [strToU8(readme), { mtime: new Date('2026-01-01T00:00:00Z') }] };
for (const path of include) entries[`${root}/${path}`] = [new Uint8Array(readFileSync(join(pub, path))), { mtime: new Date('2026-01-01T00:00:00Z'), level: path.endsWith('.pdf') || path.endsWith('.png') ? 1 : 9 }];
const out = join(pub, file.zip);
writeFile(out, Buffer.from(zipSync(entries)));
console.log(`${file.zip}: ${Object.keys(entries).length} entries, ${bytesOf(out)} B`);
