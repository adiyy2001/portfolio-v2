import { describe, expect, it } from 'vitest';
import { weekdayOf } from '../lib/dates';
import { isWeekendNight, seasonOf } from '../lib/pricing';
import { exampleNights } from './exampleNights';

const byKey = (key: string) => exampleNights.find(example => example.key === key)?.night ?? 0;

describe('example nights', () => {
  it('falls on the weekdays the page text names', () => {
    expect(weekdayOf(byKey('weekday'))).toBe(2);
    expect(weekdayOf(byKey('weekend'))).toBe(5);
    expect(weekdayOf(byKey('summerWeekday'))).toBe(2);
    expect(weekdayOf(byKey('summerWeekend'))).toBe(5);
    expect(weekdayOf(byKey('market'))).toBe(2);
    expect(weekdayOf(byKey('newYearsEve'))).toBe(5);
  });

  it('falls in the season the page text names', () => {
    expect(seasonOf(byKey('weekday'))).toBeNull();
    expect(isWeekendNight(byKey('weekend'))).toBe(true);
    expect(seasonOf(byKey('summerWeekday'))).toBe('highSeason');
    expect(seasonOf(byKey('market'))).toBe('christmasMarket');
    expect(seasonOf(byKey('newYearsEve'))).toBe('newYearsEve');
  });
});
