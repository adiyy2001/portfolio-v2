import { horizonDays, weekendPackage } from '../data/packages';
import {
  canStay,
  isTaken,
  lastBookableNight,
  minNightsFor,
  summariseNight,
  validateStay,
} from './availability';
import type { Occupancy } from './availability';
import { weekdayOf } from './dates';
import type { Day } from './dates';

export interface Selection {
  arrival: Day | null;
  departure: Day | null;
}

export interface RangeContext {
  today: Day;
  guests: number;
  packageMode: boolean;
  occupancy?: Occupancy;
}

export type DayBlock =
  | 'past'
  | 'beyondHorizon'
  | 'soldOut'
  | 'noStay'
  | 'tooShort'
  | 'tooLong'
  | 'unavailable'
  | 'packageFriday'
  | 'packageNights';

export type CellRole = 'arrival' | 'departure' | 'inside' | 'none';

export interface CellModel {
  day: Day;
  block: DayBlock | null;
  role: CellRole;
  price: number | null;
  soldOut: boolean;
  inHorizon: boolean;
}

export const emptySelection: Selection = { arrival: null, departure: null };

const occupancyOf = (context: RangeContext): Occupancy => context.occupancy ?? isTaken;

export const arrivalBlock = (day: Day, context: RangeContext): DayBlock | null => {
  const occupancy = occupancyOf(context);
  if (day < context.today) return 'past';
  if (day > lastBookableNight(context.today)) return 'beyondHorizon';
  if (context.packageMode && weekdayOf(day) !== weekendPackage.arrivalWeekday) {
    return 'packageFriday';
  }
  if (summariseNight(day, context.guests, occupancy).soldOut) return 'soldOut';
  const nights = context.packageMode ? weekendPackage.nights : minNightsFor(day);
  const problem = validateStay(day, day + nights, context.guests, context.today, occupancy);
  if (problem === 'beyondHorizon') return 'beyondHorizon';
  return problem === null ? null : 'noStay';
};

export const departureBlock = (arrival: Day, day: Day, context: RangeContext): DayBlock | null => {
  if (context.packageMode && day - arrival !== weekendPackage.nights) return 'packageNights';
  const problem = validateStay(arrival, day, context.guests, context.today, occupancyOf(context));
  switch (problem) {
    case null:
      return null;
    case 'tooShort':
    case 'tooLong':
    case 'unavailable':
    case 'beyondHorizon':
      return problem;
    case 'inPast':
      return 'past';
    case 'missingDates':
      return 'noStay';
  }
};

const isChoosingDeparture = (
  selection: Selection,
  day: Day,
): selection is { arrival: Day; departure: null } =>
  selection.arrival !== null && selection.departure === null && day > selection.arrival;

export const blockOf = (day: Day, selection: Selection, context: RangeContext): DayBlock | null =>
  isChoosingDeparture(selection, day)
    ? departureBlock(selection.arrival, day, context)
    : arrivalBlock(day, context);

export const selectDay = (selection: Selection, day: Day, context: RangeContext): Selection => {
  if (blockOf(day, selection, context) !== null) return selection;
  if (isChoosingDeparture(selection, day)) return { arrival: selection.arrival, departure: day };
  if (context.packageMode) return { arrival: day, departure: day + weekendPackage.nights };
  return { arrival: day, departure: null };
};

export const reconcileSelection = (selection: Selection, context: RangeContext): Selection => {
  const { arrival, departure } = selection;
  if (arrival === null || arrivalBlock(arrival, context) !== null) return emptySelection;
  if (departure === null) {
    return context.packageMode
      ? { arrival, departure: arrival + weekendPackage.nights }
      : selection;
  }
  return departureBlock(arrival, departure, context) === null
    ? selection
    : { arrival, departure: null };
};

export const cellModel = (day: Day, selection: Selection, context: RangeContext): CellModel => {
  const inHorizon = day >= context.today && day < context.today + horizonDays;
  const summary = inHorizon ? summariseNight(day, context.guests, occupancyOf(context)) : null;
  const { arrival, departure } = selection;
  let role: CellRole = 'none';
  if (arrival !== null && day === arrival) role = 'arrival';
  else if (departure !== null && day === departure) role = 'departure';
  else if (arrival !== null && departure !== null && day > arrival && day < departure)
    role = 'inside';
  return {
    day,
    block: blockOf(day, selection, context),
    role,
    price: summary ? summary.fromPrice : null,
    soldOut: summary ? summary.soldOut : false,
    inHorizon,
  };
};

export const nightsOf = (selection: Selection): number =>
  selection.arrival !== null && selection.departure !== null
    ? selection.departure - selection.arrival
    : 0;

export const canStayWith = (selection: Selection, context: RangeContext): boolean =>
  selection.arrival !== null &&
  selection.departure !== null &&
  canStay(
    selection.arrival,
    selection.departure - selection.arrival,
    context.guests,
    occupancyOf(context),
  );
