export interface RequestValues {
  name: string;
  phone: string;
  car: string;
  service: string;
}

export type RequestErrors = Partial<Record<keyof RequestValues, string>>;

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const normalizePhone = (value: string): string => {
  const digits = value.replace(/[\s\-().]/g, '');
  const withoutPrefix = digits.replace(/^(\+48|0048)/, '');
  return withoutPrefix;
};

export const isPolishPhone = (value: string): boolean => /^[1-9]\d{8}$/.test(normalizePhone(value));

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const messages = {
  name: 'Wpisz imię, co najmniej dwie litery.',
  phone: 'Wpisz numer telefonu, dziewięć cyfr, na przykład 600 000 000.',
  car: 'Wpisz markę i rocznik auta, na przykład Skoda Octavia 2012.',
  service: 'Wybierz, czego dotyczy zlecenie.',
  email: 'Wpisz adres e-mail w formie imie@domena.pl.',
  topic: 'Wybierz temat wiadomości.',
  message: 'Napisz kilka słów o tym, co dzieje się z autem. Wystarczy dziesięć znaków.',
} as const;

const letters = (value: string): number => value.replace(/[^\p{L}]/gu, '').length;

export const validateContactDetails = (values: Pick<RequestValues, 'name' | 'phone' | 'car'>) => {
  const errors: Partial<Record<'name' | 'phone' | 'car', string>> = {};
  if (letters(values.name) < 2) errors.name = messages.name;
  if (!isPolishPhone(values.phone)) errors.phone = messages.phone;
  if (values.car.trim().length < 3) errors.car = messages.car;
  return errors;
};

export const validateRequest = (values: RequestValues): RequestErrors => {
  const errors: RequestErrors = validateContactDetails(values);
  if (!values.service) errors.service = messages.service;
  return errors;
};

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  if (letters(values.name) < 2) errors.name = messages.name;
  if (!isEmail(values.email)) errors.email = messages.email;
  if (!values.topic) errors.topic = messages.topic;
  if (values.message.trim().length < 10) errors.message = messages.message;
  return errors;
};

export const firstErrorKey = <T extends string>(errors: Partial<Record<T, string>>, order: T[]): T | null =>
  order.find(key => errors[key]) ?? null;
