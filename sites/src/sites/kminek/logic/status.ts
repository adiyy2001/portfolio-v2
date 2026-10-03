import type { Lang } from '../data/lang';
import type { Weekday, WeekHours } from '../data/hours';

export interface Clock {
  weekday: Weekday;
  minutes: number;
}

export interface Reopening {
  when: 'today' | 'tomorrow' | 'later';
  weekday: Weekday;
  at: string;
}

export type Status =
  | { state: 'open'; closesAt: string; kitchenOpen: boolean }
  | { state: 'closed'; reopens: Reopening };

const weekdays: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 } as const;

export const clockInWarsaw = (instant: Date): Clock => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const read = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  const weekday = weekdayIndex[read('weekday') as keyof typeof weekdayIndex] ?? 0;
  return { weekday, minutes: Number(read('hour')) * 60 + Number(read('minute')) };
};

export const statusAt = (clock: Clock, hours: WeekHours): Status => {
  const today = hours[clock.weekday];
  if (today && clock.minutes >= toMinutes(today.opens) && clock.minutes < toMinutes(today.closes)) {
    return {
      state: 'open',
      closesAt: today.closes,
      kitchenOpen: clock.minutes < toMinutes(today.kitchenCloses),
    };
  }
  if (today && clock.minutes < toMinutes(today.opens)) {
    return { state: 'closed', reopens: { when: 'today', weekday: clock.weekday, at: today.opens } };
  }
  for (let offset = 1; offset <= 7; offset += 1) {
    const weekday = weekdays[(clock.weekday + offset) % 7] ?? 0;
    const day = hours[weekday];
    if (day) {
      return {
        state: 'closed',
        reopens: { when: offset === 1 ? 'tomorrow' : 'later', weekday, at: day.opens },
      };
    }
  }
  return { state: 'closed', reopens: { when: 'later', weekday: 2, at: '12:00' } };
};

const accusativeWeekdays: Record<Lang, readonly string[]> = {
  pl: [
    'w niedzielę',
    'w poniedziałek',
    'we wtorek',
    'w środę',
    'w czwartek',
    'w piątek',
    'w sobotę',
  ],
  en: [
    'on Sunday',
    'on Monday',
    'on Tuesday',
    'on Wednesday',
    'on Thursday',
    'on Friday',
    'on Saturday',
  ],
};

const when = (reopens: Reopening, lang: Lang) => {
  if (reopens.when === 'today') return lang === 'pl' ? 'dziś' : 'today';
  if (reopens.when === 'tomorrow') return lang === 'pl' ? 'jutro' : 'tomorrow';
  return accusativeWeekdays[lang][reopens.weekday] ?? '';
};

export const describeStatus = (status: Status, lang: Lang) => {
  if (status.state === 'open') {
    if (lang === 'pl') {
      return status.kitchenOpen
        ? `Teraz otwarte, do ${status.closesAt}.`
        : `Teraz otwarte do ${status.closesAt}, kuchnia już zamknięta.`;
    }
    return status.kitchenOpen
      ? `Open now, until ${status.closesAt}.`
      : `Open until ${status.closesAt}, the kitchen has closed.`;
  }
  const moment = when(status.reopens, lang);
  return lang === 'pl'
    ? `Teraz zamknięte. Otwieramy ${moment} o ${status.reopens.at}.`
    : `Closed now. We open ${moment} at ${status.reopens.at}.`;
};
