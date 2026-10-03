import { describe, expect, it } from 'vitest';
import { currentSectionIndex } from './current-section';

describe('currentSectionIndex', () => {
  const tops = [400, 900, 1500, 2300];

  it('returns -1 while the first heading is still below the threshold', () => {
    expect(currentSectionIndex(tops, 120)).toBe(-1);
  });

  it('returns the first heading once it reaches the threshold', () => {
    expect(currentSectionIndex(tops, 400)).toBe(0);
  });

  it('returns the last heading that passed the threshold', () => {
    expect(currentSectionIndex(tops, 1600)).toBe(2);
  });

  it('returns the last index when everything is above the threshold', () => {
    expect(currentSectionIndex(tops, 5000)).toBe(3);
  });

  it('handles an empty list', () => {
    expect(currentSectionIndex([], 100)).toBe(-1);
  });

  it('accepts negative tops for headings that scrolled out of view', () => {
    expect(currentSectionIndex([-800, -200, 300], 100)).toBe(1);
  });
});
