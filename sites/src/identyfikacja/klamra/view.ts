import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';
import { extras } from './content';
import { stickerBox, stickerSet, stickerSvg } from './lib/stickers';

export const slug = 'klamra';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/klamra-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

const iconLabels: Record<string, string> = { blad: 'błąd', galaz: 'gałąź' };

export const iconLabel = (name: string) => iconLabels[name] ?? name;

export const logoVariants = [
  {
    id: 'primary',
    name: 'Główne',
    alt: 'wersja główna',
    note: 'klamry, kursor i napis, gdy jest miejsce',
    ground: 'biel',
  },
  {
    id: 'horizontal',
    name: 'Poziome',
    alt: 'wersja pozioma',
    note: 'sygnet i napis obok siebie, paski i nagłówki',
    ground: 'mgla',
  },
  {
    id: 'vertical',
    name: 'Pionowe',
    alt: 'wersja pionowa',
    note: 'sygnet nad napisem, naklejki i kwadratowe pola',
    ground: 'mieta',
  },
  {
    id: 'symbol',
    name: 'Sygnet',
    alt: 'sygnet',
    note: 'sama ramka z klamrami, awatary i ikony',
    ground: 'niebo',
  },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    alt: 'wersja jednokolorowa',
    note: 'czarne, do druku w jednym kolorze',
    ground: 'biel',
  },
  {
    id: 'negative',
    name: 'Negatyw',
    alt: 'negatyw',
    note: 'na atramencie, żółta ramka zostaje',
    ground: 'atrament',
  },
] as const;

export const minimums = [
  { src: 'favicon.svg', width: 16, height: 16, label: 'Sygnet', text: extras.minimum.symbol },
  {
    src: 'logo/klamra-symbol.svg',
    width: 24,
    height: 24,
    label: 'Pełny znak',
    text: extras.minimum.fullStamp,
  },
  {
    src: 'logo/klamra-primary.svg',
    width: 120,
    height: 32,
    label: 'Logo główne',
    text: extras.minimum.primary,
  },
] as const;

export const sizeTest = [
  { src: 'favicon.svg', size: 16, label: 'ikona strony, 16 px' },
  { src: 'favicon.svg', size: 32, label: '32 px' },
  { src: 'logo/klamra-symbol.svg', size: 24, label: 'pełny sygnet, 24 px' },
  { src: 'logo/klamra-symbol.svg', size: 48, label: '48 px' },
  { src: 'logo/klamra-symbol.svg', size: 96, label: '96 px' },
  { src: 'logo/klamra-symbol.svg', size: 192, label: '192 px' },
] as const;

export const laptopArea = { width: 760, height: 480 };

export const laptopStickers = stickerSet.map(sticker => {
  const box = stickerBox(sticker);
  return {
    id: sticker.id,
    name: sticker.name,
    width: box.width,
    height: box.height,
    svg: stickerSvg(sticker),
  };
});

export const heroStickers = ['todo', 'push', 'semi'].map(id => {
  const sticker = stickerSet.find(item => item.id === id)!;
  const box = stickerBox(sticker);
  return { id, width: box.width, height: box.height, svg: stickerSvg(sticker) };
});

export const heroProof = [
  {
    src: 'mockups/klamra-card-front.jpg',
    width: 1800,
    height: 1260,
    alt: 'Awers wizytówki Klamry',
  },
  {
    src: 'social/klamra-post-1.png',
    width: 1080,
    height: 1350,
    alt: 'Post Klamry o pierwszej linijce kodu',
  },
  {
    src: 'social/klamra-avatar.png',
    width: 1080,
    height: 1080,
    alt: 'Awatar Klamry',
  },
] as const;

export const brandbookPreviews = extras.brandbookPages;
