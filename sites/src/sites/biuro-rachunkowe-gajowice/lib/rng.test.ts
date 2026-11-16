import { describe, expect, it } from 'vitest';
import { createRng } from './rng';

describe('createRng', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = createRng(107);
    const b = createRng(107);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('stays inside the unit interval and differs between seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    const values = Array.from({ length: 200 }, () => a());
    expect(values.every(value => value >= 0 && value < 1)).toBe(true);
    expect(a()).not.toBe(b());
  });
});
