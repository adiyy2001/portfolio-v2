import { form as copy } from '../copy';
import { types, units } from '../data';
import { m2 } from '../format';
import {
  type ContactField,
  type ContactValues,
  errorFields,
  makeReference,
  validateContact,
} from '../validation';
import { all, need, readStore, writeStore } from './dom';

interface StoredRequest {
  ref: string;
  name: string;
  loft: string;
  date: string;
}

const storeKey = 'cegielnia-14:requests';
const storeLimit = 5;

const labelOfLoft = (value: string) => {
  if (!value) return copy.loftAny;
  const unit = units.find(item => item.code === value);
  if (unit) return unit.code;
  const type = types.find(item => item.key === value);
  return type ? m2(type.area) : value;
};

const renderStored = () => {
  const root = document.querySelector<HTMLElement>('[data-stored]');
  if (!root) return;
  const list = need<HTMLElement>(root, '[data-stored-list]');
  const empty = need<HTMLElement>(root, '[data-stored-empty]');
  const clear = need<HTMLButtonElement>(root, '[data-stored-clear]');
  const items = readStore<StoredRequest[]>(storeKey, []);
  list.textContent = '';
  for (const item of items) {
    const row = document.createElement('li');
    const ref = document.createElement('b');
    ref.textContent = item.ref;
    row.append(ref, ` ${item.name}, ${labelOfLoft(item.loft)}, ${item.date}`);
    list.appendChild(row);
  }
  list.hidden = items.length === 0;
  empty.hidden = items.length > 0;
  clear.hidden = items.length === 0;
};

const initStoredClear = () => {
  const clear = document.querySelector<HTMLButtonElement>('[data-stored-clear]');
  if (!clear) return;
  clear.addEventListener('click', () => {
    writeStore(storeKey, []);
    renderStored();
    document.querySelector<HTMLElement>('[data-stored-empty]')?.setAttribute('tabindex', '-1');
    document.querySelector<HTMLElement>('[data-stored-empty]')?.focus();
  });
};

const initForm = (form: HTMLFormElement) => {
  const full = form.dataset.form === 'full';
  const summary = need<HTMLElement>(form, '[data-summary]');
  const summaryTitle = need<HTMLElement>(summary, '[data-summary-title]');
  const summaryList = need<HTMLElement>(summary, '[data-summary-list]');
  const done = need<HTMLElement>(form, '[data-done]');
  const doneTitle = need<HTMLElement>(done, '[data-done-title]');
  const again = need<HTMLButtonElement>(done, '[data-again]');
  const submit = need<HTMLButtonElement>(form, 'button[type=submit]');
  const fields = all<HTMLElement>(form, '[data-field]');

  const control = (field: string) =>
    form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[name=${field}]`,
    );

  const read = (): ContactValues => ({
    name: (control('name') as HTMLInputElement | null)?.value ?? '',
    phone: (control('phone') as HTMLInputElement | null)?.value ?? '',
    email: (control('email') as HTMLInputElement | null)?.value ?? '',
    message: (control('message') as HTMLTextAreaElement | null)?.value ?? '',
    consent: (control('consent') as HTMLInputElement | null)?.checked ?? false,
  });

  const clearErrors = () => {
    summary.hidden = true;
    summaryList.textContent = '';
    for (const field of fields) {
      const error = field.querySelector<HTMLElement>('[data-error]');
      if (error) {
        error.hidden = true;
        error.textContent = '';
      }
      field.querySelector('[aria-invalid]')?.removeAttribute('aria-invalid');
    }
  };

  const showErrors = (errors: ReturnType<typeof validateContact>) => {
    clearErrors();
    const failed = errorFields(errors);
    for (const name of failed) {
      const field = form.querySelector<HTMLElement>(`[data-field=${name}]`);
      const message = errors[name as ContactField];
      if (!field || !message) continue;
      const error = need<HTMLElement>(field, '[data-error]');
      error.textContent = message;
      error.hidden = false;
      control(name)?.setAttribute('aria-invalid', 'true');
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${control(name)?.id ?? ''}`;
      link.textContent = message;
      link.addEventListener('click', event => {
        event.preventDefault();
        control(name)?.focus();
      });
      item.appendChild(link);
      summaryList.appendChild(item);
    }
    summaryTitle.textContent = copy.summary(failed.length);
    summary.hidden = false;
    summary.scrollIntoView({ block: 'nearest' });
    control(failed[0])?.focus();
  };

  const remember = (ref: string, values: ContactValues) => {
    const loft = (control('loft') as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
    const date = new Date().toLocaleDateString('pl-PL');
    const items = readStore<StoredRequest[]>(storeKey, []);
    const next = [{ ref, name: values.name.trim(), loft, date }, ...items].slice(0, storeLimit);
    writeStore(storeKey, next);
    renderStored();
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = read();
    const errors = validateContact(values, { requireConsent: full });
    if (errorFields(errors).length > 0) {
      showErrors(errors);
      return;
    }
    clearErrors();
    const ref = makeReference();
    remember(ref, values);
    doneTitle.textContent = copy.doneTitle(ref);
    for (const child of Array.from(form.children)) {
      if (child !== done) (child as HTMLElement).hidden = true;
    }
    done.hidden = false;
    done.focus();
  });

  again.addEventListener('click', () => {
    form.reset();
    clearErrors();
    for (const child of Array.from(form.children)) {
      if (child !== done && child !== summary) (child as HTMLElement).hidden = false;
    }
    done.hidden = true;
    submit.focus();
  });
};

all<HTMLFormElement>(document, 'form[data-form]').forEach(initForm);
renderStored();
initStoredClear();
