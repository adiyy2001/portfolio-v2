import { useState } from 'preact/hooks';
import { business, sampleNotice } from '../data/business';
import { firstErrorField, validateContact } from '../lib/validation';
import type { ContactValues, Errors } from '../lib/validation';
import {
  ErrorSummary,
  FormDone,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/FormParts';

type Field = keyof ContactValues;

const topics = [
  { value: 'oferta', label: 'Pytanie o ofertę z katalogu' },
  { value: 'sprzedaz', label: 'Chcę sprzedać mieszkanie' },
  { value: 'kupno', label: 'Szukam mieszkania do kupna' },
  { value: 'inne', label: 'Coś innego' },
];

const fieldOrder: Field[] = ['name', 'email', 'topic', 'message'];
const blank: ContactValues = { name: '', email: '', topic: 'oferta', message: '' };

export const ContactForm = () => {
  const [values, setValues] = useState<ContactValues>(blank);
  const [errors, setErrors] = useState<Errors<ContactValues>>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<ContactValues | null>(null);

  const set = (field: Field, value: string): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(values);
  };

  if (done) {
    return (
      <FormDone
        title={`Dziękujemy, ${done.name.trim()}.`}
        resetLabel="Napisz kolejną wiadomość"
        onReset={() => {
          setDone(null);
          setValues(blank);
        }}>
        <p>{sampleNotice}</p>
        <p>
          Odpisalibyśmy na adres {done.email.trim()} w dzień roboczy. Pilna sprawa? Zadzwoń:{' '}
          {business.phone}.
        </p>
      </FormDone>
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
      <button type="submit" class="form-btn">
        Wyślij wiadomość
      </button>
    </form>
  );
};

export default ContactForm;
