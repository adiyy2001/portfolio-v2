import { describe, expect, it } from 'vitest';
import {
  accessories,
  accessoriesForCoffee,
  coffees,
  getAccessory,
  getCoffee,
  getProduct,
  products,
  relatedCoffees,
} from './catalog';
import { accessoryCopy, coffeeCopy } from './copy';
import { brewOrder, countryOrder, processOrder, roastOrder } from './facets';
import { recipeTemplates } from './recipes';

describe('catalog', () => {
  it('has twelve coffees and four accessories with unique ids', () => {
    expect(coffees).toHaveLength(12);
    expect(accessories).toHaveLength(4);
    expect(new Set(products.map(product => product.id)).size).toBe(products.length);
  });

  it('looks products up by id and kind', () => {
    expect(getProduct('etiopia-gedeb')?.kind).toBe('coffee');
    expect(getCoffee('dripper-02')).toBeUndefined();
    expect(getAccessory('dripper-02')?.name).toBe('Dripper ceramiczny 02');
    expect(getProduct('nie-ma')).toBeUndefined();
  });

  it('keeps every coffee inside the known facets', () => {
    for (const coffee of coffees) {
      expect(roastOrder).toContain(coffee.roast);
      expect(processOrder).toContain(coffee.process);
      expect(countryOrder).toContain(coffee.country);
      expect(coffee.brew.length).toBeGreaterThan(0);
      expect(coffee.brew).toContain(coffee.recipe.method);
      for (const method of coffee.brew) expect(brewOrder).toContain(method);
      expect(recipeTemplates[coffee.recipe.method]).toBeDefined();
      expect(coffee.notes).toHaveLength(3);
      expect(coffeeCopy[coffee.id].story.length).toBeGreaterThanOrEqual(2);
      expect(coffeeCopy[coffee.id].tip.length).toBeGreaterThan(20);
    }
  });

  it('has copy for every accessory', () => {
    for (const accessory of accessories) {
      const copy = accessoryCopy[accessory.id];
      expect(copy.description.length).toBeGreaterThanOrEqual(2);
      expect(copy.specs.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('suggests other coffees of a similar kind first', () => {
    const related = relatedCoffees('etiopia-gedeb', 3);
    expect(related).toHaveLength(3);
    expect(related.map(coffee => coffee.id)).not.toContain('etiopia-gedeb');
    expect(related[0].roast).toBe('jasne');
    expect(relatedCoffees('dripper-02', 3)).toEqual([]);
  });

  it('suggests accessories that match the brew method', () => {
    const forPourOver = accessoriesForCoffee('etiopia-gedeb').map(item => item.id);
    expect(forPourOver).toContain('dripper-02');
    expect(forPourOver).toContain('filtry-02');
    expect(accessoriesForCoffee('dripper-02')).toEqual([]);
  });
});
