import { describe, expect, it } from 'vitest';
import { addDays, isoDate, warsawClock } from './clock';
import {
  addBooking,
  arrivalHours,
  describeBooking,
  freeHours,
  nextWorkingDays,
  orderNumber,
  parseBookings,
  removeBooking,
  takenHours,
} from './booking';
import type { Booking } from './booking';

const clock = (iso: string) => warsawClock(new Date(iso));

const sample: Booking = {
  id: 'WS-123456',
  service: 'hamulce',
  serviceName: 'Hamulce',
  date: '2026-11-17',
  hour: 9,
  name: 'Ola',
  phone: '600 000 000',
  car: 'Skoda Octavia 2012',
  note: '',
  createdAt: 1,
};

describe('arrivalHours', () => {
  it('stops two hours before closing', () => {
    expect(arrivalHours(1)).toEqual([8, 9, 10, 11, 12, 13, 14, 15]);
    expect(arrivalHours(6)).toEqual([8, 9, 10]);
    expect(arrivalHours(0)).toEqual([]);
  });
});

describe('nextWorkingDays', () => {
  it('skips Sundays and lists Saturdays with short hours', () => {
    const days = nextWorkingDays(clock('2026-11-19T07:00:00+01:00'));
    expect(days.map(day => day.iso)).toEqual([
      '2026-11-19',
      '2026-11-20',
      '2026-11-21',
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
    ]);
    expect(days[2].hours).toEqual([8, 9, 10]);
    expect(days[2].label).toBe('sobota, 21 listopada');
  });

  it('drops hours that start sooner than two hours from now', () => {
    const [today] = nextWorkingDays(clock('2026-11-16T11:10:00+01:00'));
    expect(today.hours).toEqual([13, 14, 15]);
  });

  it('starts tomorrow when nothing is left today', () => {
    const [first] = nextWorkingDays(clock('2026-11-16T14:00:00+01:00'));
    expect(first.iso).toBe('2026-11-17');
  });

  it('starts on Monday on a Sunday', () => {
    const [first] = nextWorkingDays(clock('2026-11-22T10:00:00+01:00'));
    expect(first.iso).toBe('2026-11-23');
  });
});

describe('takenHours', () => {
  it('is stable for the same day', () => {
    expect(takenHours('2026-11-17')).toEqual(takenHours('2026-11-17'));
  });

  it('never fills a whole day', () => {
    const start = clock('2026-11-16T07:00:00+01:00');
    for (let offset = 0; offset < 400; offset += 1) {
      const iso = isoDate(addDays(start, offset));
      const hours = arrivalHours(new Date(`${iso}T12:00:00Z`).getUTCDay());
      if (hours.length === 0) continue;
      expect(hours.length - takenHours(iso).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('leaves Sunday empty', () => {
    expect(takenHours('2026-11-22')).toEqual([]);
  });
});

describe('freeHours', () => {
  it('removes scripted slots and the ones already booked here', () => {
    const [day] = nextWorkingDays(clock('2026-11-16T07:00:00+01:00'), 2).slice(1);
    const free = freeHours(day, []);
    expect(free.every(hour => !takenHours(day.iso).includes(hour))).toBe(true);
    expect(free.length).toBeGreaterThan(0);
    const mine = { ...sample, date: day.iso, hour: free[0] };
    expect(freeHours(day, [mine])).not.toContain(free[0]);
  });
});

describe('orderNumber', () => {
  it('always has six digits', () => {
    expect(orderNumber(() => 0)).toBe('WS-100000');
    expect(orderNumber(() => 0.999999)).toBe('WS-999999');
    expect(orderNumber(() => 0.5)).toMatch(/^WS-\d{6}$/);
  });
});

describe('parseBookings', () => {
  it('returns an empty list for missing or broken data', () => {
    expect(parseBookings(null)).toEqual([]);
    expect(parseBookings('{')).toEqual([]);
    expect(parseBookings('{"a":1}')).toEqual([]);
  });

  it('keeps only well formed bookings', () => {
    const raw = JSON.stringify([sample, { id: 'x' }, { ...sample, id: 'WS-1' }, null, 4]);
    expect(parseBookings(raw)).toEqual([sample]);
  });

  it('accepts a request without a date', () => {
    const open = { ...sample, date: null, hour: null };
    expect(parseBookings(JSON.stringify([open]))).toEqual([open]);
  });

  it('caps the list', () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      ...sample,
      id: `WS-${100000 + index}`,
    }));
    expect(parseBookings(JSON.stringify(many))).toHaveLength(12);
  });
});

describe('addBooking and removeBooking', () => {
  it('puts the newest first and replaces a repeated id', () => {
    const other = { ...sample, id: 'WS-222222' };
    const list = addBooking(addBooking([], sample), other);
    expect(list.map(item => item.id)).toEqual(['WS-222222', 'WS-123456']);
    expect(addBooking(list, { ...sample, name: 'Ewa' })[0].name).toBe('Ewa');
    expect(addBooking(list, sample)).toHaveLength(2);
  });

  it('removes by id', () => {
    expect(removeBooking([sample], 'WS-123456')).toEqual([]);
    expect(removeBooking([sample], 'WS-000000')).toEqual([sample]);
  });
});

describe('describeBooking', () => {
  it('writes day and hour', () => {
    expect(describeBooking(sample)).toBe('wtorek, 17 listopada, godz. 9:00');
  });

  it('says the term is agreed by phone when there is no date', () => {
    expect(describeBooking({ ...sample, date: null, hour: null })).toBe(
      'do ustalenia telefonicznie',
    );
  });
});
