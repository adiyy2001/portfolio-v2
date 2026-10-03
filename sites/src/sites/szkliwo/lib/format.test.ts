import { describe, expect, it } from 'vitest';
import { formatMinutes, formatNumber, formatZloty, plural } from './format';

const nbsp = ' ';
const positions = ['pozycja', 'pozycje', 'pozycji'] as const;

describe('formatNumber', () => {
  it('groups thousands with a non-breaking space', () => {
    expect(formatNumber(1090)).toBe(`1${nbsp}090`);
    expect(formatNumber(15900)).toBe(`15${nbsp}900`);
    expect(formatNumber(380)).toBe('380');
  });
});

describe('formatZloty', () => {
  it('appends the currency after a non-breaking space', () => {
    expect(formatZloty(4500)).toBe(`4${nbsp}500${nbsp}zł`);
  });
});

describe('plural', () => {
  it('picks the Polish form for the count', () => {
    expect(plural(1, positions)).toBe('pozycja');
    expect(plural(2, positions)).toBe('pozycje');
    expect(plural(4, positions)).toBe('pozycje');
    expect(plural(5, positions)).toBe('pozycji');
    expect(plural(12, positions)).toBe('pozycji');
    expect(plural(22, positions)).toBe('pozycje');
    expect(plural(0, positions)).toBe('pozycji');
    expect(plural(61, positions)).toBe('pozycji');
  });
});

describe('formatMinutes', () => {
  it('shows minutes after midnight as a clock time', () => {
    expect(formatMinutes(480)).toBe('8:00');
    expect(formatMinutes(1215)).toBe('20:15');
  });
});
