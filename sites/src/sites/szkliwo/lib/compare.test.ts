import { describe, expect, it } from 'vitest';
import {
  clampValue,
  describeValue,
  initialValue,
  maximumValue,
  minimumValue,
  valueFromKey,
  valueFromPointer,
} from './compare';

describe('clampValue', () => {
  it('rounds and keeps the value between 0 and 100', () => {
    expect(clampValue(42.4)).toBe(42);
    expect(clampValue(42.6)).toBe(43);
    expect(clampValue(-8)).toBe(minimumValue);
    expect(clampValue(140)).toBe(maximumValue);
  });
});

describe('valueFromPointer', () => {
  it('maps the pointer position to a percentage of the width', () => {
    expect(valueFromPointer(300, 100, 400)).toBe(50);
    expect(valueFromPointer(100, 100, 400)).toBe(0);
    expect(valueFromPointer(500, 100, 400)).toBe(100);
  });

  it('stays inside the range when the pointer leaves the stage', () => {
    expect(valueFromPointer(20, 100, 400)).toBe(0);
    expect(valueFromPointer(900, 100, 400)).toBe(100);
  });

  it('falls back to the middle for a stage without width', () => {
    expect(valueFromPointer(10, 0, 0)).toBe(initialValue);
  });
});

describe('valueFromKey', () => {
  it('moves by one with the arrow keys', () => {
    expect(valueFromKey('ArrowRight', 50, false)).toBe(51);
    expect(valueFromKey('ArrowUp', 50, false)).toBe(51);
    expect(valueFromKey('ArrowLeft', 50, false)).toBe(49);
    expect(valueFromKey('ArrowDown', 50, false)).toBe(49);
  });

  it('moves by ten with shift or the page keys', () => {
    expect(valueFromKey('ArrowRight', 50, true)).toBe(60);
    expect(valueFromKey('ArrowLeft', 50, true)).toBe(40);
    expect(valueFromKey('PageUp', 50, false)).toBe(60);
    expect(valueFromKey('PageDown', 50, false)).toBe(40);
  });

  it('jumps to the ends with Home and End', () => {
    expect(valueFromKey('Home', 50, false)).toBe(0);
    expect(valueFromKey('End', 50, false)).toBe(100);
  });

  it('does not run past the ends', () => {
    expect(valueFromKey('ArrowLeft', 0, false)).toBe(0);
    expect(valueFromKey('PageUp', 95, false)).toBe(100);
  });

  it('ignores keys that do not move the slider', () => {
    expect(valueFromKey('Tab', 50, false)).toBeNull();
    expect(valueFromKey('a', 50, false)).toBeNull();
  });
});

describe('describeValue', () => {
  it('names both shares in Polish', () => {
    expect(describeValue(62)).toBe('Przed: 62%, po: 38%');
    expect(describeValue(0)).toBe('Przed: 0%, po: 100%');
  });
});
