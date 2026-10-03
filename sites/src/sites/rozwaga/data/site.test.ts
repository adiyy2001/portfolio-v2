import { describe, expect, it } from 'vitest';
import { formatZloty, grossFromNet, shifts, site } from './site';

describe('grossFromNet', () => {
  it('adds 23 percent VAT and rounds to grosze', () => {
    expect(grossFromNet(380)).toBe(467.4);
    expect(grossFromNet(1200)).toBe(1476);
    expect(grossFromNet(333)).toBe(409.59);
  });
});

describe('formatZloty', () => {
  it('groups thousands with a space and drops empty fractions', () => {
    expect(formatZloty(380)).toBe('380 zł');
    expect(formatZloty(1800)).toBe('1 800 zł');
    expect(formatZloty(12500)).toBe('12 500 zł');
  });

  it('keeps two digits of grosze when they exist', () => {
    expect(formatZloty(467.4)).toBe('467,40 zł');
    expect(formatZloty(1476)).toBe('1 476 zł');
  });
});

describe('office configuration', () => {
  it('opens Monday to Thursday until 17:00 and Friday until 15:00', () => {
    expect(shifts).toHaveLength(2);
    expect(shifts[0]?.to).toBe(17 * 60);
    expect(shifts[1]?.to).toBe(15 * 60);
  });

  it('uses the reserved example domain and the unassignable phone pattern', () => {
    expect(site.email).toMatch(/@rozwaga\.example$/);
    expect(site.phone).toBe('+48 71 000 00 01');
  });
});
