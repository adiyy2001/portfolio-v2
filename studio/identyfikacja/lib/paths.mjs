import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const identityRoot = resolve(here, '..');
export const studioRoot = resolve(identityRoot, '..');
export const repoRoot = resolve(studioRoot, '..');
export const sitesRoot = join(repoRoot, 'sites');

export const slugs = ['skibka', 'nosna', 'rzut', 'klamra', 'cuvee', 'wolnobieg'];

export const publicBase = '/wzornik/identyfikacja';

export const brandPaths = slug => {
  if (!slugs.includes(slug)) throw new Error(`unknown brand slug "${slug}", expected one of ${slugs.join(', ')}`);
  const studio = join(identityRoot, 'brands', slug);
  return {
    slug,
    studio,
    brandJson: join(studio, 'brand.json'),
    status: join(studio, 'STATUS.md'),
    src: join(studio, 'src'),
    out: join(studioRoot, 'out', slug),
    pub: join(sitesRoot, 'public', 'identyfikacja', slug),
    site: join(sitesRoot, 'src', 'identyfikacja', slug),
    page: join(sitesRoot, 'src', 'pages', 'identyfikacja', slug),
    dist: join(sitesRoot, 'dist'),
    distBrand: join(sitesRoot, 'dist', 'identyfikacja', slug),
    url: `${publicBase}/${slug}/`,
  };
};

export const fontsSrcRoot = () => process.env.WZ_FONTS_SRC ?? join(studioRoot, 'out', 'fonts-src');
