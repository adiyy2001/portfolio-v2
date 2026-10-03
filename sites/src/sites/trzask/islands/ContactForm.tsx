import { useState } from 'preact/hooks';
import { sampleNotice } from '../data/site';
import { firstErrorField, validateContact } from '../lib/validation';
import type { ContactErrors, ContactField, ContactValues } from '../lib/validation';
import {
  ErrorSummary,
  SelectField,
  SuccessNotice,
  TextAreaField,
  TextField,
} from '../components/FormParts';

const topics = [
  { value: 'zamowienie', label: 'Pytanie o zamówienie' },
  { value: 'kawa', label: 'Pomoc w wyborze kawy' },
  { value: 'hurt', label: 'Kawa dla firmy albo kawiarni' },
  { value: 'inne', label: 'Coś innego' },
];

const fieldOrder: ContactField[] = ['name', 'email', 'topic', 'message'];

export const ContactForm = () => {
  const [values, setValues] = useState<ContactValues>({
    name: '',
    email: '',
    topic: 'zamowienie',
    message: '',
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);

  const set = (field: ContactField, value: string): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(true);
  };

  if (done) {
    return (
      <SuccessNotice>
        <strong>{values.name}, dziękujemy za wiadomość.</strong> {sampleNotice} W&nbsp;prawdziwym
        sklepie odpisalibyśmy na {values.email} w&nbsp;ciągu jednego dnia roboczego.
      </SuccessNotice>
    );
  }

  const items = fieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: `contact-${field}`, message: errors[field] ?? '' }));

  return (
    <form onSubmit={onSubmit} noValidate>
      <ErrorSummary items={items} focusSignal={firstErrorField(errors, fieldOrder) ? attempt : 0} />
      <TextField
        id="contact-name"
        label="Imię"
        value={values.name}
        autocomplete="given-name"
        error={errors.name}
        onInput={value => set('name', value)}
      />
      <TextField
        id="contact-email"
        label="Adres e-mail"
        type="email"
        value={values.email}
        autocomplete="email"
        error={errors.email}
        onInput={value => set('email', value)}
      />
      <SelectField
        id="contact-topic"
        label="Temat"
        value={values.topic}
        options={topics}
        onChange={value => set('topic', value)}
      />
      <TextAreaField
        id="contact-message"
        label="Wiadomość"
        value={values.message}
        error={errors.message}
        onInput={value => set('message', value)}
      />
      <button type="submit" class="btn btn--lime">
        Wyślij wiadomość
      </button>
    </form>
  );
};

export default ContactForm;
