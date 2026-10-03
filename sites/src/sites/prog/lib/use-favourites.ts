import { useCallback, useEffect, useState } from 'preact/hooks';
import {
  browserStorage,
  favouritesEvent,
  favouritesKey,
  readFavourites,
  toggleSlug,
  writeFavourites,
} from './favourites';

export const useFavourites = () => {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(readFavourites(browserStorage()));
    sync();
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === favouritesKey) sync();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(favouritesEvent, sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(favouritesEvent, sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const next = toggleSlug(readFavourites(browserStorage()), slug);
    writeFavourites(browserStorage(), next);
    setSlugs(next);
    window.dispatchEvent(new Event(favouritesEvent));
  }, []);

  const clear = useCallback(() => {
    writeFavourites(browserStorage(), []);
    setSlugs([]);
    window.dispatchEvent(new Event(favouritesEvent));
  }, []);

  return { slugs, ready, toggle, clear };
};
