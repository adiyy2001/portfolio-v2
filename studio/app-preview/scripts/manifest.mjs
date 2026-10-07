import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { contrast } from '../lib/contrast.mjs';
import { finalName, formatsOrder, posterName, screenName, webName, webTargets } from '../lib/convention.mjs';
import { probe } from '../lib/ffprobe.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths } from '../lib/paths.mjs';

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const media = (file, root) => {
  const info = probe(file);
  return {
    path: relative(root, file),
    bytes: info.bytes,
    width: info.video.width,
    height: info.video.height,
    fps: info.video.fps,
    frames: info.video.frames,
    duration: info.duration,
    codec: info.video.codec,
    profile: info.video.profile,
    pixFmt: info.video.pixFmt,
    bitrate: info.bitrate,
    audio: info.audio
      ? `${info.audio.codec.toUpperCase()}, ${info.audio.channels === 2 ? 'stereo' : `${info.audio.channels} kan.`}, ${info.audio.sampleRate / 1000}\u00a0kHz`
      : null,
  };
};

const finalNotes = {
  store: 'App Store Connect, podgląd aplikacji na iPhone',
  '9x16': 'Reels, TikTok, Shorts',
  '1x1': 'post w kanale',
  '16x9': 'YouTube, link w Google Play',
};

export const manifest = async slug => {
  const paths = appPaths(slug);
  const meta = await loadMeta(slug);
  const finals = ['store', ...formatsOrder].map(kind => ({
    kind,
    title: kind === 'store' ? 'Wersja sklepowa' : `Wersja marketingowa ${kind.replace('x', ':')}`,
    note: finalNotes[kind],
    name: finalName(slug, kind),
    ...media(join(paths.final, finalName(slug, kind)), paths.final),
  }));
  const videos = Object.fromEntries(
    Object.keys(webTargets).map(variant => [
      variant,
      {
        webm: media(join(paths.pub, webName(slug, variant, 'webm')), paths.pub),
        mp4: media(join(paths.pub, webName(slug, variant, 'mp4')), paths.pub),
        poster: posterName(slug, variant),
      },
    ]),
  );
  const fonts = meta.fontFiles.map(font => ({
    family: font.family,
    file: `fonts/${font.web}`,
    license: `fonts/OFL-${font.source.dir}.txt`,
    weight: font.weight,
    used: font.used,
    role: font.role,
    bytes: statSync(join(paths.pub, 'fonts', font.web)).size,
  }));
  const palette = meta.palette.map(item => ({
    ...item,
    onSurface: contrast(item.hex, meta.color.surface),
    onGrouped: contrast(item.hex, meta.color.grouped),
  }));
  const validateFile = join(paths.qa, 'validate.json');
  const timesFile = join(paths.qa, 'render-times.json');
  const files = walk(paths.pub).filter(file => !file.endsWith('manifest.json'));
  const data = {
    app: meta.app,
    generatedAt: new Date().toISOString().slice(0, 10),
    storyboard: {
      ...meta.storyboard,
      shots: meta.storyboard.shots.map(shot => ({ ...shot, seconds: [shot.from / 30, (shot.to + 1) / 30] })),
      board: `${slug}-storyboard.png`,
    },
    marketing: { ...meta.marketing, beats: meta.marketingBeats },
    palette,
    type: meta.type,
    fonts,
    motion: meta.motion,
    gallery: meta.gallery.map(item => ({ ...item, file: screenName(slug, item.n) })),
    videos,
    finals,
    icons: { full: `${slug}-icon-1024.png`, rounded: `${slug}-icon-512.png` },
    renderSeconds: existsSync(timesFile) ? JSON.parse(readFileSync(timesFile, 'utf8')) : {},
    validation: existsSync(validateFile) ? JSON.parse(readFileSync(validateFile, 'utf8')).pass : null,
    published: {
      totalBytes: files.reduce((sum, file) => sum + statSync(file).size, 0),
      count: files.length,
    },
  };
  writeFileSync(join(paths.pub, 'manifest.json'), `${JSON.stringify(data, null, 2)}\n`);
  return data;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug } = requireSlug();
  const data = await manifest(slug);
  console.log(`manifest: ${data.published.count} files, ${data.published.totalBytes} B`);
}
