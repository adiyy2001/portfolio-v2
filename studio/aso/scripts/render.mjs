import { join } from 'node:path';
import sharp from 'sharp';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { launch, renderHtml } from '../lib/browser.mjs';
import { docFor, frameName, loadCompose, validateJob } from '../lib/compose.mjs';
import { cleanDir, ensureDir, writeFile } from '../lib/files.mjs';
import { fontChecks } from '../lib/fonts.mjs';

export const seamMargin = 24;

const sliceFrames = async (buffer, job) => {
  const frames = job.frames ?? 1;
  const frameWidth = job.frameWidth ?? job.width;
  const meta = await sharp(buffer).metadata();
  const px = Math.round(frameWidth * job.scale);
  if (meta.width !== px * frames || meta.height !== Math.round(job.height * job.scale)) {
    throw new Error(`${job.id}: rendered ${meta.width}x${meta.height}, expected ${px * frames}x${Math.round(job.height * job.scale)}`);
  }
  return Promise.all(
    job.outputs.map(async output => ({
      output,
      buffer: frames === 1 ? buffer : await sharp(buffer).extract({ left: output.frame * px, top: 0, width: px, height: meta.height }).png().toBuffer(),
    })),
  );
};

export const runRender = async (app, { only, lang } = {}) => {
  const compose = await loadCompose(app);
  const all = compose.jobs(app);
  const errors = all.flatMap(validateJob);
  if (errors.length > 0) throw new Error(errors.join('\n'));
  const jobs = all.filter(job => (!only || only.some(part => job.id.includes(part))) && (!lang || job.lang === lang));
  const partial = jobs.length !== all.length;
  const dir = partial ? ensureDir(app.paths.render) : cleanDir(app.paths.render);
  const framesDir = ensureDir(join(dir, 'frames'));
  const stageDir = ensureDir(join(app.paths.tmp, 'stage'));
  const checks = fontChecks(app);
  const boxes = [];
  const browser = await launch();
  try {
    for (const job of jobs) {
      const started = Date.now();
      const html = docFor(app, job);
      const { buffer, boxes: found } = await renderHtml(browser, {
        dir: stageDir,
        name: job.id,
        html,
        width: job.width,
        height: job.height,
        scale: job.scale,
        fontChecks: checks,
      });
      writeFile(join(dir, `${job.id}.png`), buffer);
      for (const { output, buffer: frame } of await sliceFrames(buffer, job)) {
        writeFile(join(framesDir, `${frameName(job, output)}.png`), frame);
      }
      boxes.push({
        id: job.id,
        store: job.store,
        lang: job.lang,
        canvas: { width: job.width, height: job.height },
        strip: (job.frames ?? 1) > 1 ? { frames: job.frames, frameWidth: job.frameWidth, margin: seamMargin, origin: 0 } : null,
        boxes: found,
      });
      console.log(`render ${job.id}: ${job.outputs.length} frames, ${Date.now() - started} ms`);
    }
    if (compose.sheets) {
      for (const sheet of compose.sheets(app)) {
        const { buffer } = await renderHtml(browser, {
          dir: stageDir,
          name: sheet.id,
          html: docFor(app, sheet),
          width: sheet.width,
          height: sheet.height,
          scale: sheet.scale ?? 1,
          fontChecks: checks,
        });
        writeFile(join(app.paths.out, 'sheets', `${sheet.id}.png`), buffer);
        console.log(`sheet ${sheet.id}`);
      }
    }
  } finally {
    await browser.close();
  }
  const boxesFile = join(dir, 'boxes.json');
  let merged = boxes;
  if (partial) {
    const { existsSync, readFileSync } = await import('node:fs');
    const previous = existsSync(boxesFile) ? JSON.parse(readFileSync(boxesFile, 'utf8')) : [];
    const ids = new Set(boxes.map(item => item.id));
    merged = [...previous.filter(item => !ids.has(item.id)), ...boxes];
  }
  writeFile(boxesFile, JSON.stringify(merged, null, 2));
  return merged;
};

if (import.meta.main) {
  const { slug, flags } = requireSlug();
  const only = typeof flags.only === 'string' ? flags.only.split(',') : undefined;
  await runRender(loadApp(slug), { only, lang: flags.lang });
}
