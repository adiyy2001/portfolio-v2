import { describe, expect, it } from 'vitest';
import {
  favouritesKey,
  parseFavourites,
  readFavourites,
  toggleSlug,
  writeFavourites,
} from './favourites';
import type { StorageLike } from './favourites';

const known = ['a', 'b', 'c'];

const memory = (
  initial: Record<string, string> = {},
): StorageLike & { data: Record<string, string> } => {
  const data = { ...initial };
  return {
    data,
    getItem: key => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
};

describe('favourites', () => {
  it('parses only known string slugs without duplicates', () => {
    expect(parseFavourites('["a","x","a",3,"c"]', known)).toEqual(['a', 'c']);
  });

  it('survives broken or missing storage content', () => {
    expect(parseFavourites(null, known)).toEqual([]);
    expect(parseFavourites('{', known)).toEqual([]);
    expect(parseFavourites('{"a":1}', known)).toEqual([]);
    expect(readFavourites(null, known)).toEqual([]);
  });

  it('round trips through storage', () => {
    const storage = memory();
    expect(writeFavourites(storage, ['b'])).toBe(true);
    expect(storage.data[favouritesKey]).toBe('["b"]');
    expect(readFavourites(storage, known)).toEqual(['b']);
  });

  it('reports a failed write', () => {
    const broken: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('full');
      },
    };
    expect(writeFavourites(broken, ['a'])).toBe(false);
    expect(writeFavourites(null, ['a'])).toBe(false);
  });

  it('toggles a slug on and off', () => {
    expect(toggleSlug([], 'a')).toEqual(['a']);
    expect(toggleSlug(['a', 'b'], 'a')).toEqual(['b']);
  });
});
