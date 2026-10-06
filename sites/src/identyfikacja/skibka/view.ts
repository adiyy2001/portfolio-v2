import { assetUrl } from '../shared/manifest';
import type { Manifest } from '../shared/types';
import { hashSeed, loafParts, mulberry32, stampArt } from './lib/stamp';
import stampData from './stamp-data.json';

export const slug = 'skibka';

export const asset = (path: string) => assetUrl(slug, path);

export const fileInfo = (manifest: Manifest, path: string) =>
  manifest.files.find(file => file.path === path);

export const iconNames = (manifest: Manifest) =>
  manifest.files.flatMap(file => {
    const match = file.path.match(/^icons\/svg\/skibka-icon-(.+)\.svg$/);
    return match ? [match[1]] : [];
  });

export const logoVariants = [
  {
    id: 'primary',
    name: 'Główne',
    note: 'pieczątka i napis, gdy jest miejsce',
    ground: 'maka-biala',
  },
  {
    id: 'horizontal',
    name: 'Poziome',
    note: 'uproszczony sygnet, paski i nagłówki',
    ground: 'otreby',
  },
  { id: 'vertical', name: 'Pionowe', note: 'torby, naklejki, kwadratowe pola', ground: 'kraft' },
  {
    id: 'symbol',
    name: 'Sygnet',
    note: 'sama pieczątka, awatary i pieczątka na torbie',
    ground: 'maka-biala',
  },
  {
    id: 'mono-black',
    name: 'Jednokolorowe',
    note: 'czarne, do druku w jednym kolorze',
    ground: 'white',
  },
  { id: 'negative', name: 'Negatyw', note: 'jasne na żytnim tle', ground: 'zyto' },
] as const;

export const heroArt = (() => {
  const art = stampArt(hashSeed('hero'));
  const loaf = loafParts(hashSeed('hero-loaf'));
  const rng = mulberry32(hashSeed('flour'));
  const specks = Array.from({ length: 46 }, () => ({
    x: Number((rng() * 640).toFixed(1)),
    y: Number((rng() * 560).toFixed(1)),
    r: Number((0.8 + rng() * 2.4).toFixed(1)),
    o: Number((0.35 + rng() * 0.5).toFixed(2)),
  }));
  return { art, loaf, specks, ring: stampData.ring.d };
})();

export const pressData = { ring: stampData.ring.d, loaf: stampData.loaf };

export const mockupSize: Record<string, [number, number]> = {
  'mockups/skibka-card-front.jpg': [1800, 1260],
  'mockups/skibka-card-back.jpg': [1800, 1260],
  'mockups/skibka-letterhead.jpg': [1500, 1860],
  'mockups/skibka-application.jpg': [1900, 1400],
  'mockups/skibka-email-signature.jpg': [1600, 1100],
};
