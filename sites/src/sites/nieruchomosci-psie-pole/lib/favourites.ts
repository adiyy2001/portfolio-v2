export const favouritesKey = 'nieruchomosci-psie-pole:favourites';
export const favouritesEvent = 'nieruchomosci-psie-pole:favourites-changed';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const parseFavourites = (raw: string | null, known: readonly string[]): string[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (typeof item === 'string' && known.includes(item)) seen.add(item);
    }
    return [...seen];
  } catch {
    return [];
  }
};

export const readFavourites = (storage: StorageLike | null, known: readonly string[]): string[] => {
  if (!storage) return [];
  try {
    return parseFavourites(storage.getItem(favouritesKey), known);
  } catch {
    return [];
  }
};

export const writeFavourites = (storage: StorageLike | null, slugs: readonly string[]): boolean => {
  if (!storage) return false;
  try {
    storage.setItem(favouritesKey, JSON.stringify(slugs));
    return true;
  } catch {
    return false;
  }
};

export const toggleSlug = (slugs: readonly string[], slug: string): string[] =>
  slugs.includes(slug) ? slugs.filter(item => item !== slug) : [...slugs, slug];

export const browserStorage = (): StorageLike | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
