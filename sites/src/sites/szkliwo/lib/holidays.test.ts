import { describe, expect, it } from 'vitest';
import { isPublicHoliday } from './holidays';

describe('isPublicHoliday', () => {
  it('knows the fixed holidays', () => {
    expect(isPublicHoliday(2026, 1, 1)).toBe(true);
    expect(isPublicHoliday(2026, 11, 11)).toBe(true);
    expect(isPublicHoliday(2026, 12, 26)).toBe(true);
  });

  it('knows the movable holidays of 2026', () => {
    expect(isPublicHoliday(2026, 4, 5)).toBe(true);
    expect(isPublicHoliday(2026, 4, 6)).toBe(true);
    expect(isPublicHoliday(2026, 5, 24)).toBe(true);
    expect(isPublicHoliday(2026, 6, 4)).toBe(true);
  });

  it('moves with Easter in other years', () => {
    expect(isPublicHoliday(2025, 4, 20)).toBe(true);
    expect(isPublicHoliday(2025, 4, 21)).toBe(true);
    expect(isPublicHoliday(2027, 3, 28)).toBe(true);
    expect(isPublicHoliday(2027, 5, 27)).toBe(true);
  });

  it('treats Christmas Eve as a holiday only from 2025', () => {
    expect(isPublicHoliday(2024, 12, 24)).toBe(false);
    expect(isPublicHoliday(2025, 12, 24)).toBe(true);
    expect(isPublicHoliday(2026, 12, 24)).toBe(true);
  });

  it('leaves ordinary days alone', () => {
    expect(isPublicHoliday(2026, 10, 3)).toBe(false);
    expect(isPublicHoliday(2026, 4, 7)).toBe(false);
  });
});
