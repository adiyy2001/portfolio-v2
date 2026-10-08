import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { finalName, formatsOrder, masterName, webName, webTargets } from '../lib/convention.mjs';
import { ffmpeg } from '../lib/ffmpeg.mjs';
import { probe } from '../lib/ffprobe.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths, ensureDir } from '../lib/paths.mjs';

const frameSheet = (input, out, cellWidth, columns) => {
  const info = probe(input);
  const count = Math.ceil(info.duration * 2);
  const rows = Math.ceil(count / columns);
  ffmpeg(['-i', input, '-vf', `fps=2,scale=${cellWidth}:-2:flags=lanczos,tile=${columns}x${rows}:padding=6:margin=6:color=white`, '-frames:v', '1', out]);
  return out;
};

const pickFrames = (input, frames, scale, out) => {
  const select = frames.map(n => `eq(n\\,${n})`).join('+');
  ffmpeg(['-i', input, '-vf', `select='${select}',scale=iw*${scale}:-2:flags=lanczos,tile=${frames.length}x1:padding=8:margin=8:color=white`, '-vsync', 'vfr', '-frames:v', '1', out]);
  return out;
};

export const sheets = async slug => {
  const paths = appPaths(slug);
  const meta = await loadMeta(slug);
  const dir = ensureDir(paths.sheets);
  const made = [];
  const store = join(paths.final, finalName(slug, 'store'));
  const storeSource = existsSync(store) ? store : join(paths.masters, masterName('store'));
  made.push(frameSheet(storeSource, join(dir, 'store-frames.png'), 177, 8));
  made.push(pickFrames(storeSource, [0, meta.storyboard.defaultPoster, meta.storyboard.poster], 0.25, join(dir, 'store-thumbnails-25.png')));
  for (const format of formatsOrder) {
    const file = join(paths.final, finalName(slug, format));
    const source = existsSync(file) ? file : join(paths.masters, masterName(`marketing-${format}`));
    const cell = format === '16x9' ? 320 : format === '1x1' ? 240 : 180;
    made.push(frameSheet(source, join(dir, `marketing-${format}-frames.png`), cell, format === '16x9' ? 6 : 8));
    made.push(pickFrames(source, [0, meta.marketing.poster, meta.marketing.outro + 60], 0.25, join(dir, `marketing-${format}-thumbnails-25.png`)));
  }
  for (const variant of Object.keys(webTargets)) {
    const file = join(paths.pub, webName(slug, variant, 'mp4'));
    if (!existsSync(file)) continue;
    const frames = probe(file).video.frames;
    made.push(pickFrames(file, [frames - 2, frames - 1, 0, 1], 1, join(dir, `seam-${variant}.png`)));
  }
  const tile = join(paths.masters, masterName('tile', false));
  if (existsSync(tile)) made.push(frameSheet(tile, join(dir, 'tile-frames.png'), 160, 10));
  return made;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug } = requireSlug();
  for (const file of await sheets(slug)) console.log(file);
}
