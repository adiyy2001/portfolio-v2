import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';

export const slug = 'rzut';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/rzut-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

export const logoVariants = [
  {
    id: 'primary',
    name: 'Główne',
    note: 'kwadrat, nazwa i podpis, gdy jest miejsce',
    ground: 'biel',
    width: 511,
    height: 211,
  },
  {
    id: 'horizontal',
    name: 'Poziome',
    note: 'nagłówki, stopki i paski',
    ground: 'papier',
    width: 511,
    height: 120,
  },
  {
    id: 'vertical',
    name: 'Pionowe',
    note: 'pola kwadratowe i pionowe',
    ground: 'biel',
    width: 351,
    height: 391,
  },
  {
    id: 'symbol',
    name: 'Sygnet',
    note: 'ikona, awatar i najmniejsze rozmiary',
    ground: 'papier',
    width: 120,
    height: 120,
  },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    note: 'druk w jednym kolorze i pieczątki',
    ground: 'biel',
    width: 511,
    height: 211,
  },
  {
    id: 'negative',
    name: 'Negatyw',
    note: 'czerń i ciemne pola',
    ground: 'czern',
    width: 511,
    height: 211,
  },
] as const;

export const proportions = [
  { id: 'biel', name: 'Biel', share: 62 },
  { id: 'czern', name: 'Czerń', share: 28 },
  { id: 'kobalt', name: 'Kobalt', share: 10 },
] as const;
