import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'node:fs';
import { requireSlug } from '../lib/args.mjs';
import { names } from '../lib/convention.mjs';
import { ensureDir } from '../lib/files.mjs';
import { brandPaths } from '../lib/paths.mjs';

const { slug, positional, flags } = requireSlug(process.argv.slice(2));
const paths = brandPaths(slug);
const target = positional[0] ?? names(slug).brandbook;
const pdf = join(paths.pub, target);
const count = (await PDFDocument.load(readFileSync(pdf))).getPageCount();
const dpi = Number(flags.dpi ?? 48);
let pages;
if (flags.pages === 'all') pages = Array.from({ length: count }, (_, i) => i + 1);
else if (flags.pages) pages = String(flags.pages).split(',').map(Number);
else {
  const pool = Array.from({ length: count }, (_, i) => i + 1);
  pages = [];
  const wanted = Number(flags.random ?? 3);
  while (pages.length < Math.min(wanted, count)) {
    const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    pages.push(pick);
  }
  pages.sort((a, b) => a - b);
}
const dir = ensureDir(join(paths.out, 'pdf-preview'));
const stem = target.replace(/[/.]/g, '-');
for (const page of pages) {
  execFileSync('pdftoppm', ['-r', String(dpi), '-f', String(page), '-l', String(page), '-png', '-singlefile', pdf, join(dir, `${stem}-${String(page).padStart(2, '0')}`)]);
  console.log(join(dir, `${stem}-${String(page).padStart(2, '0')}.png`));
}
console.log(`${count} pages in ${target}`);
