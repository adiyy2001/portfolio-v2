import type { ExtraId } from './extras';

export interface WeekendPackage {
  nights: number;
  arrivalWeekday: number;
  includedExtras: readonly ExtraId[];
  priceShare: number;
}

export const weekendPackage: WeekendPackage = {
  nights: 2,
  arrivalWeekday: 5,
  includedExtras: ['breakfast', 'lateCheckOut', 'welcomeSet'],
  priceShare: 85,
};

export interface LongStayTier {
  fromNights: number;
  percent: number;
}

export const longStayTiers: readonly LongStayTier[] = [
  { fromNights: 5, percent: 10 },
  { fromNights: 8, percent: 15 },
];

export const maxNights = 30;
export const horizonDays = 365;
export const nonRefundablePercentOff = 10;
