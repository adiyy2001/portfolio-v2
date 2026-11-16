import { describe, expect, it } from 'vitest';
import { countMatching, emptyFilters, matches, parseFilters, rowOf, toQuery } from './filter';
import { units } from './data';

const rows = units.map(rowOf);

describe('filters', () => {
  it('shows everything without filters', () => {
    expect(countMatching(rows, emptyFilters())).toBe(67);
  });

  it('combines groups with and, values inside a group with or', () => {
    const filters = { rooms: ['2', '3'], floor: [], status: ['dostepny'] };
    const count = rows.filter(
      row => ['2', '3'].includes(row.rooms) && row.status === 'dostepny',
    ).length;
    expect(countMatching(rows, filters)).toBe(count);
    expect(matches({ rooms: '4', floor: 'pietro-3', status: 'dostepny' }, filters)).toBe(false);
  });

  it('filters by floor', () => {
    expect(countMatching(rows, { rooms: [], floor: ['parter'], status: [] })).toBe(28);
  });

  it('round trips through the query string', () => {
    const filters = { rooms: ['2', '4'], floor: ['parter'], status: ['dostepny', 'zarezerwowany'] };
    expect(toQuery(filters)).toBe('?pokoje=2,4&pietro=parter&status=dostepny,zarezerwowany');
    expect(parseFilters(toQuery(filters))).toEqual(filters);
    expect(toQuery(emptyFilters())).toBe('');
  });

  it('ignores unknown parameters', () => {
    expect(parseFilters('?x=1')).toEqual(emptyFilters());
  });
});
