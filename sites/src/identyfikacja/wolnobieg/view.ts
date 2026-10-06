import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';
import { arcStripe } from './lib/stripes';

export const slug = 'wolnobieg';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/wolnobieg-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

export const logoVariants = [
  {
    id: 'primary',
    name: 'Główne',
    note: 'napis i trzy pasy, gdy jest miejsce',
    ground: 'krem',
  },
  {
    id: 'horizontal',
    name: 'Poziome',
    note: 'odznaka obok napisu, paski i nagłówki',
    ground: 'krem-jasny',
  },
  { id: 'vertical', name: 'Pionowe', note: 'plakaty, naklejki, kwadratowe pola', ground: 'piasek' },
  {
    id: 'symbol',
    name: 'Sygnet',
    note: 'sama odznaka, awatary i naklejka na ramę',
    ground: 'pomarancz',
  },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    note: 'czarne, do druku w jednym kolorze',
    ground: 'white',
  },
  { id: 'negative', name: 'Negatyw', note: 'jasne na kakaowym tle', ground: 'kakao' },
] as const;

export const sizeTest = [
  { src: 'favicon.svg', size: 16, label: 'uproszczony sygnet, 16 px' },
  { src: 'favicon.svg', size: 24, label: '24 px' },
  { src: 'favicon.svg', size: 48, label: '48 px' },
  { src: 'logo/wolnobieg-symbol.svg', size: 48, label: 'pełna odznaka, 48 px' },
  { src: 'logo/wolnobieg-symbol.svg', size: 96, label: '96 px' },
  { src: 'logo/wolnobieg-symbol.svg', size: 192, label: '192 px' },
] as const;

const heroColors = ['#3f2411', '#e9a81d', '#fbf3df'];

export const heroArcs = heroColors.map((color, index) => ({
  color,
  d: arcStripe(600, 600, 300 + index * 92, 66, 180, 270, true),
}));

export const swoosh = [
  { color: '#ec7424', d: 'M4 12C90 2 190 2 276 12' },
  { color: '#e9a81d', d: 'M4 22C90 12 190 12 276 22' },
  { color: '#5b2f14', d: 'M4 32C90 22 190 22 276 32' },
];
