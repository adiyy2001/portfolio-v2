import { useEffect, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { business, sampleNotice } from '../data/site';
import { otherRepair, services } from '../data/services';
import { orderNumber } from '../lib/booking';
import type { Booking } from '../lib/booking';
import { saveBooking } from '../lib/saved';
import { firstErrorKey, normalizePhone, validateRequest } from '../lib/validation';
import type { RequestErrors, RequestValues } from '../lib/validation';
import { Field, describedBy } from './fields';

const empty: RequestValues = { name: '', phone: '', car: '', service: '' };
const order: Array<keyof RequestValues> = ['name', 'phone', 'car', 'service'];

interface Done {
  booking: Booking;
  stored: boolean;
}

export default function QuickOrder() {
  const [values, setValues] = useState<RequestValues>(empty);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    if (done) document.getElementById('quick-done')?.focus();
  }, [done]);

  const change = (key: keyof RequestValues, value: string): void => {
    setValues({ ...values, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    const found = validateRequest(values);
    setErrors(found);
    const first = firstErrorKey(found, order);
    if (first) {
      document.getElementById(`quick-${first}`)?.focus();
      return;
    }
    const choice =
      services.find(item => item.slug === values.service) ??
      (values.service === otherRepair.slug ? otherRepair : undefined);
    const booking: Booking = {
      id: orderNumber(),
      service: values.service,
      serviceName: choice?.name ?? otherRepair.name,
      date: null,
      hour: null,
      name: values.name.trim(),
      phone: normalizePhone(values.phone),
      car: values.car.trim(),
      note: '',
      createdAt: Date.now(),
    };
    const result = saveBooking(booking);
    setDone({ booking, stored: result.stored });
    setValues(empty);
  };

  if (done) {
    return (
      <div class="confirm" id="quick-done" tabindex={-1}>
        <h4 class="confirm-h">Zlecenie przyjęte</h4>
        <p>
          Numer zlecenia: <strong>{done.booking.id}</strong>. {done.booking.serviceName}, auto:{' '}
          {done.booking.car}. Oddzwonimy w godzinach przyjęć, żeby ustalić termin.
        </p>
        <p class="confirm-sample">
          {done.stored
            ? sampleNotice
            : `To strona przykładowa, więc nic nie wysłaliśmy. Przeglądarka nie pozwoliła też zapisać zlecenia, więc zadzwoń: ${business.phone}.`}
        </p>
        <div class="send-row">
          <button type="button" class="send" onClick={() => setDone(null)}>
            Nowe zlecenie
          </button>
          <a class="call-alt" href={link('/warsztat-szybowcowa/umow-wizyte/')}>
            Zobacz zapisane zlecenia
          </a>
        </div>
      </div>
    );
  }

  const hasErrors = order.some(key => errors[key]);

  return (
    <form class="quick" noValidate onSubmit={submit} aria-label="Zlecenie warsztatowe">
      <div class="fields">
        <Field id="quick-name" label="Imię" error={errors.name}>
          <input
            id="quick-name"
            type="text"
            autoComplete="given-name"
            value={values.name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={describedBy('quick-name', errors.name)}
            onInput={event => change('name', event.currentTarget.value)}
          />
        </Field>
        <Field id="quick-phone" label="Telefon" error={errors.phone}>
          <input
            id="quick-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={describedBy('quick-phone', errors.phone)}
            onInput={event => change('phone', event.currentTarget.value)}
          />
        </Field>
        <Field id="quick-car" label="Marka i rocznik auta" error={errors.car}>
          <input
            id="quick-car"
            type="text"
            value={values.car}
            aria-invalid={errors.car ? 'true' : undefined}
            aria-describedby={describedBy('quick-car', errors.car)}
            onInput={event => change('car', event.currentTarget.value)}
          />
        </Field>
        <Field id="quick-service" label="Czego dotyczy" error={errors.service}>
          <select
            id="quick-service"
            value={values.service}
            aria-invalid={errors.service ? 'true' : undefined}
            aria-describedby={describedBy('quick-service', errors.service)}
            onChange={event => change('service', event.currentTarget.value)}>
            <option value="">Wybierz usługę</option>
            {services.map(item => (
              <option value={item.slug}>{item.name}</option>
            ))}
            <option value={otherRepair.slug}>{otherRepair.name}</option>
          </select>
        </Field>
      </div>
      <div class="send-row">
        <button type="submit" class="send">
          Wyślij zlecenie
        </button>
        <a class="call-alt" href={business.phoneHref}>
          Wolisz zadzwonić? {business.phone}
        </a>
      </div>
      <p class="form-note">{hasErrors ? 'Popraw zaznaczone pola i wyślij jeszcze raz.' : ''}</p>
    </form>
  );
}
