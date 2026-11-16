import { unitsPage } from '../copy';
import { emptyFilters, type Filters, matches, parseFilters, toQuery } from '../filter';
import { all, need } from './dom';

const groups = [
  { name: 'pokoje', key: 'rooms' },
  { name: 'pietro', key: 'floor' },
  { name: 'status', key: 'status' },
] as const;

const initFilters = (form: HTMLFormElement) => {
  const rows = all<HTMLTableRowElement>(document, '[data-rows] tr');
  const count = need<HTMLElement>(form, '[data-count]');
  const resetButton = need<HTMLButtonElement>(form, '[data-reset]');
  const empty = need<HTMLElement>(document, '[data-empty]');
  const emptyReset = need<HTMLButtonElement>(empty, '[data-reset-empty]');
  const inputs = all<HTMLInputElement>(form, 'input[type=checkbox]');

  const readForm = (): Filters => {
    const filters = emptyFilters();
    for (const group of groups) {
      filters[group.key] = inputs
        .filter(input => input.name === group.name && input.checked)
        .map(input => input.value);
    }
    return filters;
  };

  const writeForm = (filters: Filters) => {
    for (const group of groups) {
      for (const input of inputs) {
        if (input.name === group.name) input.checked = filters[group.key].includes(input.value);
      }
    }
  };

  const apply = (filters: Filters, syncUrl: boolean) => {
    let shown = 0;
    for (const row of rows) {
      const visible = matches(
        {
          rooms: row.dataset.rooms ?? '',
          floor: row.dataset.floor ?? '',
          status: row.dataset.status ?? '',
        },
        filters,
      );
      row.hidden = !visible;
      if (visible) shown++;
    }
    count.textContent = unitsPage.count(shown, rows.length);
    const active = toQuery(filters) !== '';
    resetButton.hidden = !active;
    empty.classList.toggle('show', shown === 0);
    if (syncUrl) {
      const next = `${window.location.pathname}${toQuery(filters)}${window.location.hash}`;
      window.history.replaceState(null, '', next);
    }
  };

  const clear = () => {
    const filters = emptyFilters();
    writeForm(filters);
    apply(filters, true);
  };

  form.addEventListener('change', () => apply(readForm(), true));
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    clear();
  });
  emptyReset.addEventListener('click', clear);

  const initial = parseFilters(window.location.search);
  writeForm(initial);
  apply(initial, false);
};

const form = document.querySelector<HTMLFormElement>('[data-filters]');
if (form) initFilters(form);
