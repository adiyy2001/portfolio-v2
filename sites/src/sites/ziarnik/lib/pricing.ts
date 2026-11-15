import { numbers } from '../data/site';

export const perKgGr = (priceGr: number, grams: number = numbers.bagGrams): number =>
  Math.round((priceGr * 1000) / grams);
