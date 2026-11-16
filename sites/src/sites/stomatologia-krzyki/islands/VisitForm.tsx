import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { clinic, formTopics, sampleStatus } from '../data/site';
import { validateVisit } from '../lib/validation';
import type { VisitErrors } from '../lib/validation';

interface Props {
  idPrefix: string;
  formId?: string;
}

const arrow = (
  <svg viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M2 9h13M10 4l5 5-5 5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const VisitForm = ({ idPrefix, formId }: Props) => {
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<VisitErrors>({});
  const [status, setStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
    const topic = new URLSearchParams(window.location.search).get('temat');
    const select = formRef.current?.elements.namedItem(`${idPrefix}-topic`);
    if (topic && select instanceof HTMLSelectElement) {
      if ((formTopics as readonly string[]).includes(topic)) select.value = topic;
    }
  }, []);

  const onSubmit = (event: Event) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const read = (field: string) => {
      const element = form.elements.namedItem(`${idPrefix}-${field}`);
      return element instanceof HTMLInputElement || element instanceof HTMLSelectElement
        ? element.value
        : '';
    };
    const found = validateVisit({ name: read('name'), phone: read('phone'), topic: read('topic') });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('');
      const first = Object.keys(found)[0];
      const field = form.elements.namedItem(`${idPrefix}-${first}`);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    form.reset();
    setStatus(sampleStatus);
    statusRef.current?.focus();
  };

  const id = (name: string) => `${idPrefix}-${name}`;
  const invalid = (name: keyof VisitErrors) => (errors[name] ? 'true' : undefined);
  const describedBy = (name: keyof VisitErrors) => (errors[name] ? id(`${name}-error`) : undefined);

  return (
    <form
      class="form"
      id={formId}
      ref={formRef}
      action={link('/stomatologia-krzyki/wyslano/')}
      method="get"
      noValidate={ready}
      onSubmit={onSubmit}>
      <div class="field">
        <label for={id('name')}>Imię</label>
        <input
          id={id('name')}
          type="text"
          autocomplete="given-name"
          required
          aria-invalid={invalid('name')}
          aria-describedby={describedBy('name')}
        />
        {errors.name && (
          <p class="field-error" id={id('name-error')}>
            {errors.name}
          </p>
        )}
      </div>
      <div class="field">
        <label for={id('phone')}>Telefon</label>
        <input
          id={id('phone')}
          type="tel"
          autocomplete="tel"
          required
          aria-invalid={invalid('phone')}
          aria-describedby={describedBy('phone')}
        />
        {errors.phone && (
          <p class="field-error" id={id('phone-error')}>
            {errors.phone}
          </p>
        )}
      </div>
      <div class="field field-wide">
        <label for={id('topic')}>Czego dotyczy</label>
        <select
          id={id('topic')}
          aria-invalid={invalid('topic')}
          aria-describedby={describedBy('topic')}>
          {formTopics.map(topic => (
            <option value={topic}>{topic}</option>
          ))}
        </select>
        {errors.topic && (
          <p class="field-error" id={id('topic-error')}>
            {errors.topic}
          </p>
        )}
      </div>
      <p class="consent-note field-wide">
        Podany numer służy wyłącznie do oddzwonienia w sprawie wizyty. Zgodę na to wyrażasz,
        wysyłając formularz.
      </p>
      <div class="form-foot field-wide">
        <button class="pill pill-navy" type="submit">
          Poproś o telefon
          {arrow}
        </button>
      </div>
      <div class="form-status" role="status" aria-live="polite" tabIndex={-1} ref={statusRef}>
        {status}
      </div>
      <p class="form-fallback field-wide">
        Wolisz od razu? Zadzwoń: <a href={clinic.phoneHref}>{clinic.phoneDisplay}</a>.
      </p>
    </form>
  );
};

export default VisitForm;
