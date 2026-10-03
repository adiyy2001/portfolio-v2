import { useEffect, useRef, useState } from 'preact/hooks';
import { firstErrorField, validateBooking, type BookingField } from '../lib/booking';
import {
  freeSlotCount,
  longDayLabel,
  shortDayLabel,
  todayInBrowser,
  upcomingViewingDays,
  weekdayShortName,
  type ViewingDay,
} from '../lib/slots';
import type { ErrorMap } from '../lib/validation';
import { Icon } from './Icon';

interface Props {
  slug: string;
  street: string;
  agentName: string;
}

const fieldIds: Record<BookingField, string> = {
  name: 'booking-name',
  phone: 'booking-phone',
  email: 'booking-email',
  consent: 'booking-consent',
};

const dayName = (day: ViewingDay): string => weekdayShortName(day.weekday);

export const ViewingBooking = ({ slug, street, agentName }: Props) => {
  const [days, setDays] = useState<ViewingDay[]>([]);
  const [dayKey, setDayKey] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ErrorMap<BookingField>>({});
  const [sent, setSent] = useState<{ name: string; slotText: string } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDays(upcomingViewingDays(todayInBrowser(), slug));
  }, [slug]);

  const day = days.find(item => item.key === dayKey);
  const errorEntries = (Object.keys(fieldIds) as BookingField[]).flatMap(field => {
    const text = errors[field];
    return text ? [{ field, text }] : [];
  });

  const chooseDay = (key: string) => {
    setDayKey(key);
    setTime('');
  };

  const submit = (event: Event) => {
    event.preventDefault();
    const found = validateBooking({ name, phone, email, consent });
    setErrors(found);
    const first = firstErrorField(found);
    if (first) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const slotText = day && time ? `${longDayLabel(day.date)}, godz. ${time}` : '';
    setSent({ name: name.trim(), slotText });
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const reset = () => {
    setSent(null);
    setErrors({});
    setDayKey('');
    setTime('');
    setMessage('');
    setConsent(false);
  };

  if (sent) {
    return (
      <div class="success-panel" tabIndex={-1} ref={successRef} role="status">
        <h3>Dziękujemy, {sent.name}.</h3>
        <p>
          {sent.slotText
            ? `Zapisaliśmy termin: ${sent.slotText}. ${agentName} potwierdzi go telefonicznie.`
            : `${agentName} oddzwoni w sprawie: ${street}.`}
        </p>
        <p>
          <strong>To strona przykładowa, więc nic nie zostało wysłane.</strong>
        </p>
        <button type="button" class="btn btn-quiet" onClick={reset}>
          Wypełnij jeszcze raz
        </button>
      </div>
    );
  }

  return (
    <form class="booking" noValidate onSubmit={submit}>
      {errorEntries.length > 0 && (
        <div class="error-summary" tabIndex={-1} ref={summaryRef} role="alert">
          <h3>Formularz wymaga poprawek</h3>
          <ul>
            {errorEntries.map(entry => (
              <li key={entry.field}>
                <a href={`#${fieldIds[entry.field]}`}>{entry.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset class="booking-days">
        <legend class="field-label">Termin oglądania (opcjonalnie)</legend>
        {days.length === 0 ? (
          <p class="field-hint booking-loading">Sprawdzam wolne terminy.</p>
        ) : (
          <div class="day-grid">
            {days.map(item => (
              <label class="day" key={item.key}>
                <input
                  type="radio"
                  name="viewing-day"
                  value={item.key}
                  checked={dayKey === item.key}
                  disabled={freeSlotCount(item) === 0}
                  onChange={() => chooseDay(item.key)}
                />
                <span class="day-card">
                  <span class="day-name">{dayName(item)}</span>
                  <span class="day-date">{shortDayLabel(item.date)}</span>
                  <span class="day-free">
                    {freeSlotCount(item) === 0 ? 'brak' : `${freeSlotCount(item)} wolne`}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset class="booking-times" disabled={!day}>
        <legend class="field-label">
          {day ? `Godzina, ${longDayLabel(day.date)}` : 'Godzina'}
        </legend>
        {day ? (
          <div class="time-grid">
            {day.slots.map(slot => (
              <label class="time" key={slot.time}>
                <input
                  type="radio"
                  name="viewing-time"
                  value={slot.time}
                  checked={time === slot.time}
                  disabled={slot.taken}
                  onChange={() => setTime(slot.time)}
                />
                <span class="time-chip">
                  {slot.time}
                  {slot.taken && <span class="visually-hidden"> (zajęte)</span>}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p class="field-hint">Najpierw wybierz dzień. Przekreślone godziny są już zajęte.</p>
        )}
      </fieldset>

      <div class="booking-fields">
        <div class="field">
          <label for={fieldIds.name}>Imię i nazwisko</label>
          <input
            id={fieldIds.name}
            class="input"
            type="text"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'booking-name-error' : undefined}
            onInput={event => setName(event.currentTarget.value)}
          />
          {errors.name && (
            <p class="field-error" id="booking-name-error">
              <Icon name="alert" size={16} />
              <span>{errors.name}</span>
            </p>
          )}
        </div>
        <div class="field">
          <label for={fieldIds.phone}>Telefon</label>
          <input
            id={fieldIds.phone}
            class="input"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
            onInput={event => setPhone(event.currentTarget.value)}
          />
          {errors.phone && (
            <p class="field-error" id="booking-phone-error">
              <Icon name="alert" size={16} />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>
        <div class="field">
          <label for={fieldIds.email}>E-mail (opcjonalnie)</label>
          <input
            id={fieldIds.email}
            class="input"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'booking-email-error' : undefined}
            onInput={event => setEmail(event.currentTarget.value)}
          />
          {errors.email && (
            <p class="field-error" id="booking-email-error">
              <Icon name="alert" size={16} />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
        <div class="field">
          <label for="booking-message">Pytanie do agenta (opcjonalnie)</label>
          <textarea
            id="booking-message"
            class="textarea"
            value={message}
            onInput={event => setMessage(event.currentTarget.value)}
          />
        </div>
      </div>

      <div class="field">
        <label class="check">
          <input
            id={fieldIds.consent}
            type="checkbox"
            checked={consent}
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? 'booking-consent-error' : undefined}
            onChange={event => setConsent(event.currentTarget.checked)}
          />
          <span class="box" aria-hidden="true" />
          <span class="check-text">
            Zgadzam się, żeby biuro Próg skontaktowało się ze mną w sprawie tej oferty.
          </span>
        </label>
        {errors.consent && (
          <p class="field-error" id="booking-consent-error">
            <Icon name="alert" size={16} />
            <span>{errors.consent}</span>
          </p>
        )}
      </div>

      <button type="submit" class="btn btn-primary btn-block">
        {day && time ? 'Umów oglądanie' : 'Wyślij zapytanie'}
      </button>
      <p class="field-hint">
        Formularz nie ma zaplecza: po wysłaniu zobaczysz tylko potwierdzenie, bez wysyłki.
      </p>
    </form>
  );
};

export default ViewingBooking;
