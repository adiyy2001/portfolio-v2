import { describe, expect, it } from 'vitest';
import {
  describeChange,
  describeShade,
  getShade,
  guideOrder,
  heroShades,
  lightnessLabel,
  shadeCount,
  shadeRank,
  stepsBetween,
} from './shades';

describe('shadeRank', () => {
  it('orders the guide from the lightest shade to the darkest', () => {
    expect(shadeRank('B1')).toBe(1);
    expect(shadeRank('A1')).toBe(2);
    expect(shadeRank('A3.5')).toBe(12);
    expect(shadeRank('C4')).toBe(16);
  });

  it('ranks every shade of the guide exactly once', () => {
    const ranks = guideOrder.map(shadeRank).sort((a, b) => a - b);
    expect(ranks).toEqual(Array.from({ length: shadeCount }, (_, index) => index + 1));
  });
});

describe('getShade', () => {
  it('reads the group from the name', () => {
    expect(getShade('A3.5').group).toBe('A');
    expect(getShade('D2').group).toBe('D');
  });

  it('gives every hero shade a colour', () => {
    expect(heroShades.every(name => /^#[0-9a-f]{6}$/.test(getShade(name).color))).toBe(true);
  });
});

describe('stepsBetween', () => {
  it('counts steps towards a lighter target as positive', () => {
    expect(stepsBetween('A3', 'B1')).toBe(8);
    expect(stepsBetween('A3', 'A1')).toBe(7);
  });

  it('is zero for the same shade and negative for a darker target', () => {
    expect(stepsBetween('A2', 'A2')).toBe(0);
    expect(stepsBetween('A1', 'A3')).toBe(-7);
  });
});

describe('lightnessLabel', () => {
  it('names the band a rank falls into', () => {
    expect(lightnessLabel(1)).toBe('Bardzo jasny');
    expect(lightnessLabel(5)).toBe('Jasny');
    expect(lightnessLabel(9)).toBe('Średni');
    expect(lightnessLabel(12)).toBe('Ciemniejszy');
    expect(lightnessLabel(16)).toBe('Ciemny');
  });
});

describe('describeShade', () => {
  it('mentions the group and its tone', () => {
    expect(describeShade('B1')).toBe('Bardzo jasny odcień z grupy B, z żółtawym odcieniem.');
    expect(describeShade('C2')).toBe('Jasny odcień z grupy C, szarawy.');
  });
});

describe('describeChange', () => {
  it('refuses a darker or equal target', () => {
    expect(describeChange('A2', 'A2')).toContain('ten sam odcień');
    expect(describeChange('A1', 'A3')).toContain('ciemniejszy');
  });

  it('calls one or two steps small and uses the right plural', () => {
    expect(describeChange('A2', 'B2')).toContain('Niewielka zmiana: 2 stopnie');
    expect(describeChange('A1', 'B1')).toContain('Niewielka zmiana: 1 stopień');
  });

  it('calls three to five steps typical', () => {
    expect(describeChange('A2', 'A1')).toContain('Typowy wynik wybielania: 3 stopnie');
    expect(describeChange('A3', 'A2')).toContain('Typowy wynik wybielania: 4 stopnie');
  });

  it('warns when the goal is beyond what whitening usually does', () => {
    expect(describeChange('A3.5', 'B1')).toContain('Więcej niż zwykle');
    expect(describeChange('A3.5', 'B1')).toContain('11 stopni');
  });
});
