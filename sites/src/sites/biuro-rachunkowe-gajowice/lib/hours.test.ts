import { describe, expect, it } from 'vitest';
import { openInfo } from './hours';

describe('openInfo', () => {
  it('is open on a weekday at noon', () => {
    expect(openInfo(new Date(2026, 10, 16, 12, 0)).open).toBe(true);
  });

  it('is closed before eight and tells when it opens', () => {
    const info = openInfo(new Date(2026, 10, 16, 7, 30));
    expect(info.open).toBe(false);
    expect(info.long).toBe('Biuro zamknięte. Otwarcie dziś o 8:00.');
  });

  it('closes at sixteen sharp', () => {
    expect(openInfo(new Date(2026, 10, 16, 16, 0)).open).toBe(false);
    expect(openInfo(new Date(2026, 10, 16, 15, 59)).open).toBe(true);
  });

  it('points to Monday from Friday evening and the weekend', () => {
    expect(openInfo(new Date(2026, 10, 20, 17, 0)).short).toBe('zamknięte do pn 8:00');
    expect(openInfo(new Date(2026, 10, 15, 12, 0)).short).toBe('zamknięte do pn 8:00');
  });

  it('points to tomorrow on a weekday evening', () => {
    expect(openInfo(new Date(2026, 10, 17, 18, 0)).short).toBe('zamknięte do jutra 8:00');
  });
});
