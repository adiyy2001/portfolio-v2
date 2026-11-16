import {
  firstInvalidField,
  parseQuoteParams,
  quoteFieldOrder,
  validateQuote,
  type QuoteField,
  type QuoteValues,
} from '../lib/validation';
import { facts } from '../data/site';
import { plans } from '../data/plans';
import { find, make } from './dom';

type FieldElement = HTMLInputElement | HTMLSelectElement;

export const setupQuoteForm = (): void => {
  const form = find(document, '#wycena-form', HTMLFormElement);
  const done = find(document, '#qf-done', HTMLElement);
  const doneList = find(done, 'dl', HTMLElement);
  const reset = find(done, 'button', HTMLButtonElement);
  const submit = find(form, 'button[type="submit"]', HTMLButtonElement);
  const consentField = find(form, '#qf-consent', HTMLInputElement);
  const fields: Record<QuoteField, FieldElement> = {
    email: find(form, '#qf-email', HTMLInputElement),
    forma: find(form, '#qf-forma', HTMLSelectElement),
    faktur: find(form, '#qf-faktur', HTMLInputElement),
    name: find(form, '#qf-name', HTMLInputElement),
    phone: find(form, '#qf-phone', HTMLInputElement),
    consent: consentField,
  };
  const messages: Record<QuoteField, HTMLElement> = {
    email: find(form, '#qf-err-email', HTMLElement),
    forma: find(form, '#qf-err-forma', HTMLElement),
    faktur: find(form, '#qf-err-faktur', HTMLElement),
    name: find(form, '#qf-err-name', HTMLElement),
    phone: find(form, '#qf-err-phone', HTMLElement),
    consent: find(form, '#qf-err-consent', HTMLElement),
  };
  form.noValidate = true;

  const prefill = parseQuoteParams(window.location.search);
  if (prefill.email) fields.email.value = prefill.email;
  if (prefill.forma)
    fields.forma.value = prefill.forma === 'osoba' ? 'osoba fizyczna' : 'spółka z o.o.';
  if (prefill.faktur !== null) fields.faktur.value = String(prefill.faktur);

  const values = (): QuoteValues => ({
    email: fields.email.value,
    forma: fields.forma.value,
    faktur: fields.faktur.value,
    name: fields.name.value,
    phone: fields.phone.value,
    consent: consentField.checked,
  });

  const clearError = (field: QuoteField): void => {
    messages[field].textContent = '';
    fields[field].removeAttribute('aria-invalid');
  };

  for (const field of quoteFieldOrder) {
    fields[field].addEventListener('input', () => clearError(field));
    fields[field].addEventListener('change', () => clearError(field));
  }

  const planNote = find(form, '#qf-plan', HTMLElement);
  const plan = plans.find(item => item.id === prefill.plan);
  if (plan) {
    planNote.textContent = `Wybrany plan: ${plan.name}, do ${plan.limit} faktur w miesiącu.`;
    planNote.hidden = false;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const current = values();
    const errors = validateQuote(current, true);
    for (const field of quoteFieldOrder) {
      const message = errors[field];
      messages[field].textContent = message ?? '';
      if (message) fields[field].setAttribute('aria-invalid', 'true');
      else fields[field].removeAttribute('aria-invalid');
    }
    const invalid = firstInvalidField(errors);
    if (invalid) {
      fields[invalid].focus();
      return;
    }
    doneList.textContent = '';
    const rows: Array<[string, string]> = [
      ['e-mail', current.email.trim()],
      ['forma firmy', current.forma || 'nie podano'],
      ['faktur w miesiącu', current.faktur.trim() || 'nie podano'],
      ['imię i nazwisko lub firma', current.name.trim()],
      ['telefon', current.phone.trim() || 'nie podano'],
    ];
    for (const [label, value] of rows) {
      const group = make('div');
      group.append(make('dt', '', label), make('dd', '', value));
      doneList.append(group);
    }
    find(done, '#qf-done-reply', HTMLElement).textContent =
      `Prawdziwe biuro odpisałoby w ciągu ${facts.replyHours} godzin w dni robocze.`;
    done.hidden = false;
    submit.disabled = true;
    done.focus();
  });

  reset.addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    submit.disabled = false;
    fields.email.focus();
  });
};
