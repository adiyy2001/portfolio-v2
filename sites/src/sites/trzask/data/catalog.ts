import { accessories } from './accessories';
import { coffees } from './coffees';
import type { Accessory, Coffee, Product } from './types';

export { accessories, coffees };

export const products: Product[] = [...coffees, ...accessories];

const productById = new Map<string, Product>(products.map(product => [product.id, product]));

export const getProduct = (id: string): Product | undefined => productById.get(id);

export const getCoffee = (id: string): Coffee | undefined => {
  const product = productById.get(id);
  return product?.kind === 'coffee' ? product : undefined;
};

export const getAccessory = (id: string): Accessory | undefined => {
  const product = productById.get(id);
  return product?.kind === 'accessory' ? product : undefined;
};

const relatedScore = (base: Coffee, other: Coffee): number => {
  let score = 0;
  if (other.roast === base.roast) score += 2;
  if (other.process === base.process) score += 1;
  if (other.brew.some(method => base.brew.includes(method))) score += 1;
  return score;
};

export const relatedCoffees = (id: string, count: number): Coffee[] => {
  const base = getCoffee(id);
  if (!base) return [];
  return coffees
    .map((coffee, index) => ({ coffee, index, score: relatedScore(base, coffee) }))
    .filter(entry => entry.coffee.id !== id)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(entry => entry.coffee);
};

export const accessoriesForCoffee = (id: string): Accessory[] => {
  const base = getCoffee(id);
  if (!base) return [];
  return accessories.filter(accessory => accessory.tags.includes(base.recipe.method));
};
