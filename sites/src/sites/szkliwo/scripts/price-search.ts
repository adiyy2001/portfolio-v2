import { matches, queryString, readQuery, resultSummary, tokenize } from '../lib/search';

const form = document.querySelector<HTMLFormElement>('[data-price-form]');
const input = document.querySelector<HTMLInputElement>('[data-price-input]');
const status = document.querySelector<HTMLElement>('[data-price-status]');
const empty = document.querySelector<HTMLElement>('[data-price-empty]');
const clear = document.querySelector<HTMLButtonElement>('[data-price-clear]');
const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-price-row]'));
const categories = Array.from(document.querySelectorAll<HTMLElement>('[data-price-category]'));

const jumps = document.querySelector<HTMLElement>('[data-price-jumps]');
const jumpLinks = Array.from(document.querySelectorAll<HTMLElement>('[data-price-jump]'));

const announceDelay = 350;

if (form && input && status && empty && clear) {
  let announceTimer: number | undefined;

  const apply = (query: string, announceNow: boolean) => {
    const tokens = tokenize(query);
    let visible = 0;
    rows.forEach(row => {
      const show = tokens.length === 0 || matches(row.dataset.search ?? '', tokens);
      row.hidden = !show;
      if (show) visible += 1;
    });
    categories.forEach(category => {
      category.hidden = !category.querySelector('[data-price-row]:not([hidden])');
    });
    jumpLinks.forEach(link => {
      const section = categories.find(category => category.id === link.dataset.priceJump);
      link.hidden = section?.hidden ?? false;
    });
    if (jumps) jumps.hidden = visible === 0;
    empty.hidden = visible > 0;
    clear.hidden = query.trim() === '';
    const summary = resultSummary(visible, rows.length, query);
    window.clearTimeout(announceTimer);
    if (announceNow) status.textContent = summary;
    else announceTimer = window.setTimeout(() => (status.textContent = summary), announceDelay);
    history.replaceState(null, '', `${location.pathname}${queryString(query)}${location.hash}`);
  };

  input.value = readQuery(location.search);
  apply(input.value, true);

  input.addEventListener('input', () => apply(input.value, false));

  form.addEventListener('submit', event => {
    event.preventDefault();
    apply(input.value, true);
  });

  clear.addEventListener('click', () => {
    input.value = '';
    apply('', true);
    input.focus();
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      input.value = '';
      apply('', true);
    }
  });
}
