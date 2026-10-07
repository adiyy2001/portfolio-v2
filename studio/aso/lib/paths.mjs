import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const asoRoot = resolve(here, '..');
export const studioRoot = resolve(asoRoot, '..');
export const repoRoot = resolve(studioRoot, '..');
export const sitesRoot = join(repoRoot, 'sites');

export const slugs = ['gran', 'szyld', 'margines', 'chochla', 'kruszec', 'bis'];

export const languages = ['pl', 'en'];

export const publicBase = '/wzornik/aso';

export const fontsSrcRoot = () => process.env.WZ_FONTS_SRC ?? join(studioRoot, 'out', 'fonts-src');

export const appPaths = slug => {
  if (!slugs.includes(slug)) throw new Error(`unknown app slug "${slug}", expected one of ${slugs.join(', ')}`);
  const studio = join(asoRoot, 'apps', slug);
  const out = join(studioRoot, 'out', 'aso', slug);
  const site = join(sitesRoot, 'src', 'aso', slug);
  return {
    slug,
    studio,
    appJson: join(studio, 'app.json'),
    status: join(studio, 'STATUS.md'),
    out,
    render: join(out, 'render'),
    exportDir: join(out, 'export'),
    boards: join(out, 'boards'),
    thumbs: join(out, 'thumbs'),
    seams: join(out, 'seams'),
    shots: join(out, 'shots'),
    tmp: join(out, 'tmp'),
    fontsPinned: join(out, 'fonts-pinned'),
    pub: join(sitesRoot, 'public', 'aso', slug),
    site,
    copyDir: join(site, 'copy'),
    page: join(sitesRoot, 'src', 'pages', 'aso', slug),
    dist: join(sitesRoot, 'dist'),
    url: `${publicBase}/${slug}/`,
  };
};
