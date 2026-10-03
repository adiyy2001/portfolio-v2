import { describe, expect, it } from 'vitest';
import { warsawMoment } from './warsaw-time';

describe('warsawMoment', () => {
  it('applies summer time', () => {
    expect(warsawMoment(new Date('2026-10-05T07:30:00Z'))).toEqual({
      date: { year: 2026, month: 10, day: 5 },
      minutes: 9 * 60 + 30,
    });
  });

  it('applies winter time', () => {
    expect(warsawMoment(new Date('2026-12-01T08:00:00Z'))).toEqual({
      date: { year: 2026, month: 12, day: 1 },
      minutes: 9 * 60,
    });
  });

  it('rolls over to the next day after midnight in Warsaw', () => {
    expect(warsawMoment(new Date('2026-10-05T22:30:00Z'))).toEqual({
      date: { year: 2026, month: 10, day: 6 },
      minutes: 30,
    });
  });

  it('switches offset on the last Sunday of October', () => {
    expect(warsawMoment(new Date('2026-10-25T00:30:00Z')).minutes).toBe(2 * 60 + 30);
    expect(warsawMoment(new Date('2026-10-25T02:30:00Z')).minutes).toBe(3 * 60 + 30);
  });
});
