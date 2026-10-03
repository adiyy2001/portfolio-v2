import { formatZloty } from '../format';
import { type BucketId, documentBuckets } from '../packages';
import {
  type BusinessType,
  type Quote,
  type QuoteInput,
  type VatStatus,
  buildQuote,
  clampEmployees,
  describeQuote,
  parseQuoteParams,
} from '../quote';
import {
  type ContactErrors,
  type ContactField,
  type ContactMethod,
  type ContactValues,
  contactFieldOrder,
  firstInvalidField,
  validateContact,
} from '../validation';

const businessTypes: readonly BusinessType[] = ['ryczalt', 'kpir', 'spolka', 'unknown'];
const vatStatuses: readonly VatStatus[] = ['active', 'exempt', 'unknown'];
const contactMethods: readonly ContactMethod[] = ['email', 'phone'];

const find = <Element extends HTMLElement>(
  root: ParentNode,
  selector: string,
  type: new () => Element,
): Element => {
  const found = root.querySelector(selector);
  if (!(found instanceof type)) throw new Error(`Missing ${selector}`);
  return found;
};

const checkedValue = <Value extends string>(
  form: HTMLFormElement,
  name: string,
  allowed: readonly Value[],
): Value => {
  const checked = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  const found = allowed.find(value => value === checked?.value);
  if (!found) throw new Error(`No valid value for ${name}`);
  return found;
};

const setChecked = (form: HTMLFormElement, name: string, value: string): void => {
  for (const input of form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)) {
    input.checked = input.value === value;
  }
};

const bucketIds: readonly BucketId[] = documentBuckets.map(bucket => bucket.id);

const readQuoteInput = (form: HTMLFormElement): QuoteInput => ({
  businessType: checkedValue(form, 'businessType', businessTypes),
  documents: checkedValue(form, 'documents', bucketIds),
  vat: checkedValue(form, 'vat', vatStatuses),
  employees: clampEmployees(find(form, '#employees', HTMLInputElement).value),
});

const applyParams = (form: HTMLFormElement): void => {
  const params = parseQuoteParams(location.search);
  if (params.businessType) setChecked(form, 'businessType', params.businessType);
  if (params.documents) setChecked(form, 'documents', params.documents);
  if (params.vat) setChecked(form, 'vat', params.vat);
  if (params.employees !== undefined) {
    find(form, '#employees', HTMLInputElement).value = String(params.employees);
  }
};

const textItem = (tag: string, text: string): HTMLElement => {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
};

const renderQuote = (sheet: HTMLElement, announcer: HTMLElement, quote: Quote): void => {
  const priced = find(sheet, '[data-quote-priced]', HTMLElement);
  const individual = find(sheet, '[data-quote-individual]', HTMLElement);
  announcer.textContent = describeQuote(quote);
  const barLabel = find(document, '[data-bar-label]', HTMLElement);
  const barValue = find(document, '[data-bar-value]', HTMLElement);
  barLabel.textContent =
    quote.kind === 'priced' ? `Pakiet ${quote.packageName}` : 'Wycena indywidualna';
  barValue.textContent = quote.kind === 'priced' ? `${formatZloty(quote.netGrosze)} netto` : '';

  if (quote.kind === 'individual') {
    priced.hidden = true;
    individual.hidden = false;
    individual.textContent = quote.reason;
    return;
  }

  priced.hidden = false;
  individual.hidden = true;
  find(sheet, '[data-quote-package]', HTMLElement).textContent = quote.packageName;
  find(sheet, '[data-quote-lines]', HTMLElement).replaceChildren(
    ...quote.lines.flatMap(line => [
      textItem('dt', line.label),
      textItem('dd', formatZloty(line.grosze)),
    ]),
  );
  find(sheet, '[data-quote-net]', HTMLElement).textContent = formatZloty(quote.netGrosze);
  find(sheet, '[data-quote-gross]', HTMLElement).textContent =
    `${formatZloty(quote.grossGrosze)} brutto z 23% VAT`;
  find(sheet, '[data-quote-assumptions]', HTMLElement).replaceChildren(
    ...quote.assumptions.map(text => textItem('li', text)),
  );
};

const readContact = (form: HTMLFormElement): ContactValues => ({
  name: find(form, '#name', HTMLInputElement).value,
  email: find(form, '#email', HTMLInputElement).value,
  phone: find(form, '#phone', HTMLInputElement).value,
  nip: find(form, '#nip', HTMLInputElement).value,
  contactMethod: checkedValue(form, 'contactMethod', contactMethods),
  consent: find(form, '#consent', HTMLInputElement).checked,
});

const showErrors = (form: HTMLFormElement, errors: ContactErrors): void => {
  for (const field of contactFieldOrder) {
    const wrapper = find(form, `[data-field="${field}"]`, HTMLElement);
    const message = errors[field];
    const control = find(wrapper, `#${field}`, HTMLInputElement);
    const output = find(wrapper, '.field-error', HTMLElement);
    wrapper.dataset.invalid = String(message !== undefined);
    output.textContent = message ?? '';
    if (message === undefined) control.removeAttribute('aria-invalid');
    else control.setAttribute('aria-invalid', 'true');
  }
};

const fieldLabels: Record<ContactField, string> = {
  name: 'Imię i nazwisko',
  email: 'Adres e-mail',
  phone: 'Telefon',
  nip: 'NIP',
  consent: 'Zgoda',
};

const renderSummary = (summary: HTMLElement, errors: ContactErrors): void => {
  const list = find(summary, '[data-error-list]', HTMLElement);
  const items = contactFieldOrder.flatMap(field => {
    const message = errors[field];
    if (message === undefined) return [];
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = `#${field}`;
    anchor.textContent = `${fieldLabels[field]}: ${message}`;
    item.append(anchor);
    return [item];
  });
  list.replaceChildren(...items);
  summary.hidden = items.length === 0;
};

export const setupQuoteForm = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;
  const sheet = find(document, '[data-quote-sheet]', HTMLElement);
  const announcer = find(document, '[data-quote-announce]', HTMLElement);
  const summary = find(form, '[data-error-summary]', HTMLElement);
  const success = find(document, '[data-success]', HTMLElement);
  const successName = find(success, '[data-success-name]', HTMLElement);
  const successQuote = find(success, '[data-success-quote]', HTMLElement);
  const employees = find(form, '#employees', HTMLInputElement);
  let attempted = false;

  const update = (): void => renderQuote(sheet, announcer, buildQuote(readQuoteInput(form)));

  applyParams(form);
  update();

  form.addEventListener('change', event => {
    if (event.target instanceof HTMLInputElement && event.target.name === 'employees') {
      employees.value = String(clampEmployees(employees.value));
    }
    update();
  });
  employees.addEventListener('input', update);
  employees.addEventListener('focus', () => employees.select());

  for (const button of form.querySelectorAll<HTMLButtonElement>('[data-step]')) {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.step);
      employees.value = String(clampEmployees(String(clampEmployees(employees.value) + step)));
      update();
    });
  }

  const revalidate = (): void => {
    const errors = validateContact(readContact(form));
    showErrors(form, errors);
    renderSummary(summary, errors);
  };

  form.addEventListener('input', event => {
    if (attempted && event.target instanceof HTMLInputElement && event.target.id !== 'employees') {
      revalidate();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    const values = readContact(form);
    const errors = validateContact(values);
    showErrors(form, errors);
    renderSummary(summary, errors);
    const first = firstInvalidField(errors);
    if (first) {
      summary.focus();
      return;
    }
    successName.textContent = values.name.trim();
    successQuote.textContent = describeQuote(buildQuote(readQuoteInput(form)));
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  find(success, '[data-success-reset]', HTMLButtonElement).addEventListener('click', () => {
    attempted = false;
    form.reset();
    applyParams(form);
    showErrors(form, {});
    renderSummary(summary, {});
    update();
    success.hidden = true;
    form.hidden = false;
    find(form, 'input[name="businessType"]:checked', HTMLInputElement).focus();
  });
};
