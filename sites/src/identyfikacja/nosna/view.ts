import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';
import { dayOf, grid, markBody, markBox, variantFile, variantName } from './lib/field';
import type { Variant } from './lib/field';

export const slug = 'nosna';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/nosna-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

export const iconLabels: Record<string, string> = {
  glosnik: 'głośnik',
  sluchawki: 'słuchawki',
  wejscie: 'wejście',
};

export const iconLabel = (name: string) => iconLabels[name] ?? name;

export const ink = '#0E0E12';

export const logoVariants = [
  { id: 'primary', name: 'Główne', note: 'znak z napisem, gdy jest miejsce', ground: 'papier' },
  { id: 'horizontal', name: 'Poziome', note: 'paski, nagłówki i podpis e-mail', ground: 'kosc' },
  { id: 'vertical', name: 'Pionowe', note: 'smycze, grzbiety i wąskie pola', ground: 'papier' },
  { id: 'symbol', name: 'Sygnet', note: 'samo pole i nośna, awatary i plakaty', ground: 'kosc' },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    note: 'czarne, do druku w jednym kolorze',
    ground: 'white',
  },
  { id: 'negative', name: 'Negatyw', note: 'jasne na atramencie', ground: 'atrament' },
] as const;

export const gridCells = grid.map((variant: Variant) => ({
  variant,
  name: variantName(variant).replace(' BPM', '\u00a0BPM'),
  file: `logo/${variantFile(variant)}`,
  viewBox: markBox.join(' '),
  markup: markBody(variant, { thread: dayOf(variant.day).color, ink }),
}));

export const sizeTest = [
  { src: 'favicon.svg', size: 16, label: 'ikona strony, 16\u00a0px' },
  { src: 'favicon.svg', size: 24, label: '24\u00a0px' },
  { src: 'favicon.svg', size: 48, label: '48\u00a0px' },
  { src: 'logo/nosna-symbol.svg', size: 48, label: 'pełny sygnet, 48\u00a0px' },
  { src: 'logo/nosna-symbol.svg', size: 96, label: '96\u00a0px' },
  { src: 'logo/nosna-symbol.svg', size: 192, label: '192\u00a0px' },
] as const;
