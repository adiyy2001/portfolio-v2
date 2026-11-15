import { setupCalculator } from './calculator';
import { setupCalendar } from './calendar';
import { setupClock } from './clock';
import { setupCmdForm } from './cmd-form';
import { find, prefersReducedMotion } from './dom';
import { setupFaq } from './faq';
import { setupKeys } from './keys';
import { setupPanel } from './panel';

export const setupHome = (): void => {
  setupClock(now => document.dispatchEvent(new CustomEvent('kajet:tick', { detail: now })));
  setupCalculator();
  const panel = setupPanel();
  setupCalendar();
  setupFaq();
  setupCmdForm();
  const mail = find(document, '#cmd-mail', HTMLInputElement);
  setupKeys({
    onKey: panel.handleKey,
    focusSearch: panel.focusSearch,
    openQuote: () => {
      find(document, '#kontakt', HTMLElement).scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
      mail.focus({ preventScroll: true });
    },
  });
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href="#kontakt"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    window.setTimeout(() => mail.focus({ preventScroll: true }), 0);
  });
};
