import { describe, expect, it } from 'vitest';
import { flats } from './data';
import {
  defaultState,
  filterAndSort,
  hasFilters,
  matchesFilters,
  parseQuery,
  resultText,
  toQuery,
  toggleValue,
} from './finder';

describe('query state', () => {
  it('reads every parameter', () => {
    expect(parseQuery('?pokoje=2,3&pietro=0,4&wolne=1&sortuj=cena-malejaco')).toEqual({
      rooms: [2, 3],
      floors: [0, 4],
      onlyAvailable: true,
      sort: 'cena-malejaco',
    });
  });

  it('ignores junk and keeps only allowed values', () => {
    expect(parseQuery('?pokoje=9,x,3,3&pietro=7&sortuj=foo&wolne=0')).toEqual({
      rooms: [3],
      floors: [],
      onlyAvailable: false,
      sort: 'numer',
    });
    expect(parseQuery('')).toEqual(defaultState);
  });

  it('writes a short query and nothing for the default state', () => {
    expect(toQuery(defaultState)).toBe('');
    expect(toQuery({ rooms: [3, 2], floors: [4, 0], onlyAvailable: true, sort: 'numer' })).toBe(
      '?pokoje=2,3&pietro=0,4&wolne=1',
    );
    expect(toQuery({ ...defaultState, sort: 'powierzchnia-rosnaco' })).toBe(
      '?sortuj=powierzchnia-rosnaco',
    );
  });

  it('round-trips a shared link', () => {
    const state = parseQuery('?pokoje=4&pietro=1,2,3&wolne=1&sortuj=cena-rosnaco');
    expect(parseQuery(toQuery(state))).toEqual(state);
  });

  it('tells whether any filter is on', () => {
    expect(hasFilters(defaultState)).toBe(false);
    expect(hasFilters({ ...defaultState, sort: 'cena-rosnaco' })).toBe(false);
    expect(hasFilters({ ...defaultState, floors: [2] })).toBe(true);
    expect(hasFilters({ ...defaultState, onlyAvailable: true })).toBe(true);
  });

  it('toggles a value in a list', () => {
    expect(toggleValue([2], 3)).toEqual([2, 3]);
    expect(toggleValue([2, 3], 2)).toEqual([3]);
  });
});

describe('filtering and sorting', () => {
  it('returns every flat for the default state', () => {
    expect(filterAndSort(flats, defaultState)).toHaveLength(48);
  });

  it('combines rooms, floors and availability', () => {
    const result = filterAndSort(flats, {
      rooms: [3],
      floors: [3, 4],
      onlyAvailable: true,
      sort: 'numer',
    });
    expect(result.length).toBeGreaterThan(0);
    for (const flat of result) {
      expect(flat.rooms).toBe(3);
      expect([3, 4]).toContain(flat.floor);
      expect(flat.status).toBe('available');
    }
    expect(result.length).toBe(
      flats.filter(flat => flat.rooms === 3 && flat.floor >= 3 && flat.status === 'available')
        .length,
    );
  });

  it('keeps the matcher and the list in agreement', () => {
    const state = parseQuery('?pokoje=2,4&pietro=1');
    const ids = new Set(filterAndSort(flats, state));
    for (const flat of flats) expect(ids.has(flat)).toBe(matchesFilters(flat, state));
  });

  it('sorts by price and area in both directions without changing the input', () => {
    const before = [...flats];
    const cheap = filterAndSort(flats, { ...defaultState, sort: 'cena-rosnaco' });
    const dear = filterAndSort(flats, { ...defaultState, sort: 'cena-malejaco' });
    const small = filterAndSort(flats, { ...defaultState, sort: 'powierzchnia-rosnaco' });
    const large = filterAndSort(flats, { ...defaultState, sort: 'powierzchnia-malejaco' });
    expect(cheap[0].price).toBe(Math.min(...flats.map(flat => flat.price)));
    expect(dear[0].price).toBe(Math.max(...flats.map(flat => flat.price)));
    expect(small[0].area).toBe(Math.min(...flats.map(flat => flat.area)));
    expect(large[0].area).toBe(Math.max(...flats.map(flat => flat.area)));
    expect(flats).toEqual(before);
  });
});

describe('result text', () => {
  it('uses the right verb and noun form', () => {
    expect(resultText(1, 48)).toBe('Pasuje 1 mieszkanie z 48.');
    expect(resultText(3, 48)).toBe('Pasują 3 mieszkania z 48.');
    expect(resultText(14, 48)).toBe('Pasuje 14 mieszkań z 48.');
    expect(resultText(22, 48)).toBe('Pasują 22 mieszkania z 48.');
    expect(resultText(0, 48)).toBe('Żadne mieszkanie nie pasuje do tych filtrów.');
  });
});
