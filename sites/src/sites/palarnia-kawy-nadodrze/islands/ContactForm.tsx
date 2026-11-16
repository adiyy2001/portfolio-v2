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
  { value: 'zamowienie', label: 'Zamówienie albo odbiór' },
  { value: 'kawa', label: 'Pytanie o kawę lub parzenie' },
  { value: 'abonament', label: 'Abonament' },
  { value: 'firma', label: 'Kawa do biura albo kawiarni' },
  { value: 'inne', label: 'Coś innego' },
];

const fieldOrder: ContactField[] = ['name', 'email', 'topic', 'message'];

const initial: ContactValues = { name: '', email: '', topic: 'zamowienie', message: '' };

export const ContactForm = () => {
  const [values, setValues] = useState<ContactValues>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState(false);

  const set = <K extends ContactField>(field: K, value: ContactValues[K]): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div class="sub-done">
        <SuccessNotice>
          <p>
            <strong>{sampleNotice}</strong>
          </p>
          <p>
            Tak wyglądałoby potwierdzenie: wiadomość od {values.name.trim()} trafiłaby do palarni, a
            odpowiedź na adres {values.email.trim()}.
          </p>
        </SuccessNotice>
        <button
          type="button"
          class="btn btn--ghost"
          onClick={() => {
            setValues(initial);
            setSent(false);
          }}>
          Napisz kolejną wiadomość
        </button>
      </div>
    );
  }

  const summaryItems = fieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: field, message: errors[field] ?? '' }));
  const firstError = firstErrorField(errors, fieldOrder);

  return (
    <form class="contact-form" onSubmit={onSubmit} noValidate>
      <ErrorSummary items={summaryItems} focusSignal={firstError ? attempt : 0} />
      <div class="cform__grid">
        <TextField
          id="name"
          label="Imię"
          value={values.name}
          autocomplete="given-name"
          error={errors.name}
          onInput={value => set('name', value)}
        />
        <TextField
          id="email"
          label="Adres e-mail"
          type="email"
          value={values.email}
          autocomplete="email"
          error={errors.email}
          onInput={value => set('email', value)}
        />
      </div>
      <SelectField
        id="topic"
        label="Czego dotyczy wiadomość"
        value={values.topic}
        options={topics}
        onChange={value => set('topic', value)}
      />
      <TextAreaField
        id="message"
        label="Wiadomość"
        value={values.message}
        error={errors.message}
        onInput={value => set('message', value)}
      />
      <button type="submit" class="btn">
        Wyślij wiadomość
      </button>
      <p class="cform__small">{sampleNotice}</p>
    </form>
  );
};

export default ContactForm;
