import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { link } from '../../shared/link';
import type { AsoCopy, Lang, Manifest, ManifestFile, ManifestGroup, Shot, Store } from './types';

export const readManifest = (slug: string, root = process.cwd()): Manifest =>
  JSON.parse(readFileSync(join(root, 'public', 'aso', slug, 'manifest.json'), 'utf8'));

export const assetUrl = (slug: string, path: string) => link(`/aso/${slug}/${path}`);

export const pageUrl = (slug: string) => link(`/aso/${slug}/`);

export const webPath = (store: Store | 'feature', lang: Lang, slot?: string, variant?: string) =>
  store === 'feature'
    ? `web/feature-${lang}.webp`
    : `web/${store}-${lang}-${variant === 'b' ? `${slot}b` : slot}.webp`;

export const webFile = (manifest: Manifest, path: string) =>
  manifest.web.find(item => item.path === path);

export const shotsOf = (
  manifest: Manifest,
  copy: AsoCopy,
  store: Store,
  options: { variant?: 'b' } = {},
): Shot[] => {
  const slots = options.variant === 'b' ? [copy.slots[0]] : copy.slots;
  return slots.map(slot => {
    const path = webPath(store, copy.lang, slot.id, options.variant);
    const file = webFile(manifest, path);
    if (!file) throw new Error(`${manifest.app.slug}: missing ${path} in the manifest`);
    const text = options.variant === 'b' ? copy.variantB : slot;
    return {
      src: assetUrl(manifest.app.slug, path),
      alt: text.alt,
      width: file.width,
      height: file.height,
      headline: text.headline,
      slot: options.variant === 'b' ? `${slot.id}b` : slot.id,
    };
  });
};

export const featureOf = (manifest: Manifest, copy: AsoCopy): Shot => {
  const path = webPath('feature', copy.lang);
  const file = webFile(manifest, path);
  if (!file) throw new Error(`${manifest.app.slug}: missing ${path} in the manifest`);
  return {
    src: assetUrl(manifest.app.slug, path),
    alt: copy.feature.alt,
    width: file.width,
    height: file.height,
    headline: copy.feature.headline,
    slot: 'feature',
  };
};

export const filesOf = (manifest: Manifest, group: ManifestGroup): ManifestFile[] =>
  group.files.flatMap(path => {
    const file = manifest.files.find(item => item.path === path);
    return file ? [file] : [];
  });

export const fileName = (path: string) => path.split('/').pop() ?? path;

export const dimensionsOf = (file: ManifestFile) =>
  file.width && file.height ? `${file.width}×${file.height} px` : '';

export const groupOf = (manifest: Manifest, id: string) =>
  manifest.groups.find(group => group.id === id);

export const fontFaceCss = (manifest: Manifest) =>
  manifest.fonts
    .map(
      font =>
        `@font-face{font-family:'${font.css}';src:url(${assetUrl(manifest.app.slug, font.file)}) format('woff2');font-weight:${font.weight};font-style:${font.style};font-display:swap}`,
    )
    .join('');

export const preloadFonts = (manifest: Manifest, weights: number[]) =>
  manifest.fonts
    .filter(font => weights.includes(font.weight))
    .map(font => assetUrl(manifest.app.slug, font.file));
