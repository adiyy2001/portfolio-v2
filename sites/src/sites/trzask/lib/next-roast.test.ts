import { describe, expect, it } from 'vitest';
import { describeSlot, nextRoastSlot, warsawWallClock } from './next-roast';

const at = (year: number, month: number, day: number, hour = 0, minute = 0) =>
  new Date(year, month - 1, day, hour, minute);

const summary = (now: Date) => {
  const slot = nextRoastSlot(now);
  return [slot.roast.getDate(), slot.roast.getDay(), slot.ship.getDate(), slot.ship.getDay()];
};

describe('nextRoastSlot', () => {
  it('picks Tuesday while the Monday noon cut-off is still ahead', () => {
    expect(summary(at(2026, 10, 5, 9))).toEqual([6, 2, 7, 3]);
    expect(summary(at(2026, 10, 5, 11, 59))).toEqual([6, 2, 7, 3]);
  });

  it('moves to Thursday exactly at the cut-off', () => {
    expect(summary(at(2026, 10, 5, 12, 0))).toEqual([8, 4, 9, 5]);
    expect(summary(at(2026, 10, 5, 18))).toEqual([8, 4, 9, 5]);
  });

  it('picks Thursday on the day of the Tuesday roast', () => {
    expect(summary(at(2026, 10, 6, 8))).toEqual([8, 4, 9, 5]);
    expect(summary(at(2026, 10, 7, 11, 30))).toEqual([8, 4, 9, 5]);
  });

  it('picks next Tuesday after the Wednesday noon cut-off', () => {
    expect(summary(at(2026, 10, 7, 12, 0))).toEqual([13, 2, 14, 3]);
    expect(summary(at(2026, 10, 9, 10))).toEqual([13, 2, 14, 3]);
  });

  it('reaches the next Tuesday from the weekend', () => {
    expect(summary(at(2026, 10, 3, 10))).toEqual([6, 2, 7, 3]);
    expect(summary(at(2026, 10, 4, 22))).toEqual([6, 2, 7, 3]);
  });

  it('crosses the end of the year', () => {
    const slot = nextRoastSlot(at(2026, 12, 30, 13));
    expect(slot.roast.getFullYear()).toBe(2027);
    expect(slot.roast.getMonth()).toBe(0);
    expect(slot.roast.getDate()).toBe(5);
    expect(slot.ship.getDate()).toBe(6);
  });

  it('sets the cut-off at noon the day before the roast', () => {
    const slot = nextRoastSlot(at(2026, 10, 5, 9));
    expect(slot.cutoff.getDate()).toBe(5);
    expect(slot.cutoff.getHours()).toBe(12);
    expect(slot.cutoff.getMinutes()).toBe(0);
  });
});

describe('describeSlot', () => {
  it('writes Polish sentences with declined weekdays and months', () => {
    const text = describeSlot(nextRoastSlot(at(2026, 10, 5, 9)));
    expect(text.head).toBe('Następne palenie: wtorek 6 października');
    expect(text.tail).toBe('Zamów do poniedziałku 12:00, wyślemy w środę');
    expect(text.sentence).toBe(
      'Zamów do poniedziałku do godziny 12:00. Wypalimy we wtorek (6 października), a paczkę nadamy w środę (7 października).',
    );
    expect(text.shortShip).toBe('środa 7 października');
  });

  it('uses Thursday and Friday forms for the second roast', () => {
    const text = describeSlot(nextRoastSlot(at(2026, 10, 6, 8)));
    expect(text.head).toBe('Następne palenie: czwartek 8 października');
    expect(text.tail).toBe('Zamów do środy 12:00, wyślemy w piątek');
  });
});

describe('warsawWallClock', () => {
  it('shifts a UTC instant to Warsaw summer time', () => {
    const wall = warsawWallClock(new Date('2026-10-05T09:30:00Z'));
    expect([wall.getDate(), wall.getHours(), wall.getMinutes()]).toEqual([5, 11, 30]);
  });

  it('shifts a UTC instant to Warsaw winter time', () => {
    const wall = warsawWallClock(new Date('2026-12-01T09:30:00Z'));
    expect([wall.getDate(), wall.getHours(), wall.getMinutes()]).toEqual([1, 10, 30]);
  });

  it('rolls over to the next day late in the evening', () => {
    const wall = warsawWallClock(new Date('2026-10-05T22:30:00Z'));
    expect([wall.getDate(), wall.getHours()]).toEqual([6, 0]);
  });
});
