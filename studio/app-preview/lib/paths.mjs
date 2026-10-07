import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const appPreviewRoot = resolve(here, '..');
export const studioRoot = resolve(appPreviewRoot, '..');
export const repoRoot = resolve(studioRoot, '..');
export const sitesRoot = join(repoRoot, 'sites');
export const outRoot = join(studioRoot, 'out', 'app-preview');
export const remotionPublic = join(outRoot, 'public');
export const fontsSrc = process.env.WZ_FONTS_SRC ?? join(studioRoot, 'out', 'fonts-src');

export const slugs = ['kasownik', 'sztanga', 'rygiel', 'kielek', 'poziomka', 'poludnie'];

export const headlessShell =
  process.env.WZ_HEADLESS ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

export const chromiumPath = process.env.WZ_CHROMIUM ?? '/opt/pw-browsers/chromium';

export const ensureDir = dir => {
  mkdirSync(dir, { recursive: true });
  return dir;
};

export const appPaths = slug => {
  if (!slugs.includes(slug)) throw new Error(`unknown app "${slug}", expected one of ${slugs.join(', ')}`);
  const out = join(outRoot, slug);
  return {
    slug,
    src: join(appPreviewRoot, 'src', 'apps', slug),
    status: join(appPreviewRoot, 'apps', slug, 'STATUS.md'),
    out,
    masters: join(out, 'masters'),
    final: join(out, 'final'),
    stills: join(out, 'stills'),
    sheets: join(out, 'sheets'),
    qa: join(out, 'qa'),
    shots: join(out, 'shots'),
    pub: join(sitesRoot, 'public', 'app-preview', slug),
    site: join(sitesRoot, 'src', 'app-preview', slug),
    page: join(sitesRoot, 'src', 'pages', 'app-preview', slug),
    url: `/wzornik/app-preview/${slug}/`,
  };
};
