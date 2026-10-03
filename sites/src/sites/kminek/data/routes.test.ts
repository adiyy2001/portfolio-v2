import { describe, expect, it } from 'vitest';
import { langs } from './lang';
import { otherLang, pageIds, paths } from './routes';

describe('routes', () => {
  it('has a path for every page in both languages', () => {
    for (const lang of langs) {
      expect(Object.keys(paths[lang]).sort()).toEqual([...pageIds].sort());
    }
  });

  it('ends every path with a slash and keeps English under /en/', () => {
    for (const lang of langs) {
      for (const id of pageIds) {
        expect(paths[lang][id].endsWith('/')).toBe(true);
      }
    }
    for (const id of pageIds) {
      expect(paths.en[id].startsWith('/kminek/en/')).toBe(true);
      expect(paths.pl[id].startsWith('/kminek/en/')).toBe(false);
    }
  });

  it('never uses a path twice', () => {
    const all = langs.flatMap(lang => pageIds.map(id => paths[lang][id]));
    expect(new Set(all).size).toBe(all.length);
  });

  it('switches between the two languages', () => {
    expect(otherLang('pl')).toBe('en');
    expect(otherLang('en')).toBe('pl');
  });
});
