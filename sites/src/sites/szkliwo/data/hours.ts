export type IsoDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OpeningDay {
  day: IsoDay;
  name: string;
  accusative: string;
  opens: number | null;
  closes: number | null;
}

const hour = (value: number) => value * 60;

export const openingHours: readonly OpeningDay[] = [
  { day: 1, name: 'Poniedziałek', accusative: 'w poniedziałek', opens: hour(8), closes: hour(20) },
  { day: 2, name: 'Wtorek', accusative: 'we wtorek', opens: hour(8), closes: hour(20) },
  { day: 3, name: 'Środa', accusative: 'w środę', opens: hour(8), closes: hour(20) },
  { day: 4, name: 'Czwartek', accusative: 'w czwartek', opens: hour(8), closes: hour(20) },
  { day: 5, name: 'Piątek', accusative: 'w piątek', opens: hour(8), closes: hour(20) },
  { day: 6, name: 'Sobota', accusative: 'w sobotę', opens: hour(9), closes: hour(14) },
  { day: 7, name: 'Niedziela', accusative: 'w niedzielę', opens: null, closes: null },
];
