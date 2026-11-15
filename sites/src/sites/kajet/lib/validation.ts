export interface QuoteValues {
  email: string;
  forma: string;
  faktur: string;
  name: string;
  phone: string;
  consent: boolean;
}

export type QuoteField = 'email' | 'forma' | 'faktur' | 'name' | 'phone' | 'consent';
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const quoteFieldOrder: readonly QuoteField[] = [
  'email',
  'forma',
  'faktur',
  'name',
  'phone',
  'consent',
];

export const formaOptions = ['osoba fizyczna', 'spółka z o.o.'] as const;

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value.trim());

export const normalizePhone = (value: string): string | null => {
  const stripped = value.replace(/[\s\-().]/g, '');
  const national = stripped.replace(/^(\+48|0048)/, '');
  return /^[1-9]\d{8}$/.test(national) ? national : null;
};

export const parseInvoiceCount = (value: string): number | null => {
  const text = value.trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  return Number(text);
};

export const validateQuote = (values: QuoteValues, full: boolean): QuoteErrors => {
  const errors: QuoteErrors = {};
  if (!values.email.trim()) errors.email = 'Wpisz adres e-mail.';
  else if (!isValidEmail(values.email)) errors.email = 'To nie wygląda na adres e-mail.';
  if (values.forma && !formaOptions.some(option => option === values.forma)) {
    errors.forma = 'Wybierz formę firmy z listy.';
  }
  if (values.faktur.trim() && parseInvoiceCount(values.faktur) === null) {
    errors.faktur = 'Wpisz liczbę faktur jako liczbę całkowitą od 0 do 999.';
  }
  if (full) {
    if (values.name.trim().length < 2) errors.name = 'Wpisz imię i nazwisko albo nazwę firmy.';
    if (values.phone.trim() && !normalizePhone(values.phone)) {
      errors.phone = 'Telefon ma mieć 9 cyfr, na przykład 600 100 200.';
    }
    if (!values.consent) errors.consent = 'Zaznacz zgodę na kontakt w sprawie wyceny.';
  }
  return errors;
};

export const firstInvalidField = (errors: QuoteErrors): QuoteField | null =>
  quoteFieldOrder.find(field => errors[field]) ?? null;

export interface QuotePrefill {
  email: string | null;
  forma: 'osoba' | 'spolka' | null;
  faktur: number | null;
  plan: string | null;
}

const formaFromParam = (value: string | null): 'osoba' | 'spolka' | null => {
  if (value === 'osoba' || value === 'osoba fizyczna') return 'osoba';
  if (value === 'spolka' || value === 'spółka z o.o.') return 'spolka';
  return null;
};

export const parseQuoteParams = (search: string): QuotePrefill => {
  const params = new URLSearchParams(search);
  const email = params.get('email');
  const faktur = params.get('faktur');
  const plan = params.get('plan');
  const count = faktur === null ? null : parseInvoiceCount(faktur);
  return {
    email: email !== null && isValidEmail(email) ? email.trim() : null,
    forma: formaFromParam(params.get('forma')),
    faktur: count,
    plan: plan === 'maly' || plan === 'sredni' || plan === 'duzy' ? plan : null,
  };
};
