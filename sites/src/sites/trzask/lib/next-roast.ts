import { roastSchedule } from '../data/site';

export interface RoastSlot {
  cutoff: Date;
  roast: Date;
  ship: Date;
}

export interface RoastSlotText {
  head: string;
  tail: string;
  sentence: string;
  shortRoast: string;
  shortShip: string;
}

const weekdayNominative = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
];

const weekdayGenitive = [
  'niedzieli',
  'poniedziałku',
  'wtorku',
  'środy',
  'czwartku',
  'piątku',
  'soboty',
];

const weekdayAccusativeWith = [
  'w niedzielę',
  'w poniedziałek',
  'we wtorek',
  'w środę',
  'w czwartek',
  'w piątek',
  'w sobotę',
];

const monthGenitive = [
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

const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const nextWorkingDay = (date: Date): Date => {
  let next = addDays(date, 1);
  while (next.getDay() === 0 || next.getDay() === 6) next = addDays(next, 1);
  return next;
};

export const nextRoastSlot = (now: Date): RoastSlot => {
  for (let offset = 0; offset < 21; offset += 1) {
    const roast = addDays(now, offset);
    if (!roastSchedule.roastWeekdays.some(weekday => weekday === roast.getDay())) continue;
    const before = addDays(roast, -1);
    const cutoff = new Date(
      before.getFullYear(),
      before.getMonth(),
      before.getDate(),
      roastSchedule.cutoffHour,
    );
    if (cutoff.getTime() > now.getTime()) {
      return { cutoff, roast, ship: nextWorkingDay(roast) };
    }
  }
  const roast = addDays(now, 7);
  return { cutoff: addDays(roast, -1), roast, ship: nextWorkingDay(roast) };
};

const dayAndMonth = (date: Date): string => `${date.getDate()} ${monthGenitive[date.getMonth()]}`;

export const describeSlot = (slot: RoastSlot): RoastSlotText => {
  const cutoffDay = weekdayGenitive[slot.cutoff.getDay()];
  const hour = `${slot.cutoff.getHours()}:00`;
  const roastLong = `${weekdayNominative[slot.roast.getDay()]} ${dayAndMonth(slot.roast)}`;
  const shipWord = weekdayAccusativeWith[slot.ship.getDay()];
  return {
    head: `Następne palenie: ${roastLong}`,
    tail: `Zamów do ${cutoffDay} ${hour}, wyślemy ${shipWord}`,
    sentence: `Zamów do ${cutoffDay} do godziny ${hour}. Wypalimy ${weekdayAccusativeWith[slot.roast.getDay()]} (${dayAndMonth(slot.roast)}), a paczkę nadamy ${shipWord} (${dayAndMonth(slot.ship)}).`,
    shortRoast: roastLong,
    shortShip: `${weekdayNominative[slot.ship.getDay()]} ${dayAndMonth(slot.ship)}`,
  };
};

export const warsawWallClock = (instant: Date): Date => {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(instant);
    const read = (type: string): number => Number(parts.find(part => part.type === type)?.value);
    const year = read('year');
    const month = read('month');
    const day = read('day');
    const hour = read('hour');
    const minute = read('minute');
    if ([year, month, day, hour, minute].some(value => Number.isNaN(value))) return instant;
    return new Date(year, month - 1, day, hour, minute);
  } catch {
    return instant;
  }
};
