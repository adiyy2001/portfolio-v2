import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';

export const slug = 'cuvee';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/cuvee-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

export const logoVariants = [
  {
    id: 'primary',
    name: 'Główne',
    note: 'nazwa, mosiężna linia i opis, gdy jest miejsce',
    ground: 'papier',
  },
  { id: 'horizontal', name: 'Poziome', note: 'paski, nagłówki i podpis e-mail', ground: 'len' },
  { id: 'vertical', name: 'Pionowe', note: 'etykiety, szyldy i kwadratowe pola', ground: 'papier' },
  {
    id: 'symbol',
    name: 'Sygnet',
    note: 'sama litera C w arkadzie, awatary i pieczęć',
    ground: 'len',
  },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    note: 'czarne, do druku w jednym kolorze',
    ground: 'white',
  },
  { id: 'negative', name: 'Negatyw', note: 'jasne na ciepłej czerni', ground: 'czern' },
] as const;

export const sizeTest = [
  { src: 'favicon.svg', size: 16, label: 'sygnet uproszczony, 16 px' },
  { src: 'favicon.svg', size: 24, label: '24 px' },
  { src: 'favicon.svg', size: 48, label: '48 px' },
  { src: 'logo/cuvee-symbol.svg', size: 48, label: 'pełny sygnet, 48 px' },
  { src: 'logo/cuvee-symbol.svg', size: 96, label: '96 px' },
  { src: 'logo/cuvee-symbol.svg', size: 192, label: '192 px' },
] as const;
