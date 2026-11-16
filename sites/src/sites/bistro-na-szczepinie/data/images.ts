import type { ImageId } from './events';

export interface SiteImage {
  file: string;
  width: number;
  height: number;
}

export const images: Record<ImageId, SiteImage> = {
  poledwiczki: { file: 'poledwiczki.webp', width: 2000, height: 1333 },
  zupa: { file: 'zupa.webp', width: 1800, height: 1328 },
  buraki: { file: 'buraki.webp', width: 1800, height: 1200 },
  sala: { file: 'sala.webp', width: 1500, height: 1000 },
  pierogi: { file: 'pierogi.webp', width: 1600, height: 1066 },
  wino: { file: 'wino.webp', width: 1600, height: 1066 },
  sniadanie: { file: 'sniadanie.webp', width: 1600, height: 1066 },
};

export const imagePath = (id: ImageId) => `/bistro-na-szczepinie/img/${images[id].file}`;
