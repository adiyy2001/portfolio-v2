import { describe, expect, it } from 'vitest';
import { holdUnits } from './typography';

const nbsp = '\u00a0';

describe('holdUnits', () => {
  it('joins a number with its unit using a non-breaking space', () => {
    expect(holdUnits('15 g kawy na 250 ml, 3:00')).toBe(`15${nbsp}g kawy na 250${nbsp}ml, 3:00`);
  });

  it('keeps a unit at the end of the text attached', () => {
    expect(holdUnits('18 g kawy na 36 g')).toBe(`18${nbsp}g kawy na 36${nbsp}g`);
  });

  it('leaves words that only start with a unit letter alone', () => {
    expect(holdUnits('3 gramy i 2 sztuki')).toBe('3 gramy i 2 sztuki');
  });
});
