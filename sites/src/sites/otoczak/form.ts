import { errorSummary, validateContact, type ContactField, type ContactValues } from './contact';

const FIELD_ORDER: readonly ContactField[] = ['name', 'email', 'message', 'consent'];

type Control = HTMLInputElement | HTMLTextAreaElement;

const isControl = (element: unknown): element is Control =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  const status = form?.querySelector<HTMLElement>('[data-form-status]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const reset = success?.querySelector<HTMLButtonElement>('[data-form-reset]');
  if (!form || !status || !success) return;

  let attempted = false;

  const control = (field: ContactField) => {
    const element = form.elements.namedItem(field);
    return isControl(element) ? element : undefined;
  };

  const readValues = (): ContactValues => {
    const consent = form.elements.namedItem('consent');
    return {
      name: control('name')?.value ?? '',
      email: control('email')?.value ?? '',
      message: control('message')?.value ?? '',
      consent: consent instanceof HTMLInputElement && consent.checked,
    };
  };

  const showError = (field: ContactField, message: string | undefined) => {
    const input = control(field);
    const output = form.querySelector<HTMLElement>(`[data-error="${field}"]`);
    if (!input || !output) return;
    output.textContent = message ?? '';
    output.hidden = message === undefined;
    if (message === undefined) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
  };

  const announce = (message: string) => {
    status.textContent = '';
    window.requestAnimationFrame(() => {
      status.textContent = message;
    });
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    const errors = validateContact(readValues());
    FIELD_ORDER.forEach(field => showError(field, errors[field]));
    const invalid = FIELD_ORDER.filter(field => errors[field] !== undefined);
    if (invalid.length > 0) {
      announce(errorSummary(invalid.length));
      const first = invalid[0];
      if (first) control(first)?.focus();
      return;
    }
    status.textContent = '';
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  const revalidate = (field: ContactField) => {
    if (!attempted) return;
    showError(field, validateContact(readValues())[field]);
    const remaining = FIELD_ORDER.filter(
      name => control(name)?.getAttribute('aria-invalid') === 'true',
    ).length;
    const summary = remaining === 0 ? '' : errorSummary(remaining);
    if (status.textContent !== summary) status.textContent = summary;
  };

  FIELD_ORDER.forEach(field => {
    const input = control(field);
    input?.addEventListener('input', () => revalidate(field));
    input?.addEventListener('change', () => revalidate(field));
    input?.addEventListener('blur', () => revalidate(field));
  });

  reset?.addEventListener('click', () => {
    form.reset();
    attempted = false;
    FIELD_ORDER.forEach(field => showError(field, undefined));
    success.hidden = true;
    form.hidden = false;
    control('name')?.focus();
  });
}
