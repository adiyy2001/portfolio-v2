import { deliveryMethods, paymentMethods } from '../data/site';
import type { DeliveryId, PaymentId } from '../data/site';

export interface CheckoutValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  delivery: DeliveryId | '';
  locker: string;
  street: string;
  postcode: string;
  city: string;
  payment: PaymentId | '';
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

export interface SubscriptionContactValues {
  name: string;
  email: string;
}

export type SubscriptionContactErrors = Partial<Record<keyof SubscriptionContactValues, string>>;

export const checkoutFieldOrder: CheckoutField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'delivery',
  'locker',
  'street',
  'postcode',
  'city',
  'payment',
];

export const emptyCheckout: CheckoutValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  delivery: '',
  locker: '',
  street: '',
  postcode: '',
  city: '',
  payment: '',
};

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const normalizePhone = (value: string): string => {
  const compact = value.replace(/[\s\-().]/g, '');
  if (compact.startsWith('+48')) return compact.slice(3);
  if (compact.startsWith('0048')) return compact.slice(4);
  return compact;
};

export const isPhone = (value: string): boolean => /^\d{9}$/.test(normalizePhone(value));

export const isPostcode = (value: string): boolean => /^\d{2}-\d{3}$/.test(value.trim());

export const isLockerCode = (value: string): boolean =>
  /^[A-Za-z]{3}\d{2,3}[A-Za-z]{1,2}$/.test(value.trim());

export const validateCheckout = (values: CheckoutValues): CheckoutErrors => {
  const errors: CheckoutErrors = {};
  if (!values.firstName.trim()) errors.firstName = 'Podaj imię.';
  if (!values.lastName.trim()) errors.lastName = 'Podaj nazwisko.';
  if (!values.email.trim()) errors.email = 'Podaj adres e-mail.';
  else if (!isEmail(values.email))
    errors.email = 'Adres e-mail wygląda na niepełny, np. anna@poczta.example.';
  if (!values.phone.trim()) errors.phone = 'Podaj numer telefonu, przyda się kurierowi.';
  else if (!isPhone(values.phone))
    errors.phone = 'Numer telefonu powinien mieć 9 cyfr, np. 600 700 800.';

  const method = deliveryMethods.find(entry => entry.id === values.delivery);
  if (!method) {
    errors.delivery = 'Wybierz sposób dostawy.';
  } else if (method.needs === 'locker') {
    if (!values.locker.trim()) errors.locker = 'Podaj kod paczkomatu, np. WRO12M.';
    else if (!isLockerCode(values.locker)) {
      errors.locker =
        'Kod paczkomatu to trzy litery, dwie lub trzy cyfry i jedna lub dwie litery, np. WRO12M.';
    }
  } else if (method.needs === 'address') {
    if (!values.street.trim()) errors.street = 'Podaj ulicę i numer domu.';
    if (!values.postcode.trim()) errors.postcode = 'Podaj kod pocztowy.';
    else if (!isPostcode(values.postcode)) errors.postcode = 'Kod pocztowy zapisz jako 00-000.';
    if (!values.city.trim()) errors.city = 'Podaj miejscowość.';
  }

  const payment = paymentMethods.find(entry => entry.id === values.payment);
  if (!payment) errors.payment = 'Wybierz sposób płatności.';
  else if (payment.pickupOnly && values.delivery !== 'odbior') {
    errors.payment = 'Płatność w palarni jest możliwa tylko przy odbiorze osobistym.';
  }
  return errors;
};

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = 'Podaj imię.';
  if (!values.email.trim()) errors.email = 'Podaj adres e-mail, na który odpiszemy.';
  else if (!isEmail(values.email))
    errors.email = 'Adres e-mail wygląda na niepełny, np. anna@poczta.example.';
  if (values.message.trim().length < 10)
    errors.message = 'Napisz kilka słów więcej, co najmniej 10 znaków.';
  return errors;
};

export const validateSubscriptionContact = (
  values: SubscriptionContactValues,
): SubscriptionContactErrors => {
  const errors: SubscriptionContactErrors = {};
  if (!values.name.trim()) errors.name = 'Podaj imię.';
  if (!values.email.trim()) errors.email = 'Podaj adres e-mail.';
  else if (!isEmail(values.email))
    errors.email = 'Adres e-mail wygląda na niepełny, np. anna@poczta.example.';
  return errors;
};

export const firstErrorField = <K extends string>(
  errors: Partial<Record<K, string>>,
  order: readonly K[],
): K | null => order.find(field => Boolean(errors[field])) ?? null;
