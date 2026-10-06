import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { writeFile } from '../lib/files.mjs';
import { buildFonts } from '../lib/fonts.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const built = await buildFonts(brand);
writeFile(join(brand.paths.out, 'fonts.json'), JSON.stringify(built.map(entry => Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'pinned'))), null, 2));
for (const face of built) console.log(`${face.family} ${face.weight} ${face.style}: ${face.file} ${face.bytes} B`);
