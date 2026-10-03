import { describe, expect, it } from 'vitest';
import { districtById } from '../data/districts';
import { estimateValue, floorFactor, roundToStep, type EstimateInput } from './estimate';

const base: EstimateInput = {
  district: districtById('nadodrze'),
  type: 'mieszkanie',
  area: 50,
  floor: 2,
  floorsTotal: 5,
  condition: 'dobry',
  elevator: false,
  outdoor: false,
};

describe('estimate', () => {
  it('rounds to a step', () => {
    expect(roundToStep(12345, 5000)).toBe(10000);
    expect(roundToStep(12600, 5000)).toBe(15000);
  });

  it('gives a range of six percent either side of the middle', () => {
    const estimate = estimateValue(base);
    expect(estimate.perSquareMeter).toBe(11800);
    expect(estimate.low).toBe(555000);
    expect(estimate.high).toBe(625000);
  });

  it('lowers the value for a flat that needs renovation and raises it after one', () => {
    const rough = estimateValue({ ...base, condition: 'do-remontu' });
    const renovated = estimateValue({ ...base, condition: 'po-remoncie' });
    const normal = estimateValue(base);
    expect(rough.perSquareMeter).toBeLessThan(normal.perSquareMeter);
    expect(renovated.perSquareMeter).toBeGreaterThan(normal.perSquareMeter);
  });

  it('prices houses by the house rate', () => {
    const house = estimateValue({ ...base, type: 'dom', floor: null });
    expect(house.perSquareMeter).toBe(districtById('nadodrze').houseM2);
  });

  it('adds three percent for a balcony or garden', () => {
    const plain = estimateValue(base);
    const outdoor = estimateValue({ ...base, outdoor: true });
    expect(outdoor.perSquareMeter).toBe(Math.round(plain.perSquareMeter * 1.03));
  });

  it('discounts ground floors and high floors without a lift', () => {
    expect(floorFactor(0, 5, false)).toBe(0.96);
    expect(floorFactor(4, 5, false)).toBe(0.95);
    expect(floorFactor(4, 8, false)).toBe(0.97);
    expect(floorFactor(4, 5, true)).toBe(1);
    expect(floorFactor(null, 2, false)).toBe(1);
  });
});
