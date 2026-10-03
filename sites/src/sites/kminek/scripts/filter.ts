import type { AllergenId } from '../data/allergens';
import { menuCopy } from '../copy/menu';
import {
  filtersFromSearch,
  formatCount,
  isFiltering,
  matchesFilters,
  parseAllergens,
  parseDiet,
  parseDietFilter,
  searchFromFilters,
  type Filters,
} from '../logic/menu-filter';

const lang = document.documentElement.lang === 'en' ? 'en' : 'pl';
const copy = menuCopy[lang].filter;

const root = document.querySelector<HTMLElement>('[data-filters]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const form = root?.querySelector<HTMLFormElement>('[data-filters-panel]');
const toggle = root?.querySelector<HTMLButtonElement>('[data-filters-toggle]');
const count = root?.querySelector<HTMLElement>('[data-count]');
const reset = root?.querySelector<HTMLButtonElement>('[data-reset]');
const activeCount = root?.querySelector<HTMLElement>('[data-active-count]');
const empty = menu?.querySelector<HTMLElement>('[data-empty]');

const radios = () =>
  Array.from(form?.querySelectorAll<HTMLInputElement>('input[name="diet"]') ?? []);
const boxes = () =>
  Array.from(form?.querySelectorAll<HTMLInputElement>('input[name="without"]') ?? []);

const readFilters = (): Filters => ({
  diet: parseDietFilter(radios().find(radio => radio.checked)?.value),
  without: new Set<AllergenId>(
    parseAllergens(
      boxes()
        .filter(box => box.checked)
        .map(box => box.value)
        .join(' '),
    ),
  ),
});

const writeFilters = (filters: Filters) => {
  radios().forEach(radio => {
    radio.checked = radio.value === filters.diet;
  });
  boxes().forEach(box => {
    box.checked = parseAllergens(box.value).some(id => filters.without.has(id));
  });
};

const apply = (filters: Filters) => {
  if (!menu || !count || !reset || !empty) return;
  const dishes = Array.from(menu.querySelectorAll<HTMLElement>('[data-dish]'));
  let shown = 0;
  dishes.forEach(dish => {
    const visible = matchesFilters(
      { diet: parseDiet(dish.dataset.diet), allergens: parseAllergens(dish.dataset.allergens) },
      filters,
    );
    dish.hidden = !visible;
    if (visible) shown += 1;
  });
  menu.querySelectorAll<HTMLElement>('[data-section]').forEach(section => {
    section.hidden = section.querySelectorAll('[data-dish]:not([hidden])').length === 0;
  });
  empty.hidden = shown > 0;
  reset.hidden = !isFiltering(filters);
  count.textContent = formatCount(copy.countTemplate, shown, dishes.length);
  if (activeCount) {
    const active = (filters.diet === 'any' ? 0 : 1) + filters.without.size;
    activeCount.textContent = active > 0 ? String(active) : '';
    activeCount.hidden = active === 0;
  }
};

const rememberInUrl = (filters: Filters) => {
  try {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${searchFromFilters(filters)}`,
    );
  } catch {
    return;
  }
};

const initToggle = () => {
  if (!root || !toggle) return;
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    root.toggleAttribute('data-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  if (isFiltering(filtersFromSearch(window.location.search))) setOpen(true);
};

const init = () => {
  if (!form || !reset) return;
  const initial = filtersFromSearch(window.location.search);
  writeFilters(initial);
  apply(initial);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('change', () => {
    const filters = readFilters();
    apply(filters);
    rememberInUrl(filters);
  });
  reset.addEventListener('click', event => {
    event.preventDefault();
    const cleared: Filters = { diet: 'any', without: new Set() };
    writeFilters(cleared);
    apply(cleared);
    rememberInUrl(cleared);
    radios()[0]?.focus();
  });
  initToggle();
};

init();
