import { isValidEmail } from './guest';
import type { FieldProblem } from './guest';

export type ContactTopic = 'booking' | 'change' | 'group' | 'voucher' | 'other';

export const contactTopics: readonly ContactTopic[] = [
  'booking',
  'change',
  'group',
  'voucher',
  'other',
];

export const maxContactMessageLength = 1000;
export const minContactMessageLength = 10;

export interface ContactDraft {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

export type ContactProblem = FieldProblem | 'tooShort';

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', ContactProblem>>;

export const emptyContact: ContactDraft = { name: '', email: '', topic: 'booking', message: '' };

export const isContactTopic = (value: string): value is ContactTopic =>
  contactTopics.some(topic => topic === value);

const letterCount = (value: string): number => (value.match(/\p{L}/gu) ?? []).length;

export const validateContact = (draft: ContactDraft): ContactErrors => {
  const errors: ContactErrors = {};
  const name = draft.name.trim();
  if (name === '') errors.name = 'required';
  else if (letterCount(name) < 2) errors.name = 'invalidName';
  else if (name.length > 80) errors.name = 'tooLong';

  const email = draft.email.trim();
  if (email === '') errors.email = 'required';
  else if (!isValidEmail(email)) errors.email = 'invalidEmail';

  const message = draft.message.trim();
  if (message === '') errors.message = 'required';
  else if (message.length < minContactMessageLength) errors.message = 'tooShort';
  else if (draft.message.length > maxContactMessageLength) errors.message = 'tooLong';
  return errors;
};
