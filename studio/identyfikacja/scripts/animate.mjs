import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { animationSize, names } from '../lib/convention.mjs';
import { bytesOf, ensureDir } from '../lib/files.mjs';
import { launch } from '../lib/browser.mjs';

const { slug, flags } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const file = names(slug);
const source = join(brand.paths.src, 'animation.html');
if (!existsSync(source)) {
  console.error(`missing ${source}: it must define window.__duration (ms) and window.__seek(ms)`);
  process.exit(1);
}
const fps = Number(flags.fps ?? 30);
const framesDir = join(brand.paths.out, 'frames');
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const browser = await launch();
let frameCount = 0;
try {
  const context = await browser.newContext({ viewport: { width: animationSize, height: animationSize }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`file://${source}`);
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.__duration);
  if (!(duration >= 2000 && duration <= 4000)) throw new Error(`window.__duration is ${duration}, expected 2000 to 4000`);
  frameCount = Math.round((duration / 1000) * fps) + 1;
  for (let i = 0; i < frameCount; i += 1) {
    const t = Math.min(duration, (i * 1000) / fps);
    await page.evaluate(ms => window.__seek(ms), t);
    await page.screenshot({ path: join(framesDir, `f${String(i).padStart(4, '0')}.png`), clip: { x: 0, y: 0, width: animationSize, height: animationSize } });
  }
  await context.close();
} finally {
  await browser.close();
}

const outDir = ensureDir(join(brand.paths.pub, 'animation'));
const mp4 = join(brand.paths.pub, file.mp4);
const webm = join(brand.paths.pub, file.webm);
const input = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(framesDir, 'f%04d.png')];
const limit = 1.5 * 1024 * 1024;

let crf = 22;
for (; crf <= 36; crf += 2) {
  execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', String(crf), '-preset', 'slow', '-movflags', '+faststart', '-an', mp4]);
  if (bytesOf(mp4) < limit) break;
}
let vp9 = 30;
for (; vp9 <= 46; vp9 += 3) {
  execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '0', '-crf', String(vp9), '-row-mt', '1', '-an', webm]);
  if (bytesOf(webm) < limit) break;
}
rmSync(framesDir, { recursive: true, force: true });
console.log(`${frameCount} frames at ${fps} fps, mp4 crf ${crf} ${bytesOf(mp4)} B, webm crf ${vp9} ${bytesOf(webm)} B (${outDir})`);
