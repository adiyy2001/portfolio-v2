export interface ContactValues {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const errorMessages: Record<ContactField, { empty: string; invalid?: string }> = {
  name: { empty: 'Podaj imię albo pseudonim, żebym wiedziała, jak do Ciebie pisać.' },
  email: {
    empty: 'Podaj adres e-mail, na który mogę odpisać.',
    invalid:
      'W tym adresie czegoś brakuje. Sprawdź, czy jest w nim znak @ i domena, na przykład nazwa@poczta.pl.',
  },
  message: {
    empty:
      'Napisz kilka zdań, najlepiej co najmniej dziesięć znaków. Resztę zostawmy na spotkanie.',
  },
  consent: {
    empty: 'Bez zgody nie mogę przeczytać wiadomości. Zaznacz ją, jeśli się z nią zgadzasz.',
  },
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
  `W formularzu ${count === 1 ? 'jest' : 'są'} ${count} ${pluralize(count, 'uwaga', 'uwagi', 'uwag')}. Popraw zaznaczone pola.`;
