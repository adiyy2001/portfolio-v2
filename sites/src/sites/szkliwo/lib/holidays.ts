interface CalendarDay {
  month: number;
  day: number;
}

const dayInMilliseconds = 86_400_000;

const easterSunday = (year: number): CalendarDay => {
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
  return { month, day };
};

const daysAfterEaster = (year: number, days: number): CalendarDay => {
  const easter = easterSunday(year);
  const shifted = new Date(Date.UTC(year, easter.month - 1, easter.day) + days * dayInMilliseconds);
  return { month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
};

const fixedHolidays: readonly CalendarDay[] = [
  { month: 1, day: 1 },
  { month: 1, day: 6 },
  { month: 5, day: 1 },
  { month: 5, day: 3 },
  { month: 8, day: 15 },
  { month: 11, day: 1 },
  { month: 11, day: 11 },
  { month: 12, day: 25 },
  { month: 12, day: 26 },
];

const christmasEveBecameHolidayIn = 2025;

export const isPublicHoliday = (year: number, month: number, day: number) => {
  const movable = [
    daysAfterEaster(year, 0),
    daysAfterEaster(year, 1),
    daysAfterEaster(year, 49),
    daysAfterEaster(year, 60),
  ];
  const holidays = [...fixedHolidays, ...movable];
  if (year >= christmasEveBecameHolidayIn) holidays.push({ month: 12, day: 24 });
  return holidays.some(holiday => holiday.month === month && holiday.day === day);
};
