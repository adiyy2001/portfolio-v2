import { describe, expect, it } from 'vitest';
import { weekHours } from '../data/hours';
import { clockInWarsaw, describeStatus, statusAt, toMinutes } from './status';

describe('toMinutes', () => {
  it('converts clock strings', () => {
    expect(toMinutes('12:00')).toBe(720);
    expect(toMinutes('21:30')).toBe(1290);
  });
});

describe('clockInWarsaw', () => {
  it('reads the weekday and time in Warsaw during summer time', () => {
    expect(clockInWarsaw(new Date('2026-07-14T10:30:00Z'))).toEqual({
      weekday: 2,
      minutes: 12 * 60 + 30,
    });
  });

  it('reads the weekday and time in Warsaw during winter time', () => {
    expect(clockInWarsaw(new Date('2026-12-06T22:30:00Z'))).toEqual({
      weekday: 0,
      minutes: 23 * 60 + 30,
    });
  });

  it('rolls over to the next weekday after midnight in Warsaw', () => {
    expect(clockInWarsaw(new Date('2026-10-04T22:30:00Z'))).toEqual({ weekday: 1, minutes: 30 });
  });
});

describe('statusAt', () => {
  it('is open during the day with the kitchen working', () => {
    expect(statusAt({ weekday: 3, minutes: 15 * 60 }, weekHours)).toEqual({
      state: 'open',
      closesAt: '22:00',
      kitchenOpen: true,
    });
  });

  it('is open after the kitchen closes', () => {
    expect(statusAt({ weekday: 5, minutes: 21 * 60 + 10 }, weekHours)).toEqual({
      state: 'open',
      closesAt: '22:00',
      kitchenOpen: false,
    });
  });

  it('opens at 12:00 sharp and closes at 22:00 sharp', () => {
    expect(statusAt({ weekday: 2, minutes: 12 * 60 }, weekHours).state).toBe('open');
    expect(statusAt({ weekday: 2, minutes: 22 * 60 }, weekHours).state).toBe('closed');
  });

  it('reopens today when it is still morning', () => {
    expect(statusAt({ weekday: 4, minutes: 9 * 60 }, weekHours)).toEqual({
      state: 'closed',
      reopens: { when: 'today', weekday: 4, at: '12:00' },
    });
  });

  it('reopens tomorrow after closing time', () => {
    expect(statusAt({ weekday: 4, minutes: 22 * 60 + 30 }, weekHours)).toEqual({
      state: 'closed',
      reopens: { when: 'tomorrow', weekday: 5, at: '12:00' },
    });
  });

  it('reopens on Tuesday when the bistro is closed on Monday', () => {
    expect(statusAt({ weekday: 1, minutes: 14 * 60 }, weekHours)).toEqual({
      state: 'closed',
      reopens: { when: 'tomorrow', weekday: 2, at: '12:00' },
    });
    expect(statusAt({ weekday: 0, minutes: 22 * 60 + 30 }, weekHours)).toEqual({
      state: 'closed',
      reopens: { when: 'later', weekday: 2, at: '12:00' },
    });
  });
});

describe('describeStatus', () => {
  it('describes an open bistro in both languages', () => {
    const status = statusAt({ weekday: 3, minutes: 15 * 60 }, weekHours);
    expect(describeStatus(status, 'pl')).toBe('Teraz otwarte, do 22:00.');
    expect(describeStatus(status, 'en')).toBe('Open now, until 22:00.');
  });

  it('mentions the closed kitchen', () => {
    const status = statusAt({ weekday: 3, minutes: 21 * 60 + 30 }, weekHours);
    expect(describeStatus(status, 'pl')).toBe('Teraz otwarte do 22:00, kuchnia już zamknięta.');
    expect(describeStatus(status, 'en')).toBe('Open until 22:00, the kitchen has closed.');
  });

  it('says when the bistro opens next', () => {
    expect(describeStatus(statusAt({ weekday: 4, minutes: 9 * 60 }, weekHours), 'pl')).toBe(
      'Teraz zamknięte. Otwieramy dziś o 12:00.',
    );
    expect(describeStatus(statusAt({ weekday: 4, minutes: 23 * 60 }, weekHours), 'en')).toBe(
      'Closed now. We open tomorrow at 12:00.',
    );
    expect(describeStatus(statusAt({ weekday: 0, minutes: 23 * 60 }, weekHours), 'pl')).toBe(
      'Teraz zamknięte. Otwieramy we wtorek o 12:00.',
    );
    expect(describeStatus(statusAt({ weekday: 0, minutes: 23 * 60 }, weekHours), 'en')).toBe(
      'Closed now. We open on Tuesday at 12:00.',
    );
  });
});
