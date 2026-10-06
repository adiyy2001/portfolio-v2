import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { colorTable, contrastTable, loadBrand } from '../lib/brand.mjs';
import { names } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const file = names(slug);

const payload = {
  brand: brand.name,
  note: 'CMYK jest przybliżony, bez profilu druku. Odpowiedników Pantone nie podajemy.',
  palette: palette.map(({ id, name, group, role, hex, rgb, oklchCss, cmykApproxText }) => ({ id, name, group, role, hex, rgb: `${rgb.r} ${rgb.g} ${rgb.b}`, oklch: oklchCss, cmykApprox: cmykApproxText })),
  contrast: contrast.map(({ id, use, fgHex, bgHex, kind, ratio, required, level, pass, note }) => ({ id, use, foreground: fgHex, background: bgHex, kind, ratio, required, level, pass, note })),
};
const tokens = `:root{\n${palette.map(entry => `  --${slug}-${entry.id}: ${entry.hex};`).join('\n')}\n}\n`;

writeFile(join(brand.paths.pub, file.palette), `${JSON.stringify(payload, null, 2)}\n`);
writeFile(join(brand.paths.pub, file.tokens), tokens);
writeFile(join(brand.paths.out, 'colors.json'), JSON.stringify({ palette, contrast }, null, 2));

const failing = contrast.filter(item => !item.pass);
for (const item of contrast) {
  console.log(`${item.pass ? 'ok  ' : 'FAIL'} ${item.id.padEnd(28)} ${item.fgHex} on ${item.bgHex} ${String(item.ratio).padStart(5)}:1 needs ${item.required} ${item.kind}`);
}
if (failing.length > 0) {
  console.error(`${failing.length} contrast pair(s) below the requirement`);
  process.exit(1);
}
