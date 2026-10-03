import { describe, expect, it } from 'vitest';
import { allergenIds, allergens } from './allergens';
import { dishes, featuredDishIds, sections } from './menu';
import { langs } from './lang';

const animal = ['fish', 'crustaceans', 'molluscs'] as const;
const dairyOrEgg = ['milk', 'eggs'] as const;

describe('allergen list', () => {
  it('has the fourteen allergens of the EU list exactly once', () => {
    expect(allergens).toHaveLength(14);
    expect(allergens.map(allergen => allergen.id).sort()).toEqual([...allergenIds].sort());
  });

  it('uses a unique two letter code per language', () => {
    for (const lang of langs) {
      const codes = allergens.map(allergen => allergen.code[lang]);
      expect(new Set(codes).size).toBe(codes.length);
      expect(codes.every(code => /^[A-Z]{2}$/.test(code))).toBe(true);
    }
  });
});

describe('menu data', () => {
  it('has unique dish ids', () => {
    expect(new Set(dishes.map(dish => dish.id)).size).toBe(dishes.length);
  });

  it('puts every dish in a known section and fills every section', () => {
    const known = new Set(sections.map(section => section.id));
    expect(dishes.every(dish => known.has(dish.section))).toBe(true);
    for (const section of sections) {
      expect(dishes.some(dish => dish.section === section.id)).toBe(true);
    }
  });

  it('uses whole positive prices', () => {
    expect(dishes.every(dish => Number.isInteger(dish.price) && dish.price > 0)).toBe(true);
  });

  it('names every dish in both languages', () => {
    for (const dish of dishes) {
      for (const lang of langs) {
        expect(dish.name[lang].length).toBeGreaterThan(1);
      }
    }
  });

  it('never marks a dish with animal products as vegetarian or vegan', () => {
    for (const dish of dishes.filter(item => item.diet !== 'none')) {
      expect(dish.allergens.some(allergen => animal.some(name => name === allergen))).toBe(false);
    }
  });

  it('never marks a dish with dairy or eggs as vegan', () => {
    for (const dish of dishes.filter(item => item.diet === 'vegan')) {
      expect(dish.allergens.some(allergen => dairyOrEgg.some(name => name === allergen))).toBe(
        false,
      );
    }
  });

  it('lists each allergen of a dish once', () => {
    for (const dish of dishes) {
      expect(new Set(dish.allergens).size).toBe(dish.allergens.length);
    }
  });

  it('features dishes that exist, in the order of the first design', () => {
    expect(featuredDishIds.every(id => dishes.some(dish => dish.id === id))).toBe(true);
    expect(dishes.find(dish => dish.id === featuredDishIds[0])?.price).toBe(34);
  });
});
