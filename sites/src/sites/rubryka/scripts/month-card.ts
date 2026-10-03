import {
  type CalendarDate,
  type MonthRow,
  type Profile,
  buildMonth,
  daysInMonth,
  monthDays,
  monthNamesGenitive,
  soonestWaiting,
  summarize,
  weekdayNames,
  weekdayOf,
} from '../deadlines';
import { daysLeftPhrase, formatDayMonth } from '../format';

const readToday = (): CalendarDate => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
};

const text = (element: Element | null, value: string): void => {
  if (element) element.textContent = value;
};

const stateFor = (row: MonthRow): { main: string; note: string } => {
  const date = formatDayMonth(row.due.day, row.due.month);
  if (row.status === 'done') return { main: row.doneText, note: `termin: ${date}` };
  if (row.status === 'today') return { main: 'dziś', note: 'ostatni dzień' };
  return { main: `do ${date}`, note: daysLeftPhrase(row.daysLeft) };
};

const renderRow = (item: HTMLElement, row: MonthRow, order: number, isNext: boolean): void => {
  const state = stateFor(row);
  item.dataset.status = row.status;
  item.dataset.next = String(isNext);
  item.style.setProperty('--order', String(order));
  text(item.querySelector('[data-state-main]'), state.main);
  text(item.querySelector('[data-state-note]'), state.note);
  text(item.querySelector('[data-hint]'), row.shiftNote ?? item.dataset.baseHint ?? '');
};

const renderRuler = (ruler: HTMLElement, today: CalendarDate, rows: readonly MonthRow[]): void => {
  const marksByDay = new Map<number, number>();
  for (const row of rows) marksByDay.set(row.due.day, (marksByDay.get(row.due.day) ?? 0) + 1);

  const days = monthDays(today.year, today.month).map((kind, index) => {
    const day = index + 1;
    const cell = document.createElement('span');
    cell.className = 'month__day';
    cell.dataset.kind = kind;
    if (day === today.day) cell.dataset.today = 'true';
    const flags = marksByDay.get(day) ?? 0;
    for (let flag = 0; flag < flags; flag += 1) {
      const mark = document.createElement('i');
      mark.className = 'month__flag';
      mark.style.setProperty('--stack', String(flag));
      cell.append(mark);
    }
    return cell;
  });
  ruler.replaceChildren(...days);
};

const describeDay = (date: CalendarDate): string =>
  `${weekdayNames[weekdayOf(date)] ?? ''}, ${date.day} ${monthNamesGenitive[date.month - 1] ?? ''}`;

export const setupMonthCard = (): void => {
  const card = document.querySelector<HTMLElement>('[data-month-card]');
  if (!card) return;

  const today = readToday();
  const title = card.querySelector('[data-month-name]');
  const items = Array.from(card.querySelectorAll<HTMLElement>('[data-row]'));
  const ruler = card.querySelector<HTMLElement>('[data-ruler]');
  const slider = card.querySelector<HTMLInputElement>('[data-slider]');
  const reset = card.querySelector<HTMLButtonElement>('[data-reset]');
  const summary = card.querySelector<HTMLElement>('[data-summary]');
  const caption = card.querySelector('[data-today]');
  const announcer = card.querySelector('[data-announcer]');
  const inputs = Array.from(card.querySelectorAll<HTMLInputElement>('input[name="month-profile"]'));
  const length = daysInMonth(today.year, today.month);
  let viewed = today;

  card.style.setProperty('--days', String(length));
  if (slider) {
    slider.max = String(length);
    slider.value = String(today.day);
  }

  const render = (profile: Profile, staggerTicks: boolean): void => {
    const month = buildMonth(viewed, profile);
    const next = soonestWaiting(month.rows);
    const isToday = viewed.day === today.day;
    let doneCount = 0;
    for (const row of month.rows) {
      const item = items.find(candidate => candidate.dataset.row === row.id);
      if (!item) continue;
      renderRow(item, row, row.status === 'done' && staggerTicks ? doneCount : 0, row === next);
      if (row.status === 'done') doneCount += 1;
    }
    text(title, month.monthName);
    if (ruler) renderRuler(ruler, today, month.rows);
    text(summary, summarize(viewed, profile));
    text(
      caption,
      isToday
        ? `Dziś: ${describeDay(today)}. Przeciągnij znacznik, żeby zobaczyć inny dzień.`
        : `Podgląd: ${describeDay(viewed)}. Dziś jest ${today.day} ${monthNamesGenitive[today.month - 1] ?? ''}.`,
    );
    card.dataset.scrubbed = String(!isToday);
    if (reset) reset.hidden = isToday;
    slider?.setAttribute(
      'aria-valuetext',
      `${describeDay(viewed)}, ${doneCount} z ${month.rows.length} terminów odhaczone${isToday ? ', dziś' : ''}`,
    );
  };

  const selectedProfile = (): Profile =>
    inputs.some(input => input.checked && input.value === 'company') ? 'company' : 'sole';

  for (const input of inputs) {
    input.addEventListener('change', () => {
      render(selectedProfile(), false);
      text(announcer, summarize(viewed, selectedProfile()));
    });
  }

  slider?.addEventListener('input', () => {
    viewed = { ...today, day: Number(slider.value) };
    render(selectedProfile(), false);
  });

  reset?.addEventListener('click', () => {
    viewed = today;
    if (slider) slider.value = String(today.day);
    render(selectedProfile(), false);
    slider?.focus();
  });

  render(selectedProfile(), true);
  card.classList.add('month--live');
};
