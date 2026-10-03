import { isPublicHoliday } from '../lib/holidays';
import { warsawMoment } from '../lib/open-status';

const now = warsawMoment(new Date());
const today = now.isoDay;
const closedForHoliday = isPublicHoliday(now.year, now.month, now.day);
document.querySelectorAll<HTMLElement>('[data-day]').forEach(row => {
  if (Number(row.dataset.day) === today) {
    row.setAttribute('aria-current', 'date');
    row.dataset.today = 'true';
    const marker = row.querySelector<HTMLElement>('[data-today-marker]');
    if (marker) marker.hidden = false;
    const hours = row.querySelector<HTMLElement>('td');
    if (hours && closedForHoliday) hours.textContent = 'nieczynne (święto)';
  }
});

const toggle = document.querySelector<HTMLButtonElement>('[data-calendar-toggle]');
const panel = document.querySelector<HTMLElement>('[data-calendar-panel]');
if (toggle && panel) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
}
