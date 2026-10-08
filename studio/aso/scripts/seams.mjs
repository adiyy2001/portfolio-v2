import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { columnDiff, columnStats } from '../lib/boards.mjs';
import { expectedFiles } from '../lib/convention.mjs';
import { cleanDir, writeFile } from '../lib/files.mjs';

const band = 64;
const zoom = 4;
const tile = 600;

const pairsFor = app => {
  const files = expectedFiles(app);
  const pairs = [];
  for (const store of ['appstore', 'play']) {
    for (const lang of ['pl', 'en']) {
      const set = files.filter(item => item.group === store && item.lang === lang);
      for (let i = 0; i < set.length - 1; i += 1) pairs.push({ id: `${store}-${lang}-${set[i].slot}-${set[i + 1].slot}`, left: set[i], right: set[i + 1] });
      const b = files.find(item => item.group === 'variantB' && item.store === store && item.lang === lang);
      pairs.push({ id: `${store}-${lang}-01b-02`, left: b, right: set[1] });
    }
  }
  return pairs;
};

export const runSeams = async (app, { crops = true } = {}) => {
  const dir = cleanDir(app.paths.seams);
  const report = [];
  let failed = 0;
  for (const pair of pairsFor(app)) {
    const left = readFileSync(join(app.paths.exportDir, pair.left.path));
    const right = readFileSync(join(app.paths.exportDir, pair.right.path));
    const { width, height } = await sharp(left).metadata();
    const edgeL = await columnStats(left, width - 1);
    const innerL = await columnStats(left, width - 2);
    const edgeR = await columnStats(right, 0);
    const innerR = await columnStats(right, 1);
    const across = columnDiff(edgeL, edgeR);
    const baseline = (columnDiff(innerL, edgeL) + columnDiff(edgeR, innerR)) / 2;
    const ok = across <= baseline * 2.5 + 1.5;
    if (!ok) failed += 1;
    report.push({ id: pair.id, across: Number(across.toFixed(3)), baseline: Number(baseline.toFixed(3)), ok });
    if (crops) {
      const joined = await sharp({ create: { width: band * 2, height, channels: 3, background: '#000' } })
        .composite([
          { input: await sharp(left).extract({ left: width - band, top: 0, width: band, height }).toBuffer(), left: 0, top: 0 },
          { input: await sharp(right).extract({ left: 0, top: 0, width: band, height }).toBuffer(), left: band, top: 0 },
        ])
        .png()
        .toBuffer();
      const big = await sharp(joined).resize({ width: band * 2 * zoom, height: height * zoom, kernel: 'nearest' }).png().toBuffer();
      const tall = height * zoom;
      const pieces = [];
      for (let top = 0; top < tall; top += tile * zoom) {
        const h = Math.min(tile * zoom, tall - top);
        pieces.push(await sharp(big).extract({ left: 0, top, width: band * 2 * zoom, height: h }).png().toBuffer());
      }
      const gap = 24;
      const sheetWidth = pieces.length * band * 2 * zoom + (pieces.length - 1) * gap;
      const sheet = await sharp({ create: { width: sheetWidth, height: tile * zoom, channels: 3, background: '#ff00ff' } })
        .composite(pieces.map((input, i) => ({ input, left: i * (band * 2 * zoom + gap), top: 0 })))
        .png({ compressionLevel: 9 })
        .toBuffer();
      writeFile(join(dir, `${pair.id}.png`), sheet);
    }
  }
  writeFile(join(dir, 'report.json'), JSON.stringify(report, null, 2));
  for (const item of report) console.log(`seam ${item.id}: across ${item.across}, baseline ${item.baseline}${item.ok ? '' : '  BROKEN'}`);
  if (failed > 0) throw new Error(`${failed} seams do not match`);
  return report;
};

if (import.meta.main) {
  const { slug, flags } = requireSlug();
  try {
    await runSeams(loadApp(slug), { crops: !flags['no-crops'] });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
