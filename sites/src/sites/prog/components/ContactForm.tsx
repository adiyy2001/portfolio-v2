import { useRef, useState } from 'preact/hooks';
import {
  contactFieldOrder,
  contactTopics,
  emptyContact,
  validateContact,
  type ContactField,
  type ContactValues,
} from '../lib/contact-form';
import type { ErrorMap } from '../lib/validation';
import { Icon } from './Icon';

const fieldId = (field: ContactField): string => `contact-${field}`;

const FieldError = ({ field, text }: { field: ContactField; text: string }) => (
  <p class="field-error" id={`${fieldId(field)}-error`}>
    <Icon name="alert" size={16} />
    <span>{text}</span>
  </p>
);

export const ContactForm = () => {
  const [values, setValues] = useState<ContactValues>(emptyContact);
  const [errors, setErrors] = useState<ErrorMap<ContactField>>({});
  const [sentName, setSentName] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) =>
    setValues(current => ({ ...current, [key]: value }));

  const describe = (field: ContactField): string | undefined =>
    errors[field] ? `${fieldId(field)}-error` : undefined;
  const invalid = (field: ContactField): 'true' | undefined => (errors[field] ? 'true' : undefined);

  const submit = (event: Event) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (contactFieldOrder.some(field => found[field])) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSentName(values.name.trim());
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const reset = () => {
    setValues(emptyContact);
    setErrors({});
    setSentName(null);
  };

  if (sentName !== null) {
    return (
      <div class="success-panel" tabIndex={-1} ref={successRef} role="status">
        <h3>Dziękujemy, {sentName}.</h3>
        <p>Odpowiadamy w dni robocze, zwykle jeszcze tego samego dnia.</p>
        <p>
          <strong>To strona przykładowa, więc nic nie zostało wysłane.</strong>
        </p>
        <button type="button" class="btn btn-quiet" onClick={reset}>
          Napisz jeszcze raz
        </button>
      </div>
    );
  }

  const entries = contactFieldOrder.flatMap(field => {
    const text = errors[field];
    return text ? [{ field, text }] : [];
  });

  return (
    <form class="contact-form" noValidate onSubmit={submit}>
      {entries.length > 0 && (
        <div class="error-summary" tabIndex={-1} ref={summaryRef} role="alert">
          <h3>Formularz wymaga poprawek</h3>
          <ul>
            {entries.map(entry => (
              <li key={entry.field}>
                <a href={`#${fieldId(entry.field)}`}>{entry.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div class="field">
        <label for={fieldId('topic')}>Czego dotyczy wiadomość</label>
        <select
          id={fieldId('topic')}
          class="select"
          value={values.topic}
          aria-invalid={invalid('topic')}
          aria-describedby={describe('topic')}
          onChange={event => set('topic', event.currentTarget.value as ContactValues['topic'])}>
          <option value="">Wybierz z listy</option>
          {contactTopics.map(topic => (
            <option value={topic.value} key={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        {errors.topic && <FieldError field="topic" text={errors.topic} />}
      </div>
      <div class="contact-pair">
        <div class="field">
          <label for={fieldId('name')}>Imię i nazwisko</label>
          <input
            id={fieldId('name')}
            class="input"
            type="text"
            autoComplete="name"
            value={values.name}
            aria-invalid={invalid('name')}
            aria-describedby={describe('name')}
            onInput={event => set('name', event.currentTarget.value)}
          />
          {errors.name && <FieldError field="name" text={errors.name} />}
        </div>
        <div class="field">
          <label for={fieldId('phone')}>Telefon</label>
          <input
            id={fieldId('phone')}
            class="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            aria-invalid={invalid('phone')}
            aria-describedby={describe('phone')}
            onInput={event => set('phone', event.currentTarget.value)}
          />
          {errors.phone && <FieldError field="phone" text={errors.phone} />}
        </div>
      </div>
      <div class="field">
        <label for={fieldId('email')}>E-mail (opcjonalnie)</label>
        <input
          id={fieldId('email')}
          class="input"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={invalid('email')}
          aria-describedby={describe('email')}
          onInput={event => set('email', event.currentTarget.value)}
        />
        {errors.email && <FieldError field="email" text={errors.email} />}
      </div>
      <div class="field">
        <label for={fieldId('message')}>Wiadomość</label>
        <textarea
          id={fieldId('message')}
          class="textarea"
          value={values.message}
          aria-invalid={invalid('message')}
          aria-describedby={describe('message')}
          onInput={event => set('message', event.currentTarget.value)}
        />
        {errors.message && <FieldError field="message" text={errors.message} />}
      </div>
      <div class="field">
        <label class="check">
          <input
            id={fieldId('consent')}
            type="checkbox"
            checked={values.consent}
            aria-invalid={invalid('consent')}
            aria-describedby={describe('consent')}
            onChange={event => set('consent', event.currentTarget.checked)}
          />
          <span class="box" aria-hidden="true" />
          <span class="check-text">
            Zgadzam się, żeby biuro Próg odpowiedziało na moją wiadomość.
          </span>
        </label>
        {errors.consent && <FieldError field="consent" text={errors.consent} />}
      </div>
      <button type="submit" class="btn btn-primary">
        Wyślij wiadomość <Icon name="arrow" size={18} />
      </button>
      <p class="field-hint">
        Formularz nie ma zaplecza: po wysłaniu zobaczysz tylko potwierdzenie, bez wysyłki.
      </p>
    </form>
  );
};

export default ContactForm;
