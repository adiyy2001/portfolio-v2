import { describe, expect, it } from 'vitest';
import { dishes } from '../data/menu';
import {
  countByAllergen,
  formatCount,
  isFiltering,
  matchesFilters,
  noFilters,
  parseAllergens,
  parseDiet,
  filtersFromSearch,
  searchFromFilters,
  parseDietFilter,
  type Filters,
} from './menu-filter';

const visible = (filters: Filters) => dishes.filter(dish => matchesFilters(dish, filters));

describe('matchesFilters', () => {
  it('shows everything without filters', () => {
    expect(visible(noFilters())).toHaveLength(dishes.length);
  });

  it('keeps vegan dishes when vegetarian is chosen', () => {
    const result = visible({ diet: 'vegetarian', without: new Set() });
    expect(result.some(dish => dish.diet === 'vegan')).toBe(true);
    expect(result.some(dish => dish.diet === 'vegetarian')).toBe(true);
    expect(result.every(dish => dish.diet !== 'none')).toBe(true);
  });

  it('keeps only vegan dishes when vegan is chosen', () => {
    const result = visible({ diet: 'vegan', without: new Set() });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(dish => dish.diet === 'vegan')).toBe(true);
  });

  it('hides dishes that contain an excluded allergen', () => {
    const result = visible({ diet: 'any', without: new Set(['gluten']) });
    expect(result.every(dish => !dish.allergens.includes('gluten'))).toBe(true);
    expect(result.length).toBeLessThan(dishes.length);
  });

  it('combines several allergens and the diet', () => {
    const result = visible({ diet: 'vegetarian', without: new Set(['gluten', 'milk']) });
    expect(
      result.every(
        dish =>
          dish.diet !== 'none' &&
          !dish.allergens.includes('gluten') &&
          !dish.allergens.includes('milk'),
      ),
    ).toBe(true);
  });

  it('can end with nothing left', () => {
    expect(visible({ diet: 'vegan', without: new Set(['celery', 'gluten', 'nuts']) }).length).toBe(
      3,
    );
    expect(
      visible({ diet: 'vegan', without: new Set(['celery']) }).every(dish => dish.id !== 'golabki'),
    ).toBe(true);
  });
});

describe('isFiltering', () => {
  it('tells whether any filter is active', () => {
    expect(isFiltering(noFilters())).toBe(false);
    expect(isFiltering({ diet: 'vegan', without: new Set() })).toBe(true);
    expect(isFiltering({ diet: 'any', without: new Set(['eggs']) })).toBe(true);
  });
});

describe('countByAllergen', () => {
  it('counts dishes per allergen and returns zero for absent ones', () => {
    const counts = countByAllergen(dishes);
    expect(counts.gluten).toBe(dishes.filter(dish => dish.allergens.includes('gluten')).length);
    expect(counts.lupin).toBe(0);
    expect(counts.molluscs).toBe(0);
  });
});

describe('parsing', () => {
  it('parses allergen lists from attributes and ignores unknown tokens', () => {
    expect(parseAllergens('gluten milk  nonsense')).toEqual(['gluten', 'milk']);
    expect(parseAllergens(undefined)).toEqual([]);
    expect(parseAllergens('')).toEqual([]);
  });

  it('parses the diet attribute', () => {
    expect(parseDiet('vegan')).toBe('vegan');
    expect(parseDiet('vegetarian')).toBe('vegetarian');
    expect(parseDiet('whatever')).toBe('none');
    expect(parseDiet(undefined)).toBe('none');
  });
});

describe('formatCount', () => {
  it('fills the template with the numbers', () => {
    expect(formatCount('Pokazuję {shown} z {total} pozycji.', 7, 22)).toBe(
      'Pokazuję 7 z 22 pozycji.',
    );
    expect(formatCount('Showing {shown} of {total} items.', 0, 22)).toBe('Showing 0 of 22 items.');
  });
});

describe('filter URL state', () => {
  it('writes nothing when no filter is active', () => {
    expect(searchFromFilters(noFilters())).toBe('');
  });

  it('writes the diet and the allergens in the canonical order', () => {
    const filters: Filters = { diet: 'vegan', without: new Set(['milk', 'gluten']) };
    expect(searchFromFilters(filters)).toBe('?dieta=vegan&bez=gluten,milk');
  });

  it('reads back what it wrote', () => {
    const filters: Filters = { diet: 'vegetarian', without: new Set(['eggs', 'celery']) };
    const restored = filtersFromSearch(searchFromFilters(filters));
    expect(restored.diet).toBe('vegetarian');
    expect([...restored.without].sort()).toEqual(['celery', 'eggs']);
  });

  it('ignores unknown values', () => {
    const restored = filtersFromSearch('?dieta=paleo&bez=gluten,nonsense');
    expect(restored.diet).toBe('any');
    expect([...restored.without]).toEqual(['gluten']);
  });

  it('falls back to any diet for a missing value', () => {
    expect(parseDietFilter(null)).toBe('any');
    expect(parseDietFilter('vegan')).toBe('vegan');
  });
});
