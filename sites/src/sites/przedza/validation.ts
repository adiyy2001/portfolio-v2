export interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export type EnquiryField = keyof EnquiryValues;

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const messageLimit = 1000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;

export const normalizePhone = (raw: string) => raw.replace(/[\s().-]/g, '');

export const isPolishPhone = (raw: string) => /^(\+48|0048)?\d{9}$/.test(normalizePhone(raw));

export const validateEnquiry = (values: EnquiryValues): EnquiryErrors => {
  const errors: EnquiryErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (name.length === 0) errors.name = 'Podaj imię, żebyśmy wiedzieli, jak się zwracać.';
  else if (name.length < 2) errors.name = 'Imię jest za krótkie.';

  if (email.length === 0) errors.email = 'Podaj adres e-mail, na który mamy odpowiedzieć.';
  else if (!emailPattern.test(email))
    errors.email = 'Adres e-mail wygląda na niepełny. Sprawdź, czy jest w nim znak @ i domena.';

  if (phone.length > 0 && !isPolishPhone(phone))
    errors.phone = 'Numer telefonu ma mieć 9 cyfr, na przykład 600 100 200.';

  if (values.message.length > messageLimit)
    errors.message = `Wiadomość jest za długa o ${values.message.length - messageLimit} znaków.`;

  if (!values.consent)
    errors.consent = 'Zaznacz zgodę, żebyśmy mogli odpowiedzieć na to zapytanie.';

  return errors;
};

export const errorFields = (errors: EnquiryErrors): EnquiryField[] =>
  (['name', 'email', 'phone', 'message', 'consent'] as const).filter(field => errors[field]);
