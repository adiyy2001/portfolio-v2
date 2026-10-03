import { areas } from '../data/areas';
import { shifts } from '../data/site';
import {
  callbackDays,
  callbackSummary,
  callbackWindows,
  type CallbackDay,
  type CallbackWindow,
} from '../lib/callback';
import {
  validateArea,
  validateConsent,
  validateContact,
  validateDescription,
  validateName,
  type FieldName,
  type FormErrors,
  type FormValues,
} from '../lib/validation';
import { pluralForm } from '../lib/reading-time';
import { warsawMoment } from '../lib/warsaw-time';

const query = <T extends Element>(selector: string, root: ParentNode = document): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const areaOptions = [
  ...areas.map(area => ({ id: area.slug, label: area.name })),
  { id: 'inne', label: 'Nie wiem, której dotyczy' },
];
const areaIds = areaOptions.map(option => option.id);

const form = query<HTMLFormElement>('#consult-form');
const nameInput = query<HTMLInputElement>('#field-name');
const contactInput = query<HTMLInputElement>('#field-contact');
const companyInput = query<HTMLInputElement>('#field-company');
const descriptionInput = query<HTMLTextAreaElement>('#field-description');
const consentInput = query<HTMLInputElement>('#field-consent');
const counter = query<HTMLElement>('#field-description-counter');
const daySelect = query<HTMLSelectElement>('#field-day');
const callbackOutput = query<HTMLElement>('#callback-summary');
const summaryBox = query<HTMLElement>('#error-summary');
const summaryTitle = query<HTMLElement>('#error-summary-title');
const summaryList = query<HTMLElement>('#error-summary-list');
const done = query<HTMLElement>('#consult-done');
const doneCallback = query<HTMLElement>('#consult-done-callback');
const doneRecap = query<HTMLElement>('#consult-done-recap');
const againButton = query<HTMLButtonElement>('#consult-again');

const windowRadios = Array.from(
  form.querySelectorAll<HTMLInputElement>('input[name="window"]'),
).filter(radio => radio.value !== '');
const anyWindowRadio = query<HTMLInputElement>('input[name="window"][value=""]');
const areaRadios = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="area"]'));

const days: CallbackDay[] = callbackDays(warsawMoment(new Date()), shifts);

days.forEach(day => {
  const option = document.createElement('option');
  option.value = day.iso;
  option.textContent = day.label;
  daySelect.append(option);
});

const readValues = (): FormValues => ({
  name: nameInput.value,
  contact: contactInput.value,
  area: areaRadios.find(radio => radio.checked)?.value ?? '',
  description: descriptionInput.value,
  consent: consentInput.checked,
});

const check = (field: FieldName, values: FormValues): string | undefined => {
  switch (field) {
    case 'name':
      return validateName(values.name);
    case 'contact':
      return validateContact(values.contact);
    case 'area':
      return validateArea(values.area, areaIds);
    case 'description':
      return validateDescription(values.description);
    case 'consent':
      return validateConsent(values.consent);
  }
};

const fieldIds: Record<FieldName, string> = {
  name: 'field-name',
  contact: 'field-contact',
  area: 'field-area',
  description: 'field-description',
  consent: 'field-consent',
};

const showError = (field: FieldName, message: string | undefined) => {
  const errorElement = query<HTMLElement>(`#${fieldIds[field]}-error`);
  errorElement.textContent = message ?? '';
  errorElement.classList.toggle('is-visible', Boolean(message));
  const control = field === 'area' ? areaRadios : [query<HTMLElement>(`#${fieldIds[field]}`)];
  control.forEach(element => {
    if (message) element.setAttribute('aria-invalid', 'true');
    else element.removeAttribute('aria-invalid');
  });
};

const fields: FieldName[] = ['name', 'contact', 'area', 'description', 'consent'];

const validateField = (field: FieldName) => {
  const message = check(field, readValues());
  showError(field, message);
  return message;
};

const hideSummary = () => {
  summaryBox.hidden = true;
  summaryList.replaceChildren();
};

const focusField = (field: FieldName) => {
  const target = field === 'area' ? areaRadios[0] : query<HTMLElement>(`#${fieldIds[field]}`);
  target?.focus();
};

const showSummary = (errors: FormErrors) => {
  const failing = fields.filter(field => errors[field]);
  summaryList.replaceChildren();
  summaryTitle.textContent = `Popraw ${failing.length} ${pluralForm(failing.length, ['pole', 'pola', 'pól'])}, żeby wysłać formularz:`;
  failing.forEach(field => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${fieldIds[field]}`;
    link.textContent = errors[field] ?? '';
    link.addEventListener('click', event => {
      event.preventDefault();
      focusField(field);
    });
    item.append(link);
    summaryList.append(item);
  });
  summaryBox.hidden = false;
  summaryBox.focus();
};

const selectedDay = (): CallbackDay | undefined => days.find(day => day.iso === daySelect.value);

const selectedWindow = (): CallbackWindow | undefined => {
  const checked = windowRadios.find(radio => radio.checked);
  return callbackWindows.find(window => window.id === checked?.value);
};

const refreshWindows = () => {
  const day = selectedDay();
  windowRadios.forEach(radio => {
    const allowed = !day || day.windows.some(window => window.id === radio.value);
    const label = radio.closest('label');
    radio.disabled = !allowed;
    label?.classList.toggle('is-disabled', !allowed);
    if (!allowed && radio.checked) anyWindowRadio.checked = true;
  });
};

const refreshSummary = () => {
  callbackOutput.textContent = callbackSummary(selectedDay(), selectedWindow());
};

const refreshCounter = () => {
  counter.textContent = `${descriptionInput.value.length} / 1500`;
};

fields.forEach(field => {
  const control = field === 'area' ? areaRadios : [query<HTMLElement>(`#${fieldIds[field]}`)];
  control.forEach(element => {
    element.addEventListener('blur', () => {
      if (field === 'area') return;
      if (element instanceof HTMLInputElement && element.type === 'checkbox') return;
      const hasValue = readValues()[field] !== '';
      if (hasValue) validateField(field);
    });
    element.addEventListener('change', () => {
      if (query<HTMLElement>(`#${fieldIds[field]}-error`).classList.contains('is-visible')) {
        validateField(field);
      }
    });
    element.addEventListener('input', () => {
      if (query<HTMLElement>(`#${fieldIds[field]}-error`).classList.contains('is-visible')) {
        validateField(field);
      }
    });
  });
});

descriptionInput.addEventListener('input', refreshCounter);
daySelect.addEventListener('change', () => {
  refreshWindows();
  refreshSummary();
});
windowRadios.forEach(radio => radio.addEventListener('change', refreshSummary));
anyWindowRadio.addEventListener('change', refreshSummary);

const addRecapRow = (term: string, value: string) => {
  const row = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.className = 'label';
  dt.textContent = term;
  dd.textContent = value;
  row.append(dt, dd);
  doneRecap.append(row);
};

form.addEventListener('submit', event => {
  event.preventDefault();
  const values = readValues();
  const errors: FormErrors = {};
  fields.forEach(field => {
    const message = check(field, values);
    showError(field, message);
    if (message) errors[field] = message;
  });
  if (Object.keys(errors).length > 0) {
    showSummary(errors);
    return;
  }
  hideSummary();
  doneRecap.replaceChildren();
  doneCallback.textContent = `W prawdziwej kancelarii: ${callbackSummary(selectedDay(), selectedWindow())}`;
  addRecapRow('Imię i nazwisko', values.name.trim());
  addRecapRow('Kontakt', values.contact.trim());
  if (companyInput.value.trim()) addRecapRow('Firma', companyInput.value.trim());
  addRecapRow('Obszar', areaOptions.find(option => option.id === values.area)?.label ?? '');
  form.hidden = true;
  done.hidden = false;
  done.focus();
});

againButton.addEventListener('click', () => {
  form.reset();
  fields.forEach(field => showError(field, undefined));
  refreshWindows();
  refreshSummary();
  refreshCounter();
  done.hidden = true;
  form.hidden = false;
  nameInput.focus();
});

refreshWindows();
refreshSummary();
refreshCounter();
