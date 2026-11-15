import { useState } from 'preact/hooks';
import { matterLabel, matterOptions } from '../data/form';
import { firm, sampleNotice } from '../data/site';
import {
  ErrorSummary,
  DonePanel,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/FormParts';
import {
  contactFieldOrder,
  emptyContact,
  firstErrorField,
  validateContact,
} from '../lib/validation';
import type { ContactErrors, ContactField, ContactValues } from '../lib/validation';

const fieldIds: Record<ContactField, string> = {
  name: 'f-name',
  contact: 'f-contact',
  matter: 'f-matter',
  message: 'f-msg',
};

export const ContactForm = () => {
  const [values, setValues] = useState<ContactValues>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState<ContactValues | null>(null);

  const set = (field: ContactField, value: string): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setSent(values);
  };

  const startOver = (): void => {
    setValues(emptyContact);
    setErrors({});
    setSent(null);
  };

  if (sent) {
    return (
      <DonePanel>
        <h3>Dziękujemy, {sent.name.trim()}.</h3>
        <p class="form-done-text">
          {sampleNotice} W prawdziwej kancelarii odpowiedzielibyśmy na {sent.contact.trim()} w ciągu
          jednego dnia roboczego.
        </p>
        <dl>
          <div>
            <dt>Rodzaj sprawy</dt>
            <dd>{matterLabel(sent.matter)}</dd>
          </div>
          <div>
            <dt>Kontakt</dt>
            <dd>{sent.contact.trim()}</dd>
          </div>
          <div>
            <dt>Opis</dt>
            <dd>{sent.message.trim()}</dd>
          </div>
        </dl>
        <button type="button" class="again" onClick={startOver}>
          Wypełnij formularz od nowa
        </button>
      </DonePanel>
    );
  }

  const items = contactFieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: fieldIds[field], message: errors[field] ?? '' }));

  return (
    <form class="form" onSubmit={onSubmit} noValidate aria-label="Formularz kontaktowy">
      <ErrorSummary items={items} focusSignal={firstErrorField(errors) ? attempt : 0} />
      <TextField
        id={fieldIds.name}
        label="Imię i nazwisko"
        value={values.name}
        autocomplete="name"
        error={errors.name}
        onInput={value => set('name', value)}
      />
      <TextField
        id={fieldIds.contact}
        label="Telefon lub e-mail"
        value={values.contact}
        autocomplete="off"
        error={errors.contact}
        onInput={value => set('contact', value)}
      />
      <SelectField
        id={fieldIds.matter}
        label="Rodzaj sprawy"
        value={values.matter}
        placeholder="Wybierz rodzaj sprawy"
        options={matterOptions}
        error={errors.matter}
        onChange={value => set('matter', value)}
      />
      <TextAreaField
        id={fieldIds.message}
        label="Opisz krótko, o co chodzi"
        value={values.message}
        error={errors.message}
        onInput={value => set('message', value)}
      />
      <button type="submit" class="send">
        Wyślij wiadomość
      </button>
      <p class="form-fallback">
        Formularz nie działa albo wolisz mówić? Zadzwoń pod numer{' '}
        <a href={firm.phone.href}>{firm.phone.display}</a> albo napisz na{' '}
        <a href={`mailto:${firm.email}`}>{firm.email}</a>.
      </p>
    </form>
  );
};

export default ContactForm;
