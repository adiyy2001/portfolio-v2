import { describe, expect, it } from 'vitest';
import { defaultFilters, type Filters } from './filters';
import { filtersEqual, parseFilters, serializeFilters } from './url-state';

describe('url state', () => {
  it('parses an empty query as the default filters', () => {
    expect(parseFilters('')).toEqual(defaultFilters);
  });

  it('reads every parameter', () => {
    const filters = parseFilters(
      '?transakcja=sprzedaz&typ=mieszkanie&dzielnica=nadodrze,biskupin&pokoje=2,3&cena_od=400000&cena_do=900000&m2_od=40&m2_do=80&pietro=niskie,srednie&dodatki=balkon,winda&sort=cena-malejaco',
    );
    expect(filters).toEqual({
      transaction: 'sprzedaz',
      type: 'mieszkanie',
      districts: ['nadodrze', 'biskupin'],
      rooms: [2, 3],
      priceMin: 400000,
      priceMax: 900000,
      areaMin: 40,
      areaMax: 80,
      floors: ['niskie', 'srednie'],
      extras: ['balkon', 'winda'],
      sort: 'cena-malejaco',
    });
  });

  it('drops unknown and malformed values', () => {
    const filters = parseFilters(
      '?transakcja=kradziez&typ=zamek&dzielnica=atlantyda,gaj&pokoje=0,2,9,x&cena_od=-5&m2_do=abc&sort=losowo',
    );
    expect(filters.transaction).toBeNull();
    expect(filters.type).toBeNull();
    expect(filters.districts).toEqual(['gaj']);
    expect(filters.rooms).toEqual([2]);
    expect(filters.priceMin).toBeNull();
    expect(filters.areaMax).toBeNull();
    expect(filters.sort).toBe('najnowsze');
  });

  it('drops a maximum lower than the minimum', () => {
    const filters = parseFilters('?cena_od=900000&cena_do=100000&m2_od=80&m2_do=30');
    expect(filters.priceMax).toBeNull();
    expect(filters.areaMax).toBeNull();
  });

  it('treats empty values from a plain form as missing', () => {
    expect(parseFilters('?transakcja=sprzedaz&typ=&dzielnica=&pokoje=&cena_do=')).toEqual({
      ...defaultFilters,
      transaction: 'sprzedaz',
    });
  });

  it('serializes only what differs from the defaults', () => {
    expect(serializeFilters(defaultFilters)).toBe('');
    const filters: Filters = {
      ...defaultFilters,
      transaction: 'wynajem',
      districts: ['gaj', 'huby'],
      rooms: [2],
      priceMax: 3500,
      sort: 'cena-rosnaco',
    };
    expect(serializeFilters(filters)).toBe(
      'transakcja=wynajem&dzielnica=gaj,huby&pokoje=2&cena_do=3500&sort=cena-rosnaco',
    );
  });

  it('omits price parameters when no transaction is chosen', () => {
    expect(serializeFilters({ ...defaultFilters, priceMax: 3500 })).toBe('');
  });

  it('round trips through the query string', () => {
    const filters: Filters = {
      ...defaultFilters,
      transaction: 'sprzedaz',
      type: 'dom',
      districts: ['biskupin'],
      rooms: [4, 5],
      priceMin: 1000000,
      areaMin: 120,
      floors: [],
      extras: ['ogrod', 'parking'],
      sort: 'cena-za-m2',
    };
    expect(parseFilters(serializeFilters(filters))).toEqual(filters);
    expect(filtersEqual(filters, parseFilters(serializeFilters(filters)))).toBe(true);
    expect(filtersEqual(filters, defaultFilters)).toBe(false);
  });
});
