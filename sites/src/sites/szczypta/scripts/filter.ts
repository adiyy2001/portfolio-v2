import type { Lang } from '../data/lang';
import { menuCopy } from '../copy/menu';

const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'pl');

export const initFilter = () => {
  const root = document.querySelector<HTMLElement>('[data-filters]');
  if (!root) return;
  const copy = menuCopy[pageLang()].filters;
  const vegetarian = root.querySelector<HTMLInputElement>('[data-filter="vegetarian"]');
  const vegan = root.querySelector<HTMLInputElement>('[data-filter="vegan"]');
  const allergens = [...root.querySelectorAll<HTMLInputElement>('[data-allergen]')];
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const reset = root.querySelector<HTMLButtonElement>('[data-filter-reset]');
  const dishes = [...document.querySelectorAll<HTMLElement>('.dish')];
  const chapters = [...document.querySelectorAll<HTMLElement>('.chapter[data-chapter]')];
  root.hidden = false;

  const apply = () => {
    const avoided = allergens.filter(box => box.checked).map(box => box.dataset.allergen ?? '');
    let shown = 0;
    dishes.forEach(dish => {
      const diet = dish.dataset.diet ?? '';
      const own = (dish.dataset.allergens ?? '').split(' ').filter(Boolean);
      const dietOk = vegan?.checked
        ? diet === 'vegan'
        : vegetarian?.checked
          ? diet === 'vegan' || diet === 'vegetarian'
          : true;
      const visible = dietOk && !avoided.some(id => own.includes(id));
      dish.hidden = !visible;
      if (visible) shown += 1;
    });
    chapters.forEach(chapter => {
      chapter.hidden = ![...chapter.querySelectorAll<HTMLElement>('.dish')].some(
        dish => !dish.hidden,
      );
    });
    const active = Boolean(vegan?.checked || vegetarian?.checked || avoided.length);
    if (reset) reset.hidden = !active;
    if (status) {
      status.textContent = !active
        ? ''
        : shown === 0
          ? copy.none
          : copy.status(shown, dishes.length);
    }
  };

  vegan?.addEventListener('change', () => {
    if (vegan.checked && vegetarian) vegetarian.checked = true;
    apply();
  });
  vegetarian?.addEventListener('change', () => {
    if (!vegetarian.checked && vegan) vegan.checked = false;
    apply();
  });
  allergens.forEach(box => box.addEventListener('change', apply));
  reset?.addEventListener('click', () => {
    [vegetarian, vegan, ...allergens].forEach(box => {
      if (box) box.checked = false;
    });
    apply();
    vegetarian?.focus();
  });
  apply();
};
