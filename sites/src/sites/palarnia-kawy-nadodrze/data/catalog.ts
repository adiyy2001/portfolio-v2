import { coffees } from './coffees';
import { degreePriceZl } from './site';
import type { Coffee } from './types';

export { coffees };

const coffeeById = new Map<string, Coffee>(coffees.map(coffee => [coffee.id, coffee]));

export const getCoffee = (id: string): Coffee | undefined => coffeeById.get(id);

export const coffeePriceZl = (coffee: Coffee): number => degreePriceZl[coffee.degree];

export const coffeePriceGr = (coffee: Coffee): number => coffeePriceZl(coffee) * 100;

export const coffeesAtDegree = (degree: Coffee['degree']): Coffee[] =>
  coffees.filter(coffee => coffee.degree === degree);

export const relatedCoffees = (id: string, count: number): Coffee[] => {
  const base = getCoffee(id);
  if (!base) return [];
  return coffees
    .filter(coffee => coffee.id !== id)
    .map((coffee, index) => ({
      coffee,
      index,
      score: (coffee.degree === base.degree ? 2 : 0) + (coffee.country === base.country ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(entry => entry.coffee);
};
