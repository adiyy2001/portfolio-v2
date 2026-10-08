import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import subsetFont from 'subset-font';
import { bytesOf, ensureDir, writeFile } from './files.mjs';
import { fontsSrcRoot } from './paths.mjs';

const ranges = [
  [0x20, 0x7e],
  [0xa0, 0x17f],
  [0x2010, 0x2027],
  [0x2030, 0x203a],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2212, 0x2212],
];

export const subsetText = ranges
  .flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)))
  .join('');

const defaultFeatures = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'tnum', 'lnum', 'pnum', 'case'];

export const faceFile = (family, instance) => {
  const width = instance.axes?.wdth;
  const narrow = width && width !== 100 ? `-w${width}` : '';
  return `${family.replace(/\s+/g, '')}-${instance.weight}${narrow}${instance.style === 'italic' ? '-italic' : ''}`;
};

const axesOf = instance => {
  const axes = { ...(instance.axes ?? {}) };
  if (instance.weight && !('wght' in axes) && instance.variable !== false) axes.wght = instance.weight;
  return axes;
};

export const sourceFile = font => join(fontsSrcRoot(), font.dir, font.file);

export const buildFonts = async app => {
  const siteDir = ensureDir(join(app.paths.pub, 'fonts'));
  const pinnedDir = ensureDir(app.paths.fontsPinned);
  const built = [];
  const licensed = new Set();
  for (const font of app.fonts) {
    const src = sourceFile(font);
    if (!existsSync(src)) throw new Error(`font source missing: ${src}; run scripts/fonts-check.mjs ${app.slug} or set WZ_FONTS_SRC`);
    const buffer = readFileSync(src);
    for (const instance of font.instances) {
      const axes = font.variable === false ? undefined : axesOf(instance);
      const base = faceFile(font.family, instance);
      const keepFeatures = font.keepFeatures ?? defaultFeatures;
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

export const pinnedFaceCss = app =>
  app.fonts
    .flatMap(font =>
      font.instances.map(instance => {
        const path = join(app.paths.fontsPinned, `${faceFile(font.family, instance)}.ttf`);
        if (!existsSync(path)) throw new Error(`pinned font missing: ${basename(path)}; run scripts/fonts.mjs ${app.slug}`);
        return `@font-face{font-family:'${font.css}';src:url(data:font/ttf;base64,${readFileSync(path).toString('base64')}) format('truetype');font-weight:${instance.weight};font-style:${instance.style ?? 'normal'}}`;
      }),
    )
    .join('\n');

export const fontChecks = app =>
  app.fonts.flatMap(font =>
    font.instances.map(instance => `${instance.style === 'italic' ? 'italic ' : ''}${instance.weight} 16px "${font.css}"`),
  );
