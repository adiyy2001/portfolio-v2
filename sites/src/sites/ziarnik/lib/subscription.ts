import { getCoffee } from '../data/catalog';
import { degreePriceZl, numbers, subscriptionTerms } from '../data/site';
import { perKgGr } from './pricing';

export interface SubscriptionQuote {
  bags: number;
  bagPriceGr: number;
  weeklyGr: number;
  gramsPerWeek: number;
  cupsPerWeek: number;
  perKgGr: number;
}

export const subscriptionBagPriceGr = degreePriceZl[subscriptionTerms.degree] * 100;

export const clampBags = (bags: number): number =>
  Math.min(subscriptionTerms.maxBags, Math.max(1, Math.floor(bags)));

export const quoteSubscription = (bags: number): SubscriptionQuote => {
  const count = clampBags(bags);
  return {
    bags: count,
    bagPriceGr: subscriptionBagPriceGr,
    weeklyGr: subscriptionBagPriceGr * count,
    gramsPerWeek: numbers.bagGrams * count,
    cupsPerWeek: Math.floor(numbers.bagGrams / 15) * count,
    perKgGr: perKgGr(subscriptionBagPriceGr),
  };
};

export const subscriptionCoffeeLabel = (id: string): string =>
  id === 'dobor' ? 'Dobiera Hubert, zawsze stopień 6' : (getCoffee(id)?.name ?? '');
