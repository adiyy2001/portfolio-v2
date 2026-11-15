import { describe, expect, it } from 'vitest';
import { warsawClock } from './hours';
import { formatShortDate, pickupDayLabel, pickupDays, windowsFor } from './pickup';

const clockAt = (iso: string) => warsawClock(new Date(iso));

describe('pickupDays', () => {
  it('starts on the next opening day and skips Sundays', () => {
    const days = pickupDays(clockAt('2026-11-14T10:00:00Z'), 3);
    expect(days.map(day => day.iso)).toEqual(['2026-11-16', '2026-11-17', '2026-11-18']);
  });

  it('skips public holidays', () => {
    const days = pickupDays(clockAt('2026-11-10T10:00:00Z'), 2);
    expect(days.map(day => day.iso)).toEqual(['2026-11-12', '2026-11-13']);
  });

  it('gives Saturday shorter windows', () => {
    expect(windowsFor('2026-11-21')).toEqual(['9:00 do 12:00', '12:00 do 15:00']);
    expect(windowsFor('2026-11-16')).toEqual(['8:00 do 11:00', '11:00 do 14:00', '14:00 do 18:00']);
  });

  it('labels days in Polish', () => {
    expect(pickupDayLabel('2026-11-16')).toBe('poniedziałek 16.11');
    expect(formatShortDate('2026-12-05')).toBe('5.12');
  });
});
