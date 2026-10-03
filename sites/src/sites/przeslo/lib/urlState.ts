import { isRoomTypeId, maxCapacity } from '../data/rooms';
import type { RoomTypeId } from '../data/rooms';
import { parseIsoDate, toIsoDate } from './dates';
import type { Day } from './dates';
import type { RateId } from './pricing';

export interface BookingQuery {
  arrival: Day | null;
  departure: Day | null;
  guests: number;
  room: RoomTypeId | null;
  rate: RateId;
  weekendPackage: boolean;
}

export const defaultGuests = 2;

export const parseBookingQuery = (search: string): BookingQuery => {
  const params = new URLSearchParams(search);
  const arrival = parseIsoDate(params.get('arrival') ?? '');
  const departure = parseIsoDate(params.get('departure') ?? '');
  const guests = Number(params.get('guests'));
  const room = params.get('room');
  const validStay = arrival !== null && departure !== null && departure > arrival;
  return {
    arrival: validStay ? arrival : null,
    departure: validStay ? departure : null,
    guests:
      Number.isInteger(guests) && guests >= 1 && guests <= maxCapacity ? guests : defaultGuests,
    room: isRoomTypeId(room) ? room : null,
    rate: params.get('rate') === 'nonrefundable' ? 'nonRefundable' : 'flexible',
    weekendPackage: params.get('package') === '1',
  };
};

export const buildBookingQuery = (query: Partial<BookingQuery>): string => {
  const params = new URLSearchParams();
  if (query.arrival !== undefined && query.arrival !== null) {
    params.set('arrival', toIsoDate(query.arrival));
  }
  if (query.departure !== undefined && query.departure !== null) {
    params.set('departure', toIsoDate(query.departure));
  }
  if (query.guests !== undefined) params.set('guests', String(query.guests));
  if (query.room !== undefined && query.room !== null) params.set('room', query.room);
  if (query.rate === 'nonRefundable') params.set('rate', 'nonrefundable');
  if (query.weekendPackage) params.set('package', '1');
  const text = params.toString();
  return text === '' ? '' : `?${text}`;
};
