import type { Lang } from '../data/lang';
import { inlineName } from '../logic/format';

const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'pl');

export const markToday = () => {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return;
  const row = document.querySelector<HTMLElement>(`.wrow[data-day="${day}"]`);
  if (!row) return;
  row.classList.add('is-today');
  const lang = pageLang();
  const read = (selector: string) => row.querySelector(selector)?.textContent?.trim() ?? '';
  const fill = (id: string, text: string) => {
    const node = document.getElementById(id);
    if (node && text) node.textContent = text;
  };
  fill('today-day', document.getElementById('today-day')?.dataset.today ?? '');
  fill('today-second', read('.w-second'));
  fill('today-soup', inlineName(read('.w-soup'), lang));
  fill('today-dessert', inlineName(read('.w-dessert'), lang));
  fill('today-price', read('.wprice .num'));
};
