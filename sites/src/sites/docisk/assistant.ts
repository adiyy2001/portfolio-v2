import { bookingServices, priceLabel, serviceById, services } from './data';
import type { BookingServiceId, ServiceId } from './data';

export type Intent = 'hours' | 'price' | 'booking' | 'address' | 'invoice' | 'human' | 'fallback';

export const bookingsStorageKey = 'docisk-bookings';
export const logStorageKey = 'docisk-log';
export const logLimit = 40;
export const firstBookingNumber = 1042;
export const bookingRequestText = 'Umów wymianę opon';

export const greeting =
  'Cześć, jestem asystentem AI serwisu Docisk. Odpowiadam z cennika i grafiku. W każdej chwili możesz poprosić o rozmowę z człowiekiem.';
export const fallbackAnswer =
  'Nie mam tego w bazie wiedzy. Mogę przekazać pytanie do serwisu, oddzwonią w godzinach pracy. Zostawisz numer?';
export const handoffDone = 'Przekazuję. Ktoś z serwisu oddzwoni w godzinach pracy.';
export const handoffAsk =
  'Jasne. Podaj numer telefonu, 9 cyfr. Ktoś z serwisu oddzwoni w godzinach pracy.';
export const phoneError = 'Numer musi mieć 9 cyfr, na przykład 600 000 000.';
export const invoiceAnswer = 'Tak, wystawiamy faktury VAT, podaj NIP przy odbiorze.';
export const addressAnswer =
  'Jesteśmy przy ul. Przykładowej 12, 52-200 Wrocław (Krzyki). Telefon: 71 000 00 00.';
export const closedLead = 'Serwis jest teraz zamknięty.';

const wordStart = (stems: string[]): RegExp =>
  new RegExp(`(?<![\\p{L}\\p{N}])(?:${stems.join('|')})`, 'u');

const humanRule = wordStart([
  'człowiek',
  'czlowiek',
  'konsultant',
  'osob(?!ow)',
  'zadzwoń',
  'zadzwon',
  'wolę',
  'wole',
]);
const invoiceRule = wordStart(['faktur', 'vat']);
const bookingRule = wordStart(['umów', 'umow', 'termin', 'zapis', 'rezerw']);
const priceRule = wordStart(['cen', 'koszt', 'ile', 'płac']);
const lateBookingRule = wordStart(['wymian']);
const hoursRule = wordStart(['godzin', 'otwart', 'czynn', 'kiedy']);
const addressRule = wordStart(['adres', 'gdzie', 'dojazd']);

const lower = (text: string): string => text.toLowerCase();

export const detectIntent = (text: string): Intent => {
  const value = lower(text);
  if (humanRule.test(value)) return 'human';
  if (invoiceRule.test(value)) return 'invoice';
  if (bookingRule.test(value)) return 'booking';
  if (priceRule.test(value)) return 'price';
  if (lateBookingRule.test(value)) return 'booking';
  if (hoursRule.test(value)) return 'hours';
  if (addressRule.test(value)) return 'address';
  return 'fallback';
};

const serviceRules: ReadonlyArray<readonly [ServiceId, RegExp]> = [
  ['storage', wordStart(['przechow', 'sezon'])],
  ['tires', wordStart(['opon'])],
  ['oil', wordStart(['olej'])],
  ['inspection', wordStart(['przegl[ąa]d'])],
  ['diagnostics', wordStart(['diagnost'])],
  ['ac', wordStart(['klimat'])],
  ['brakes', wordStart(['hamul', 'klock'])],
];

export const detectService = (text: string): ServiceId | null => {
  const value = lower(text);
  const found = serviceRules.find(([, rule]) => rule.test(value));
  return found ? found[0] : null;
};

export const detectBookingService = (text: string): BookingServiceId | null => {
  const id = detectService(text);
  const match = bookingServices.find(service => service.id === id);
  return match ? match.id : null;
};

export const parsePhone = (text: string): string | null => {
  const digits = text.replace(/[\s-]/g, '');
  if (!/^\d{9}$/.test(digits)) return null;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

const minutesOf = (date: Date): number => date.getHours() * 60 + date.getMinutes();

const openingWindows: Record<number, readonly [number, number] | null> = {
  0: null,
  1: [480, 1080],
  2: [480, 1080],
  3: [480, 1080],
  4: [480, 1080],
  5: [480, 1080],
  6: [480, 840],
};

export const isOpen = (date: Date): boolean => {
  const span = openingWindows[date.getDay()];
  if (!span) return false;
  const minutes = minutesOf(date);
  return minutes >= span[0] && minutes < span[1];
};

export interface DayOption {
  key: string;
  label: string;
  index: number;
}

const weekdayNames = ['ndz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
const pad = (value: number): string => String(value).padStart(2, '0');

export const dateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const nextWorkingDays = (now: Date, count = 5): DayOption[] => {
  const days: DayOption[] = [];
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const weekday = cursor.getDay();
    if (weekday === 0 || weekday === 6) continue;
    days.push({
      key: dateKey(cursor),
      label: `${weekdayNames[weekday]} ${cursor.getDate()}.${cursor.getMonth() + 1}`,
      index: days.length,
    });
  }
  return days;
};

export const slotHours: readonly number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export const formatHour = (hour: number): string => `${hour}:00`;

export const formatClock = (date: Date): string =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

export interface Booking {
  id: string;
  service: BookingServiceId;
  dayKey: string;
  dayLabel: string;
  hour: number;
  phone: string;
}

const scriptedTakenHours = (dayIndex: number): number[] => {
  const first = (dayIndex * 3) % slotHours.length;
  return [first, (first + 4) % slotHours.length, (first + 7) % slotHours.length].map(
    offset => slotHours[0] + offset,
  );
};

export const takenHours = (day: DayOption, bookings: readonly Booking[]): number[] => {
  const booked = bookings
    .filter(booking => booking.dayKey === day.key)
    .map(booking => booking.hour);
  return [...new Set([...scriptedTakenHours(day.index), ...booked])].sort((a, b) => a - b);
};

export const isTaken = (day: DayOption, hour: number, bookings: readonly Booking[]): boolean =>
  takenHours(day, bookings).includes(hour);

export type BookingState =
  | { step: 'idle' }
  | { step: 'service' }
  | { step: 'day'; service: BookingServiceId }
  | { step: 'hour'; service: BookingServiceId; day: DayOption }
  | { step: 'phone'; service: BookingServiceId; day: DayOption; hour: number }
  | { step: 'confirm'; service: BookingServiceId; day: DayOption; hour: number; phone: string }
  | { step: 'done'; booking: Booking };

export type BookingAction =
  | { type: 'start'; service?: BookingServiceId }
  | { type: 'service'; service: BookingServiceId }
  | { type: 'day'; key: string }
  | { type: 'hour'; hour: number }
  | { type: 'phone'; text: string }
  | { type: 'confirm' }
  | { type: 'change' }
  | { type: 'cancel' };

export interface BookingContext {
  now: Date;
  bookings: readonly Booking[];
}

export const idleBooking: BookingState = { step: 'idle' };

export const isBookingActive = (state: BookingState): boolean =>
  state.step !== 'idle' && state.step !== 'done';

export const bookingReducer = (
  state: BookingState,
  action: BookingAction,
  context: BookingContext,
): BookingState => {
  if (action.type === 'start') {
    return action.service ? { step: 'day', service: action.service } : { step: 'service' };
  }
  if (action.type === 'cancel') return idleBooking;
  if (action.type === 'change') return state.step === 'confirm' ? { step: 'service' } : state;
  if (action.type === 'service') {
    return state.step === 'service' ? { step: 'day', service: action.service } : state;
  }
  if (action.type === 'day') {
    if (state.step !== 'day') return state;
    const day = nextWorkingDays(context.now).find(option => option.key === action.key);
    return day ? { step: 'hour', service: state.service, day } : state;
  }
  if (action.type === 'hour') {
    if (state.step !== 'hour') return state;
    const valid =
      slotHours.includes(action.hour) && !isTaken(state.day, action.hour, context.bookings);
    return valid
      ? { step: 'phone', service: state.service, day: state.day, hour: action.hour }
      : state;
  }
  if (action.type === 'phone') {
    if (state.step !== 'phone') return state;
    const phone = parsePhone(action.text);
    return phone ? { ...state, step: 'confirm', phone } : state;
  }
  if (state.step !== 'confirm') return state;
  return {
    step: 'done',
    booking: {
      id: `D-${firstBookingNumber + context.bookings.length}`,
      service: state.service,
      dayKey: state.day.key,
      dayLabel: state.day.label,
      hour: state.hour,
      phone: state.phone,
    },
  };
};

export const bookingServiceLabel = (id: BookingServiceId): string => {
  const found = bookingServices.find(service => service.id === id);
  return found ? found.label : id;
};

export interface Chip {
  label: string;
  disabled?: boolean;
  note?: string;
}

export interface Reply {
  text: string;
  chips: Chip[];
}

export const mainChips: Chip[] = [
  { label: 'Godziny otwarcia' },
  { label: 'Ile kosztuje wymiana opon?' },
  { label: bookingRequestText },
  { label: 'Wolę człowieka' },
];

const cancelChip: Chip = { label: 'Anuluj' };
const declineChip: Chip = { label: 'Nie, dziękuję' };

export const summaryOf = (state: Extract<BookingState, { step: 'confirm' }>): string =>
  `${bookingServiceLabel(state.service)}, ${state.day.label}, ${formatHour(state.hour)}, tel. ${state.phone}. Potwierdzasz?`;

export const confirmationOf = (booking: Booking): string =>
  `Zapisane. Numer rezerwacji ${booking.id}. Dostaniesz SMS z przypomnieniem dzień wcześniej.`;

export const promptFor = (state: BookingState, context: BookingContext): Reply => {
  if (state.step === 'service') {
    return {
      text: 'Jaką usługę wybierasz?',
      chips: [...bookingServices.map(service => ({ label: service.label })), cancelChip],
    };
  }
  if (state.step === 'day') {
    return {
      text: 'Który dzień Ci pasuje?',
      chips: [...nextWorkingDays(context.now).map(day => ({ label: day.label })), cancelChip],
    };
  }
  if (state.step === 'hour') {
    const taken = takenHours(state.day, context.bookings);
    return {
      text: `${state.day.label}: wybierz godzinę. Zajęte są oznaczone.`,
      chips: [
        ...slotHours.map(hour =>
          taken.includes(hour)
            ? { label: formatHour(hour), disabled: true, note: 'zajęte' }
            : { label: formatHour(hour) },
        ),
        cancelChip,
      ],
    };
  }
  if (state.step === 'phone') {
    return {
      text: 'Podaj numer telefonu, 9 cyfr. Na ten numer wyślemy SMS z przypomnieniem.',
      chips: [cancelChip],
    };
  }
  if (state.step === 'confirm') {
    return { text: summaryOf(state), chips: [{ label: 'Potwierdzam' }, { label: 'Zmień' }] };
  }
  if (state.step === 'done') return { text: confirmationOf(state.booking), chips: mainChips };
  return { text: '', chips: mainChips };
};

export type LogKind = 'intent' | 'schedule' | 'booking' | 'sms' | 'handoff' | 'fallback';

export interface LogEvent {
  time: string;
  kind: LogKind;
  text: string;
}

export const logKindLabels: Record<LogKind, string> = {
  intent: 'Rozpoznanie',
  schedule: 'Grafik',
  booking: 'Rezerwacja',
  sms: 'SMS',
  handoff: 'Człowiek',
  fallback: 'Brak odpowiedzi',
};

export const appendLog = (log: readonly LogEvent[], events: readonly LogEvent[]): LogEvent[] =>
  [...log, ...events].slice(-logLimit);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLogEvent = (value: unknown): value is LogEvent =>
  isRecord(value) &&
  typeof value.time === 'string' &&
  typeof value.text === 'string' &&
  typeof value.kind === 'string' &&
  Object.hasOwn(logKindLabels, value.kind);

const isBooking = (value: unknown): value is Booking =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.service === 'string' &&
  bookingServices.some(service => service.id === value.service) &&
  typeof value.dayKey === 'string' &&
  typeof value.dayLabel === 'string' &&
  typeof value.hour === 'number' &&
  typeof value.phone === 'string';

const parseList = <T>(raw: string | null, guard: (value: unknown) => value is T): T[] => {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
};

export const parseLog = (raw: string | null): LogEvent[] =>
  parseList(raw, isLogEvent).slice(-logLimit);

export const parseBookings = (raw: string | null): Booking[] => parseList(raw, isBooking);

export interface Message {
  id: number;
  from: 'assistant' | 'user';
  text: string;
}

export interface Session {
  messages: Message[];
  chips: Chip[];
  booking: BookingState;
  handoff: boolean;
  bookings: Booking[];
  log: LogEvent[];
  error: string | null;
}

export interface Env {
  now: Date;
}

export const startSession = (bookings: Booking[] = [], log: LogEvent[] = []): Session => ({
  messages: [{ id: 0, from: 'assistant', text: greeting }],
  chips: mainChips,
  booking: idleBooking,
  handoff: false,
  bookings,
  log,
  error: null,
});

export const expectsPhone = (session: Session): boolean =>
  session.handoff || session.booking.step === 'phone';

const withMessage = (session: Session, from: Message['from'], text: string): Session => ({
  ...session,
  messages: [...session.messages, { id: session.messages.length, from, text }],
});

const say = (session: Session, text: string, chips: Chip[] = mainChips): Session => ({
  ...withMessage(session, 'assistant', text),
  chips,
});

const record = (session: Session, env: Env, kind: LogKind, text: string): Session => ({
  ...session,
  log: appendLog(session.log, [{ time: formatClock(env.now), kind, text }]),
});

const intentNames: Record<Exclude<Intent, 'fallback'>, string> = {
  hours: 'godziny otwarcia',
  price: 'cennik',
  booking: 'rezerwacja terminu',
  address: 'adres',
  invoice: 'faktura',
  human: 'rozmowa z człowiekiem',
};

const recognized = (session: Session, env: Env, intent: Exclude<Intent, 'fallback'>): Session =>
  record(session, env, 'intent', `Rozpoznano pytanie: ${intentNames[intent]}`);

const hoursAnswer = (env: Env): string =>
  `${isOpen(env.now) ? '' : `${closedLead} `}Pracujemy: pon. do pt. 8:00 do 18:00, w sobotę 8:00 do 14:00. W niedzielę serwis jest nieczynny.`;

const priceAnswer = (service: ServiceId | null): string => {
  if (service) {
    const found = serviceById(service);
    return `${found.name}: ${priceLabel(found)}. Ceny brutto, części osobno.`;
  }
  const list = services.map(item => `${item.name.toLowerCase()} ${priceLabel(item)}`).join(', ');
  return `Ceny brutto, części osobno: ${list}. Cennik jest też wyżej na stronie.`;
};

const bookingLead = (env: Env): string =>
  isOpen(env.now) ? 'Zapiszę Cię na termin.' : `${closedLead} Termin zapisuję od razu.`;

const bookingContext = (session: Session, env: Env): BookingContext => ({
  now: env.now,
  bookings: session.bookings,
});

const beginBookingFlow = (
  session: Session,
  env: Env,
  service: BookingServiceId | null,
): Session => {
  const booking = bookingReducer(
    session.booking,
    { type: 'start', service: service ?? undefined },
    bookingContext(session, env),
  );
  const reply = promptFor(booking, bookingContext(session, env));
  const next = recognized({ ...session, booking, handoff: false }, env, 'booking');
  return say(next, `${bookingLead(env)} ${reply.text}`, reply.chips);
};

const beginHandoff = (session: Session, env: Env): Session =>
  say(recognized({ ...session, booking: idleBooking, handoff: true }, env, 'human'), handoffAsk, [
    declineChip,
  ]);

const respondToIntent = (session: Session, text: string, env: Env): Session => {
  const intent = detectIntent(text);
  if (intent === 'hours') return say(recognized(session, env, intent), hoursAnswer(env));
  if (intent === 'price') {
    return say(recognized(session, env, intent), priceAnswer(detectService(text)));
  }
  if (intent === 'booking') return beginBookingFlow(session, env, detectBookingService(text));
  if (intent === 'address') return say(recognized(session, env, intent), addressAnswer);
  if (intent === 'invoice') return say(recognized(session, env, intent), invoiceAnswer);
  if (intent === 'human') return beginHandoff(session, env);
  return say(
    record(
      { ...session, handoff: true },
      env,
      'fallback',
      'Brak odpowiedzi w bazie, zaproponowano kontakt',
    ),
    fallbackAnswer,
    [declineChip],
  );
};

const declineRule = /^\s*(nie|dzięki|dziękuję|dziekuje|rezygnuję|rezygnuje)/i;
const affirmRule = /^\s*(tak|ok|jasne|dobrze|zostawię|zostawie)/i;
const cancelRule = /^\s*(anuluj|rezygnuj|przerwij)/i;
const confirmRule = /^\s*(tak|potwierdzam|ok|zgoda)/i;
const changeRule = /^\s*(zmień|zmien|nie|zmiana)/i;

const respondInHandoff = (session: Session, text: string, env: Env): Session => {
  const phone = parsePhone(text);
  if (phone) {
    return say(
      record(
        { ...session, handoff: false },
        env,
        'handoff',
        'Przekazano do człowieka: prośba o telefon',
      ),
      handoffDone,
    );
  }
  if (declineRule.test(text)) {
    return say(
      { ...session, handoff: false },
      'W porządku. Możesz zapytać o cennik, godziny albo termin.',
    );
  }
  if (affirmRule.test(text)) {
    return say(session, 'Podaj numer telefonu, 9 cyfr, na przykład 600 000 000.', [declineChip]);
  }
  if (detectIntent(text) !== 'fallback')
    return respondToIntent({ ...session, handoff: false }, text, env);
  return say({ ...session, error: phoneError }, phoneError, [declineChip]);
};

const parseDay = (text: string, env: Env): DayOption | null => {
  const found = /(\d{1,2})\.(\d{1,2})/.exec(text);
  if (!found) return null;
  const suffix = `-${pad(Number(found[2]))}-${pad(Number(found[1]))}`;
  return nextWorkingDays(env.now).find(day => day.key.endsWith(suffix)) ?? null;
};

const parseHour = (text: string): number | null => {
  const found = /^\D*(\d{1,2})(?:[:.](\d{2}))?\D*$/.exec(text);
  if (!found) return null;
  if (found[2] !== undefined && found[2] !== '00') return null;
  const hour = Number(found[1]);
  return slotHours.includes(hour) ? hour : null;
};

const reprompt = (session: Session, env: Env, lead: string): Session => {
  const reply = promptFor(session.booking, bookingContext(session, env));
  return say(session, `${lead} ${reply.text}`, reply.chips);
};

const respondInBooking = (session: Session, text: string, env: Env): Session => {
  if (cancelRule.test(text)) {
    return say(
      { ...session, booking: idleBooking },
      'Dobrze, nie zapisuję terminu. W czym jeszcze pomóc?',
    );
  }
  if (detectIntent(text) === 'human') return beginHandoff(session, env);

  const context = bookingContext(session, env);
  const state = session.booking;

  if (state.step === 'service') {
    const service = detectBookingService(text);
    if (!service) return reprompt(session, env, 'Nie rozpoznaję usługi.');
    const booking = bookingReducer(state, { type: 'service', service }, context);
    const reply = promptFor(booking, context);
    return say({ ...session, booking }, reply.text, reply.chips);
  }

  if (state.step === 'day') {
    const day = parseDay(text, env);
    if (!day) return reprompt(session, env, 'Wybierz jeden z dni z listy.');
    const booking = bookingReducer(state, { type: 'day', key: day.key }, context);
    const free = slotHours.length - takenHours(day, session.bookings).length;
    const reply = promptFor(booking, context);
    return say(
      record(
        { ...session, booking },
        env,
        'schedule',
        `Sprawdzono grafik: ${day.label}, wolnych godzin: ${free}`,
      ),
      reply.text,
      reply.chips,
    );
  }

  if (state.step === 'hour') {
    const hour = parseHour(text);
    if (hour === null) {
      return reprompt(session, env, 'Podaj pełną godzinę od 8:00 do 17:00, na przykład 10:00.');
    }
    if (isTaken(state.day, hour, session.bookings)) {
      return reprompt(
        record(
          session,
          env,
          'schedule',
          `Sprawdzono grafik: ${state.day.label} ${formatHour(hour)} zajęte`,
        ),
        env,
        'Ta godzina jest zajęta.',
      );
    }
    const booking = bookingReducer(state, { type: 'hour', hour }, context);
    const reply = promptFor(booking, context);
    return say(
      record(
        { ...session, booking },
        env,
        'schedule',
        `Sprawdzono grafik: ${state.day.label} ${formatHour(hour)} wolne`,
      ),
      reply.text,
      reply.chips,
    );
  }

  if (state.step === 'phone') {
    const booking = bookingReducer(state, { type: 'phone', text }, context);
    if (booking.step !== 'confirm') {
      return say({ ...session, error: phoneError }, phoneError, [cancelChip]);
    }
    const reply = promptFor(booking, context);
    return say({ ...session, booking }, reply.text, reply.chips);
  }

  if (state.step === 'confirm') {
    if (confirmRule.test(text)) {
      const booking = bookingReducer(state, { type: 'confirm' }, context);
      if (booking.step !== 'done') return session;
      const saved = booking.booking;
      const stored: Session = { ...session, booking, bookings: [...session.bookings, saved] };
      const logged = record(
        record(stored, env, 'booking', `Zapisano rezerwację ${saved.id}`),
        env,
        'sms',
        'SMS z potwierdzeniem (symulacja)',
      );
      return say(logged, confirmationOf(saved));
    }
    if (changeRule.test(text)) {
      const booking = bookingReducer(state, { type: 'change' }, context);
      const reply = promptFor(booking, context);
      return say({ ...session, booking }, `Dobrze, zaczynamy od nowa. ${reply.text}`, reply.chips);
    }
    return reprompt(session, env, 'Wybierz Potwierdzam albo Zmień.');
  }

  return session;
};

export const sendText = (session: Session, raw: string, env: Env): Session => {
  const text = raw.trim();
  if (!text) return session;
  const current = withMessage({ ...session, error: null }, 'user', text);
  if (isBookingActive(current.booking)) return respondInBooking(current, text, env);
  if (current.handoff) return respondInHandoff(current, text, env);
  return respondToIntent(current, text, env);
};

export const beginBooking = (session: Session, env: Env): Session =>
  beginBookingFlow(
    withMessage({ ...session, error: null }, 'user', bookingRequestText),
    env,
    detectBookingService(bookingRequestText),
  );
