import { describe, expect, it } from 'vitest';
import { clampNm, describeTorque, hitFor, nearestFastener } from './torque';

describe('clampNm', () => {
  it('keeps the value inside the scale and rounds it', () => {
    expect(clampNm(3)).toBe(10);
    expect(clampNm(500)).toBe(210);
    expect(clampNm(88.6)).toBe(89);
  });

  it('falls back to the start value for garbage', () => {
    expect(clampNm(Number.NaN)).toBe(110);
  });
});

describe('nearestFastener', () => {
  it('picks the closest known torque', () => {
    expect(nearestFastener(10).nm).toBe(25);
    expect(nearestFastener(60).nm).toBe(35);
    expect(nearestFastener(70).nm).toBe(90);
    expect(nearestFastener(210).nm).toBe(110);
  });
});

describe('hitFor', () => {
  it('accepts a value within one newton metre', () => {
    expect(hitFor(111)?.label).toBe('Koło');
    expect(hitFor(34)?.label).toBe('Odpływ oleju');
    expect(hitFor(112)).toBeUndefined();
  });
});

describe('describeTorque', () => {
  it('names the fastener on a hit', () => {
    const result = describeTorque(110);
    expect(result.kind).toBe('hit');
    expect(result.verdict).toBe('Koło, 110 Nm.');
    expect(result.spoken).toBe('Koło, 110 Nm. Tak jak w karcie producenta.');
  });

  it('says how far a loose value is from the nearest fastener', () => {
    const result = describeTorque(105);
    expect(result.kind).toBe('low');
    expect(result.verdict).toBe('Za luźno.');
    expect(result.detail).toBe('Najbliżej: koło, 110 Nm. Brakuje 5 Nm.');
    expect(result.spoken.startsWith('105 Nm. Za luźno.')).toBe(true);
  });

  it('says how much too tight a value is', () => {
    const result = describeTorque(200);
    expect(result.kind).toBe('high');
    expect(result.detail).toBe('Najbliżej: koło, 110 Nm. O 90 Nm za dużo.');
  });
});
