import { find, findAll, findOptional } from './dom';

const storageKey = 'biuro-rachunkowe-gajowice-keys';

const readKeys = (): boolean => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === null) return !window.matchMedia('(pointer: coarse)').matches;
    return stored !== 'off';
  } catch {
    return true;
  }
};

const storeKeys = (on: boolean): void => {
  try {
    localStorage.setItem(storageKey, on ? 'on' : 'off');
  } catch {
    return;
  }
};

export interface KeysOptions {
  onKey?: (event: KeyboardEvent) => boolean;
  focusSearch?: () => void;
  openQuote?: () => void;
}

export const isKeysOn = (): boolean => !document.documentElement.classList.contains('keys-off');

export const setupKeys = (options: KeysOptions = {}): void => {
  let on = readKeys();
  const toggle = findOptional(document, '#keys-sw', HTMLButtonElement);
  const apply = (): void => {
    document.documentElement.classList.toggle('keys-off', !on);
    if (!toggle) return;
    toggle.setAttribute('aria-checked', on ? 'true' : 'false');
    const state = find(toggle, '.sw-state', HTMLElement);
    state.textContent = on ? 'wł.' : 'wył.';
  };
  toggle?.addEventListener('click', () => {
    on = !on;
    storeKeys(on);
    apply();
  });
  apply();

  const navLinks = findAll(document, '.bar-nav a', HTMLAnchorElement);
  const quoteHref = find(document, '.bar-nav', HTMLElement).dataset.quote ?? '';

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || !on) return;
    const target = event.target;
    const inField = target instanceof HTMLElement && target.matches('input,select,textarea');
    if (inField) {
      if (options.onKey) options.onKey(event);
      return;
    }
    const key = event.key;
    if (/^[1-5]$/.test(key)) {
      const destination = navLinks[Number(key) - 1];
      if (destination) window.location.assign(destination.href);
      return;
    }
    if (key === '/' && options.focusSearch) {
      event.preventDefault();
      options.focusSearch();
      return;
    }
    if (key === 'w') {
      event.preventDefault();
      if (options.openQuote) options.openQuote();
      else if (quoteHref) window.location.assign(quoteHref);
      return;
    }
    if (options.onKey) options.onKey(event);
  });
};
