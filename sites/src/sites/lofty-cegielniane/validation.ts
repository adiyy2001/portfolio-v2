import { site } from './site';

export interface ContactValues {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactRules {
  requireConsent: boolean;
}

export const messageLimit = 800;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;

export const normalizePhone = (raw: string) => raw.replace(/[\s().-]/g, '');

export const isPolishPhone = (raw: string) => /^(\+48|0048)?\d{9}$/.test(normalizePhone(raw));

export const validateContact = (values: ContactValues, rules: ContactRules): ContactErrors => {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();

  if (name.length === 0) errors.name = 'Podaj imię.';
  else if (name.length < 2) errors.name = 'Imię jest za krótkie.';

  if (phone.length === 0) errors.phone = 'Podaj numer telefonu, żebyśmy mogli oddzwonić.';
  else if (!isPolishPhone(phone))
    errors.phone = 'Numer telefonu ma mieć 9 cyfr, na przykład 601 555 014.';

  if (email.length > 0 && !emailPattern.test(email))
    errors.email = 'Adres e-mail wygląda na niepełny. Sprawdź znak @ i domenę.';

  if (values.message.length > messageLimit)
    errors.message = `Wiadomość jest za długa o ${values.message.length - messageLimit} znaków.`;

  if (rules.requireConsent && !values.consent)
    errors.consent = 'Zaznacz zgodę, żebyśmy mogli oddzwonić.';

  return errors;
};

export const fieldOrder: ContactField[] = ['name', 'phone', 'email', 'message', 'consent'];

export const errorFields = (errors: ContactErrors): ContactField[] =>
  fieldOrder.filter(field => errors[field]);

export const makeReference = (random: () => number = Math.random) =>
  `${site.refPrefix}${String(Math.floor(100000 + random() * 900000))}`;

export const referencePattern = /^CG-\d{6}$/;
