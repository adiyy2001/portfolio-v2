import type { Product, WeightGrams } from '../data/types';

export const defaultWeight: WeightGrams = 250;

export const weightPriceZl = (base250: number, grams: WeightGrams): number => {
  if (grams === 250) return base250;
  if (grams === 500) return Math.round((base250 * 192) / 100);
  return Math.round((base250 * 368) / 100);
};

export const weightPriceGr = (base250: number, grams: WeightGrams): number =>
  weightPriceZl(base250, grams) * 100;

export const unitPricePerKgGr = (priceGr: number, grams: number): number =>
  Math.round((priceGr * 1000) / grams);

export const productPriceGr = (product: Product, weight: WeightGrams | null): number =>
  product.kind === 'coffee'
    ? weightPriceGr(product.base250, weight ?? defaultWeight)
    : product.price * 100;

export const lowestPriceGr = (product: Product): number => productPriceGr(product, defaultWeight);
