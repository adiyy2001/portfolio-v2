import { formTopics } from '../data/site';

export interface VisitRequest {
  name: string;
  phone: string;
  topic: string;
}

export type VisitErrors = Partial<Record<keyof VisitRequest, string>>;

export const phoneDigits = (value: string) => value.replace(/\D/g, '');

export const validateVisit = (request: VisitRequest): VisitErrors => {
  const errors: VisitErrors = {};
  if (request.name.trim().length < 2) errors.name = 'Wpisz imię, co najmniej dwie litery.';
  const digits = phoneDigits(request.phone);
  const onlyPhoneCharacters = /^[+\d\s()-]+$/.test(request.phone.trim());
  if (!onlyPhoneCharacters || digits.length < 9 || digits.length > 12) {
    errors.phone = 'Wpisz numer telefonu, na przykład 600 100 200.';
  }
  if (!(formTopics as readonly string[]).includes(request.topic)) {
    errors.topic = 'Wybierz temat z listy.';
  }
  return errors;
};
