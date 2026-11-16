import { find, findAll } from './dom';

export const setupFaq = (): void => {
  const faq = find(document, '#faq', HTMLElement);
  faq.addEventListener('keydown', event => {
    const summaries = findAll(faq, 'summary', HTMLElement);
    const current = document.activeElement;
    const index = current instanceof HTMLElement ? summaries.indexOf(current) : -1;
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowDown') next = Math.min(summaries.length - 1, index + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = summaries.length - 1;
    else return;
    event.preventDefault();
    summaries[next]?.focus();
  });
};
