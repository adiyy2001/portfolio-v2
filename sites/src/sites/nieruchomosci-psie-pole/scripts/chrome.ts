import { openStatus, warsawWallClock } from '../lib/hours';

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

const initOpenStatus = (): void => {
  const text = openStatus(warsawWallClock(new Date()));
  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach(element => {
    element.textContent = text;
    element.hidden = false;
  });
};

initMenu();
initOpenStatus();
