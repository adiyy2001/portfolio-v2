import { describe, expect, it } from 'vitest';
import {
  appendLog,
  beginBooking,
  bookingReducer,
  detectBookingService,
  detectIntent,
  detectService,
  expectsPhone,
  greeting,
  isOpen,
  isTaken,
  logLimit,
  nextWorkingDays,
  parseBookings,
  parseLog,
  parsePhone,
  sendText,
  slotHours,
  startSession,
  takenHours,
} from './assistant';
import type { Booking, BookingContext, BookingState, LogEvent, Session } from './assistant';

const at = (day: number, hour: number, minute = 0): Date => new Date(2026, 10, day, hour, minute);
const monday = at(2, 12);
const friday = at(6, 10);
const env = { now: monday };

const lastReply = (session: Session): string => session.messages[session.messages.length - 1].text;

const run = (session: Session, ...texts: string[]): Session =>
  texts.reduce((current, text) => sendText(current, text, env), session);

describe('detectIntent', () => {
  it.each([
    ['Godziny otwarcia', 'hours'],
    ['Kiedy jesteście otwarci?', 'hours'],
    ['Ile kosztuje wymiana opon?', 'price'],
    ['Jaki jest cennik?', 'price'],
    ['Czy płacę kartą?', 'price'],
    ['Umów wymianę opon', 'booking'],
    ['Chcę zapis na wolny termin', 'booking'],
    ['Wymiana opon w piątek', 'booking'],
    ['Gdzie jesteście?', 'address'],
    ['Jaki jest dojazd?', 'address'],
    ['Czy wystawiacie fakturę VAT?', 'invoice'],
    ['Wolę człowieka', 'human'],
    ['Zadzwoń do mnie', 'human'],
    ['Jaka będzie pogoda w sobotę?', 'fallback'],
    ['Czy naprawiacie rowery?', 'fallback'],
    ['', 'fallback'],
  ])('maps "%s" to %s', (text, intent) => {
    expect(detectIntent(text)).toBe(intent);
  });

  it('does not treat a passenger car as a request for a person', () => {
    expect(detectIntent('Czy wymieniacie opony w aucie osobowym?')).not.toBe('human');
  });

  it('finds the service by keyword', () => {
    expect(detectService('Ile za wymianę opon?')).toBe('tires');
    expect(detectService('Cena przechowania opon na sezon')).toBe('storage');
    expect(detectService('olej silnikowy')).toBe('oil');
    expect(detectService('przegląd przed badaniem')).toBe('inspection');
    expect(detectService('diagnostyka')).toBe('diagnostics');
    expect(detectService('klimatyzacja')).toBe('ac');
    expect(detectService('klocki hamulcowe')).toBe('brakes');
    expect(detectService('ile to kosztuje')).toBeNull();
  });

  it('offers only bookable services for a booking', () => {
    expect(detectBookingService('umów wymianę oleju')).toBe('oil');
    expect(detectBookingService('umów klimatyzację')).toBeNull();
  });
});

describe('isOpen', () => {
  it('is open on a weekday during working hours', () => {
    expect(isOpen(at(3, 10))).toBe(true);
    expect(isOpen(at(3, 8, 0))).toBe(true);
    expect(isOpen(at(3, 17, 59))).toBe(true);
  });

  it('is closed on a weekday before and after working hours', () => {
    expect(isOpen(at(3, 7, 59))).toBe(false);
    expect(isOpen(at(3, 18, 0))).toBe(false);
    expect(isOpen(at(3, 19))).toBe(false);
  });

  it('closes earlier on Saturday', () => {
    expect(isOpen(at(7, 9))).toBe(true);
    expect(isOpen(at(7, 13, 59))).toBe(true);
    expect(isOpen(at(7, 14, 0))).toBe(false);
  });

  it('is closed on Sunday', () => {
    expect(isOpen(at(8, 10))).toBe(false);
  });
});

describe('nextWorkingDays', () => {
  it('skips the weekend and counts from the next day', () => {
    const labels = nextWorkingDays(friday).map(day => day.label);
    expect(labels).toEqual(['pon. 9.11', 'wt. 10.11', 'śr. 11.11', 'czw. 12.11', 'pt. 13.11']);
  });

  it('labels the days with the weekday and the date', () => {
    const days = nextWorkingDays(monday);
    expect(days[0]).toEqual({ key: '2026-11-03', label: 'wt. 3.11', index: 0 });
    expect(days).toHaveLength(5);
    expect(days.map(day => day.index)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('taken slots', () => {
  const days = nextWorkingDays(monday);

  it('marks three slots on every day and gives the same answer every time', () => {
    days.forEach(day => {
      expect(takenHours(day, [])).toHaveLength(3);
      expect(takenHours(day, [])).toEqual(takenHours(day, []));
      takenHours(day, []).forEach(hour => expect(slotHours).toContain(hour));
    });
  });

  it('varies between days', () => {
    expect(takenHours(days[0], [])).not.toEqual(takenHours(days[1], []));
  });

  it('adds the slots that are already booked in the browser', () => {
    const free = slotHours.find(hour => !isTaken(days[0], hour, []));
    if (free === undefined) throw new Error('no free slot');
    const booking: Booking = {
      id: 'D-1042',
      service: 'tires',
      dayKey: days[0].key,
      dayLabel: days[0].label,
      hour: free,
      phone: '600 000 000',
    };
    expect(isTaken(days[0], free, [booking])).toBe(true);
    expect(isTaken(days[1], free, [booking])).toBe(isTaken(days[1], free, []));
    expect(takenHours(days[0], [booking])).toHaveLength(4);
  });
});

describe('parsePhone', () => {
  it('accepts nine digits with spaces', () => {
    expect(parsePhone('600 000 000')).toBe('600 000 000');
    expect(parsePhone('600000000')).toBe('600 000 000');
    expect(parsePhone(' 6 0 0 0 0 0 0 0 0 ')).toBe('600 000 000');
  });

  it('rejects anything else', () => {
    expect(parsePhone('12345')).toBeNull();
    expect(parsePhone('6000000000')).toBeNull();
    expect(parsePhone('abc def ghi')).toBeNull();
    expect(parsePhone('')).toBeNull();
  });
});

describe('bookingReducer', () => {
  const context: BookingContext = { now: monday, bookings: [] };
  const days = nextWorkingDays(monday);
  const freeHour = slotHours.find(hour => !isTaken(days[0], hour, []));
  if (freeHour === undefined) throw new Error('no free slot');

  it('walks from the start to the confirmation with the first booking number', () => {
    let state: BookingState = { step: 'idle' };
    state = bookingReducer(state, { type: 'start' }, context);
    expect(state.step).toBe('service');
    state = bookingReducer(state, { type: 'service', service: 'tires' }, context);
    expect(state.step).toBe('day');
    state = bookingReducer(state, { type: 'day', key: days[0].key }, context);
    expect(state.step).toBe('hour');
    state = bookingReducer(state, { type: 'hour', hour: freeHour }, context);
    expect(state.step).toBe('phone');
    state = bookingReducer(state, { type: 'phone', text: '600 000 000' }, context);
    expect(state).toMatchObject({ step: 'confirm', phone: '600 000 000' });
    state = bookingReducer(state, { type: 'confirm' }, context);
    expect(state).toEqual({
      step: 'done',
      booking: {
        id: 'D-1042',
        service: 'tires',
        dayKey: days[0].key,
        dayLabel: days[0].label,
        hour: freeHour,
        phone: '600 000 000',
      },
    });
  });

  it('numbers the next booking after the stored ones', () => {
    const stored: Booking[] = [
      { id: 'D-1042', service: 'oil', dayKey: 'x', dayLabel: 'x', hour: 8, phone: '600 000 000' },
    ];
    const state: BookingState = {
      step: 'confirm',
      service: 'oil',
      day: days[1],
      hour: 9,
      phone: '600 000 000',
    };
    const done = bookingReducer(state, { type: 'confirm' }, { now: monday, bookings: stored });
    expect(done.step === 'done' && done.booking.id).toBe('D-1043');
  });

  it('does not accept a taken hour or a bad phone number', () => {
    const taken = takenHours(days[0], [])[0];
    const hourState: BookingState = { step: 'hour', service: 'tires', day: days[0] };
    expect(bookingReducer(hourState, { type: 'hour', hour: taken }, context)).toBe(hourState);
    const phoneState: BookingState = { step: 'phone', service: 'tires', day: days[0], hour: 10 };
    expect(bookingReducer(phoneState, { type: 'phone', text: '12345' }, context)).toBe(phoneState);
  });

  it('ignores actions that do not belong to the step', () => {
    const state: BookingState = { step: 'service' };
    expect(bookingReducer(state, { type: 'confirm' }, context)).toBe(state);
    expect(bookingReducer(state, { type: 'hour', hour: 10 }, context)).toBe(state);
  });

  it('goes back to the service on change and to idle on cancel', () => {
    const state: BookingState = {
      step: 'confirm',
      service: 'tires',
      day: days[0],
      hour: 10,
      phone: '600 000 000',
    };
    expect(bookingReducer(state, { type: 'change' }, context)).toEqual({ step: 'service' });
    expect(bookingReducer(state, { type: 'cancel' }, context)).toEqual({ step: 'idle' });
  });

  it('skips the service step when the service is known', () => {
    expect(bookingReducer({ step: 'idle' }, { type: 'start', service: 'oil' }, context)).toEqual({
      step: 'day',
      service: 'oil',
    });
  });
});

describe('conversation', () => {
  it('starts with the greeting and the four quick replies', () => {
    const session = startSession();
    expect(session.messages).toHaveLength(1);
    expect(session.messages[0].text).toBe(greeting);
    expect(session.chips.map(chip => chip.label)).toEqual([
      'Godziny otwarcia',
      'Ile kosztuje wymiana opon?',
      'Umów wymianę opon',
      'Wolę człowieka',
    ]);
  });

  it('answers from the price list and logs the recognised question', () => {
    const session = run(startSession(), 'Ile kosztuje wymiana opon?');
    expect(lastReply(session)).toBe('Wymiana opon: 120 zł. Ceny brutto, części osobno.');
    expect(session.log.map(event => event.text)).toEqual(['Rozpoznano pytanie: cennik']);
  });

  it('gives the whole price list when no service matches', () => {
    const reply = lastReply(run(startSession(), 'Ile płacę?'));
    expect(reply).toContain('wymiana opon 120 zł');
    expect(reply).toContain('klocki hamulcowe od 250 zł');
  });

  it('says the service is closed outside working hours', () => {
    const closed = { now: at(8, 11) };
    const hours = sendText(startSession(), 'Godziny otwarcia', closed);
    expect(lastReply(hours).startsWith('Serwis jest teraz zamknięty.')).toBe(true);
    const booking = sendText(startSession(), 'Umów wymianę opon', closed);
    expect(
      lastReply(booking).startsWith('Serwis jest teraz zamknięty. Termin zapisuję od razu.'),
    ).toBe(true);
    expect(booking.booking.step).toBe('day');
  });

  it('does not mention closing during working hours', () => {
    expect(lastReply(run(startSession(), 'Godziny otwarcia'))).not.toContain('zamknięty');
  });

  it('answers the invoice question', () => {
    expect(lastReply(run(startSession(), 'Czy wystawiacie fakturę?'))).toBe(
      'Tak, wystawiamy faktury VAT, podaj NIP przy odbiorze.',
    );
  });

  it('offers a callback when it has no answer and takes the number', () => {
    let session = run(startSession(), 'Czy naprawiacie rowery?');
    expect(lastReply(session)).toContain('Nie mam tego w bazie wiedzy.');
    expect(session.log[0].kind).toBe('fallback');
    expect(expectsPhone(session)).toBe(true);
    session = run(session, '12345');
    expect(session.error).not.toBeNull();
    expect(expectsPhone(session)).toBe(true);
    session = run(session, '600 000 000');
    expect(lastReply(session)).toBe('Przekazuję. Ktoś z serwisu oddzwoni w godzinach pracy.');
    expect(session.log[session.log.length - 1].text).toBe(
      'Przekazano do człowieka: prośba o telefon',
    );
    expect(expectsPhone(session)).toBe(false);
    expect(session.error).toBeNull();
  });

  it('hands over to a person on request and lets the visitor decline', () => {
    let session = run(startSession(), 'Wolę człowieka');
    expect(expectsPhone(session)).toBe(true);
    session = run(session, 'Nie, dziękuję');
    expect(expectsPhone(session)).toBe(false);
  });

  it('leaves the callback path when the visitor asks about something else', () => {
    const session = run(startSession(), 'Czy naprawiacie rowery?', 'Godziny otwarcia');
    expect(expectsPhone(session)).toBe(false);
    expect(lastReply(session)).toContain('Pracujemy');
  });

  it('books a visit from the first question to the confirmation and stores it', () => {
    let session = run(startSession(), 'Umów wymianę opon');
    expect(session.booking.step).toBe('day');
    session = run(session, 'wt. 3.11');
    expect(session.booking.step).toBe('hour');
    const taken = takenHours(nextWorkingDays(monday)[0], []);
    const hour = slotHours.find(candidate => !taken.includes(candidate));
    if (hour === undefined) throw new Error('no free slot');
    session = run(session, `${hour}:00`);
    expect(session.booking.step).toBe('phone');
    session = run(session, '12345');
    expect(session.booking.step).toBe('phone');
    expect(session.error).toBe('Numer musi mieć 9 cyfr, na przykład 600 000 000.');
    session = run(session, '600 000 000');
    expect(lastReply(session)).toBe(
      `Wymiana opon, wt. 3.11, ${hour}:00, tel. 600 000 000. Potwierdzasz?`,
    );
    expect(session.chips.map(chip => chip.label)).toEqual(['Potwierdzam', 'Zmień']);
    session = run(session, 'Potwierdzam');
    expect(lastReply(session)).toBe(
      'Zapisane. Numer rezerwacji D-1042. Dostaniesz SMS z przypomnieniem dzień wcześniej.',
    );
    expect(session.bookings).toHaveLength(1);
    expect(session.log.map(event => event.kind)).toEqual([
      'intent',
      'schedule',
      'schedule',
      'booking',
      'sms',
    ]);
    expect(session.log.map(event => event.text)).toContain('Zapisano rezerwację D-1042');
  });

  it('refuses a taken hour and keeps the step', () => {
    const day = nextWorkingDays(monday)[0];
    const taken = takenHours(day, [])[0];
    const session = run(startSession(), 'Umów wymianę opon', 'wt. 3.11', `${taken}:00`);
    expect(session.booking.step).toBe('hour');
    expect(lastReply(session)).toContain('Ta godzina jest zajęta.');
    expect(session.log[session.log.length - 1].text).toBe(
      `Sprawdzono grafik: wt. 3.11 ${taken}:00 zajęte`,
    );
  });

  it('marks the taken hours as disabled quick replies', () => {
    const session = run(startSession(), 'Umów wymianę opon', 'wt. 3.11');
    const disabled = session.chips.filter(chip => chip.disabled);
    expect(disabled).toHaveLength(3);
    disabled.forEach(chip => expect(chip.note).toBe('zajęte'));
  });

  it('asks for the service when the first message does not name one', () => {
    const session = run(startSession(), 'Chcę umówić termin');
    expect(session.booking.step).toBe('service');
    expect(session.chips.map(chip => chip.label)).toEqual([
      'Wymiana opon',
      'Wymiana oleju',
      'Przegląd',
      'Diagnostyka',
      'Anuluj',
    ]);
  });

  it('lets the visitor change the choice and cancel', () => {
    const phoneStep = run(startSession(), 'Umów wymianę oleju', 'wt. 3.11');
    expect(phoneStep.booking.step).toBe('hour');
    const cancelled = run(phoneStep, 'Anuluj');
    expect(cancelled.booking.step).toBe('idle');
    expect(cancelled.bookings).toHaveLength(0);
  });

  it('starts the booking from the hero button at any time', () => {
    const session = beginBooking(run(startSession(), 'Czy naprawiacie rowery?'), env);
    expect(session.booking).toEqual({ step: 'day', service: 'tires' });
    expect(session.handoff).toBe(false);
    expect(session.messages[session.messages.length - 2]).toMatchObject({
      from: 'user',
      text: 'Umów wymianę opon',
    });
  });

  it('ignores an empty message', () => {
    const session = startSession();
    expect(sendText(session, '   ', env)).toBe(session);
  });
});

describe('log', () => {
  const event = (index: number): LogEvent => ({
    time: '10:00:00',
    kind: 'intent',
    text: `e${index}`,
  });

  it('keeps the last 40 entries', () => {
    const many = Array.from({ length: 50 }, (_, index) => event(index));
    const kept = appendLog([], many);
    expect(kept).toHaveLength(logLimit);
    expect(kept[0].text).toBe('e10');
    expect(appendLog(kept, [event(99)])[logLimit - 1].text).toBe('e99');
  });

  it('reads stored data and ignores broken data', () => {
    expect(parseLog(JSON.stringify([event(1), { nope: true }]))).toEqual([event(1)]);
    expect(parseLog('not json')).toEqual([]);
    expect(parseLog(null)).toEqual([]);
    expect(parseLog(JSON.stringify([{ time: 'x', kind: 'toString', text: 'y' }]))).toEqual([]);
    expect(parseBookings('{}')).toEqual([]);
    expect(parseBookings(null)).toEqual([]);
  });

  it('reads a stored booking', () => {
    const stored: Booking = {
      id: 'D-1042',
      service: 'tires',
      dayKey: '2026-11-03',
      dayLabel: 'wt. 3.11',
      hour: 10,
      phone: '600 000 000',
    };
    expect(parseBookings(JSON.stringify([stored, { id: 1 }]))).toEqual([stored]);
  });
});
