import { describe, expect, it } from 'vitest';
import { coffees } from '../data/catalog';
import {
  activeFilterCount,
  clearFilters,
  defaultFilters,
  parseFilters,
  resultMessage,
  serializeFilters,
  toggleFilter,
  visibleCoffees,
} from './filters';
import type { FilterState } from './filters';

const ids = (state: FilterState) => visibleCoffees(coffees, state).map(coffee => coffee.id);

describe('filter URL state', () => {
  it('parses an empty query to the defaults', () => {
    expect(parseFilters('')).toEqual(defaultFilters);
    expect(parseFilters('?')).toEqual(defaultFilters);
  });

  it('reads comma separated values in canonical order', () => {
    const state = parseFilters('?palenie=srednie,jasne&parzenie=przelew&sortuj=cena-rosnaco');
    expect(state.roast).toEqual(['jasne', 'srednie']);
    expect(state.brew).toEqual(['przelew']);
    expect(state.sort).toBe('cena-rosnaco');
  });

  it('ignores unknown values and unknown sort ids', () => {
    const state = parseFilters('?palenie=bardzo-ciemne,ciemne&kraj=atlantyda&sortuj=losowo');
    expect(state.roast).toEqual(['ciemne']);
    expect(state.country).toEqual([]);
    expect(state.sort).toBe('polecane');
  });

  it('serializes only what differs from the defaults', () => {
    expect(serializeFilters(defaultFilters)).toBe('');
    expect(
      serializeFilters({
        ...defaultFilters,
        roast: ['jasne', 'srednie'],
        process: ['myta'],
        sort: 'nazwa',
      }),
    ).toBe('?palenie=jasne,srednie&obrobka=myta&sortuj=nazwa');
  });

  it('round-trips through the query string', () => {
    const state: FilterState = {
      roast: ['jasne'],
      brew: ['przelew', 'aeropress'],
      country: ['etiopia', 'kenia'],
      process: ['naturalna'],
      sort: 'cena-malejaco',
    };
    expect(parseFilters(serializeFilters(state))).toEqual(state);
  });
});

describe('toggling filters', () => {
  it('adds values in canonical order and removes them again', () => {
    const withDark = toggleFilter(defaultFilters, 'roast', 'ciemne');
    const withBoth = toggleFilter(withDark, 'roast', 'jasne');
    expect(withBoth.roast).toEqual(['jasne', 'ciemne']);
    expect(toggleFilter(withBoth, 'roast', 'ciemne').roast).toEqual(['jasne']);
  });

  it('ignores values that do not belong to the group', () => {
    expect(toggleFilter(defaultFilters, 'roast', 'myta')).toBe(defaultFilters);
  });

  it('clears the selections but keeps the sort', () => {
    const state = toggleFilter({ ...defaultFilters, sort: 'nazwa' }, 'brew', 'espresso');
    expect(activeFilterCount(state)).toBe(1);
    expect(clearFilters(state)).toEqual({ ...defaultFilters, sort: 'nazwa' });
  });
});

describe('visibleCoffees', () => {
  it('shows every coffee without filters', () => {
    expect(ids(defaultFilters)).toHaveLength(coffees.length);
  });

  it('matches any value inside a group', () => {
    const light = ids({ ...defaultFilters, roast: ['jasne'] });
    const dark = ids({ ...defaultFilters, roast: ['ciemne'] });
    const both = ids({ ...defaultFilters, roast: ['jasne', 'ciemne'] });
    expect(both).toHaveLength(light.length + dark.length);
  });

  it('requires every group to match', () => {
    const result = ids({ ...defaultFilters, roast: ['jasne'], country: ['etiopia'] });
    expect(result).toEqual(['etiopia-gedeb', 'etiopia-guji']);
    expect(ids({ ...defaultFilters, roast: ['ciemne'], country: ['etiopia'] })).toEqual([]);
  });

  it('filters by brew method and process', () => {
    expect(ids({ ...defaultFilters, brew: ['espresso'] }).length).toBeGreaterThan(0);
    expect(ids({ ...defaultFilters, process: ['anaerobowa'] })).toEqual(['kolumbia-narino']);
  });

  it('sorts by price in both directions', () => {
    const rising = visibleCoffees(coffees, { ...defaultFilters, sort: 'cena-rosnaco' });
    const falling = visibleCoffees(coffees, { ...defaultFilters, sort: 'cena-malejaco' });
    expect(rising[0].base250).toBe(Math.min(...coffees.map(coffee => coffee.base250)));
    expect(falling[0].base250).toBe(Math.max(...coffees.map(coffee => coffee.base250)));
  });

  it('sorts by roast level from light to dark and keeps the catalog order inside a level', () => {
    const sorted = visibleCoffees(coffees, { ...defaultFilters, sort: 'palenie' });
    const order = sorted.map(coffee => coffee.roast);
    expect(order.indexOf('ciemne')).toBeGreaterThan(order.lastIndexOf('srednie'));
    expect(order.indexOf('srednie')).toBeGreaterThan(order.lastIndexOf('jasne'));
  });

  it('sorts names with Polish collation', () => {
    const sorted = visibleCoffees(coffees, { ...defaultFilters, sort: 'nazwa' });
    const names = sorted.map(coffee => coffee.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pl')));
  });
});

describe('resultMessage', () => {
  it('declines the noun by count', () => {
    expect(resultMessage(1, 12)).toBe('Pokazano 1 kawę z 12.');
    expect(resultMessage(3, 12)).toBe('Pokazano 3 kawy z 12.');
    expect(resultMessage(12, 12)).toBe('Pokazano 12 kaw z 12.');
  });

  it('says when nothing matches', () => {
    expect(resultMessage(0, 12)).toBe('Żadna kawa nie pasuje do wybranych filtrów.');
  });
});
