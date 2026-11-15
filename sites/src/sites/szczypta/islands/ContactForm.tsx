import { useEffect, useRef, useState } from 'preact/hooks';
import { contactCopy } from '../copy/contact';

type Field = 'name' | 'email' | 'message';

interface Values {
  name: string;
  email: string;
  message: string;
}

const fieldOrder: Field[] = ['name', 'email', 'message'];

const validate = (values: Values): Partial<Record<Field, string>> => {
  const errors = contactCopy.form.errors;
  const found: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) found.name = errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) found.email = errors.email;
  if (values.message.trim().length < 5) found.message = errors.message;
  return found;
};

export const ContactForm = () => {
  const copy = contactCopy.form;
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (field: Field, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const submit = (event: Event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setAttempt(0);
      setDone(true);
      return;
    }
    setAttempt(count => count + 1);
  };

  const again = () => {
    setValues({ name: '', email: '', message: '' });
    setErrors({});
    setAttempt(0);
    setDone(false);
    window.requestAnimationFrame(() => nameRef.current?.focus());
  };

  if (done) {
    return (
      <div class="form-done" ref={doneRef} tabIndex={-1}>
        <h2>{copy.done.title}</h2>
        <p>{copy.done.text}</p>
        <p>
          <button type="button" class="again" onClick={again}>
            {copy.done.again}
          </button>
        </p>
      </div>
    );
  }

  const failed = fieldOrder.filter(field => errors[field]);

  return (
    <form class="contact-form" noValidate onSubmit={submit}>
      <h2>{copy.title}</h2>
      {failed.length > 0 && (
        <div class="error-summary" ref={summaryRef} tabIndex={-1} role="alert">
          <h3>{copy.summaryTitle}</h3>
          <ul>
            {failed.map(field => (
              <li key={field}>
                <a href={`#contact-${field}`}>{errors[field]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div class="f">
        <label for="contact-name">{copy.name}</label>
        <input
          id="contact-name"
          type="text"
          autoComplete="given-name"
          ref={nameRef}
          value={values.name}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          onInput={event => set('name', (event.currentTarget as HTMLInputElement).value)}
        />
        {errors.name && (
          <p class="f-error" id="contact-name-error">
            {errors.name}
          </p>
        )}
      </div>
      <div class="f">
        <label for="contact-email">{copy.email}</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          onInput={event => set('email', (event.currentTarget as HTMLInputElement).value)}
        />
        {errors.email && (
          <p class="f-error" id="contact-email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div class="f">
        <label for="contact-message">{copy.message}</label>
        <textarea
          id="contact-message"
          value={values.message}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          onInput={event => set('message', (event.currentTarget as HTMLTextAreaElement).value)}
        />
        {errors.message && (
          <p class="f-error" id="contact-message-error">
            {errors.message}
          </p>
        )}
      </div>
      <button class="send" type="submit">
        {copy.send}
      </button>
    </form>
  );
};

export default ContactForm;
