import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { finalName, formatSizes, formatsOrder, limits, posterName, publishedNames, screenName, webName, webTargets } from '../lib/convention.mjs';
import { ssimFrames } from '../lib/ffmpeg.mjs';
import { probe } from '../lib/ffprobe.mjs';
import { loadTs } from '../lib/load-ts.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths, appPreviewRoot, ensureDir } from '../lib/paths.mjs';

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

export const validate = async slug => {
  const paths = appPaths(slug);
  const meta = await loadMeta(slug);
  const { storyboardProblems } = await loadTs(join(appPreviewRoot, 'src', 'shared', 'rules.ts'));
  const checks = [];
  const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
  const sb = meta.storyboard;

  for (const problem of storyboardProblems(sb)) check('storyboard rules', false, problem);
  check('storyboard rules', storyboardProblems(sb).length === 0, `${sb.shots.length} shots, ${sb.duration} frames`);

  const store = probe(join(paths.final, finalName(slug, 'store')));
  const v = store.video;
  check('store size', v.width === 886 && v.height === 1920, `${v.width}x${v.height}`);
  check('store fps', v.rFrameRate === '30/1', v.rFrameRate);
  check('store frames', v.frames === sb.duration, `${v.frames} frames`);
  check('store length 15 to 30 s', store.duration >= 15 && store.duration <= 30.05, `${store.duration} s`);
  check('store codec', v.codec === 'h264' && v.profile === 'High' && v.level <= 40, `${v.codec} ${v.profile} level ${v.level}`);
  check('store pixels', v.pixFmt === 'yuv420p' && v.colorRange === 'tv', `${v.pixFmt} ${v.colorRange} ${v.colorSpace}`);
  check('store bitrate near 10 to 12 Mbps', v.bitrate >= 9.5e6 && v.bitrate <= 12.5e6, `${(v.bitrate / 1e6).toFixed(2)} Mbps`);
  check('store audio silent stereo AAC', store.audio && store.audio.codec === 'aac' && store.audio.channels === 2, store.audio ? `${store.audio.codec} ${store.audio.channels} ch ${store.audio.sampleRate} Hz` : 'none');
  check('store under 500 MB', store.bytes < 500 * 1024 * 1024, `${store.bytes} B`);

  const finals = [{ kind: 'store', info: store }];
  for (const format of formatsOrder) {
    const info = probe(join(paths.final, finalName(slug, format)));
    const want = formatSizes[format];
    finals.push({ kind: format, info });
    check(`social ${format}`, info.video.width === want.width && info.video.height === want.height && info.video.rFrameRate === '30/1' && info.video.frames === meta.marketing.duration && info.video.pixFmt === 'yuv420p', `${info.video.width}x${info.video.height} ${info.video.frames} frames ${info.duration} s`);
  }

  const web = [];
  for (const [variant, spec] of Object.entries(webTargets)) {
    for (const ext of ['webm', 'mp4']) {
      const file = join(paths.pub, webName(slug, variant, ext));
      if (!existsSync(file)) {
        check(`web ${variant}.${ext}`, false, 'missing');
        continue;
      }
      const info = probe(file);
      const codec = ext === 'webm' ? 'vp9' : 'h264';
      check(`web ${variant}.${ext}`, info.video.codec === codec && info.video.width === spec.width && info.video.height === spec.height && info.bytes <= spec.hard && !info.audio, `${info.video.width}x${info.video.height} ${info.video.codec} ${info.bytes} B, target ${spec.target}`);
      if (info.bytes > spec.target) check(`web ${variant}.${ext} target`, false, `${info.bytes} B over ${spec.target}`);
      const frames = info.video.frames;
      const seam = ssimFrames(file, frames - 1, 0);
      const step = ssimFrames(file, 0, 1);
      if (ext === 'mp4') check(`loop seam ${variant}`, seam >= Math.min(0.9, step - 0.05), `last to first SSIM ${seam.toFixed(4)}, first step ${step.toFixed(4)}`);
      web.push({ variant, ext, info, seam });
    }
    const poster = join(paths.pub, posterName(slug, variant));
    check(`poster ${variant}`, existsSync(poster) && statSync(poster).size <= limits.poster, existsSync(poster) ? `${statSync(poster).size} B` : 'missing');
  }

  for (const { n } of meta.gallery) {
    const file = join(paths.pub, screenName(slug, n));
    check(`screen ${n}`, existsSync(file) && statSync(file).size <= limits.screen, existsSync(file) ? `${statSync(file).size} B` : 'missing');
  }
  const board = join(paths.pub, `${slug}-storyboard.png`);
  check('storyboard board', existsSync(board) && statSync(board).size <= limits.storyboard, existsSync(board) ? `${statSync(board).size} B` : 'missing');
  const icon = probe(join(paths.pub, `${slug}-icon-1024.png`));
  check('icon 1024 without alpha', icon.video.width === 1024 && icon.video.height === 1024 && icon.video.pixFmt === 'rgb24', `${icon.video.width}x${icon.video.height} ${icon.video.pixFmt}`);
  const og = probe(join(paths.pub, 'og.png'));
  check('og 1200x630', og.video.width === 1200 && og.video.height === 630, `${og.video.width}x${og.video.height}`);
  const expected = publishedNames(slug, meta.gallery.length).filter(name => name !== 'manifest.json');
  const missing = expected.filter(name => !existsSync(join(paths.pub, name)));
  check('published names', missing.length === 0, missing.length ? `missing ${missing.join(', ')}` : `${expected.length} files`);
  const files = walk(paths.pub);
  const total = files.reduce((sum, file) => sum + statSync(file).size, 0);
  check('app budget 14 MB', total <= limits.appBudget, `${(total / 1024 / 1024).toFixed(2)} MB in ${files.length} files`);
  check('app hard cap 18 MB', total <= limits.appHardCap, `${(total / 1024 / 1024).toFixed(2)} MB`);
  const big = files.filter(file => statSync(file).size > limits.file);
  check('every file under 50 MB', big.length === 0, big.join(', ') || 'ok');

  const report = { slug, checkedAt: new Date().toISOString(), pass: checks.every(c => c.pass), checks, finals, web, totalBytes: total };
  writeFileSync(join(ensureDir(paths.qa), 'validate.json'), JSON.stringify(report, null, 2));
  return report;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug } = requireSlug();
  const report = await validate(slug);
  for (const c of report.checks) console.log(`${c.pass ? 'ok  ' : 'FAIL'} ${c.name}: ${c.detail}`);
  console.log(report.pass ? 'all checks passed' : 'some checks failed');
  process.exit(report.pass ? 0 : 1);
}
