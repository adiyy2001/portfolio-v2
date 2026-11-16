import { link } from '../../../shared/link';
import type { OfferImage } from '../data/offers';

export interface ImageSet {
  src: string;
  srcset: string;
}

export const imagePath = (key: string, width: number): string =>
  link(`/nieruchomosci-psie-pole/img/${key}-${width}.webp`);

export const imageSet = (key: string, widths: readonly number[]): ImageSet => {
  const sorted = [...widths].sort((a, b) => a - b);
  const middle = sorted[Math.min(1, sorted.length - 1)] ?? sorted[0] ?? 0;
  return {
    src: imagePath(key, middle),
    srcset: sorted.map(width => `${imagePath(key, width)} ${width}w`).join(', '),
  };
};

export const offerImageSet = (image: OfferImage): ImageSet => imageSet(image.key, image.widths);
