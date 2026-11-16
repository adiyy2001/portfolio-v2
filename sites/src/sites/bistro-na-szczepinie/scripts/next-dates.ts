import type { Lang } from '../data/lang';
import { eventsCopy } from '../copy/events';
import { eventBySlug } from '../data/events';
import { capitalize, longDate } from '../logic/format';
import { nextOccurrence } from '../logic/events';

const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'pl');

export const fillNextDates = () => {
  const lang = pageLang();
  const copy = eventsCopy[lang];
  const now = new Date();
  document.querySelectorAll<HTMLElement>('[data-ev-next]').forEach(element => {
    const event = eventBySlug(element.dataset.evNext ?? '');
    if (!event) return;
    const date = nextOccurrence(event.rule, now);
    const label = element.querySelector('[data-ev-label]');
    const value = element.querySelector('[data-ev-value]');
    if (label) label.textContent = copy.next;
    if (!value) return;
    const day = capitalize(longDate(date, lang));
    value.textContent = element.hasAttribute('data-ev-date-only') ? day : `${day}, ${event.start}`;
  });
};
