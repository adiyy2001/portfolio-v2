import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listFlag, requireSlug } from '../lib/args.mjs';
import { finalName, formatsOrder, limits, masterName, posterName, screenName, webName, webTargets } from '../lib/convention.mjs';
import { ffmpeg, searchQuality, size, toTv } from '../lib/ffmpeg.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths, ensureDir } from '../lib/paths.mjs';

const steps = ['final', 'web', 'posters', 'images'];

const colorArgs = ['-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];
const silence = seconds => ['-f', 'lavfi', '-t', String(seconds), '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000'];

const encodeFinals = (slug, paths, meta) => {
  ensureDir(paths.final);
  const sb = meta.storyboard;
  const storeOut = join(paths.final, finalName(slug, 'store'));
  ffmpeg([
    '-i', join(paths.masters, masterName('store')),
    ...silence(sb.duration / sb.fps),
    '-map', '0:v', '-map', '1:a',
    '-frames:v', String(sb.duration),
    '-vf', toTv(886, 1920),
    '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level:v', '4.0', '-pix_fmt', 'yuv420p',
    ...colorArgs,
    '-b:v', '11.5M', '-minrate', '11.5M', '-maxrate', '11.5M', '-bufsize', '23M',
    '-x264-params', 'nal-hrd=cbr:force-cfr=1', '-r', '30',
    '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2',
    '-shortest', '-movflags', '+faststart', storeOut,
  ]);
  console.log(`final ${storeOut} ${size(storeOut)} B`);
  for (const format of formatsOrder) {
    const out = join(paths.final, finalName(slug, format));
    const [w, h] = format === '9x16' ? [1080, 1920] : format === '1x1' ? [1080, 1080] : [1920, 1080];
    ffmpeg([
      '-i', join(paths.masters, masterName(`marketing-${format}`)),
      ...silence(meta.marketing.duration / sb.fps),
      '-map', '0:v', '-map', '1:a',
      '-frames:v', String(meta.marketing.duration),
      '-vf', toTv(w, h),
      '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-crf', '15', '-pix_fmt', 'yuv420p',
      ...colorArgs, '-r', '30',
      '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-ac', '2',
      '-shortest', '-movflags', '+faststart', out,
    ]);
    console.log(`final ${out} ${size(out)} B`);
  }
};

const encodeWeb = (slug, paths, variants, meta) => {
  ensureDir(paths.pub);
  const report = {};
  for (const variant of variants) {
    const spec = { ...webTargets[variant], target: meta.webTargets?.[variant] ?? webTargets[variant].target };
    const source = join(paths.masters, masterName(spec.source, spec.source !== 'tile'));
    const filter = toTv(spec.width, spec.height);
    const webm = join(paths.pub, webName(slug, variant, 'webm'));
    const mp4 = join(paths.pub, webName(slug, variant, 'mp4'));
    const vp9 = searchQuality({
      start: 33, step: 4, max: 57, file: webm, target: spec.target,
      encode: crf => ffmpeg(['-i', source, '-vf', filter, '-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-deadline', 'good', '-cpu-used', '2', '-row-mt', '1', '-pix_fmt', 'yuv420p', ...colorArgs, '-an', webm]),
    });
    const h264 = searchQuality({
      start: 22, step: 2, max: 36, file: mp4, target: spec.target,
      encode: crf => ffmpeg(['-i', source, '-vf', filter, '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-crf', String(crf), '-pix_fmt', 'yuv420p', ...colorArgs, '-movflags', '+faststart', '-an', mp4]),
    });
    report[variant] = { webm: { crf: vp9.q, bytes: vp9.bytes }, mp4: { crf: h264.q, bytes: h264.bytes } };
    console.log(`web ${variant}: webm crf ${vp9.q} ${vp9.bytes} B, mp4 crf ${h264.q} ${h264.bytes} B`);
  }
  return report;
};

const encodePosters = (slug, paths, meta, variants) => {
  ensureDir(join(paths.pub, 'posters'));
  for (const variant of variants) {
    const spec = webTargets[variant];
    const frame = variant === 'store' ? meta.storyboard.poster : variant === 'tile' ? meta.tile.poster : meta.marketing.poster;
    const source = join(paths.masters, masterName(spec.source, spec.source !== 'tile'));
    const out = join(paths.pub, posterName(slug, variant));
    const result = searchQuality({
      start: 3, step: 1, max: 12, file: out, target: limits.poster,
      encode: q => ffmpeg(['-i', source, '-vf', `select=eq(n\\,${frame}),scale=${spec.width}:${spec.height}:flags=lanczos`, '-frames:v', '1', '-q:v', String(q), out]),
    });
    console.log(`poster ${variant} frame ${frame}: q ${result.q} ${result.bytes} B`);
  }
};

const encodeImages = (slug, paths, meta) => {
  ensureDir(join(paths.pub, 'screens'));
  for (const { n } of meta.gallery) {
    const out = join(paths.pub, screenName(slug, n));
    const result = searchQuality({
      start: 86, step: -6, max: -1, file: out, target: limits.screen,
      encode: q => ffmpeg(['-i', join(paths.stills, `screen-${n}.png`), '-vf', 'scale=443:960:flags=lanczos', '-c:v', 'libwebp', '-quality', String(Math.max(40, q)), '-compression_level', '6', out]),
    });
    console.log(`screen ${n}: ${result.bytes} B`);
  }
  const board = join(paths.pub, `${slug}-storyboard.png`);
  copyFileSync(join(paths.stills, 'storyboard.png'), board);
  if (size(board) > limits.storyboard) {
    ffmpeg(['-i', join(paths.stills, 'storyboard.png'), '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a', board]);
  }
  console.log(`storyboard ${size(board)} B`);
  ffmpeg(['-i', join(paths.stills, 'icon-1024.png'), '-pix_fmt', 'rgb24', join(paths.pub, `${slug}-icon-1024.png`)]);
  copyFileSync(join(paths.stills, 'icon-512.png'), join(paths.pub, `${slug}-icon-512.png`));
  ffmpeg(['-i', join(paths.stills, 'icon-1024.png'), '-vf', 'scale=180:180:flags=lanczos', '-pix_fmt', 'rgb24', join(paths.pub, 'apple-touch-icon.png')]);
  ffmpeg(['-i', join(paths.stills, 'og.png'), '-pix_fmt', 'rgb24', join(paths.pub, 'og.png')]);
  writeFileSync(join(paths.pub, 'favicon.svg'), `${meta.iconSvg({ rounded: true, id: 'fav' }).replace(' width="100%" height="100%"', '')}\n`);
  console.log('icons, og and favicon written');
};

export const encode = async (slug, { only = steps, variants = Object.keys(webTargets) } = {}) => {
  const paths = appPaths(slug);
  const meta = await loadMeta(slug);
  const report = {};
  if (only.includes('final')) encodeFinals(slug, paths, meta);
  if (only.includes('web')) report.web = encodeWeb(slug, paths, variants, meta);
  if (only.includes('posters')) encodePosters(slug, paths, meta, variants);
  if (only.includes('images')) encodeImages(slug, paths, meta);
  ensureDir(paths.qa);
  if (report.web) writeFileSync(join(paths.qa, 'encode.json'), JSON.stringify(report, null, 2));
  return report;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug, flags } = requireSlug();
  if (!existsSync(appPaths(slug).masters)) throw new Error('render the masters first');
  await encode(slug, { only: listFlag(flags.only, steps), variants: listFlag(flags.variants, Object.keys(webTargets)) });
}
