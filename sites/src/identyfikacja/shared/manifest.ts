import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { link } from '../../shared/link';
import type { Manifest, ManifestFile, ManifestGroup } from './types';

export const readManifest = (slug: string, root = process.cwd()): Manifest =>
  JSON.parse(readFileSync(join(root, 'public', 'identyfikacja', slug, 'manifest.json'), 'utf8'));

export const assetUrl = (slug: string, path: string) => link(`/identyfikacja/${slug}/${path}`);

export const pageUrl = (slug: string) => link(`/identyfikacja/${slug}/`);

export const filesOf = (manifest: Manifest, group: ManifestGroup): ManifestFile[] =>
  group.files.flatMap(path => {
    const file = manifest.files.find(item => item.path === path);
    return file ? [file] : [];
  });

export const fileName = (path: string) => path.split('/').pop() ?? path;

export const dimensionsOf = (file: ManifestFile) => {
  if (file.type === 'pdf' && file.pages) return `${file.pages} str.`;
  if (file.type === 'ico' && file.sizes) return file.sizes.join(', ') + ' px';
  if (
    file.width &&
    file.height &&
    (file.type === 'png' || file.type === 'jpg' || file.type === 'mp4' || file.type === 'webm')
  )
    return `${file.width}×${file.height} px`;
  return '';
};
