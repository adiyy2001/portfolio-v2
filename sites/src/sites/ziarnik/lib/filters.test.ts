import { describe, expect, it } from 'vitest';
import { coffees } from '../data/catalog';
import {
  activeFilterCount,
  clearFilters,
  defaultFilters,
  matchesFilters,
  parseFilters,
  resultMessage,
  serializeFilters,
  toggleFilter,
  visibleCoffees,
} from './filters';

describe('filter url', () => {
  it('round trips a state and ignores unknown values', () => {
    const state = {
      ...defaultFilters,
      degree: [3, 9] as Array<3 | 6 | 9>,
      country: ['kenia' as const],
    };
    expect(serializeFilters(state)).toBe('?stopien=3,9&kraj=kenia');
    expect(parseFilters(serializeFilters(state))).toEqual(state);
    expect(parseFilters('?stopien=4,6&kraj=mars&sortuj=zly')).toEqual({
      ...defaultFilters,
      degree: [6],
    });
    expect(serializeFilters(defaultFilters)).toBe('');
  });

  it('keeps the sort in the url', () => {
    expect(serializeFilters({ ...defaultFilters, sort: 'nazwa' })).toBe('?sortuj=nazwa');
  });
});

describe('toggle and clear', () => {
  it('toggles values in a stable order', () => {
    const one = toggleFilter(defaultFilters, 'degree', '9');
    const two = toggleFilter(one, 'degree', '3');
    expect(two.degree).toEqual([3, 9]);
    expect(toggleFilter(two, 'degree', '9').degree).toEqual([3]);
    expect(toggleFilter(two, 'degree', '5')).toBe(two);
    expect(activeFilterCount(two)).toBe(2);
  });

  it('clears filters but keeps the sort', () => {
    const state = { ...toggleFilter(defaultFilters, 'brew', 'espresso'), sort: 'nazwa' as const };
    expect(clearFilters(state)).toEqual({ ...defaultFilters, sort: 'nazwa' });
  });
});

describe('visibleCoffees', () => {
  it('filters across groups with and, within a group with or', () => {
    const state = {
      ...defaultFilters,
      degree: [3, 9] as Array<3 | 6 | 9>,
      brew: ['espresso' as const],
    };
    const shown = visibleCoffees(coffees, state);
    expect(shown.length).toBeGreaterThan(0);
    shown.forEach(coffee => {
      expect(matchesFilters(coffee, state)).toBe(true);
      expect(coffee.degree).toBe(9);
    });
  });

  it('sorts by price and degree without losing stability', () => {
    const cheap = visibleCoffees(coffees, { ...defaultFilters, sort: 'cena-rosnaco' });
    expect(cheap[0].degree).toBe(6);
    expect(cheap[cheap.length - 1].degree).toBe(3);
    const dark = visibleCoffees(coffees, { ...defaultFilters, sort: 'palenie' });
    expect(dark.map(coffee => coffee.degree)).toEqual([3, 3, 3, 6, 6, 6, 9, 9, 9]);
  });

  it('describes the result', () => {
    expect(resultMessage(0, 9)).toBe('Żadna kawa nie pasuje do wybranych filtrów.');
    expect(resultMessage(1, 9)).toBe('Pokazano 1 kawę z 9.');
    expect(resultMessage(3, 9)).toBe('Pokazano 3 kawy z 9.');
    expect(resultMessage(5, 9)).toBe('Pokazano 5 kaw z 9.');
  });
});
