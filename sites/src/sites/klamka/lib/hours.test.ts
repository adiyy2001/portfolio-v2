import { describe, expect, it } from 'vitest';
import { openStatus, warsawWallClock } from './hours';

const at = (day: number, hour: number, minute = 0) => ({ day, minutes: hour * 60 + minute });

describe('openStatus', () => {
  it('says the office is open on weekdays between nine and eighteen', () => {
    expect(openStatus(at(2, 9))).toBe('Teraz otwarte, do 18:00.');
    expect(openStatus(at(5, 17, 59))).toBe('Teraz otwarte, do 18:00.');
  });

  it('announces the opening time before the office opens', () => {
    expect(openStatus(at(3, 8, 30))).toBe('Zamknięte, otwieramy dziś o 9:00.');
  });

  it('uses the shorter Saturday hours', () => {
    expect(openStatus(at(6, 10))).toBe('Teraz otwarte, do 14:00.');
    expect(openStatus(at(6, 9))).toBe('Zamknięte, otwieramy dziś o 10:00.');
    expect(openStatus(at(6, 14))).toBe('Zamknięte, otwieramy w poniedziałek o 9:00.');
  });

  it('points to the next opening after closing time and on Sunday', () => {
    expect(openStatus(at(1, 18))).toBe('Zamknięte, otwieramy we wtorek o 9:00.');
    expect(openStatus(at(5, 18))).toBe('Zamknięte, otwieramy w sobotę o 10:00.');
    expect(openStatus(at(0, 12))).toBe('Zamknięte, otwieramy w poniedziałek o 9:00.');
  });
});

describe('warsawWallClock', () => {
  it('converts to Warsaw time including daylight saving', () => {
    expect(warsawWallClock(new Date('2026-11-16T08:15:00Z'))).toEqual({
      day: 1,
      minutes: 9 * 60 + 15,
    });
    expect(warsawWallClock(new Date('2026-07-18T10:00:00Z'))).toEqual({ day: 6, minutes: 12 * 60 });
  });
});
