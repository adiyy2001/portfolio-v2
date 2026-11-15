import { dayMonth } from '../lib/dates';
import { pad } from '../lib/format';
import { openInfo } from '../lib/hours';
import { find, findOptional } from './dom';

export type TickListener = (now: Date) => void;

export const setupClock = (onTick?: TickListener): void => {
  const clock = find(document, '#clock', HTMLTimeElement);
  const openState = findOptional(document, '#open-state', HTMLElement);
  const contactOpen = findOptional(document, '#contact-open', HTMLElement);
  const tick = (): void => {
    const now = new Date();
    clock.textContent = `${dayMonth(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    clock.dateTime = now.toISOString();
    const info = openInfo(now);
    if (openState) openState.textContent = info.short;
    if (contactOpen) contactOpen.textContent = info.long;
    if (onTick) onTick(now);
  };
  tick();
  window.setInterval(() => {
    if (!document.hidden) tick();
  }, 15000);
};
