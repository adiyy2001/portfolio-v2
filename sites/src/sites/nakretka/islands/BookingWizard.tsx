import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import { business, sampleNotice } from '../data/site';
import { otherRepair, services } from '../data/services';
import {
  arrivalHours,
  describeBooking,
  formatHour,
  freeHours,
  nextWorkingDays,
  orderNumber,
  takenHours,
} from '../lib/booking';
import type { Booking, BookingDay } from '../lib/booking';
import { warsawClock } from '../lib/clock';
import { sumFrom } from '../lib/estimate';
import { formatZl } from '../lib/format';
import { deleteBooking, loadBookings, saveBooking } from '../lib/saved';
import { firstErrorKey, normalizePhone, validateContactDetails } from '../lib/validation';
import {
  canAdvance,
  initialState,
  parseServiceQuery,
  serviceNames,
  wizardReducer,
} from '../lib/wizard';
import { Field, describedBy } from './fields';

type DetailErrors = Partial<Record<'name' | 'phone' | 'car', string>>;

const stepLabels = ['Usługi', 'Termin', 'Dane'];
const stepIndex = { services: 0, slot: 1, details: 2, done: 3 } as const;

const readQuery = (): string[] => {
  const raw = new URLSearchParams(window.location.search).get('usluga');
  return raw ? parseServiceQuery(raw) : [];
};

export default function BookingWizard() {
  const [state, dispatch] = useReducer(wizardReducer, undefined, () => initialState());
  const [days, setDays] = useState<BookingDay[]>([]);
  const [saved, setSaved] = useState<Booking[]>([]);
  const [details, setDetails] = useState({ name: '', phone: '', car: '', note: '' });
  const [errors, setErrors] = useState<DetailErrors>({});
  const [result, setResult] = useState<{ booking: Booking; stored: boolean } | null>(null);
  const [removed, setRemoved] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    setDays(nextWorkingDays(warsawClock(new Date())));
    setSaved(loadBookings());
    const preselected = readQuery();
    preselected.forEach(slug => dispatch({ type: 'toggle', slug }));
  }, []);

  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [state.step]);

  const day = days.find(item => item.iso === state.date);
  const total = sumFrom(state.services);
  const hasOther = state.services.includes(otherRepair.slug);

  const finish = (event: Event): void => {
    event.preventDefault();
    const found = validateContactDetails(details);
    setErrors(found);
    const first = firstErrorKey(found, ['name', 'phone', 'car']);
    if (first) {
      document.getElementById(`wiz-${first}`)?.focus();
      return;
    }
    const booking: Booking = {
      id: orderNumber(),
      service: state.services.join(','),
      serviceName: serviceNames(state.services),
      date: state.date,
      hour: state.hour,
      name: details.name.trim(),
      phone: normalizePhone(details.phone),
      car: details.car.trim(),
      note: details.note.trim(),
      createdAt: Date.now(),
    };
    const outcome = saveBooking(booking);
    setSaved(outcome.list);
    setResult({ booking, stored: outcome.stored });
    dispatch({ type: 'finish' });
  };

  const change = (key: 'name' | 'phone' | 'car' | 'note', value: string): void => {
    setDetails({ ...details, [key]: value });
    if (key !== 'note' && errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const restart = (): void => {
    setDetails({ name: '', phone: '', car: '', note: '' });
    setErrors({});
    setResult(null);
    dispatch({ type: 'reset' });
  };

  const cancel = (booking: Booking): void => {
    setSaved(deleteBooking(booking.id));
    setRemoved(`Usunęliśmy zlecenie ${booking.id} z tej przeglądarki.`);
    window.setTimeout(() => document.getElementById('wiz-removed')?.focus(), 0);
  };

  const heading =
    state.step === 'services'
      ? 'Czego potrzebuje auto?'
      : state.step === 'slot'
        ? 'Kiedy możesz przyjechać?'
        : state.step === 'details'
          ? 'Dane do zapisu'
          : 'Wizyta zapisana';

  return (
    <div class="wizard">
      {state.step !== 'done' && (
        <ol class="wiz-steps" aria-label="Postęp zapisu">
          {stepLabels.map((label, index) => (
            <li
              class={
                index === stepIndex[state.step]
                  ? 'is-current'
                  : index < stepIndex[state.step]
                    ? 'is-past'
                    : ''
              }
              aria-current={index === stepIndex[state.step] ? 'step' : undefined}>
              <span class="wiz-num">{index + 1}</span> {label}
            </li>
          ))}
        </ol>
      )}

      <h2 class="wiz-h" tabIndex={-1} ref={headingRef}>
        {heading}
      </h2>

      {state.step === 'services' && (
        <div class="wiz-body">
          <fieldset class="choices">
            <legend class="sr-only">Wybierz jedną usługę lub kilka</legend>
            {services.map(item => (
              <label class="choice">
                <input
                  type="checkbox"
                  checked={state.services.includes(item.slug)}
                  onChange={() => dispatch({ type: 'toggle', slug: item.slug })}
                />
                <span class="choice-name">{item.name}</span>
                <span class="choice-meta">
                  od {formatZl(item.price)}, {item.duration}
                </span>
              </label>
            ))}
            <label class="choice">
              <input
                type="checkbox"
                checked={hasOther}
                onChange={() => dispatch({ type: 'toggle', slug: otherRepair.slug })}
              />
              <span class="choice-name">{otherRepair.name}</span>
              <span class="choice-meta">{otherRepair.note}</span>
            </label>
          </fieldset>
          <p class="wiz-sum">
            {state.services.length === 0
              ? 'Zaznacz co najmniej jedną usługę.'
              : `Orientacyjnie od ${formatZl(total)}${hasOther ? ', bez wyceny innej naprawy' : ''}.`}
          </p>
          <div class="send-row">
            <button
              type="button"
              class="send"
              disabled={!canAdvance(state)}
              onClick={() => dispatch({ type: 'next' })}>
              Dalej, wybierz termin
            </button>
          </div>
        </div>
      )}

      {state.step === 'slot' && (
        <div class="wiz-body">
          <fieldset class="choices days">
            <legend class="wiz-legend">Dzień</legend>
            {days.map(item => (
              <label class={state.date === item.iso ? 'chip is-on' : 'chip'}>
                <input
                  type="radio"
                  name="wiz-day"
                  checked={state.date === item.iso}
                  onChange={() => dispatch({ type: 'day', date: item.iso })}
                />
                <span>{item.short}</span>
              </label>
            ))}
          </fieldset>
          {day && (
            <fieldset class="choices hours">
              <legend class="wiz-legend">Godzina przyjęcia, {day.label}</legend>
              {arrivalHours(day.weekday).map(hour => {
                const free = freeHours(day, saved).includes(hour);
                const available = day.hours.includes(hour) && free;
                const label = takenHours(day.iso).includes(hour) || !free ? 'zajęte' : '';
                return (
                  <label
                    class={state.hour === hour ? 'chip is-on' : available ? 'chip' : 'chip is-off'}>
                    <input
                      type="radio"
                      name="wiz-hour"
                      disabled={!available}
                      checked={state.hour === hour}
                      onChange={() => dispatch({ type: 'hour', hour })}
                    />
                    <span>
                      {formatHour(hour)}
                      {!available && <small> {label || 'minęło'}</small>}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          )}
          {!day && <p class="wiz-sum">Wybierz dzień, a pokażemy wolne godziny.</p>}
          <p class="wiz-help">
            Przyjmujemy auta do dwóch godzin przed zamknięciem. Jeśli żaden termin nie pasuje,
            zadzwoń: <a href={business.phoneHref}>{business.phone}</a>.
          </p>
          <div class="send-row">
            <button type="button" class="back" onClick={() => dispatch({ type: 'back' })}>
              Wróć
            </button>
            <button
              type="button"
              class="send"
              disabled={!canAdvance(state)}
              onClick={() => dispatch({ type: 'next' })}>
              Dalej, wpisz dane
            </button>
          </div>
        </div>
      )}

      {state.step === 'details' && (
        <form class="wiz-body" noValidate onSubmit={finish}>
          <p class="wiz-recap">
            <strong>{serviceNames(state.services)}</strong>
            <br />
            {day ? `${day.label}, godz. ${state.hour === null ? '' : formatHour(state.hour)}` : ''}
          </p>
          <div class="fields fields-2">
            <Field id="wiz-name" label="Imię" error={errors.name}>
              <input
                id="wiz-name"
                type="text"
                autoComplete="given-name"
                value={details.name}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={describedBy('wiz-name', errors.name)}
                onInput={event => change('name', event.currentTarget.value)}
              />
            </Field>
            <Field id="wiz-phone" label="Telefon" error={errors.phone}>
              <input
                id="wiz-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={details.phone}
                aria-invalid={errors.phone ? 'true' : undefined}
                aria-describedby={describedBy('wiz-phone', errors.phone)}
                onInput={event => change('phone', event.currentTarget.value)}
              />
            </Field>
            <Field id="wiz-car" label="Marka i rocznik auta" error={errors.car}>
              <input
                id="wiz-car"
                type="text"
                value={details.car}
                aria-invalid={errors.car ? 'true' : undefined}
                aria-describedby={describedBy('wiz-car', errors.car)}
                onInput={event => change('car', event.currentTarget.value)}
              />
            </Field>
            <Field id="wiz-note" label="Co się dzieje z autem (nieobowiązkowo)">
              <textarea
                id="wiz-note"
                rows={3}
                value={details.note}
                onInput={event => change('note', event.currentTarget.value)}
              />
            </Field>
          </div>
          <div class="send-row">
            <button type="button" class="back" onClick={() => dispatch({ type: 'back' })}>
              Wróć
            </button>
            <button type="submit" class="send">
              Zapisz wizytę
            </button>
          </div>
        </form>
      )}

      {state.step === 'done' && result && (
        <div class="wiz-body confirm">
          <p>
            Numer zlecenia: <strong>{result.booking.id}</strong>
          </p>
          <p>
            {result.booking.serviceName}. {describeBooking(result.booking)}. Auto:{' '}
            {result.booking.car}.
          </p>
          <p class="confirm-sample">
            {result.stored
              ? sampleNotice
              : `To strona przykładowa, więc nic nie wysłaliśmy. Przeglądarka nie pozwoliła też zapisać wizyty, więc zadzwoń: ${business.phone}.`}
          </p>
          <div class="send-row">
            <button type="button" class="send" onClick={restart}>
              Umów kolejną wizytę
            </button>
          </div>
        </div>
      )}

      <section class="saved" aria-labelledby="saved-h">
        <h2 class="wiz-h2" id="saved-h">
          Zapisane w tej przeglądarce
        </h2>
        <p class="form-note" id="wiz-removed" tabIndex={-1}>
          {removed}
        </p>
        {saved.length === 0 ? (
          <p>Nie masz jeszcze zapisanych zleceń.</p>
        ) : (
          <ul class="saved-list">
            {saved.map(item => (
              <li>
                <div>
                  <strong>{item.id}</strong>, {item.serviceName}
                  <br />
                  {describeBooking(item)}. {item.car}.
                </div>
                <button type="button" class="back" onClick={() => cancel(item)}>
                  Usuń zlecenie
                  <span class="sr-only"> {item.id}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
