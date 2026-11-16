import { describe, expect, it } from 'vitest';
import { closedDates, openingSchedule } from '../data/site';
import { describeOpening, shiftIso, warsawClock, weekdayOfIso } from './hours';

const at = (iso: string) => warsawClock(new Date(iso));

describe('warsawClock', () => {
  it('reads the Warsaw date and minutes in winter and summer', () => {
    expect(at('2026-11-16T07:30:00Z')).toEqual({ iso: '2026-11-16', weekday: 1, minutes: 510 });
    expect(at('2026-07-04T06:00:00Z')).toEqual({ iso: '2026-07-04', weekday: 6, minutes: 480 });
  });

  it('moves to the next Warsaw day late in the evening', () => {
    expect(at('2026-11-15T23:30:00Z').iso).toBe('2026-11-16');
  });
});

describe('date helpers', () => {
  it('shifts across month ends and finds weekdays', () => {
    expect(shiftIso('2026-11-30', 1)).toBe('2026-12-01');
    expect(shiftIso('2026-12-31', 1)).toBe('2027-01-01');
    expect(weekdayOfIso('2026-11-15')).toBe(0);
    expect(weekdayOfIso('2026-11-16')).toBe(1);
  });
});

describe('describeOpening', () => {
  const say = (iso: string) => describeOpening(at(iso), openingSchedule, closedDates);

  it('says when the roastery closes while open', () => {
    expect(say('2026-11-16T10:00:00Z')).toBe('Otwarte do 18:00');
    expect(say('2026-11-21T10:00:00Z')).toBe('Otwarte do 15:00');
  });

  it('says when it opens before opening time', () => {
    expect(say('2026-11-16T05:00:00Z')).toBe('Zamknięte, otwieram o 8:00');
  });

  it('points to tomorrow or a named day after closing', () => {
    expect(say('2026-11-16T18:00:00Z')).toBe('Zamknięte, otwieram jutro o 8:00');
    expect(say('2026-11-21T15:00:00Z')).toBe('Zamknięte, otwieram w poniedziałek o 8:00');
    expect(say('2026-11-22T10:00:00Z')).toBe('Zamknięte, otwieram jutro o 8:00');
  });

  it('skips public holidays', () => {
    expect(say('2026-11-10T18:00:00Z')).toBe('Zamknięte, otwieram w czwartek o 8:00');
    expect(say('2026-11-11T10:00:00Z')).toBe('Zamknięte, otwieram jutro o 8:00');
  });
});
