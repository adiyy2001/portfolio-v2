export interface ContactFields {
  name: string;
  phone: string;
  email: string;
  topic: string;
  consent: boolean;
}

export type ContactField = keyof ContactFields;

export type ContactErrors = Partial<Record<ContactField, string>>;

const phoneDigits = 9;

export const normalizePhone = (text: string) => {
  const stripped = text.replace(/[\s\-().]/g, '');
  const withoutPrefix = stripped.replace(/^(\+|00)48/, '');
  return withoutPrefix;
};

export const isPolishPhone = (text: string) => {
  const digits = normalizePhone(text);
  return new RegExp(`^[1-9]\\d{${phoneDigits - 1}}$`).test(digits);
};

export const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(text.trim());

export const validateContact = (fields: ContactFields): ContactErrors => {
  const errors: ContactErrors = {};
  if (fields.name.trim().length < 2) {
    errors.name = 'Podaj imię, żebyśmy wiedzieli, jak się do ciebie zwracać.';
  }
  if (fields.phone.trim() === '') {
    errors.phone = 'Podaj numer telefonu, na który mamy oddzwonić.';
  } else if (!isPolishPhone(fields.phone)) {
    errors.phone = 'Numer telefonu powinien mieć 9 cyfr, na przykład 600 100 200.';
  }
  if (fields.email.trim() !== '' && !isEmail(fields.email)) {
    errors.email = 'Adres e-mail wygląda na niepełny. Sprawdź, czy ma znak @ i domenę.';
  }
  if (fields.topic.trim() === '') {
    errors.topic = 'Wybierz, czego dotyczy wizyta.';
  }
  if (!fields.consent) {
    errors.consent = 'Zaznacz zgodę, żebyśmy mogli oddzwonić.';
  }
  return errors;
};
