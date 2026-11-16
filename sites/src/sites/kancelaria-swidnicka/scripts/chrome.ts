import { firm } from '../data/site';
import { isOpen, warsawWallClock } from '../lib/hours';

const initMenu = (): void => {
  const button = document.querySelector<HTMLButtonElement>('#menu-btn');
  const nav = document.querySelector<HTMLElement>('#site-nav');
  if (!button || !nav) return;
  const setOpen = (open: boolean): void => {
    button.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-open', open);
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
};

const initLiveHours = (): void => {
  const open = isOpen(warsawWallClock(new Date()), firm.hours);
  const closeLabel = firm.hours.weekdaysRange.split(' do ')[1] ?? '';
  const openLabel = firm.hours.weekdaysRange.split(' do ')[0] ?? '';
  const text = open
    ? `Dziś rozmawiamy do ${closeLabel}`
    : `Teraz zamknięte, odbieramy w dni robocze od ${openLabel}`;
  document.querySelectorAll<HTMLElement>('[data-live-block]').forEach(element => {
    element.textContent = text;
  });
};

initMenu();
initLiveHours();
