export type FieldName = 'name' | 'contact' | 'area' | 'description' | 'consent';

export interface FormValues {
  name: string;
  contact: string;
  area: string;
  description: string;
  consent: boolean;
}

export type FormErrors = Partial<Record<FieldName, string>>;

export const descriptionLimits = { min: 20, max: 1500 };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const separators = /[\s().-]/g;

export const classifyContact = (value: string): 'email' | 'phone' | undefined => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.length <= 254 && emailPattern.test(trimmed)) return 'email';
  const compact = trimmed.replace(separators, '');
  if (/^(?:\+?48|0048)?[1-9]\d{8}$/.test(compact)) return 'phone';
  if (/^\+(?!48)[1-9]\d{7,14}$/.test(compact)) return 'phone';
  return undefined;
};

export const validateName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return 'Podaj imię i nazwisko.';
  if (trimmed.length > 100) return 'Imię i nazwisko mogą mieć najwyżej 100 znaków.';
  return undefined;
};

export const validateContact = (value: string): string | undefined => {
  if (value.trim().length === 0) return 'Podaj numer telefonu albo adres e-mail.';
  if (!classifyContact(value)) {
    return 'To nie wygląda na telefon ani e-mail. Przykład: 600 100 200 albo ty@firma.example.';
  }
  return undefined;
};

export const validateArea = (value: string, allowed: string[]): string | undefined =>
  allowed.includes(value) ? undefined : 'Wybierz obszar, którego dotyczy sprawa.';

export const validateDescription = (value: string): string | undefined => {
  const length = value.trim().length;
  if (length < descriptionLimits.min) {
    return `Opisz sprawę w kilku zdaniach (co najmniej ${descriptionLimits.min} znaków).`;
  }
  if (length > descriptionLimits.max) {
    return `Skróć opis do ${descriptionLimits.max} znaków, resztę opowiesz przez telefon.`;
  }
  return undefined;
};

export const validateConsent = (checked: boolean): string | undefined =>
  checked ? undefined : 'Potrzebujemy Twojej zgody, żeby oddzwonić lub odpisać.';

export const validateForm = (values: FormValues, areas: string[]): FormErrors => {
  const errors: FormErrors = {};
  const checks: [FieldName, string | undefined][] = [
    ['name', validateName(values.name)],
    ['contact', validateContact(values.contact)],
    ['area', validateArea(values.area, areas)],
    ['description', validateDescription(values.description)],
    ['consent', validateConsent(values.consent)],
  ];
  for (const [field, message] of checks) {
    if (message) errors[field] = message;
  }
  return errors;
};
