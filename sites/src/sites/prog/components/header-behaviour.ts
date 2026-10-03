import { favouritesEvent, favouritesKey, parseFavourites } from '../lib/favourites';
import { pluralize } from '../lib/format';

const setUpMenu = () => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });
};

const readCount = (): number => {
  try {
    return parseFavourites(window.localStorage.getItem(favouritesKey)).length;
  } catch {
    return 0;
  }
};

const setUpFavouritesCount = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-favourites-link]');
  const render = () => {
    const count = readCount();
    for (const link of links) {
      const badge = link.querySelector<HTMLElement>('[data-favourites-count]');
      if (!badge) continue;
      badge.hidden = count === 0;
      badge.textContent = String(count);
      if (count > 0) {
        link.setAttribute(
          'aria-label',
          `Ulubione, ${count} ${pluralize(count, 'oferta', 'oferty', 'ofert')}`,
        );
      } else {
        link.removeAttribute('aria-label');
      }
    }
  };
  render();
  window.addEventListener('storage', render);
  window.addEventListener(favouritesEvent, render);
};

setUpMenu();
setUpFavouritesCount();
