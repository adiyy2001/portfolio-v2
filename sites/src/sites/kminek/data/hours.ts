export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayHours {
  opens: string;
  closes: string;
  kitchenCloses: string;
}

export type WeekHours = Record<Weekday, DayHours | null>;

export const regularDay: DayHours = { opens: '12:00', closes: '22:00', kitchenCloses: '21:00' };

export const weekHours: WeekHours = {
  0: regularDay,
  1: null,
  2: regularDay,
  3: regularDay,
  4: regularDay,
  5: regularDay,
  6: regularDay,
};

export const weekdayOrder: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const hoursRange = (day: DayHours) => `${day.opens}-${day.closes}`;
