import type { ExtraSelection } from '../data/extras';
import { weekendPackage } from '../data/packages';
import { roomTypes } from '../data/rooms';
import type { RoomType, RoomTypeId } from '../data/rooms';
import type { Lang } from '../i18n/lang';
import { canStay, typeAvailability } from './availability';
import type { Occupancy } from './availability';
import { cleanExtras } from './booking';
import type { BookingInput } from './booking';
import type { Day } from './dates';
import { emptyGuest, emptyInvoice, hasErrors, validateGuest, validateInvoice } from './guest';
import type { GuestDetails, GuestErrors, InvoiceDetails, InvoiceErrors } from './guest';
import { quoteStay, weekendPackageApplies } from './pricing';
import type { Quote, RateId } from './pricing';
import { emptySelection, nightsOf, reconcileSelection } from './range';
import type { Selection } from './range';

export type StepId = 'dates' | 'room' | 'extras' | 'guest' | 'summary';

export const stepOrder: readonly StepId[] = ['dates', 'room', 'extras', 'guest', 'summary'];

export interface FlowState {
  selection: Selection;
  guests: number;
  packageMode: boolean;
  roomType: RoomTypeId | null;
  rate: RateId;
  extras: ExtraSelection;
  guest: GuestDetails;
  wantsInvoice: boolean;
  invoice: InvoiceDetails;
}

export const initialFlow: FlowState = {
  selection: emptySelection,
  guests: 2,
  packageMode: false,
  roomType: null,
  rate: 'flexible',
  extras: {},
  guest: emptyGuest,
  wantsInvoice: false,
  invoice: emptyInvoice,
};

export interface RoomOption {
  type: RoomType;
  free: number;
  total: number;
  fits: boolean;
  bookable: boolean;
  flexibleTotal: number | null;
  nonRefundableTotal: number | null;
}

export const staysOf = (state: FlowState): { arrival: Day; nights: number } | null =>
  state.selection.arrival !== null && state.selection.departure !== null
    ? { arrival: state.selection.arrival, nights: nightsOf(state.selection) }
    : null;

export const roomOptions = (state: FlowState, occupancy?: Occupancy): RoomOption[] => {
  const stay = staysOf(state);
  if (!stay) return [];
  const rows = typeAvailability(stay.arrival, stay.nights, occupancy);
  return roomTypes.map(type => {
    const row = rows.find(entry => entry.type.id === type.id);
    const free = row ? row.free.length : 0;
    const fits = type.capacity >= state.guests;
    const bookable = fits && free > 0;
    const totalFor = (rate: RateId): number | null =>
      bookable
        ? quoteStay({
            arrival: stay.arrival,
            nights: stay.nights,
            guests: state.guests,
            roomType: type.id,
            rate,
            extras: {},
            weekendPackage: state.packageMode,
          }).total
        : null;
    return {
      type,
      free,
      total: row ? row.total : 0,
      fits,
      bookable,
      flexibleTotal: totalFor('flexible'),
      nonRefundableTotal: totalFor('nonRefundable'),
    };
  });
};

export const packageActive = (state: FlowState): boolean => {
  const stay = staysOf(state);
  return state.packageMode && stay !== null && weekendPackageApplies(stay.arrival, stay.nights);
};

export const quoteOf = (state: FlowState): Quote | null => {
  const stay = staysOf(state);
  if (!stay || state.roomType === null) return null;
  return quoteStay({
    arrival: stay.arrival,
    nights: stay.nights,
    guests: state.guests,
    roomType: state.roomType,
    rate: state.rate,
    extras: state.extras,
    weekendPackage: state.packageMode,
  });
};

export const reconcileFlow = (state: FlowState, today: Day, occupancy?: Occupancy): FlowState => {
  const selection = reconcileSelection(state.selection, {
    today,
    guests: state.guests,
    packageMode: state.packageMode,
    occupancy,
  });
  const next: FlowState = {
    ...state,
    selection,
    extras: cleanExtras(state.extras, state.guests),
  };
  const options = roomOptions(next, occupancy);
  const chosen = options.find(option => option.type.id === next.roomType);
  return chosen && chosen.bookable ? next : { ...next, roomType: null };
};

export type StepProblem =
  'missingDates' | 'unavailable' | 'missingRoom' | 'guestInvalid' | 'invoiceInvalid';

export interface FlowErrors {
  guest: GuestErrors;
  invoice: InvoiceErrors;
}

export const flowErrors = (state: FlowState): FlowErrors => ({
  guest: validateGuest(state.guest),
  invoice: state.wantsInvoice ? validateInvoice(state.invoice) : {},
});

export const stepProblem = (
  state: FlowState,
  step: StepId,
  occupancy?: Occupancy,
): StepProblem | null => {
  const stay = staysOf(state);
  if (step === 'dates') {
    if (!stay) return 'missingDates';
    return canStay(stay.arrival, stay.nights, state.guests, occupancy) ? null : 'unavailable';
  }
  if (step === 'room') return state.roomType === null ? 'missingRoom' : null;
  if (step === 'guest') {
    const errors = flowErrors(state);
    if (hasErrors(errors.guest)) return 'guestInvalid';
    return hasErrors(errors.invoice) ? 'invoiceInvalid' : null;
  }
  return null;
};

export const firstBlockedStep = (
  state: FlowState,
  upTo: StepId,
  occupancy?: Occupancy,
): StepId | null => {
  for (const step of stepOrder) {
    if (step === upTo) return null;
    if (stepProblem(state, step, occupancy) !== null) return step;
  }
  return null;
};

export const toBookingInput = (state: FlowState, lang: Lang): BookingInput | null => {
  const stay = staysOf(state);
  if (!stay || state.roomType === null || state.selection.departure === null) return null;
  return {
    lang,
    arrival: stay.arrival,
    departure: state.selection.departure,
    guests: state.guests,
    roomType: state.roomType,
    rate: state.rate,
    extras: state.extras,
    weekendPackage: state.packageMode && weekendPackageApplies(stay.arrival, stay.nights),
    guest: state.guest,
    invoice: state.wantsInvoice ? state.invoice : null,
  };
};

export const packageIncludes = weekendPackage.includedExtras;
