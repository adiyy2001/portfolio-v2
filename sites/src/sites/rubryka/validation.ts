export type ContactMethod = 'email' | 'phone';

export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod;
  nip: string;
  consent: boolean;
}

export type ContactField = 'name' | 'email' | 'phone' | 'nip' | 'consent';
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactFieldOrder: readonly ContactField[] = [
  'name',
  'email',
  'phone',
  'nip',
  'consent',
];

const nipWeights = [6, 5, 7, 2, 3, 4, 5, 6, 7];

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value.trim());

export const normalizePhone = (value: string): string | null => {
  const stripped = value.replace(/[\s\-().]/g, '');
  const national = stripped.replace(/^(\+48|0048)/, '');
  return /^[1-9]\d{8}$/.test(national) ? national : null;
};

export const isValidNip = (value: string): boolean => {
  const digits = value.replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(digits) || /^0+$/.test(digits)) return false;
  const sum = nipWeights.reduce(
    (total, weight, index) => total + weight * Number(digits[index]),
    0,
  );
  return sum % 11 === Number(digits[9]);
};

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  const phone = values.phone.trim();

  if (values.name.trim().length < 2) errors.name = 'Wpisz imię i nazwisko.';
  if (!isValidEmail(values.email)) {
    errors.email = 'Wpisz poprawny adres e-mail, z małpą i domeną.';
  }
  if (phone === '' && values.contactMethod === 'phone') {
    errors.phone = 'Podaj numer telefonu, skoro wolisz rozmowę.';
  } else if (phone !== '' && normalizePhone(phone) === null) {
    errors.phone = 'Numer telefonu ma 9 cyfr, na przykład 600 100 200.';
  }
  if (values.nip.trim() !== '' && !isValidNip(values.nip)) {
    errors.nip = 'Ten NIP nie przechodzi sumy kontrolnej. Sprawdź cyfry albo zostaw pole puste.';
  }
  if (!values.consent) errors.consent = 'Zaznacz zgodę, żebyśmy mogli odpowiedzieć na wycenę.';

  return errors;
};

export const firstInvalidField = (errors: ContactErrors): ContactField | null =>
  contactFieldOrder.find(field => errors[field] !== undefined) ?? null;
