import { describe, expect, it } from 'vitest';
import { dayFromParts } from './dates';
import { buildBookingQuery, parseBookingQuery } from './urlState';

const friday = dayFromParts(2026, 10, 9);

describe('reading the booking query', () => {
  it('reads every parameter', () => {
    const query = parseBookingQuery(
      '?arrival=2026-10-09&departure=2026-10-11&guests=3&room=rodzinny&rate=nonrefundable&package=1',
    );
    expect(query).toEqual({
      arrival: friday,
      departure: friday + 2,
      guests: 3,
      room: 'rodzinny',
      rate: 'nonRefundable',
      weekendPackage: true,
    });
  });

  it('falls back to defaults for an empty query', () => {
    expect(parseBookingQuery('')).toEqual({
      arrival: null,
      departure: null,
      guests: 2,
      room: null,
      rate: 'flexible',
      weekendPackage: false,
    });
  });

  it('works with and without the question mark', () => {
    expect(parseBookingQuery('guests=4').guests).toBe(4);
    expect(parseBookingQuery('?guests=4').guests).toBe(4);
  });

  it('drops invalid dates and keeps the rest', () => {
    const query = parseBookingQuery('?arrival=2026-02-30&departure=2026-10-11&guests=1');
    expect(query.arrival).toBeNull();
    expect(query.departure).toBeNull();
    expect(query.guests).toBe(1);
  });

  it('drops a departure that is not after the arrival', () => {
    expect(parseBookingQuery('?arrival=2026-10-09&departure=2026-10-09').departure).toBeNull();
    expect(parseBookingQuery('?arrival=2026-10-09&departure=2026-10-08').arrival).toBeNull();
    expect(parseBookingQuery('?arrival=2026-10-09').arrival).toBeNull();
  });

  it('keeps the guest count within the largest room', () => {
    expect(parseBookingQuery('?guests=0').guests).toBe(2);
    expect(parseBookingQuery('?guests=5').guests).toBe(2);
    expect(parseBookingQuery('?guests=2.5').guests).toBe(2);
    expect(parseBookingQuery('?guests=abc').guests).toBe(2);
    expect(parseBookingQuery('?guests=4').guests).toBe(4);
  });

  it('ignores unknown rooms, rates and parameters', () => {
    const query = parseBookingQuery('?room=penthouse&rate=free&package=yes&utm_source=x');
    expect(query.room).toBeNull();
    expect(query.rate).toBe('flexible');
    expect(query.weekendPackage).toBe(false);
  });
});

describe('writing the booking query', () => {
  it('writes the parameters in a fixed order', () => {
    expect(
      buildBookingQuery({
        weekendPackage: true,
        rate: 'nonRefundable',
        room: 'klasyczny',
        guests: 2,
        departure: friday + 2,
        arrival: friday,
      }),
    ).toBe(
      '?arrival=2026-10-09&departure=2026-10-11&guests=2&room=klasyczny&rate=nonrefundable&package=1',
    );
  });

  it('leaves out what is not set or is the default', () => {
    expect(buildBookingQuery({})).toBe('');
    expect(buildBookingQuery({ arrival: null, departure: null, room: null })).toBe('');
    expect(buildBookingQuery({ rate: 'flexible', weekendPackage: false })).toBe('');
    expect(buildBookingQuery({ guests: 3 })).toBe('?guests=3');
  });

  it('round trips', () => {
    const query = {
      arrival: friday,
      departure: friday + 3,
      guests: 4,
      room: 'rodzinny' as const,
      rate: 'nonRefundable' as const,
      weekendPackage: false,
    };
    expect(parseBookingQuery(buildBookingQuery(query))).toEqual(query);
  });
});
