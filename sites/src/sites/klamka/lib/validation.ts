export interface ValuationValues {
  name: string;
  phone: string;
  address: string;
  note: string;
}

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface EnquiryValues {
  name: string;
  phone: string;
  when: string;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const phoneDigits = (value: string): string => value.replace(/\D/g, '');

export const isPhone = (value: string): boolean => {
  const digits = phoneDigits(value);
  const national = digits.startsWith('48') && digits.length === 11 ? digits.slice(2) : digits;
  return national.length === 9;
};

export const isEmail = (value: string): boolean => emailPattern.test(value.trim());

const phoneError = (value: string): string | undefined => {
  if (!value.trim()) return 'Wpisz numer telefonu.';
  if (!isPhone(value)) return 'Numer telefonu ma 9 cyfr, na przykład 600 100 200.';
  return undefined;
};

const compact = <T extends object>(errors: Errors<T>): Errors<T> =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as Errors<T>;

export const validateValuation = (values: ValuationValues): Errors<ValuationValues> =>
  compact<ValuationValues>({
    name: values.name.trim() ? undefined : 'Wpisz imię.',
    phone: phoneError(values.phone),
    address:
      values.address.trim().length >= 5 ? undefined : 'Wpisz adres mieszkania, z ulicą i numerem.',
  });

export const validateContact = (values: ContactValues): Errors<ContactValues> =>
  compact<ContactValues>({
    name: values.name.trim() ? undefined : 'Wpisz imię.',
    email: !values.email.trim()
      ? 'Wpisz adres e-mail.'
      : isEmail(values.email)
        ? undefined
        : 'Adres e-mail wygląda niepoprawnie. Sprawdź, czy jest w nim @ i domena.',
    message:
      values.message.trim().length >= 10 ? undefined : 'Napisz kilka słów, w czym możemy pomóc.',
  });

export const validateEnquiry = (values: EnquiryValues): Errors<EnquiryValues> =>
  compact<EnquiryValues>({
    name: values.name.trim() ? undefined : 'Wpisz imię.',
    phone: phoneError(values.phone),
  });

export const firstErrorField = <T extends object>(
  errors: Errors<T>,
  order: ReadonlyArray<keyof T>,
): keyof T | undefined => order.find(field => errors[field]);
