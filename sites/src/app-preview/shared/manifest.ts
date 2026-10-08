import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { link } from '../../shared/link';
import type { MotionPreset, Manifest } from './types';

export const readManifest = (slug: string, root = process.cwd()): Manifest =>
  JSON.parse(readFileSync(join(root, 'public', 'app-preview', slug, 'manifest.json'), 'utf8'));

export const assetUrl = (slug: string, path: string) => link(`/app-preview/${slug}/${path}`);

export const pageUrl = (slug: string) => link(`/app-preview/${slug}/`);

const nbsp = ' ';

export const nb = (text: string) =>
  text.replace(/(\d) (ms|s|MB|KB|kl\.\/s|min|zł|px|%)(?=$|[\s,.;:)])/g, `$1${nbsp}$2`);

export const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}${nbsp}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')}${nbsp}MB`;
};

export const formatSeconds = (seconds: number) =>
  `${(Math.round(seconds * 10) / 10).toFixed(1).replace('.', ',')}${nbsp}s`;

export const formatBitrate = (bps: number) =>
  bps >= 1e6
    ? `${(bps / 1e6).toFixed(1).replace('.', ',')}${nbsp}Mb/s`
    : `${Math.round(bps / 1e3)}${nbsp}kb/s`;

export const codecLabel = (codec: string, profile: string | null, pixFmt: string) => {
  const name = codec === 'h264' ? 'H.264' : codec === 'vp9' ? 'VP9' : codec.toUpperCase();
  return [name, profile, pixFmt].filter(Boolean).join(', ');
};

export const presetValue = (preset: MotionPreset) => {
  if (preset.kind === 'spring')
    return `sprężyna: masa ${preset.mass}, sztywność ${preset.stiffness}, tłumienie ${preset.damping}`;
  if (preset.kind === 'bezier')
    return `cubic-bezier(${preset.points.join(', ')}), ${preset.ms}${nbsp}ms`;
  return `steps(${preset.steps}), ${preset.ms}${nbsp}ms`;
};
