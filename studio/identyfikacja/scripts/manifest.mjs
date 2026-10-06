import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { writeFile } from '../lib/files.mjs';
import { buildManifest, readJson } from '../lib/manifest.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const colors = readJson(join(brand.paths.out, 'colors.json'));
const fonts = readJson(join(brand.paths.out, 'fonts.json'));
const manifest = await buildManifest(brand, {
  colors: colors && {
    palette: colors.palette.map(({ id, name, group, role, hex, rgb, oklchCss, cmykApproxText }) => ({ id, name, group, role, hex, rgb: `${rgb.r} ${rgb.g} ${rgb.b}`, oklch: oklchCss, cmykApprox: cmykApproxText })),
    contrast: colors.contrast.map(({ id, use, fgHex, bgHex, kind, ratio, required, level, pass, note }) => ({ id, use, foreground: fgHex, background: bgHex, kind, ratio, required, level, pass, note })),
  },
  fonts,
});
writeFile(join(brand.paths.pub, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest.json: ${manifest.files.length} files, ${manifest.totalHuman}`);
