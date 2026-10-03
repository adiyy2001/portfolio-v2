import { describe, expect, it } from 'vitest';
import { openStatus, warsawMoment } from './open-status';

describe('warsawMoment', () => {
  it('reads the Warsaw wall clock in winter time', () => {
    expect(warsawMoment(new Date('2026-01-12T09:30:00Z'))).toEqual({
      year: 2026,
      month: 1,
      day: 12,
      isoDay: 1,
      minutes: 10 * 60 + 30,
    });
  });

  it('reads the Warsaw wall clock in summer time', () => {
    expect(warsawMoment(new Date('2026-07-04T09:30:00Z'))).toEqual({
      year: 2026,
      month: 7,
      day: 4,
      isoDay: 6,
      minutes: 11 * 60 + 30,
    });
  });

  it('moves to the next day after local midnight', () => {
    expect(warsawMoment(new Date('2026-10-03T22:30:00Z')).day).toBe(4);
  });
});

describe('openStatus', () => {
  it('is open on a weekday afternoon', () => {
    expect(openStatus(new Date('2026-10-07T12:00:00Z'))).toEqual({
      isOpen: true,
      message: 'Teraz otwarte, do 20:00.',
    });
  });

  it('closes on Saturday at 14:00', () => {
    expect(openStatus(new Date('2026-10-03T11:59:00Z')).isOpen).toBe(true);
    expect(openStatus(new Date('2026-10-03T12:00:00Z')).isOpen).toBe(false);
  });

  it('says it opens today when the doors are not open yet', () => {
    expect(openStatus(new Date('2026-10-07T05:00:00Z')).message).toBe(
      'Teraz zamknięte. Otwieramy dziś o 8:00.',
    );
  });

  it('says it opens tomorrow after closing time', () => {
    expect(openStatus(new Date('2026-10-07T19:00:00Z')).message).toBe(
      'Teraz zamknięte. Otwieramy jutro o 8:00.',
    );
  });

  it('names Monday on Saturday evening', () => {
    expect(openStatus(new Date('2026-10-03T16:00:00Z')).message).toBe(
      'Teraz zamknięte. Otwieramy w poniedziałek o 8:00.',
    );
  });

  it('stays closed on a public holiday and skips to the next working day', () => {
    expect(openStatus(new Date('2026-11-11T10:00:00Z')).message).toBe(
      'Teraz zamknięte. Otwieramy jutro o 8:00.',
    );
  });

  it('opens on Saturday morning from Friday evening', () => {
    expect(openStatus(new Date('2026-10-02T19:00:00Z')).message).toBe(
      'Teraz zamknięte. Otwieramy jutro o 9:00.',
    );
  });
});
