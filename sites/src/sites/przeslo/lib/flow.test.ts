import { describe, expect, it } from 'vitest';
import type { Occupancy } from './availability';
import { dayFromParts } from './dates';
import {
  firstBlockedStep,
  initialFlow,
  packageActive,
  quoteOf,
  reconcileFlow,
  roomOptions,
  stepProblem,
  toBookingInput,
} from './flow';
import type { FlowState } from './flow';

const friday = dayFromParts(2026, 10, 9);
const today = dayFromParts(2026, 10, 3);
const free: Occupancy = () => false;
const full: Occupancy = () => true;

const filled = (overrides: Partial<FlowState> = {}): FlowState => ({
  ...initialFlow,
  selection: { arrival: friday, departure: friday + 2 },
  roomType: 'klasyczny',
  guest: {
    name: 'Anna Przykładowa',
    email: 'anna@example.com',
    phone: '+48 71 000 00 08',
    arrivalWindow: '',
    notes: '',
  },
  ...overrides,
});

describe('flow', () => {
  it('lists every room type with totals only for rooms that can be booked', () => {
    const options = roomOptions(filled({ guests: 3 }), free);
    expect(options).toHaveLength(5);
    const byId = Object.fromEntries(options.map(option => [option.type.id, option]));
    expect(byId.klasyczny?.bookable).toBe(false);
    expect(byId.klasyczny?.flexibleTotal).toBeNull();
    expect(byId.poddasze?.bookable).toBe(true);
    expect(byId.poddasze?.flexibleTotal).toBeGreaterThan(byId.poddasze?.nonRefundableTotal ?? 0);
  });

  it('returns no options without dates', () => {
    expect(roomOptions(initialFlow, free)).toEqual([]);
  });

  it('drops the chosen room when it is no longer free', () => {
    const state = filled();
    expect(reconcileFlow(state, today, free).roomType).toBe('klasyczny');
    expect(reconcileFlow(state, today, full).roomType).toBeNull();
  });

  it('drops the chosen room when the party no longer fits', () => {
    expect(reconcileFlow(filled({ guests: 3 }), today, free).roomType).toBeNull();
  });

  it('clamps extras to the number of guests', () => {
    const state = reconcileFlow(filled({ extras: { breakfast: 5, cot: 3 } }), today, free);
    expect(state.extras).toEqual({ breakfast: 2, cot: 1 });
  });

  it('asks for dates, then a room, then guest details', () => {
    expect(stepProblem(initialFlow, 'dates', free)).toBe('missingDates');
    expect(stepProblem(filled(), 'dates', free)).toBeNull();
    expect(stepProblem(filled(), 'dates', full)).toBe('unavailable');
    expect(stepProblem(filled({ roomType: null }), 'room')).toBe('missingRoom');
    expect(stepProblem(filled({ guest: initialFlow.guest }), 'guest')).toBe('guestInvalid');
  });

  it('validates the invoice only when it is wanted', () => {
    expect(stepProblem(filled(), 'guest')).toBeNull();
    expect(stepProblem(filled({ wantsInvoice: true }), 'guest')).toBe('invoiceInvalid');
    const valid = {
      company: 'Firma Przykładowa sp. z o.o.',
      nip: '526-104-08-28',
      street: 'ul. Przykładowa 1',
      postalCode: '50-001',
      city: 'Wrocław',
    };
    expect(stepProblem(filled({ wantsInvoice: true, invoice: valid }), 'guest')).toBeNull();
    expect(
      stepProblem(
        filled({ wantsInvoice: true, invoice: { ...valid, nip: '526-104-08-29' } }),
        'guest',
      ),
    ).toBe('invoiceInvalid');
  });

  it('finds the first earlier step that still has a problem', () => {
    expect(firstBlockedStep(initialFlow, 'summary', free)).toBe('dates');
    expect(firstBlockedStep(filled({ roomType: null }), 'summary', free)).toBe('room');
    expect(firstBlockedStep(filled({ guest: initialFlow.guest }), 'summary', free)).toBe('guest');
    expect(firstBlockedStep(filled(), 'summary', free)).toBeNull();
  });

  it('applies the weekend package only to a Friday stay of two nights', () => {
    expect(packageActive(filled({ packageMode: true }))).toBe(true);
    expect(
      packageActive(
        filled({ packageMode: true, selection: { arrival: friday, departure: friday + 3 } }),
      ),
    ).toBe(false);
    expect(packageActive(filled())).toBe(false);
  });

  it('quotes the chosen room and builds the booking input', () => {
    const state = filled({ packageMode: true });
    const quote = quoteOf(state);
    expect(quote?.weekendPackage).not.toBeNull();
    const input = toBookingInput(state, 'pl');
    expect(input?.weekendPackage).toBe(true);
    expect(input?.invoice).toBeNull();
    expect(toBookingInput(initialFlow, 'pl')).toBeNull();
    expect(quoteOf(initialFlow)).toBeNull();
  });
});
