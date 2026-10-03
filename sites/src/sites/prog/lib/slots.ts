export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export interface ViewingSlot {
  time: string;
  taken: boolean;
}

export interface ViewingDay {
  key: string;
  date: CalendarDate;
  weekday: number;
  slots: ViewingSlot[];
}

const pad = (value: number): string => String(value).padStart(2, '0');

export const dateKey = ({ year, month, day }: CalendarDate): string =>
  `${year}-${pad(month)}-${pad(day)}`;

const toUtc = ({ year, month, day }: CalendarDate): number => Date.UTC(year, month - 1, day);

const fromUtc = (stamp: number): CalendarDate => {
  const date = new Date(stamp);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

export const addDays = (date: CalendarDate, days: number): CalendarDate =>
  fromUtc(toUtc(date) + days * 86_400_000);

export const weekdayOf = (date: CalendarDate): number => new Date(toUtc(date)).getUTCDay();

export const easterSunday = (year: number): CalendarDate => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
};

export const christmasEveIsHoliday = (year: number): boolean => year >= 2025;

export const holidaysOf = (year: number): Set<string> => {
  const easter = easterSunday(year);
  const fixed: CalendarDate[] = [
    { year, month: 1, day: 1 },
    { year, month: 1, day: 6 },
    { year, month: 5, day: 1 },
    { year, month: 5, day: 3 },
    { year, month: 8, day: 15 },
    { year, month: 11, day: 1 },
    { year, month: 11, day: 11 },
    { year, month: 12, day: 25 },
    { year, month: 12, day: 26 },
  ];
  if (christmasEveIsHoliday(year)) fixed.push({ year, month: 12, day: 24 });
  const movable = [0, 1, 49, 60].map(offset => addDays(easter, offset));
  return new Set([...fixed, ...movable].map(dateKey));
};

export const isHoliday = (date: CalendarDate): boolean => holidaysOf(date.year).has(dateKey(date));

export const isViewingDay = (date: CalendarDate): boolean =>
  weekdayOf(date) !== 0 && !isHoliday(date);

export const slotTimesFor = (weekday: number): string[] => {
  const last = weekday === 6 ? 13 : 17;
  const times: string[] = [];
  for (let hour = 10; hour <= last; hour++) times.push(`${pad(hour)}:00`);
  return times;
};

const hashText = (text: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const isTaken = (slug: string, key: string, time: string): boolean =>
  hashText(`${slug}|${key}|${time}`) % 100 < 34;

export const upcomingViewingDays = (
  today: CalendarDate,
  slug: string,
  count = 10,
): ViewingDay[] => {
  const days: ViewingDay[] = [];
  let cursor = addDays(today, 1);
  while (days.length < count) {
    if (isViewingDay(cursor)) {
      const key = dateKey(cursor);
      const weekday = weekdayOf(cursor);
      days.push({
        key,
        date: cursor,
        weekday,
        slots: slotTimesFor(weekday).map(time => ({ time, taken: isTaken(slug, key, time) })),
      });
    }
    cursor = addDays(cursor, 1);
  }
  return days;
};

const weekdayNames = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
];
const weekdayShort = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
const monthNames = [
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
];

export const weekdayShortName = (weekday: number): string => weekdayShort[weekday] ?? '';

export const longDayLabel = (date: CalendarDate): string =>
  `${weekdayNames[weekdayOf(date)]} ${date.day} ${monthNames[date.month - 1]}`;

export const shortDayLabel = (date: CalendarDate): string =>
  `${date.day} ${monthNames[date.month - 1]?.slice(0, 3)}`;

export const todayInBrowser = (now: Date = new Date()): CalendarDate => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
});

export const freeSlotCount = (day: ViewingDay): number =>
  day.slots.filter(slot => !slot.taken).length;
