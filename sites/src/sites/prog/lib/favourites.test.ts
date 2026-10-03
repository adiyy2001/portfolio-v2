import { describe, expect, it } from 'vitest';
import {
  favouritesKey,
  parseFavourites,
  readFavourites,
  toggleSlug,
  writeFavourites,
  type StorageLike,
} from './favourites';

const memoryStorage = (
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
  it('parses a stored list and drops junk', () => {
    expect(parseFavourites('["a","b","a",3,""]')).toEqual(['a', 'b']);
    expect(parseFavourites('{"a":1}')).toEqual([]);
    expect(parseFavourites('not json')).toEqual([]);
    expect(parseFavourites(null)).toEqual([]);
  });

  it('toggles a slug on and off', () => {
    expect(toggleSlug(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleSlug(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('reads and writes through storage', () => {
    const storage = memoryStorage();
    expect(writeFavourites(storage, ['x', 'y'])).toBe(true);
    expect(storage.data[favouritesKey]).toBe('["x","y"]');
    expect(readFavourites(storage)).toEqual(['x', 'y']);
  });

  it('survives missing or throwing storage', () => {
    expect(readFavourites(null)).toEqual([]);
    expect(writeFavourites(null, ['x'])).toBe(false);
    const broken: StorageLike = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('full');
      },
    };
    expect(readFavourites(broken)).toEqual([]);
    expect(writeFavourites(broken, ['x'])).toBe(false);
  });
});
