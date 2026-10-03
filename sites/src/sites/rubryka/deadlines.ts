import { daysLeftPhrase, formatDayMonth } from './format';

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export type Profile = 'sole' | 'company';
export type RowId = 'ksef' | 'zus' | 'vat' | 'jpk';
export type RowStatus = 'done' | 'today' | 'open';
export type DayKind = 'workday' | 'weekend' | 'holiday';

export interface MonthRow {
  id: RowId;
  title: string;
  nominalDay: number;
  due: CalendarDate;
  status: RowStatus;
  daysLeft: number;
  doneText: string;
  shiftNote: string | null;
}

export interface MonthModel {
  year: number;
  month: number;
  monthName: string;
  rows: MonthRow[];
}

export const weekdayNames = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
] as const;

const DAY_MS = 86_400_000;

export const monthNames = [
  'styczeń',
  'luty',
  'marzec',
  'kwiecień',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpień',
  'wrzesień',
  'październik',
  'listopad',
  'grudzień',
] as const;

export const monthNamesGenitive = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
] as const;

const fixedHolidays: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26],
];

const toTime = ({ year, month, day }: CalendarDate): number => Date.UTC(year, month - 1, day);

const fromTime = (time: number): CalendarDate => {
  const date = new Date(time);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

export const sameDate = (first: CalendarDate, second: CalendarDate): boolean =>
  first.year === second.year && first.month === second.month && first.day === second.day;

export const addDays = (date: CalendarDate, days: number): CalendarDate =>
  fromTime(toTime(date) + days * DAY_MS);

export const daysBetween = (from: CalendarDate, to: CalendarDate): number =>
  Math.round((toTime(to) - toTime(from)) / DAY_MS);

export const weekdayOf = (date: CalendarDate): number => new Date(toTime(date)).getUTCDay();

export const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

export const easterSunday = (year: number): CalendarDate => {
  const goldenNumber = year % 19;
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;
  const centuryLeaps = Math.floor(century / 4);
  const centuryRest = century % 4;
  const correction = Math.floor((century + 8) / 25);
  const moonCorrection = Math.floor((century - correction + 1) / 3);
  const epact = (19 * goldenNumber + century - centuryLeaps - moonCorrection + 15) % 30;
  const leapsInCentury = Math.floor(yearInCentury / 4);
  const restInCentury = yearInCentury % 4;
  const weekdayOffset = (32 + 2 * centuryRest + 2 * leapsInCentury - epact - restInCentury) % 7;
  const shift = Math.floor((goldenNumber + 11 * epact + 22 * weekdayOffset) / 451);
  const total = epact + weekdayOffset - 7 * shift + 114;
  return { year, month: Math.floor(total / 31), day: (total % 31) + 1 };
};

export const publicHolidays = (year: number): CalendarDate[] => {
  const easter = easterSunday(year);
  const fixed = fixedHolidays.map(([month, day]) => ({ year, month, day }));
  const christmasEve = year >= 2025 ? [{ year, month: 12, day: 24 }] : [];
  return [
    ...fixed,
    ...christmasEve,
    easter,
    addDays(easter, 1),
    addDays(easter, 49),
    addDays(easter, 60),
  ];
};

export const isPublicHoliday = (date: CalendarDate): boolean =>
  publicHolidays(date.year).some(holiday => sameDate(holiday, date));

export const isWeekend = (date: CalendarDate): boolean => {
  const weekday = weekdayOf(date);
  return weekday === 0 || weekday === 6;
};

export const dayKind = (date: CalendarDate): DayKind => {
  if (isWeekend(date)) return 'weekend';
  return isPublicHoliday(date) ? 'holiday' : 'workday';
};

export const nextWorkingDay = (date: CalendarDate): CalendarDate => {
  let candidate = date;
  while (dayKind(candidate) !== 'workday') candidate = addDays(candidate, 1);
  return candidate;
};

const dayKindName = (date: CalendarDate): string => {
  if (weekdayOf(date) === 6) return 'sobota';
  if (weekdayOf(date) === 0) return 'niedziela';
  return 'święto';
};

interface RowDefinition {
  id: RowId;
  title: string;
  doneText: string;
  shifts: boolean;
  dayFor: (profile: Profile) => number;
}

const rowDefinitions: RowDefinition[] = [
  { id: 'ksef', title: 'Faktury z KSeF', doneText: 'pobrane', shifts: false, dayFor: () => 15 },
  {
    id: 'zus',
    title: 'ZUS',
    doneText: 'opłacony',
    shifts: true,
    dayFor: profile => (profile === 'company' ? 15 : 20),
  },
  { id: 'vat', title: 'VAT', doneText: 'zapłacony', shifts: true, dayFor: () => 25 },
  { id: 'jpk', title: 'JPK', doneText: 'wysłany', shifts: true, dayFor: () => 25 },
];

const statusFor = (today: CalendarDate, due: CalendarDate): RowStatus => {
  const daysLeft = daysBetween(today, due);
  if (daysLeft < 0) return 'done';
  return daysLeft === 0 ? 'today' : 'open';
};

export const buildMonth = (today: CalendarDate, profile: Profile): MonthModel => {
  const rows = rowDefinitions.map((definition): MonthRow => {
    const nominal = { year: today.year, month: today.month, day: definition.dayFor(profile) };
    const due = definition.shifts ? nextWorkingDay(nominal) : nominal;
    return {
      id: definition.id,
      title: definition.title,
      nominalDay: nominal.day,
      due,
      status: statusFor(today, due),
      daysLeft: daysBetween(today, due),
      doneText: definition.doneText,
      shiftNote: sameDate(nominal, due)
        ? null
        : `${nominal.day}. to ${dayKindName(nominal)}, więc ${formatDayMonth(due.day, due.month)}`,
    };
  });
  return {
    year: today.year,
    month: today.month,
    monthName: monthNames[today.month - 1] ?? '',
    rows,
  };
};

const nextMonthStart = (today: CalendarDate): CalendarDate =>
  today.month === 12
    ? { year: today.year + 1, month: 1, day: 1 }
    : { year: today.year, month: today.month + 1, day: 1 };

export const soonestWaiting = (rows: readonly MonthRow[]): MonthRow | null =>
  rows
    .filter(row => row.status !== 'done')
    .reduce<MonthRow | null>(
      (best, row) => (best === null || row.daysLeft < best.daysLeft ? row : best),
      null,
    );

export const summarize = (today: CalendarDate, profile: Profile): string => {
  const model = buildMonth(today, profile);
  const soonest = soonestWaiting(model.rows);
  if (soonest) {
    const date = formatDayMonth(soonest.due.day, soonest.due.month);
    return soonest.status === 'today'
      ? `Dziś mija termin: ${soonest.title}, ${date}.`
      : `Najbliżej: ${soonest.title}, ${daysLeftPhrase(soonest.daysLeft)} (${date}).`;
  }
  const following = buildMonth(nextMonthStart(today), profile);
  const first = following.rows[0];
  if (!first) return '';
  const days = daysBetween(today, first.due);
  return `${model.monthName.charAt(0).toUpperCase()}${model.monthName.slice(1)} zamknięty. Następny termin: ${first.title}, ${daysLeftPhrase(days)} (${formatDayMonth(first.due.day, first.due.month)}).`;
};

export const monthDays = (year: number, month: number): DayKind[] =>
  Array.from({ length: daysInMonth(year, month) }, (_, index) =>
    dayKind({ year, month, day: index + 1 }),
  );
