import { describe, expect, it } from 'vitest';
import { priceCategories, priceItems } from '../data/prices';
import {
  matches,
  normalize,
  queryString,
  readQuery,
  resultSummary,
  searchText,
  tokenize,
} from './search';

const indexed = priceItems.map(item => {
  const category = priceCategories.find(entry => entry.id === item.category);
  return { item, text: searchText(item, category?.name ?? '') };
});

const find = (query: string) => {
  const tokens = tokenize(query);
  return indexed.filter(entry => matches(entry.text, tokens)).map(entry => entry.item.id);
};

describe('normalize', () => {
  it('lowercases and removes Polish diacritics', () => {
    expect(normalize('Wypełnienie ŁĄKA, żółć')).toBe('wypelnienie laka zolc');
  });

  it('turns punctuation into single spaces', () => {
    expect(normalize('  RTG - punktowe,  (zdjęcie) ')).toBe('rtg punktowe zdjecie');
  });

  it('folds the nominative of tooth onto its inflected stem', () => {
    expect(normalize('ząb')).toBe('zeb');
    expect(normalize('zęba')).toBe('zeba');
  });
});

describe('tokenize', () => {
  it('splits on spaces and drops empty parts', () => {
    expect(tokenize('  leczenie   kanałowe ')).toEqual(['leczeni', 'kanalow']);
  });

  it('trims a trailing vowel so inflected forms share a stem', () => {
    expect(tokenize('plomba')).toEqual(['plomb']);
    expect(tokenize('plomby')).toEqual(['plomb']);
    expect(tokenize('zęby')).toEqual(['zeb']);
  });

  it('keeps short words and words ending in a consonant', () => {
    expect(tokenize('rtg')).toEqual(['rtg']);
    expect(tokenize('ból')).toEqual(['bol']);
    expect(tokenize('cbct')).toEqual(['cbct']);
  });

  it('returns no tokens for an empty query', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('matches', () => {
  const text = 'wypelnienie kompozytowe sredni ubytek wypelnienia';

  it('matches word prefixes only', () => {
    expect(matches(text, ['wypel'])).toBe(true);
    expect(matches(text, ['ubyt'])).toBe(true);
    expect(matches(text, ['pozyt'])).toBe(false);
  });

  it('requires every token to match', () => {
    expect(matches(text, ['sredni', 'ubyt'])).toBe(true);
    expect(matches(text, ['sredni', 'duzy'])).toBe(false);
  });

  it('matches everything when there are no tokens', () => {
    expect(matches(text, [])).toBe(true);
  });
});

describe('searching the price list', () => {
  it('finds an item by its own name', () => {
    const missing = indexed.filter(entry => !find(entry.item.name).includes(entry.item.id));
    expect(missing.map(entry => entry.item.id)).toEqual([]);
  });

  it('finds fillings by the colloquial word', () => {
    const ids = find('plomba');
    expect(ids).toContain('wypelnienie-maly');
    expect(ids).toContain('dziecko-wypelnienie');
    expect(ids).not.toContain('implant');
  });

  it('finds the whole whitening category by its name', () => {
    const ids = find('wybielanie');
    const category = priceItems.filter(item => item.category === 'wybielanie').map(item => item.id);
    category.forEach(id => expect(ids).toContain(id));
  });

  it('finds painful-visit prices by pain words', () => {
    expect(find('ból')).toEqual(expect.arrayContaining(['wizyta-w-bolu', 'opatrunek-w-bolu']));
    expect(find('boli')).toEqual(expect.arrayContaining(['wizyta-w-bolu']));
  });

  it('treats ząb, zęba and zęby alike', () => {
    expect(find('ząb')).toEqual(find('zęby'));
    expect(find('zęba')).toContain('usuniecie-proste');
  });

  it('finds the same prices with and without diacritics for ząb', () => {
    expect(find('zab')).toEqual(find('ząb'));
    expect(find('zab')).toEqual(find('zeby'));
    expect(find('zab').length).toBeGreaterThan(3);
  });

  it('narrows the list when more words are typed', () => {
    const broad = find('wypełnienie');
    const narrow = find('wypełnienie duży');
    expect(narrow.length).toBeGreaterThan(0);
    expect(narrow.length).toBeLessThan(broad.length);
    expect(narrow).toContain('wypelnienie-duzy');
  });

  it('ignores letter case and diacritics', () => {
    expect(find('KANALOWE')).toEqual(find('kanałowe'));
  });

  it('returns nothing for a word that is not in the list', () => {
    expect(find('hipopotam')).toEqual([]);
  });
});

describe('query string', () => {
  it('reads a trimmed query', () => {
    expect(readQuery('?q=%20wybielanie%20')).toBe('wybielanie');
  });

  it('reads an empty query when there is none', () => {
    expect(readQuery('')).toBe('');
    expect(readQuery('?x=1')).toBe('');
  });

  it('limits the length of a query from the address bar', () => {
    expect(readQuery(`?q=${'a'.repeat(200)}`)).toHaveLength(80);
  });

  it('writes nothing for an empty query', () => {
    expect(queryString('   ')).toBe('');
  });

  it('round trips Polish letters and spaces', () => {
    const query = 'zęby mądrości';
    expect(readQuery(queryString(query))).toBe(query);
  });
});

describe('resultSummary', () => {
  it('lists the total without a query', () => {
    expect(resultSummary(54, 54, '')).toBe('Wszystkie pozycje: 54.');
  });

  it('declines the noun for each count', () => {
    expect(resultSummary(1, 54, 'x')).toBe('Znaleziono 1 pozycję z 54.');
    expect(resultSummary(3, 54, 'x')).toBe('Znaleziono 3 pozycje z 54.');
    expect(resultSummary(5, 54, 'x')).toBe('Znaleziono 5 pozycji z 54.');
    expect(resultSummary(12, 54, 'x')).toBe('Znaleziono 12 pozycji z 54.');
    expect(resultSummary(22, 54, 'x')).toBe('Znaleziono 22 pozycje z 54.');
  });

  it('says plainly when nothing matches', () => {
    expect(resultSummary(0, 54, ' kość ')).toBe(
      'Brak pozycji dla „kość”. Spróbuj krótszego słowa.',
    );
  });
});
