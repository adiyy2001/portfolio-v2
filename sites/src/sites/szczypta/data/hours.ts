import type { Lang, Localized } from './lang';

export type DayGroup = 'weekdays' | 'saturday' | 'sunday';

export const opening: Record<DayGroup, readonly [number, number]> = {
  weekdays: [8, 21],
  saturday: [9, 22],
  sunday: [10, 20],
};

export const kitchenBreak = [16, 17] as const;

export const lastSeatingBeforeClose = 1;

export const maxPeople = 12;

export const groupOfDay = (day: number): DayGroup =>
  day === 0 ? 'sunday' : day === 6 ? 'saturday' : 'weekdays';

export const seatingWindow = (day: number): readonly [number, number] => {
  const [open, close] = opening[groupOfDay(day)];
  return [open, close - lastSeatingBeforeClose];
};

export const isKitchenBreak = (minutes: number) =>
  minutes >= kitchenBreak[0] * 60 && minutes < kitchenBreak[1] * 60;

export const clock = (hour: number) => `${hour}:00`;

export const range = (from: number, to: number, lang: Lang) =>
  `${clock(from)} ${lang === 'pl' ? 'do' : 'to'} ${clock(to)}`;

export const groupNames: Record<DayGroup, Record<Lang, { long: string; short: string }>> = {
  weekdays: {
    pl: { long: 'Poniedziałek do piątku', short: 'Pon. do pt.' },
    en: { long: 'Monday to Friday', short: 'Mon to Fri' },
  },
  saturday: {
    pl: { long: 'Sobota', short: 'Sob.' },
    en: { long: 'Saturday', short: 'Sat' },
  },
  sunday: {
    pl: { long: 'Niedziela', short: 'Niedz.' },
    en: { long: 'Sunday', short: 'Sun' },
  },
};

export interface ServiceSlot {
  group: DayGroup;
  from: number;
  to: number;
}

export interface ServiceHours {
  slots: readonly ServiceSlot[];
  closed?: Localized;
}

export const breakfastHours: ServiceHours = {
  slots: [
    { group: 'weekdays', from: 8, to: 11 },
    { group: 'saturday', from: 9, to: 16 },
    { group: 'sunday', from: 10, to: 16 },
  ],
};

export const lunchHours: ServiceHours = {
  slots: [{ group: 'weekdays', from: 11, to: 16 }],
  closed: { pl: 'Sob. i niedz. bez lunchu', en: 'No lunch on Sat and Sun' },
};

export const dinnerHours: ServiceHours = {
  slots: [
    { group: 'weekdays', from: 17, to: 21 },
    { group: 'saturday', from: 17, to: 22 },
    { group: 'sunday', from: 17, to: 20 },
  ],
};

export const weekCardHours: ServiceHours = {
  slots: [{ group: 'weekdays', from: 11, to: 16 }],
  closed: { pl: 'W weekend bez karty tygodnia', en: 'No weekly menu at the weekend' },
};

export const drinksHours: ServiceHours = {
  slots: [
    { group: 'weekdays', from: 8, to: 21 },
    { group: 'saturday', from: 9, to: 22 },
    { group: 'sunday', from: 10, to: 20 },
  ],
};

export const serviceLines = (hours: ServiceHours, lang: Lang): string[] => [
  ...hours.slots.map(
    slot => `${groupNames[slot.group][lang].short} ${range(slot.from, slot.to, lang)}`,
  ),
  ...(hours.closed ? [hours.closed[lang]] : []),
];

export const openingRows = (lang: Lang) =>
  (Object.keys(opening) as DayGroup[]).map(group => ({
    group,
    label: groupNames[group][lang].long,
    value: range(opening[group][0], opening[group][1], lang),
  }));
