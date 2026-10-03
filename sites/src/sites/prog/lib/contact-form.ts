import {
  collectErrors,
  validateConsent,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  type ErrorMap,
} from './validation';

export type ContactTopic = 'kupno' | 'wynajem' | 'sprzedaz' | 'inne';
export type ContactField = 'topic' | 'name' | 'phone' | 'email' | 'message' | 'consent';

export interface ContactValues {
  topic: ContactTopic | '';
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
}

export const contactTopics: readonly { value: ContactTopic; label: string }[] = [
  { value: 'kupno', label: 'Chcę kupić' },
  { value: 'wynajem', label: 'Chcę wynająć lub wynająć komuś' },
  { value: 'sprzedaz', label: 'Chcę sprzedać' },
  { value: 'inne', label: 'Coś innego' },
];

export const contactFieldOrder: readonly ContactField[] = [
  'topic',
  'name',
  'phone',
  'email',
  'message',
  'consent',
];

export const emptyContact: ContactValues = {
  topic: '',
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
};

export const validateContact = (values: ContactValues): ErrorMap<ContactField> =>
  collectErrors<ContactField>([
    ['topic', values.topic === '' ? 'Wybierz, czego dotyczy wiadomość.' : null],
    ['name', validateName(values.name)],
    ['phone', validatePhone(values.phone)],
    ['email', validateEmail(values.email)],
    ['message', validateMessage(values.message)],
    ['consent', validateConsent(values.consent)],
  ]);

export const topicLabel = (topic: ContactTopic | ''): string =>
  contactTopics.find(item => item.value === topic)?.label ?? '';
