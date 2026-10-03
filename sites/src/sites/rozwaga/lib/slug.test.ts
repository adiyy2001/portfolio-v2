import { describe, expect, it } from 'vitest';
import { slugify, uniqueSlugs } from './slug';

describe('slugify', () => {
  it('lowercases and joins words with hyphens', () => {
    expect(slugify('Kara umowna w praktyce')).toBe('kara-umowna-w-praktyce');
  });

  it('transliterates Polish letters', () => {
    expect(slugify('Zażółć gęślą jaźń')).toBe('zazolc-gesla-jazn');
  });

  it('drops punctuation and trims separators', () => {
    expect(slugify('  Czy to się opłaca?! ')).toBe('czy-to-sie-oplaca');
  });

  it('keeps digits', () => {
    expect(slugify('Art. 483 KC')).toBe('art-483-kc');
  });

  it('returns an empty string when nothing is left', () => {
    expect(slugify('???')).toBe('');
  });
});

describe('uniqueSlugs', () => {
  it('numbers repeated headings', () => {
    expect(uniqueSlugs(['Wnioski', 'Wnioski', 'Wnioski'])).toEqual([
      'wnioski',
      'wnioski-2',
      'wnioski-3',
    ]);
  });

  it('keeps distinct headings as they are', () => {
    expect(uniqueSlugs(['Jeden', 'Dwa'])).toEqual(['jeden', 'dwa']);
  });

  it('falls back to a name for headings without letters', () => {
    expect(uniqueSlugs(['?'])).toEqual(['sekcja']);
  });
});
