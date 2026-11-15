import { describe, expect, it } from 'vitest';
import { warsawClock } from './clock';
import { openStatus } from './hours';

const at = (iso: string) => openStatus(warsawClock(new Date(iso)));

describe('openStatus', () => {
  it('is open on a weekday morning until 17:00', () => {
    expect(at('2026-11-16T09:30:00+01:00')).toEqual({ open: true, text: 'Otwarte teraz, do 17:00' });
  });

  it('opens today before the first hour', () => {
    expect(at('2026-11-16T06:00:00+01:00').text).toBe('Zamknięte, otwieramy dziś o 8:00');
  });

  it('opens tomorrow after closing on a weekday', () => {
    expect(at('2026-11-17T17:00:00+01:00').text).toBe('Zamknięte, otwieramy jutro o 8:00');
  });

  it('closes at noon on Saturday and opens on Monday', () => {
    expect(at('2026-11-21T11:59:00+01:00').open).toBe(true);
    expect(at('2026-11-21T12:00:00+01:00').text).toBe('Zamknięte, otwieramy w poniedziałek o 8:00');
  });

  it('has no admissions on Sunday', () => {
    expect(at('2026-11-22T12:00:00+01:00').text).toBe(
      'Niedziela bez przyjęć, otwieramy jutro o 8:00',
    );
  });

  it('reads the Warsaw clock, not the machine zone', () => {
    expect(at('2026-11-16T07:30:00Z').open).toBe(true);
    expect(at('2026-11-16T06:30:00Z').open).toBe(false);
  });
});
