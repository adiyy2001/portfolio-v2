import { assetUrl } from '../shared/manifest';
import { pluralPl } from '../shared/format';
import type { Manifest, ManifestGroup } from '../shared/types';
import { extras } from './content';

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

const outsideZip = ['mockups', 'animation'];

export const inZip = (group: ManifestGroup) => !outsideZip.includes(group.id);

export const groupFormats = (manifest: Manifest, group: ManifestGroup) => {
  const first = manifest.files.find(file => file.group === group.id);
  switch (group.id) {
    case 'logo':
      return 'SVG, PDF, PNG w trzech rozmiarach: dłuższy bok 512, 1024 i 2048 px';
    case 'print':
      return 'PDF, wizytówka 91×61 mm ze spadem 3 mm, papier A4';
    case 'social':
      return 'PNG, awatar 1080×1080 px, posty 1080×1350 px';
    case 'mockups': {
      const widths = Object.values(extras.mockupSizes).map(([width]) => width);
      return `JPG, szerokość ${Math.min(...widths)} do ${Math.max(...widths)} px`;
    }
    case 'animation':
      return `MP4, WebM, ${first?.width}×${first?.height} px, 3 s`;
    case 'brandbook':
      return `PDF, ${first?.pages} ${pluralPl(first?.pages ?? 0, 'strona', 'strony', 'stron')} 1920×1080 px`;
    default:
      return group.formats;
  }
};
