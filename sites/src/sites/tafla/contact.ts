export interface ContactValues {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const errorMessages: Record<ContactField, { empty: string; invalid?: string }> = {
  name: { empty: 'Podaj imię albo pseudonim, żebym wiedziała, jak się do Ciebie zwracać.' },
  email: {
    empty: 'Podaj adres e-mail, na który mam odpisać.',
    invalid:
      'Ten adres e-mail wygląda na niepełny. Sprawdź, czy jest w nim znak @ i domena, na przykład nazwa@poczta.pl.',
  },
  message: { empty: 'Napisz kilka zdań, żebym wiedziała, od czego zacząć.' },
  consent: { empty: 'Zaznacz zgodę, żebym mogła przeczytać Twoją wiadomość.' },
};

const MIN_MESSAGE_LENGTH = 10;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  const email = values.email.trim();
  if (values.name.trim() === '') errors.name = errorMessages.name.empty;
  if (email === '') errors.email = errorMessages.email.empty;
  else if (!emailPattern.test(email)) errors.email = errorMessages.email.invalid;
  if (values.message.trim().length < MIN_MESSAGE_LENGTH)
    errors.message = errorMessages.message.empty;
  if (!values.consent) errors.consent = errorMessages.consent.empty;
  return errors;
};

export const pluralize = (count: number, one: string, few: string, many: string) => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew = lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14);
  return isFew ? few : many;
};

export const errorSummary = (count: number) =>
  `Formularz zawiera ${count} ${pluralize(count, 'błąd', 'błędy', 'błędów')}. Popraw zaznaczone pola.`;
