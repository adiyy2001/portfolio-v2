import { isValidNip } from './nip';

export type ArrivalWindow = '' | 'afternoon' | 'evening' | 'night' | 'late';

export const arrivalWindows: readonly ArrivalWindow[] = [
  '',
  'afternoon',
  'evening',
  'night',
  'late',
];

export const isArrivalWindow = (value: unknown): value is ArrivalWindow =>
  typeof value === 'string' && arrivalWindows.some(window => window === value);

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  arrivalWindow: ArrivalWindow;
  notes: string;
}

export interface InvoiceDetails {
  company: string;
  nip: string;
  street: string;
  postalCode: string;
  city: string;
}

export const emptyGuest: GuestDetails = {
  name: '',
  email: '',
  phone: '',
  arrivalWindow: '',
  notes: '',
};

export const emptyInvoice: InvoiceDetails = {
  company: '',
  nip: '',
  street: '',
  postalCode: '',
  city: '',
};

export type FieldProblem =
  | 'required'
  | 'invalidName'
  | 'invalidEmail'
  | 'invalidPhone'
  | 'invalidNip'
  | 'invalidPostalCode'
  | 'tooLong';

export type GuestErrors = Partial<Record<'name' | 'email' | 'phone' | 'notes', FieldProblem>>;
export type InvoiceErrors = Partial<Record<keyof InvoiceDetails, FieldProblem>>;

export const maxNotesLength = 300;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?\d{9,15}$/;
const postalCodePattern = /^\d{2}-\d{3}$/;

export const isValidEmail = (value: string): boolean => emailPattern.test(value.trim());

export const isValidPhone = (value: string): boolean =>
  phonePattern.test(value.replace(/[\s().-]/g, ''));

const hasTwoLetters = (value: string): boolean => (value.match(/\p{L}/gu) ?? []).length >= 2;

export const validateGuest = (guest: GuestDetails): GuestErrors => {
  const errors: GuestErrors = {};
  const name = guest.name.trim();
  if (name === '') errors.name = 'required';
  else if (!hasTwoLetters(name)) errors.name = 'invalidName';
  else if (name.length > 80) errors.name = 'tooLong';

  const email = guest.email.trim();
  if (email === '') errors.email = 'required';
  else if (!isValidEmail(email)) errors.email = 'invalidEmail';

  const phone = guest.phone.trim();
  if (phone === '') errors.phone = 'required';
  else if (!isValidPhone(phone)) errors.phone = 'invalidPhone';

  if (guest.notes.length > maxNotesLength) errors.notes = 'tooLong';
  return errors;
};

export const validateInvoice = (invoice: InvoiceDetails): InvoiceErrors => {
  const errors: InvoiceErrors = {};
  if (invoice.company.trim() === '') errors.company = 'required';
  else if (invoice.company.trim().length > 120) errors.company = 'tooLong';

  if (invoice.nip.trim() === '') errors.nip = 'required';
  else if (!isValidNip(invoice.nip)) errors.nip = 'invalidNip';

  if (invoice.street.trim() === '') errors.street = 'required';
  else if (invoice.street.trim().length > 100) errors.street = 'tooLong';

  if (invoice.postalCode.trim() === '') errors.postalCode = 'required';
  else if (!postalCodePattern.test(invoice.postalCode.trim()))
    errors.postalCode = 'invalidPostalCode';

  if (invoice.city.trim() === '') errors.city = 'required';
  else if (invoice.city.trim().length > 60) errors.city = 'tooLong';
  return errors;
};

export const hasErrors = (errors: object): boolean => Object.keys(errors).length > 0;
