import {
  collectErrors,
  validateConsent,
  validateEmail,
  validateName,
  validatePhone,
  type ErrorMap,
} from './validation';

export type BookingField = 'name' | 'phone' | 'email' | 'consent';

export interface BookingValues {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export const validateBooking = (values: BookingValues): ErrorMap<BookingField> =>
  collectErrors<BookingField>([
    ['name', validateName(values.name)],
    ['phone', validatePhone(values.phone)],
    ['email', validateEmail(values.email)],
    ['consent', validateConsent(values.consent)],
  ]);

export const firstErrorField = (
  errors: ErrorMap<BookingField>,
  order: readonly BookingField[] = ['name', 'phone', 'email', 'consent'],
): BookingField | null => order.find(field => errors[field] !== undefined) ?? null;
