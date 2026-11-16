import { closedDates, openingSchedule, pickupWindows } from '../data/site';
import { dayNamesNominative, hoursOn, shiftIso, weekdayOfIso } from './hours';
import type { WarsawClock } from './hours';

export interface PickupDay {
  iso: string;
  label: string;
  windows: string[];
}

export const windowLabel = ([from, to]: [number, number]): string => `${from}:00 do ${to}:00`;

export const formatShortDate = (iso: string): string => {
  const [, month, day] = iso.split('-');
  return `${Number(day)}.${month}`;
};

export const pickupDayLabel = (iso: string): string =>
  `${dayNamesNominative[weekdayOfIso(iso)]} ${formatShortDate(iso)}`;

export const windowsFor = (iso: string): string[] =>
  (weekdayOfIso(iso) === 6 ? pickupWindows.saturday : pickupWindows.weekday).map(windowLabel);

export const pickupDays = (clock: WarsawClock, count = 6): PickupDay[] => {
  const days: PickupDay[] = [];
  for (let offset = 1; offset <= 21 && days.length < count; offset += 1) {
    const iso = shiftIso(clock.iso, offset);
    if (!hoursOn(iso, openingSchedule, closedDates)) continue;
    days.push({ iso, label: pickupDayLabel(iso), windows: windowsFor(iso) });
  }
  return days;
};
