export interface CheckoutValues {
  name: string;
  phone: string;
  email: string;
  pickupDay: string;
  pickupWindow: string;
  note: string;
}

export type CheckoutField = keyof CheckoutValues;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type ContactField = keyof ContactValues;

export type ContactErrors = Partial<Record<ContactField, string>>;

export interface SubscriptionValues {
  coffee: string;
  grind: string;
  bags: number;
  pickupDay: string;
  name: string;
  phone: string;
  email: string;
}

export type SubscriptionField = keyof SubscriptionValues;

export type SubscriptionErrors = Partial<Record<SubscriptionField, string>>;

export const checkoutFieldOrder: CheckoutField[] = [
  'name',
  'phone',
  'email',
  'pickupDay',
  'pickupWindow',
  'note',
];

export const subscriptionFieldOrder: SubscriptionField[] = [
  'coffee',
  'grind',
  'bags',
  'pickupDay',
  'name',
  'phone',
  'email',
];

export const emptyCheckout: CheckoutValues = {
  name: '',
  phone: '',
  email: '',
  pickupDay: '',
  pickupWindow: '',
  note: '',
};

export const noteLimit = 240;

const emailHint = 'Adres e-mail wygląda na niepełny, np. anna@poczta.example.';

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const normalizePhone = (value: string): string => {
  const compact = value.replace(/[\s\-().]/g, '');
  if (compact.startsWith('+48')) return compact.slice(3);
  if (compact.startsWith('0048')) return compact.slice(4);
  return compact;
};

export const isPhone = (value: string): boolean => /^\d{9}$/.test(normalizePhone(value));

const checkPhone = (value: string): string | undefined => {
  if (!value.trim()) return 'Podaj numer telefonu, zadzwonię, gdyby coś się zmieniło.';
  if (!isPhone(value)) return 'Numer telefonu powinien mieć 9 cyfr, np. 600 700 800.';
  return undefined;
};

const checkEmail = (value: string, missing: string): string | undefined => {
  if (!value.trim()) return missing;
  if (!isEmail(value)) return emailHint;
  return undefined;
};

export const validateCheckout = (
  values: CheckoutValues,
  allowedDays: readonly string[],
  windowsFor: (iso: string) => readonly string[],
): CheckoutErrors => {
  const errors: CheckoutErrors = {};
  if (!values.name.trim()) errors.name = 'Podaj imię i nazwisko.';
  const phone = checkPhone(values.phone);
  if (phone) errors.phone = phone;
  const email = checkEmail(values.email, 'Podaj adres e-mail.');
  if (email) errors.email = email;
  if (!values.pickupDay) errors.pickupDay = 'Wybierz dzień odbioru.';
  else if (!allowedDays.includes(values.pickupDay)) {
    errors.pickupDay = 'Ten dzień jest już nieaktualny, wybierz inny.';
  }
  if (!values.pickupWindow) errors.pickupWindow = 'Wybierz godziny odbioru.';
  else if (values.pickupDay && !windowsFor(values.pickupDay).includes(values.pickupWindow)) {
    errors.pickupWindow = 'W tym dniu palarnia nie pracuje w tych godzinach, wybierz inne.';
  }
  if (values.note.length > noteLimit) {
    errors.note = `Uwagi mogą mieć najwyżej ${noteLimit} znaków.`;
  }
  return errors;
};

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = 'Podaj imię.';
  const email = checkEmail(values.email, 'Podaj adres e-mail, na który odpiszę.');
  if (email) errors.email = email;
  if (values.message.trim().length < 10) {
    errors.message = 'Napisz kilka słów więcej, co najmniej 10 znaków.';
  }
  return errors;
};

export const validateSubscription = (
  values: SubscriptionValues,
  allowedDays: readonly string[],
  maxBags: number,
): SubscriptionErrors => {
  const errors: SubscriptionErrors = {};
  if (!values.coffee) errors.coffee = 'Wybierz kawę albo zostaw dobór mnie.';
  if (!values.grind) errors.grind = 'Wybierz mielenie.';
  if (!Number.isInteger(values.bags) || values.bags < 1 || values.bags > maxBags) {
    errors.bags = `Wybierz od 1 do ${maxBags} worków tygodniowo.`;
  }
  if (!values.pickupDay) errors.pickupDay = 'Wybierz dzień odbioru.';
  else if (!allowedDays.includes(values.pickupDay)) {
    errors.pickupDay = 'Palarnia w tym dniu nie pracuje, wybierz inny dzień.';
  }
  if (!values.name.trim()) errors.name = 'Podaj imię i nazwisko.';
  const phone = checkPhone(values.phone);
  if (phone) errors.phone = phone;
  const email = checkEmail(values.email, 'Podaj adres e-mail.');
  if (email) errors.email = email;
  return errors;
};

export const firstErrorField = <K extends string>(
  errors: Partial<Record<K, string>>,
  order: readonly K[],
): K | null => order.find(field => Boolean(errors[field])) ?? null;
