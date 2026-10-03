import { validateContact, type ContactErrors, type ContactField } from '../lib/validate';

const root = document.querySelector<HTMLElement>('[data-contact]');
const form = root?.querySelector<HTMLFormElement>('[data-contact-form]');
const summary = root?.querySelector<HTMLElement>('[data-contact-summary]');
const summaryList = root?.querySelector<HTMLElement>('[data-contact-summary-list]');
const success = root?.querySelector<HTMLElement>('[data-contact-success]');
const successTitle = root?.querySelector<HTMLElement>('[data-contact-success-title]');
const successText = root?.querySelector<HTMLElement>('[data-contact-success-text]');
const reset = root?.querySelector<HTMLButtonElement>('[data-contact-reset]');

const fieldIds: Record<ContactField, string> = {
  name: 'contact-name',
  phone: 'contact-phone',
  email: 'contact-email',
  topic: 'contact-topic',
  consent: 'contact-consent',
};

const fieldOrder: readonly ContactField[] = ['name', 'phone', 'email', 'topic', 'consent'];

const timeLabels: Record<string, string> = {
  any: 'w dowolnej porze',
  morning: 'rano, między 8 a 12',
  afternoon: 'po południu, między 12 a 16',
  evening: 'wieczorem, między 16 a 20',
};

const control = (field: ContactField) =>
  form?.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${field}"]`) ?? null;

const readFields = () => {
  const data = new FormData(form ?? undefined);
  return {
    name: String(data.get('name') ?? ''),
    phone: String(data.get('phone') ?? ''),
    email: String(data.get('email') ?? ''),
    topic: String(data.get('topic') ?? ''),
    consent: data.get('consent') === 'on',
  };
};

const showErrors = (errors: ContactErrors) => {
  if (!form || !summary || !summaryList) return;
  summaryList.replaceChildren();
  fieldOrder.forEach(field => {
    const message = errors[field];
    const target = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    const input = control(field);
    if (target) {
      target.textContent = message ?? '';
      target.hidden = !message;
    }
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
    if (message) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${fieldIds[field]}`;
      link.textContent = message;
      link.addEventListener('click', event => {
        event.preventDefault();
        input?.focus();
      });
      item.append(link);
      summaryList.append(item);
    }
  });
  summary.hidden = Object.keys(errors).length === 0;
};

if (root && form && summary && success && successTitle && successText && reset) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = readFields();
    const errors = validateContact(fields);
    showErrors(errors);
    if (Object.keys(errors).length > 0) {
      summary.focus();
      return;
    }
    const time = String(new FormData(form).get('time') ?? 'any');
    successTitle.textContent = `Dziękujemy, ${fields.name.trim()}`;
    successText.textContent = `Oddzwonimy na numer ${fields.phone.trim()} ${timeLabels[time] ?? timeLabels.any}.`;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  form.addEventListener('input', event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const field = target.name as ContactField;
    if (target.getAttribute('aria-invalid') !== 'true') return;
    const errors = validateContact(readFields());
    if (!errors[field]) {
      const message = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      if (message) {
        message.textContent = '';
        message.hidden = true;
      }
      target.removeAttribute('aria-invalid');
    }
  });

  reset.addEventListener('click', () => {
    form.reset();
    showErrors({});
    success.hidden = true;
    form.hidden = false;
    control('name')?.focus();
  });
}
