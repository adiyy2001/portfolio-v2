export const formatsOrder = ['9x16', '1x1', '16x9'];

export const formatSizes = {
  '9x16': { width: 1080, height: 1920 },
  '1x1': { width: 1080, height: 1080 },
  '16x9': { width: 1920, height: 1080 },
};

const MB = 1024 * 1024;
const KB = 1024;

export const webTargets = {
  hero: { source: 'marketing-16x9', width: 1280, height: 720, target: 3 * MB, hard: 4 * MB },
  'hero-9x16': { source: 'marketing-9x16', width: 540, height: 960, target: 1.5 * MB, hard: 4 * MB },
  'social-1x1': { source: 'marketing-1x1', width: 720, height: 720, target: 1.5 * MB, hard: 4 * MB },
  store: { source: 'store', width: 442, height: 960, target: 1.5 * MB, hard: 4 * MB },
  tile: { source: 'tile', width: 480, height: 600, target: 400 * KB, hard: 4 * MB },
};

export const limits = {
  poster: 150 * KB,
  storyboard: 900 * KB,
  screen: 120 * KB,
  appBudget: 14 * MB,
  appHardCap: 18 * MB,
  file: 50 * MB,
};

export const masterName = (kind, loop = true) => `${kind}${loop ? '-loop' : ''}.mp4`;

export const finalName = (slug, kind) => {
  if (kind === 'store') return `${slug}-store-886x1920.mp4`;
  const { width, height } = formatSizes[kind];
  return `${slug}-social-${width}x${height}.mp4`;
};

export const webName = (slug, variant, ext) => `${slug}-${variant}.${ext}`;

export const posterName = (slug, variant) => `posters/${slug}-${variant}.jpg`;

export const screenName = (slug, n) => `screens/${slug}-screen-${n}.webp`;

export const publishedNames = (slug, screenCount) => [
  ...Object.keys(webTargets).flatMap(variant => [
    webName(slug, variant, 'webm'),
    webName(slug, variant, 'mp4'),
    posterName(slug, variant),
  ]),
  `${slug}-storyboard.png`,
  ...Array.from({ length: screenCount }, (_, i) => screenName(slug, i + 1)),
  `${slug}-icon-1024.png`,
  `${slug}-icon-512.png`,
  'favicon.svg',
  'apple-touch-icon.png',
  'og.png',
  'manifest.json',
];
