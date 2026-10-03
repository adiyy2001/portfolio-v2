import { useEffect, useRef, useState } from 'preact/hooks';
import type { PickerText } from '../content/picker';
import {
  addMonths,
  daysInMonth,
  firstOfMonth,
  monthIndex,
  partsFromDay,
  weekdayOf,
} from '../lib/dates';
import type { Day } from '../lib/dates';
import { formatDayLong, formatMonthYear, formatPln, weekdayShortName } from '../lib/format';
import type { Lang } from '../i18n/lang';
import { cellModel } from '../lib/range';
import type { CellModel, RangeContext, Selection } from '../lib/range';
import { horizonDays } from '../data/packages';

interface Props {
  lang: Lang;
  text: PickerText;
  context: RangeContext;
  selection: Selection;
  onSelect: (day: Day) => void;
  idPrefix: string;
}

const mondayFirst = [1, 2, 3, 4, 5, 6, 0];

const mondayIndex = (day: Day): number => (weekdayOf(day) + 6) % 7;

const weeksOf = (first: Day): (Day | null)[][] => {
  const { year, month } = partsFromDay(first);
  const length = daysInMonth(year, month);
  const cells: (Day | null)[] = [
    ...Array.from({ length: mondayIndex(first) }, () => null),
    ...Array.from({ length: length }, (_, index) => first + index),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Day | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
};

const cellLabel = (model: CellModel, lang: Lang, text: PickerText): string => {
  const parts: string[] = [formatDayLong(model.day, lang)];
  if (model.role === 'arrival') parts.push(text.roleArrival);
  if (model.role === 'departure') parts.push(text.roleDeparture);
  if (model.role === 'inside') parts.push(text.roleInside);
  if (model.price !== null)
    parts.push(`${text.fromPerNight} ${formatPln(model.price, lang)} ${text.perNight}`);
  if (model.block !== null) parts.push(text.blocks[model.block]);
  return parts.join(', ');
};

export const Calendar = ({ lang, text, context, selection, onSelect, idPrefix }: Props) => {
  const { today } = context;
  const lastDay = today + horizonDays - 1;
  const [focusDay, setFocusDay] = useState<Day>(selection.arrival ?? today);
  const [visibleMonth, setVisibleMonth] = useState<Day>(firstOfMonth(selection.arrival ?? today));
  const [reason, setReason] = useState<string | null>(null);
  const keyboardMoved = useRef(false);
  const latestFocus = useRef(focusDay);
  latestFocus.current = focusDay;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!keyboardMoved.current) return;
    keyboardMoved.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay, visibleMonth]);

  const effectiveFocus = firstOfMonth(focusDay) === visibleMonth ? focusDay : visibleMonth;
  const canGoBack = monthIndex(visibleMonth) > monthIndex(today);
  const canGoForward = monthIndex(visibleMonth) < monthIndex(lastDay);

  const clampToHorizon = (day: Day): Day => Math.min(lastDay, Math.max(today, day));

  const showMonth = (delta: number): void => {
    const target = clampToHorizon(addMonths(effectiveFocus, delta));
    setFocusDay(target);
    setVisibleMonth(firstOfMonth(target));
  };

  const moveFocus = (target: Day): void => {
    const clamped = clampToHorizon(target);
    keyboardMoved.current = true;
    latestFocus.current = clamped;
    setFocusDay(clamped);
    setVisibleMonth(firstOfMonth(clamped));
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const offset = offsets[event.key];
    if (offset !== undefined) {
      event.preventDefault();
      moveFocus(latestFocus.current + offset);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(latestFocus.current - mondayIndex(latestFocus.current));
    } else if (event.key === 'End') {
      event.preventDefault();
      moveFocus(latestFocus.current + 6 - mondayIndex(latestFocus.current));
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const months = (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1);
      moveFocus(addMonths(latestFocus.current, months));
    }
  };

  const { year, month } = partsFromDay(visibleMonth);
  const weeks = weeksOf(visibleMonth);
  const titleId = `${idPrefix}-month`;
  const hintId = `${idPrefix}-hint`;

  return (
    <div class="calendar">
      <div class="calendar-head">
        <button
          type="button"
          class="calendar-step"
          aria-label={text.monthPrevious}
          aria-disabled={canGoBack ? undefined : 'true'}
          onClick={() => canGoBack && showMonth(-1)}>
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <h3 id={titleId} aria-live="polite">
          {formatMonthYear(year, month, lang)}
        </h3>
        <button
          type="button"
          class="calendar-step"
          aria-label={text.monthNext}
          aria-disabled={canGoForward ? undefined : 'true'}
          onClick={() => canGoForward && showMonth(1)}>
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      </div>
      <div
        class="calendar-grid"
        role="grid"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        ref={gridRef}
        onKeyDown={onKeyDown}>
        <div class="calendar-row" role="row">
          {mondayFirst.map(weekday => (
            <div class="calendar-weekday" role="columnheader" key={weekday}>
              {weekdayShortName(weekday, lang)}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div class="calendar-row" role="row" key={weekIndex}>
            {week.map((day, dayIndex) => {
              if (day === null)
                return <div class="calendar-blank" role="gridcell" key={dayIndex} />;
              const model = cellModel(day, selection, context);
              const selected = model.role !== 'none';
              const dayOfMonth = partsFromDay(day).date;
              const caption =
                model.block === 'tooShort'
                  ? text.ruleShort
                  : model.price !== null && model.block !== 'past'
                    ? String(model.price)
                    : model.soldOut
                      ? text.soldOutShort
                      : '';
              return (
                <div
                  class="calendar-cell"
                  role="gridcell"
                  aria-selected={selected ? 'true' : 'false'}
                  data-role={model.role}
                  data-block={model.block ?? undefined}
                  data-sold-out={model.soldOut ? 'true' : undefined}
                  key={dayIndex}>
                  <button
                    type="button"
                    data-day={day}
                    tabIndex={day === effectiveFocus ? 0 : -1}
                    aria-disabled={model.block === null ? undefined : 'true'}
                    aria-current={day === today ? 'date' : undefined}
                    aria-label={cellLabel(model, lang, text)}
                    onFocus={() => setFocusDay(day)}
                    onClick={() => {
                      setFocusDay(day);
                      setReason(model.block === null ? null : text.blocks[model.block]);
                      onSelect(day);
                    }}>
                    <span class="calendar-day" aria-hidden="true">
                      {dayOfMonth}
                    </span>
                    <span class="calendar-price" aria-hidden="true">
                      {caption}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p class="visually-hidden" id={hintId}>
        {text.gridHint} {text.priceNote}
      </p>
      <p class="calendar-reason" role="status">
        {reason}
      </p>
      <p class="calendar-rule">{text.ruleNote}</p>
      <ul class="calendar-legend">
        <li>
          <span class="swatch swatch--free" aria-hidden="true">
            340
          </span>
          {text.legendFree}
        </li>
        <li>
          <span class="swatch swatch--selected" aria-hidden="true" />
          {text.legendSelected}
        </li>
        <li>
          <span class="swatch swatch--sold" aria-hidden="true" />
          {text.legendSoldOut}
        </li>
        <li>
          <span class="swatch swatch--rule" aria-hidden="true">
            {text.ruleShort}
          </span>
          {text.legendRule}
        </li>
        <li>
          <span class="swatch swatch--today" aria-hidden="true" />
          {text.legendToday}
        </li>
      </ul>
    </div>
  );
};
