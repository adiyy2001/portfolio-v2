import { describeSlot, nextRoastSlot, warsawWallClock } from '../lib/next-roast';

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

const initRoastText = (): void => {
  const slot = describeSlot(nextRoastSlot(warsawWallClock(new Date())));
  const parts: Record<string, string> = {
    head: slot.head,
    tail: slot.tail,
    sentence: slot.sentence,
    roast: slot.shortRoast,
    ship: slot.shortShip,
  };
  document.querySelectorAll<HTMLElement>('[data-roast]').forEach(element => {
    const text = parts[element.dataset.roast ?? ''];
    if (text) element.textContent = text;
  });
};

initMenu();
initRoastText();
