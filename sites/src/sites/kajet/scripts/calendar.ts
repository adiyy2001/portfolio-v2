import { monthlyRows, monthWindowLength, type MonthlyRow } from '../data/calendar';
import {
  dayMonth,
  dayMonthYear,
  deadlineDate,
  inDaysLabel,
  monthNames,
  monthNamesGenitive,
} from '../lib/dates';
import { find, findAll, findOptional, make } from './dom';

const eventDate = (row: MonthlyRow, year: number, month: number): Date => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.min(row.day, daysInMonth);
  return row.legal ? deadlineDate(year, month, day) : new Date(year, month, day, 23, 59, 59);
};

export const setupCalendar = (): void => {
  const now = new Date();
  const table = find(document, '#cal', HTMLTableElement);
  const list = find(document, '#cal-list', HTMLElement);
  const detail = find(document, '#cal-detail', HTMLElement);
  const monthLabel = find(document, '#cal-month', HTMLElement);
  const todayLabel = find(document, '#cal-today', HTMLElement);
  const prev = findOptional(document, '#cal-prev', HTMLButtonElement);
  const next = findOptional(document, '#cal-next', HTMLButtonElement);
  const startIndex = now.getFullYear() * 12 + now.getMonth();
  let offset = 0;
  let selectedDay = now.getDate();
  let cells = new Map<number, HTMLButtonElement>();

  const view = (): { year: number; month: number; days: number; lead: number } => {
    const index = startIndex + offset;
    const year = Math.floor(index / 12);
    const month = index % 12;
    return {
      year,
      month,
      days: new Date(year, month + 1, 0).getDate(),
      lead: (new Date(year, month, 1).getDay() + 6) % 7,
    };
  };

  const eventsOn = (day: number): MonthlyRow[] => {
    const { year, month } = view();
    return monthlyRows.filter(row => eventDate(row, year, month).getDate() === day);
  };

  const isShifted = (row: MonthlyRow): boolean => {
    const { year, month, days } = view();
    return eventDate(row, year, month).getDate() !== Math.min(row.day, days);
  };

  const rowLabel = (row: MonthlyRow): string =>
    row.label + (isShifted(row) ? ', przesunięte na dzień roboczy' : '');

  const isCurrentMonth = (): boolean => offset === 0;

  const dayLabel = (day: number): string => {
    const { month } = view();
    const events = eventsOn(day)
      .map(row => row.title)
      .join(', ');
    return `${day} ${monthNamesGenitive[month]}${events ? `, ${events}` : ''}`;
  };

  const select = (day: number, focus: boolean): void => {
    const { year, month, days } = view();
    selectedDay = Math.max(1, Math.min(days, day));
    for (const [cellDay, button] of cells) {
      const on = cellDay === selectedDay;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.tabIndex = on ? 0 : -1;
    }
    for (const item of findAll(list, 'li', HTMLElement)) {
      item.classList.toggle('sel', Number(item.dataset.day) === selectedDay);
    }
    const events = eventsOn(selectedDay);
    const first = events[0];
    if (!first) {
      const upcoming = monthlyRows
        .map(row => eventDate(row, year, month))
        .filter(date => date > now)
        .sort((a, b) => a.getTime() - b.getTime())[0];
      detail.textContent = `${dayMonth(new Date(year, month, selectedDay))}: bez terminów.${upcoming ? ` Najbliższy termin: ${dayMonthYear(upcoming)}.` : ''}`;
    } else {
      detail.textContent = `${dayMonth(eventDate(first, year, month))}: ${events.map(row => `${row.title} (${rowLabel(row)})`).join('; ')}.`;
    }
    if (focus) cells.get(selectedDay)?.focus();
  };

  const build = (): void => {
    const { year, month, days, lead } = view();
    table.textContent = '';
    cells = new Map();
    const head = make('tr');
    for (const name of ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd']) {
      const th = make('th', '', name);
      th.scope = 'col';
      head.append(th);
    }
    table.append(make('thead'), make('tbody'));
    table.tHead?.append(head);
    const body = table.tBodies[0];
    const weeks = Math.ceil((lead + days) / 7);
    for (let week = 0; week < weeks; week++) {
      const tr = make('tr');
      for (let column = 0; column < 7; column++) {
        const day = week * 7 + column - lead + 1;
        const td = make('td');
        if (day < 1 || day > days) {
          td.className = 'out';
          tr.append(td);
          continue;
        }
        const events = eventsOn(day);
        const legal = events.some(row => row.legal);
        const isToday = isCurrentMonth() && day === now.getDate();
        const button = make(
          'button',
          `cal-day${events.length ? ' ev' : ''}${legal ? ' legal' : ''}${isToday ? ' today' : ''}${column > 4 ? ' wk' : ''}`,
        );
        button.type = 'button';
        button.dataset.day = String(day);
        button.setAttribute('aria-label', dayLabel(day) + (isToday ? ', dziś' : ''));
        button.append(make('span', 'cd-n', String(day)));
        if (events.length)
          button.append(make('span', 'cd-t', events.map(row => row.short).join(', ')));
        td.append(button);
        tr.append(td);
        cells.set(day, button);
      }
      body?.append(tr);
    }
    monthLabel.textContent = `${monthNames[month]} ${year}`;
    todayLabel.textContent = `dziś ${dayMonth(now)}`;
    list.textContent = '';
    for (const row of monthlyRows) {
      const date = eventDate(row, year, month);
      const li = make('li', row.legal ? 'legal' : '');
      li.dataset.day = String(date.getDate());
      li.append(
        make('span', 'nm', row.title),
        make('span', 'amt', row.label),
        make(
          'span',
          'when',
          dayMonthYear(date) + (isShifted(row) ? ', przesunięte na dzień roboczy' : ''),
        ),
        make('span', 'st', date < now ? 'wykonane' : inDaysLabel(date, now)),
      );
      list.append(li);
    }
    if (prev) prev.disabled = offset === 0;
    if (next) next.disabled = offset === monthWindowLength - 1;
    const preferred = isCurrentMonth()
      ? now.getDate()
      : monthlyRows[0]
        ? eventDate(monthlyRows[0], year, month).getDate()
        : 1;
    select(preferred, false);
  };

  const move = (delta: number): void => {
    const target = offset + delta;
    if (target < 0 || target > monthWindowLength - 1) return;
    offset = target;
    build();
  };

  table.addEventListener('click', event => {
    const target = event.target;
    const button = target instanceof Element ? target.closest('.cal-day') : null;
    if (button instanceof HTMLElement) select(Number(button.dataset.day), true);
  });
  table.addEventListener('keydown', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains('cal-day')) return;
    const { days } = view();
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    let step = steps[event.key];
    if (event.key === 'Home') step = 1 - selectedDay;
    if (event.key === 'End') step = days - selectedDay;
    if (step === undefined) return;
    event.preventDefault();
    select(selectedDay + step, true);
  });
  list.addEventListener('click', event => {
    const target = event.target;
    const item = target instanceof Element ? target.closest('li') : null;
    if (item instanceof HTMLElement) select(Number(item.dataset.day), false);
  });
  prev?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));

  build();
};
