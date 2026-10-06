import { assetUrl } from './manifest';
import type { Manifest } from './types';

export const fontFaceCss = (manifest: Manifest) =>
  manifest.fonts
    .map(
      font =>
        `@font-face{font-family:'${font.css}';src:url(${assetUrl(manifest.brand.slug, font.file)}) format('woff2');font-weight:${font.weight};font-style:${font.style};font-display:swap}`,
    )
    .join('');

export const preloadFonts = (manifest: Manifest, ids: string[]) =>
  manifest.fonts
    .filter(font => ids.includes(font.id))
    .map(font => assetUrl(manifest.brand.slug, font.file));
