import { arrivalWindows, maxNotesLength } from '../../lib/guest';
import type { ArrivalWindow, FieldProblem } from '../../lib/guest';
import { flowErrors } from '../../lib/flow';
import { Field } from '../Field';
import type { StepProps } from './types';

interface Props extends StepProps {
  attempted: boolean;
  summaryRef: { current: HTMLDivElement | null };
}

const guestFieldIds = {
  name: 'guest-name',
  email: 'guest-email',
  phone: 'guest-phone',
  notes: 'guest-notes',
};
const invoiceFieldIds = {
  company: 'invoice-company',
  nip: 'invoice-nip',
  street: 'invoice-street',
  postalCode: 'invoice-postal-code',
  city: 'invoice-city',
};

export const GuestStep = ({ text, state, update, attempted, summaryRef }: Props) => {
  const copy = text.guest;
  const errors = flowErrors(state);
  const message = (problem: FieldProblem | undefined): string | undefined =>
    attempted && problem ? copy.errors[problem] : undefined;
  const setGuest = (change: Partial<typeof state.guest>): void =>
    update(current => ({ ...current, guest: { ...current.guest, ...change } }));
  const setInvoice = (change: Partial<typeof state.invoice>): void =>
    update(current => ({ ...current, invoice: { ...current.invoice, ...change } }));

  const summaryItems: { id: string; label: string; message: string }[] = [];
  if (attempted) {
    const labels = {
      name: copy.name,
      email: copy.email,
      phone: copy.phone,
      notes: copy.notes,
      company: copy.company,
      nip: copy.nip,
      street: copy.street,
      postalCode: copy.postalCode,
      city: copy.city,
    };
    for (const [key, problem] of Object.entries(errors.guest)) {
      const id = guestFieldIds[key as keyof typeof guestFieldIds];
      summaryItems.push({
        id,
        label: labels[key as keyof typeof labels],
        message: copy.errors[problem],
      });
    }
    for (const [key, problem] of Object.entries(errors.invoice)) {
      const id = invoiceFieldIds[key as keyof typeof invoiceFieldIds];
      summaryItems.push({
        id,
        label: labels[key as keyof typeof labels],
        message: copy.errors[problem],
      });
    }
  }

  return (
    <div class="step-body">
      <p class="step-lead">{copy.lead}</p>
      {summaryItems.length > 0 ? (
        <div class="error-summary" tabIndex={-1} ref={summaryRef} role="alert">
          <h3>{copy.errorSummary}</h3>
          <ul>
            {summaryItems.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={event => {
                    event.preventDefault();
                    document.getElementById(item.id)?.focus();
                  }}>
                  {item.label}: {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div class="form-grid">
        <Field
          id={guestFieldIds.name}
          label={copy.name}
          value={state.guest.name}
          autoComplete="name"
          error={message(errors.guest.name)}
          onInput={name => setGuest({ name })}
        />
        <Field
          id={guestFieldIds.email}
          label={copy.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={state.guest.email}
          error={message(errors.guest.email)}
          onInput={email => setGuest({ email })}
        />
        <Field
          id={guestFieldIds.phone}
          label={copy.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint={copy.phoneHint}
          value={state.guest.phone}
          error={message(errors.guest.phone)}
          onInput={phone => setGuest({ phone })}
        />
        <div class="field">
          <label for="guest-window">{copy.arrivalWindow}</label>
          <select
            id="guest-window"
            name="guest-window"
            aria-describedby="guest-window-hint"
            value={state.guest.arrivalWindow}
            onChange={event =>
              setGuest({ arrivalWindow: event.currentTarget.value as ArrivalWindow })
            }>
            {arrivalWindows.map(option => (
              <option value={option} key={option}>
                {copy.windows[option]}
              </option>
            ))}
          </select>
          <p class="hint" id="guest-window-hint">
            {copy.arrivalWindowHint}
          </p>
        </div>
        <Field
          id={guestFieldIds.notes}
          label={copy.notes}
          optionalLabel={copy.optional}
          hint={copy.notesHint}
          multiline
          value={state.guest.notes}
          error={message(errors.guest.notes)}
          onInput={notes => setGuest({ notes })}
          extra={
            <p class="hint count">{copy.notesCount(state.guest.notes.length, maxNotesLength)}</p>
          }
        />
      </div>
      <label class="check invoice-toggle">
        <input
          type="checkbox"
          checked={state.wantsInvoice}
          aria-controls="invoice-fields"
          aria-expanded={state.wantsInvoice}
          onChange={event => {
            const wantsInvoice = event.currentTarget.checked;
            update(current => ({ ...current, wantsInvoice }));
          }}
        />
        <span>{copy.invoiceToggle}</span>
      </label>
      <div id="invoice-fields" hidden={!state.wantsInvoice}>
        {state.wantsInvoice ? (
          <fieldset class="invoice">
            <legend>{copy.invoiceHeading}</legend>
            <div class="form-grid">
              <Field
                id={invoiceFieldIds.company}
                label={copy.company}
                autoComplete="organization"
                value={state.invoice.company}
                error={message(errors.invoice.company)}
                onInput={company => setInvoice({ company })}
              />
              <Field
                id={invoiceFieldIds.nip}
                label={copy.nip}
                hint={copy.nipHint}
                inputMode="numeric"
                value={state.invoice.nip}
                error={message(errors.invoice.nip)}
                onInput={nip => setInvoice({ nip })}
              />
              <Field
                id={invoiceFieldIds.street}
                label={copy.street}
                autoComplete="street-address"
                value={state.invoice.street}
                error={message(errors.invoice.street)}
                onInput={street => setInvoice({ street })}
              />
              <Field
                id={invoiceFieldIds.postalCode}
                label={copy.postalCode}
                hint={copy.postalHint}
                autoComplete="postal-code"
                inputMode="numeric"
                value={state.invoice.postalCode}
                error={message(errors.invoice.postalCode)}
                onInput={postalCode => setInvoice({ postalCode })}
              />
              <Field
                id={invoiceFieldIds.city}
                label={copy.city}
                autoComplete="address-level2"
                value={state.invoice.city}
                error={message(errors.invoice.city)}
                onInput={city => setInvoice({ city })}
              />
            </div>
          </fieldset>
        ) : null}
      </div>
    </div>
  );
};
