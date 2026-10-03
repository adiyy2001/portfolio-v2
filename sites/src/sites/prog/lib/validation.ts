export type FieldError = string | null;

export const normalizePhone = (value: string): string => {
  const compact = value.replace(/[\s\-().]/g, '');
  if (compact.startsWith('+48')) return compact.slice(3);
  if (compact.startsWith('0048')) return compact.slice(4);
  return compact;
};

export const isPolishPhone = (value: string): boolean => /^[1-9]\d{8}$/.test(normalizePhone(value));

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const validateName = (value: string): FieldError => {
  const text = value.trim();
  if (text.length === 0) return 'Podaj imię, żebyśmy wiedzieli, jak się zwracać.';
  if (text.length < 2 || !/\p{L}/u.test(text)) return 'Imię wygląda na zbyt krótkie.';
  return null;
};

export const validatePhone = (value: string): FieldError => {
  if (value.trim().length === 0) return 'Podaj numer telefonu, pod którym oddzwonimy.';
  if (!isPolishPhone(value)) return 'Numer powinien mieć 9 cyfr, na przykład 600 100 200.';
  return null;
};

export const validateEmail = (value: string, required = false): FieldError => {
  if (value.trim().length === 0) return required ? 'Podaj adres e-mail.' : null;
  if (!isEmail(value)) return 'Adres e-mail wygląda na niepełny, na przykład imie@poczta.pl.';
  return null;
};

export const validateConsent = (checked: boolean): FieldError =>
  checked ? null : 'Zaznacz zgodę, żebyśmy mogli się odezwać.';

export const validateMessage = (value: string, minimum = 10): FieldError => {
  const text = value.trim();
  if (text.length === 0) return 'Napisz kilka słów, w czym możemy pomóc.';
  if (text.length < minimum) return `Napisz co najmniej ${minimum} znaków.`;
  return null;
};

export const parseDecimal = (value: string): number | null => {
  const text = value.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  return Number(text);
};

export const validateNumber = (
  value: string,
  label: string,
  minimum: number,
  maximum: number,
): FieldError => {
  if (value.trim().length === 0) return `Podaj ${label}.`;
  const number = parseDecimal(value);
  if (number === null) return `${capitalize(label)}: wpisz liczbę, na przykład 54,5.`;
  if (number < minimum || number > maximum) {
    return `${capitalize(label)}: wpisz wartość od ${minimum} do ${maximum}.`;
  }
  return null;
};

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const validateRequired = (value: string, message: string): FieldError =>
  value.trim().length === 0 ? message : null;

export type ErrorMap<K extends string> = Partial<Record<K, string>>;

export const collectErrors = <K extends string>(
  entries: readonly (readonly [K, FieldError])[],
): ErrorMap<K> => {
  const errors: ErrorMap<K> = {};
  for (const [key, error] of entries) {
    if (error) errors[key] = error;
  }
  return errors;
};
