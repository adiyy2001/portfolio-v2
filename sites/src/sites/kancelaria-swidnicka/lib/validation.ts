import { matterOptions, minimumMessageLength } from '../data/form';

export interface ContactValues {
  name: string;
  contact: string;
  matter: string;
  message: string;
}

export type ContactField = keyof ContactValues;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactFieldOrder: ContactField[] = ['name', 'contact', 'matter', 'message'];

export const emptyContact: ContactValues = { name: '', contact: '', matter: '', message: '' };

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const normalizePhone = (value: string): string => {
  const compact = value.replace(/[\s\-().]/g, '');
  if (compact.startsWith('+48')) return compact.slice(3);
  if (compact.startsWith('0048')) return compact.slice(4);
  return compact;
};

export const isPhone = (value: string): boolean => /^\d{9}$/.test(normalizePhone(value));

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = 'Podaj imię i nazwisko.';
  const contact = values.contact.trim();
  if (!contact) errors.contact = 'Podaj telefon albo adres e-mail, na który mamy odpowiedzieć.';
  else if (!isEmail(contact) && !isPhone(contact)) {
    errors.contact = 'Wpisz numer z 9 cyfr, np. 600 700 800, albo pełny adres e-mail.';
  }
  if (!matterOptions.some(option => option.value === values.matter)) {
    errors.matter = 'Wybierz rodzaj sprawy.';
  }
  if (values.message.trim().length < minimumMessageLength) {
    errors.message = `Opisz sprawę w kilku słowach, co najmniej ${minimumMessageLength} znaków.`;
  }
  return errors;
};

export const firstErrorField = (errors: ContactErrors): ContactField | undefined =>
  contactFieldOrder.find(field => errors[field]);
