import type { Lang } from '../data/lang';
import { weekHours } from '../data/hours';
import { clockInWarsaw, describeStatus, statusAt } from '../logic/status';
import {
  menuWeekLabel,
  menuWeekOf,
  nextLabel,
  nextShowing,
  parseRecurrence,
  toIso,
  warsawMoment,
} from '../logic/schedule';
import { tie } from '../logic/typography';

const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'pl');

const initNav = () => {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const toggle = rail?.querySelector<HTMLButtonElement>('[data-rail-toggle]');
  if (!rail || !toggle) return;
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    rail.toggleAttribute('data-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  rail.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  rail.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && !rail.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('click', event => {
    if (event.target instanceof Node && !rail.contains(event.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', () => setOpen(false));
};

const updateStatus = () => {
  const text = tie(describeStatus(statusAt(clockInWarsaw(new Date()), weekHours), pageLang()));
  document.querySelectorAll('[data-status]').forEach(element => {
    if (element.textContent !== text) element.textContent = text;
  });
};

const markToday = () => {
  const today = String(clockInWarsaw(new Date()).weekday);
  document.querySelectorAll('[data-week] [data-weekday]').forEach(row => {
    if (row.getAttribute('data-weekday') === today) row.setAttribute('aria-current', 'date');
    else row.removeAttribute('aria-current');
  });
};

const updateEventDates = () => {
  const lang = pageLang();
  const now = warsawMoment(new Date());
  document.querySelectorAll<HTMLTimeElement>('time[data-rule]').forEach(element => {
    const rule = parseRecurrence(element.dataset.rule ?? '');
    if (!rule) return;
    const next = nextShowing(rule, now, element.dataset.endsAt ?? '23:59');
    element.dateTime = toIso(next);
    element.textContent = tie(nextLabel(next, now.date, lang));
  });
};

const updateMenuWeek = () => {
  const label = tie(menuWeekLabel(menuWeekOf(warsawMoment(new Date()).date), pageLang()));
  document.querySelectorAll('[data-menu-week]').forEach(element => {
    if (element.textContent !== label) element.textContent = label;
  });
};

const refresh = () => {
  updateStatus();
  markToday();
  updateEventDates();
  updateMenuWeek();
};

initNav();
refresh();
window.setInterval(refresh, 60_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});
