import { describe, expect, it } from 'vitest';
import { team } from '../data/team';
import { parseDays, weekdayLabels } from './schedule';

describe('parseDays', () => {
  it('reads a comma separated list', () => {
    expect(parseDays('Pon, wt, czw, pt')).toEqual([1, 2, 4, 5]);
  });

  it('expands a range', () => {
    expect(parseDays('Pon-pt')).toEqual([1, 2, 3, 4, 5]);
  });

  it('understands Polish letters and Saturday', () => {
    expect(parseDays('Wt, śr, pt, sob')).toEqual([2, 3, 5, 6]);
  });

  it('ignores unknown words', () => {
    expect(parseDays('Pon, niedz')).toEqual([1]);
  });

  it('gives every team member at least one working day within the week labels', () => {
    team.forEach(member => {
      const days = parseDays(member.days);
      expect(days.length).toBeGreaterThan(0);
      days.forEach(day => expect(day).toBeLessThanOrEqual(weekdayLabels.length));
    });
  });
});
