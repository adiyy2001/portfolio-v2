import { shiftOn, type Shift } from './hours';
import { monthNames, weekdayNames, weekdayPhrases } from './names';
import { addDays, isoDate, isSameDate, weekdayOf, type CalendarDate } from './polish-calendar';
import type { WarsawMoment } from './warsaw-time';

export type WindowId = 'morning' | 'noon' | 'afternoon';

export interface CallbackWindow {
  id: WindowId;
  from: number;
  to: number;
  label: string;
}

export interface CallbackDay {
  iso: string;
  label: string;
  phrase: string;
  windows: CallbackWindow[];
}

export const callbackWindows: CallbackWindow[] = [
  { id: 'morning', from: 9 * 60, to: 12 * 60, label: '9:00-12:00' },
  { id: 'noon', from: 12 * 60, to: 15 * 60, label: '12:00-15:00' },
  { id: 'afternoon', from: 15 * 60, to: 17 * 60, label: '15:00-17:00' },
];

const searchLimitInDays = 21;
const minimumLeadInMinutes = 60;

export const windowsOn = (date: CalendarDate, shifts: Shift[]): CallbackWindow[] => {
  const shift = shiftOn(date, shifts);
  if (!shift) return [];
  return callbackWindows.filter(window => window.from >= shift.from && window.to <= shift.to);
};

const describeDay = (
  date: CalendarDate,
  today: CalendarDate,
): Pick<CallbackDay, 'label' | 'phrase'> => {
  const weekday = weekdayOf(date);
  const dateText = `${date.day} ${monthNames[date.month - 1]}`;
  if (isSameDate(date, today)) {
    return { label: `dziś, ${weekdayNames[weekday]} ${dateText}`, phrase: 'dziś' };
  }
  if (isSameDate(date, addDays(today, 1))) {
    return { label: `jutro, ${weekdayNames[weekday]} ${dateText}`, phrase: 'jutro' };
  }
  return {
    label: `${weekdayNames[weekday]} ${dateText}`,
    phrase: `${weekdayPhrases[weekday]}, ${dateText}`,
  };
};

export const callbackDays = (moment: WarsawMoment, shifts: Shift[], count = 5): CallbackDay[] => {
  const days: CallbackDay[] = [];
  for (let offset = 0; offset <= searchLimitInDays && days.length < count; offset += 1) {
    const date = addDays(moment.date, offset);
    const available = windowsOn(date, shifts).filter(
      window => offset > 0 || window.to - moment.minutes >= minimumLeadInMinutes,
    );
    if (available.length > 0) {
      days.push({ iso: isoDate(date), ...describeDay(date, moment.date), windows: available });
    }
  }
  return days;
};

export const callbackSummary = (
  day: CallbackDay | undefined,
  window: CallbackWindow | undefined,
): string => {
  const windowText = window ? `w godzinach ${window.label}` : undefined;
  if (!day) {
    return windowText
      ? `Oddzwonimy w najbliższym dniu roboczym, ${windowText}.`
      : 'Oddzwonimy w ciągu jednego dnia roboczego.';
  }
  return `Oddzwonimy ${day.phrase}, ${windowText ?? 'w godzinach pracy kancelarii'}.`;
};
