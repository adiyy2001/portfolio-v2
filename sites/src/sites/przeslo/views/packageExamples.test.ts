import { describe, expect, it } from 'vitest';
import { weekdayOf } from '../lib/dates';
import {
  exampleGuests,
  longStayArrival,
  longStayRows,
  weekendArrival,
  weekendRows,
} from './packageExamples';

describe('package examples', () => {
  it('starts the weekend example on a Friday and the long stay on a Monday', () => {
    expect(weekdayOf(weekendArrival)).toBe(5);
    expect(weekdayOf(longStayArrival)).toBe(1);
  });

  it('prices the package at 85 percent of its separate items', () => {
    for (const row of weekendRows()) {
      expect(row.extrasInPackage).toBe(Math.round(row.extrasSeparately * 0.85));
      expect(row.saving).toBe(row.extrasSeparately - row.extrasInPackage);
      expect(row.total).toBe(row.accommodation + row.extrasInPackage);
    }
  });

  it('values breakfast for two over two mornings, late check-out and the welcome set', () => {
    const [row] = weekendRows();
    expect(exampleGuests).toBe(2);
    expect(row?.extrasSeparately).toBe(55 * 2 * 2 + 80 + 90);
  });

  it('applies ten percent from seven nights and fifteen from eight', () => {
    for (const row of longStayRows()) {
      expect(row.sevenNightsPay).toBe(row.sevenNightsList - Math.round(row.sevenNightsList * 0.1));
      expect(row.eightNightsPay).toBe(row.eightNightsList - Math.round(row.eightNightsList * 0.15));
    }
  });
});
