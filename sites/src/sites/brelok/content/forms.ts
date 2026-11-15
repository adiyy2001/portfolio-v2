import type { Lang } from '../i18n/lang';
import type { FieldProblem } from '../lib/validation';

const pl = {
  name: 'Imię i nazwisko',
  phone: 'Telefon',
  email: 'Adres e-mail',
  arrival: 'Przyjazd',
  nights: 'Liczba dób',
  nightsDown: 'Zmniejsz liczbę dób',
  nightsUp: 'Zwiększ liczbę dób',
  guests: 'Liczba osób',
  guestsDown: 'Zmniejsz liczbę osób',
  guestsUp: 'Zwiększ liczbę osób',
  note: 'Uwagi do pobytu (nieobowiązkowe)',
  message: 'Wiadomość',
  errorsHeading: 'Prosimy poprawić pola',
  sampleNothingSent:
    'To strona przykładowa: nic nie zostało wysłane ani zapisane poza tą przeglądarką.',
  errors: {
    name: {
      required: 'Proszę podać imię i nazwisko.',
      invalid: 'Imię i nazwisko powinno mieć co najmniej trzy znaki.',
    },
    phone: {
      required: 'Proszę podać numer telefonu.',
      invalid: 'Numer telefonu powinien mieć co najmniej dziewięć cyfr.',
    },
    email: {
      required: 'Proszę podać adres e-mail.',
      invalid: 'Adres e-mail wygląda na niepełny, na przykład imie@poczta.example.',
    },
    arrival: {
      required: 'Proszę wybrać datę przyjazdu.',
      invalid: 'Proszę wybrać datę przyjazdu z kalendarza.',
      past: 'Data przyjazdu nie może być z przeszłości.',
      far: 'Przyjmujemy rezerwacje na rok do przodu.',
    },
    message: {
      required: 'Proszę napisać wiadomość.',
      invalid: 'Wiadomość jest za krótka, prosimy o co najmniej dziesięć znaków.',
    },
  },
};

const en: typeof pl = {
  name: 'Full name',
  phone: 'Phone',
  email: 'Email address',
  arrival: 'Arrival',
  nights: 'Nights',
  nightsDown: 'Fewer nights',
  nightsUp: 'More nights',
  guests: 'Guests',
  guestsDown: 'Fewer guests',
  guestsUp: 'More guests',
  note: 'Notes for your stay (optional)',
  message: 'Message',
  errorsHeading: 'Please correct these fields',
  sampleNothingSent:
    'This is a sample website: nothing was sent, and nothing is stored outside this browser.',
  errors: {
    name: {
      required: 'Please enter your full name.',
      invalid: 'The name needs at least three characters.',
    },
    phone: {
      required: 'Please enter a phone number.',
      invalid: 'The phone number needs at least nine digits.',
    },
    email: {
      required: 'Please enter an email address.',
      invalid: 'The email address looks incomplete, for example name@mail.example.',
    },
    arrival: {
      required: 'Please choose an arrival date.',
      invalid: 'Please choose the arrival date from the calendar.',
      past: 'The arrival date cannot be in the past.',
      far: 'We take bookings up to a year ahead.',
    },
    message: {
      required: 'Please write a message.',
      invalid: 'The message is too short, please write at least ten characters.',
    },
  },
};

export const forms: Record<Lang, typeof pl> = { pl, en };

type ProblemMap = Record<FieldProblem, string>;

export const problemText = (
  lang: Lang,
  field: 'name' | 'phone' | 'email' | 'arrival' | 'message',
  problem: FieldProblem | null,
): string => {
  if (problem === null) return '';
  const map = forms[lang].errors[field] as Partial<ProblemMap>;
  return map[problem] ?? map.invalid ?? '';
};
