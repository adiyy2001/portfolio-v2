import { useEffect, useState } from 'preact/hooks';
import { business, contactNotice } from '../data/site';
import { firstErrorKey, validateContact } from '../lib/validation';
import type { ContactErrors, ContactValues } from '../lib/validation';
import { Field, describedBy } from './fields';

const empty: ContactValues = { name: '', email: '', topic: '', message: '' };
const order: Array<keyof ContactValues> = ['name', 'email', 'topic', 'message'];
const topics = ['Wycena naprawy', 'Umówiony termin', 'Karta auta i protokół', 'Inna sprawa'];

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sentTopic, setSentTopic] = useState<string | null>(null);

  useEffect(() => {
    if (sentTopic) document.getElementById('contact-done')?.focus();
  }, [sentTopic]);

  const change = (key: keyof ContactValues, value: string): void => {
    setValues({ ...values, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    const first = firstErrorKey(found, order);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setSentTopic(values.topic);
    setValues(empty);
  };

  if (sentTopic) {
    return (
      <div class="confirm" id="contact-done" tabindex={-1}>
        <h2 class="confirm-h">Wiadomość przyjęta</h2>
        <p>Temat: {sentTopic}. W prawdziwym warsztacie odpisalibyśmy w godzinach przyjęć.</p>
        <p class="confirm-sample">{contactNotice}</p>
        <div class="send-row">
          <button type="button" class="send" onClick={() => setSentTopic(null)}>
            Nowa wiadomość
          </button>
          <a class="call-alt" href={business.phoneHref}>
            Wolisz zadzwonić? {business.phone}
          </a>
        </div>
      </div>
    );
  }

  const hasErrors = order.some(key => errors[key]);

  return (
    <form class="contact-form" noValidate onSubmit={submit} aria-label="Wiadomość do warsztatu">
      <div class="fields fields-2">
        <Field id="contact-name" label="Imię" error={errors.name}>
          <input
            id="contact-name"
            type="text"
            autoComplete="given-name"
            value={values.name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={describedBy('contact-name', errors.name)}
            onInput={event => change('name', event.currentTarget.value)}
          />
        </Field>
        <Field id="contact-email" label="Adres e-mail" error={errors.email}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={describedBy('contact-email', errors.email)}
            onInput={event => change('email', event.currentTarget.value)}
          />
        </Field>
        <Field id="contact-topic" label="Temat" error={errors.topic}>
          <select
            id="contact-topic"
            value={values.topic}
            aria-invalid={errors.topic ? 'true' : undefined}
            aria-describedby={describedBy('contact-topic', errors.topic)}
            onChange={event => change('topic', event.currentTarget.value)}>
            <option value="">Wybierz temat</option>
            {topics.map(topic => (
              <option value={topic}>{topic}</option>
            ))}
          </select>
        </Field>
        <Field id="contact-message" label="Wiadomość" error={errors.message}>
          <textarea
            id="contact-message"
            rows={5}
            value={values.message}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={describedBy('contact-message', errors.message)}
            onInput={event => change('message', event.currentTarget.value)}
          />
        </Field>
      </div>
      <div class="send-row">
        <button type="submit" class="send">
          Wyślij wiadomość
        </button>
        <a class="call-alt" href={business.phoneHref}>
          Wolisz zadzwonić? {business.phone}
        </a>
      </div>
      <p class="form-note">{hasErrors ? 'Popraw zaznaczone pola i wyślij jeszcze raz.' : ''}</p>
    </form>
  );
}
