import { describe, expect, it } from 'vitest';
import { dayFromParts } from './dates';
import {
  checkInInstant,
  checkOutInstant,
  freeCancellationDeadline,
  warsawInstant,
  warsawOffsetMinutes,
} from './policy';

const iso = (instant: number): string => new Date(instant).toISOString();

describe('Warsaw time', () => {
  it('uses UTC+1 in winter and UTC+2 in summer', () => {
    expect(warsawOffsetMinutes(Date.UTC(2026, 0, 15, 12))).toBe(60);
    expect(warsawOffsetMinutes(Date.UTC(2026, 6, 15, 12))).toBe(120);
    expect(warsawOffsetMinutes(Date.UTC(2026, 11, 31, 23))).toBe(60);
  });

  it('switches on the last Sunday of March and October at 01:00 UTC', () => {
    expect(warsawOffsetMinutes(Date.UTC(2026, 2, 29, 0, 59))).toBe(60);
    expect(warsawOffsetMinutes(Date.UTC(2026, 2, 29, 1, 0))).toBe(120);
    expect(warsawOffsetMinutes(Date.UTC(2026, 9, 25, 0, 59))).toBe(120);
    expect(warsawOffsetMinutes(Date.UTC(2026, 9, 25, 1, 0))).toBe(60);
    expect(warsawOffsetMinutes(Date.UTC(2027, 2, 28, 1, 0))).toBe(120);
    expect(warsawOffsetMinutes(Date.UTC(2027, 9, 31, 1, 0))).toBe(60);
  });

  it('converts a Warsaw wall clock time to an instant', () => {
    expect(iso(warsawInstant(dayFromParts(2026, 7, 1), 15))).toBe('2026-07-01T13:00:00.000Z');
    expect(iso(warsawInstant(dayFromParts(2026, 12, 1), 15))).toBe('2026-12-01T14:00:00.000Z');
    expect(iso(warsawInstant(dayFromParts(2026, 3, 28), 15))).toBe('2026-03-28T14:00:00.000Z');
    expect(iso(warsawInstant(dayFromParts(2026, 3, 29), 15))).toBe('2026-03-29T13:00:00.000Z');
    expect(iso(warsawInstant(dayFromParts(2026, 10, 24), 15))).toBe('2026-10-24T13:00:00.000Z');
    expect(iso(warsawInstant(dayFromParts(2026, 10, 25), 15))).toBe('2026-10-25T14:00:00.000Z');
  });
});

describe('hotel times', () => {
  it('checks in at 15:00 and out at 11:00 Warsaw time', () => {
    expect(iso(checkInInstant(dayFromParts(2026, 10, 9)))).toBe('2026-10-09T13:00:00.000Z');
    expect(iso(checkOutInstant(dayFromParts(2026, 10, 11)))).toBe('2026-10-11T09:00:00.000Z');
    expect(iso(checkOutInstant(dayFromParts(2026, 12, 1)))).toBe('2026-12-01T10:00:00.000Z');
  });

  it('ends free cancellation at 15:00 two days before arrival', () => {
    expect(iso(freeCancellationDeadline(dayFromParts(2026, 10, 9)))).toBe(
      '2026-10-07T13:00:00.000Z',
    );
    expect(iso(freeCancellationDeadline(dayFromParts(2026, 12, 20)))).toBe(
      '2026-12-18T14:00:00.000Z',
    );
  });

  it('is exactly 48 hours before check-in away from clock changes', () => {
    const arrival = dayFromParts(2026, 7, 10);
    expect(checkInInstant(arrival) - freeCancellationDeadline(arrival)).toBe(48 * 3_600_000);
  });
});
