import { describe, expect, it } from 'vitest';
import { formatWorkTime, pluralPl } from './format';

const models = (count: number): string => pluralPl(count, 'model', 'modele', 'modeli');

describe('pluralPl', () => {
  it('picks the Polish plural form', () => {
    expect(models(1)).toBe('model');
    expect(models(2)).toBe('modele');
    expect(models(4)).toBe('modele');
    expect(models(5)).toBe('modeli');
    expect(models(12)).toBe('modeli');
    expect(models(14)).toBe('modeli');
    expect(models(22)).toBe('modele');
    expect(models(84)).toBe('modele');
    expect(models(100)).toBe('modeli');
    expect(models(112)).toBe('modeli');
  });
});

describe('formatWorkTime', () => {
  it('writes hours and working days', () => {
    expect(formatWorkTime(1)).toBe('1 godzina');
    expect(formatWorkTime(3)).toBe('3 godziny');
    expect(formatWorkTime(5)).toBe('5 godzin');
    expect(formatWorkTime(8)).toBe('1 dzień roboczy');
    expect(formatWorkTime(9)).toBe('1 dzień roboczy i 1 godzina');
    expect(formatWorkTime(16)).toBe('2 dni robocze');
    expect(formatWorkTime(40)).toBe('5 dni roboczych');
  });
});
