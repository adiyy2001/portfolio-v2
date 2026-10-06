import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import subsetFont from 'subset-font';
import { ensureDir, writeFile, bytesOf } from './files.mjs';
import { fontsSrcRoot } from './paths.mjs';

const ranges = [
  [0x20, 0x7e],
  [0xa0, 0x17f],
  [0x2010, 0x2027],
  [0x2030, 0x203a],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2190, 0x2193],
  [0x2212, 0x2212],
  [0x25cf, 0x25cf],
];

export const subsetText = ranges
  .flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)))
  .join('');

export const faceFile = (family, instance) =>
  `${family.replace(/\s+/g, '')}-${instance.weight}${instance.style === 'italic' ? '-italic' : ''}`;

export const sourceFile = font => join(fontsSrcRoot(), font.dir, font.file);

export const buildFonts = async brand => {
  const { pub, out } = brand.paths;
  const siteDir = ensureDir(join(pub, 'fonts'));
  const pinnedDir = ensureDir(join(out, 'fonts-pinned'));
  const built = [];
  const licensed = new Set();
  for (const font of brand.fonts) {
    const src = sourceFile(font);
    if (!existsSync(src)) throw new Error(`font source missing: ${src}; run fonts-check.mjs ${font.dir} or set WZ_FONTS_SRC`);
    const buffer = readFileSync(src);
    for (const instance of font.instances) {
      const axes = instance.axes && Object.keys(instance.axes).length > 0 ? instance.axes : undefined;
      const base = faceFile(font.family, instance);
      const keepFeatures = font.keepFeatures;
      const woff2 = await subsetFont(buffer, subsetText, { targetFormat: 'woff2', variationAxes: axes, keepFeatures });
      const ttf = await subsetFont(buffer, subsetText, { targetFormat: 'sfnt', variationAxes: axes, keepFeatures });
      const woff2Path = writeFile(join(siteDir, `${base}.woff2`), woff2);
      const ttfPath = writeFile(join(pinnedDir, `${base}.ttf`), ttf);
      built.push({
        id: font.id,
        role: font.role,
        family: font.family,
        css: font.css,
        weight: instance.weight,
        style: instance.style ?? 'normal',
        file: `fonts/${base}.woff2`,
        bytes: bytesOf(woff2Path),
        pinned: ttfPath,
      });
    }
    if (!licensed.has(font.dir)) {
      licensed.add(font.dir);
      const license = join(fontsSrcRoot(), font.dir, 'OFL.txt');
      if (!existsSync(license)) throw new Error(`missing ${license}`);
      copyFileSync(license, join(siteDir, `OFL-${font.family.replace(/\s+/g, '')}.txt`));
    }
  }
  return built;
};

export const pinnedFaceCss = (brand, { mode = 'data' } = {}) => {
  const dir = join(brand.paths.out, 'fonts-pinned');
  return brand.fonts
    .flatMap(font =>
      font.instances.map(instance => {
        const path = join(dir, `${faceFile(font.family, instance)}.ttf`);
        if (!existsSync(path)) throw new Error(`pinned font missing: ${basename(path)}; run scripts/fonts.mjs ${brand.slug}`);
        const src = mode === 'data' ? `data:font/ttf;base64,${readFileSync(path).toString('base64')}` : `file://${path}`;
        return `@font-face{font-family:'${font.css}';src:url(${src}) format('truetype');font-weight:${instance.weight};font-style:${instance.style ?? 'normal'}}`;
      }),
    )
    .join('\n');
};

export const fontPathFor = (brand, fontId, weight = 400, style = 'normal') => {
  const font = brand.fonts.find(item => item.id === fontId);
  if (!font) throw new Error(`no font "${fontId}" in brand.json`);
  const instance = font.instances.find(item => item.weight === weight && (item.style ?? 'normal') === style);
  if (!instance) throw new Error(`font ${fontId} has no instance ${weight} ${style}`);
  return join(brand.paths.out, 'fonts-pinned', `${faceFile(font.family, instance)}.ttf`);
};
