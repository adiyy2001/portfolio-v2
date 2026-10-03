import { describe, expect, it } from 'vitest';
import {
  classifyContact,
  validateArea,
  validateConsent,
  validateContact,
  validateDescription,
  validateForm,
  validateName,
  type FormValues,
} from './validation';

describe('classifyContact', () => {
  it('accepts Polish phone numbers in common notations', () => {
    expect(classifyContact('600100200')).toBe('phone');
    expect(classifyContact('600 100 200')).toBe('phone');
    expect(classifyContact('600-100-200')).toBe('phone');
    expect(classifyContact('+48 600 100 200')).toBe('phone');
    expect(classifyContact('0048600100200')).toBe('phone');
    expect(classifyContact('48 600 100 200')).toBe('phone');
    expect(classifyContact('(71) 000 00 01')).toBe('phone');
  });

  it('accepts foreign numbers with a plus sign', () => {
    expect(classifyContact('+49 30 123456')).toBe('phone');
  });

  it('rejects numbers that are too short or too long', () => {
    expect(classifyContact('60010020')).toBeUndefined();
    expect(classifyContact('6001002001')).toBeUndefined();
    expect(classifyContact('+48 600 100')).toBeUndefined();
  });

  it('rejects a Polish number starting with zero', () => {
    expect(classifyContact('012345678')).toBeUndefined();
  });

  it('accepts ordinary e-mail addresses', () => {
    expect(classifyContact('ty@firma.pl')).toBe('email');
    expect(classifyContact('  imie.nazwisko+kancelaria@mail.example.com ')).toBe('email');
  });

  it('rejects malformed e-mail addresses', () => {
    expect(classifyContact('ty@firma')).toBeUndefined();
    expect(classifyContact('ty@@firma.pl')).toBeUndefined();
    expect(classifyContact('ty firma@x.pl')).toBeUndefined();
    expect(classifyContact('@firma.pl')).toBeUndefined();
  });

  it('rejects empty and blank values', () => {
    expect(classifyContact('')).toBeUndefined();
    expect(classifyContact('   ')).toBeUndefined();
  });

  it('rejects text that is neither', () => {
    expect(classifyContact('zadzwońcie do mnie')).toBeUndefined();
  });
});

describe('validateName', () => {
  it('requires at least two characters', () => {
    expect(validateName('')).toBe('Podaj imię i nazwisko.');
    expect(validateName(' A ')).toBe('Podaj imię i nazwisko.');
    expect(validateName('Ewa Nowak')).toBeUndefined();
  });

  it('rejects absurdly long values', () => {
    expect(validateName('a'.repeat(101))).toContain('100');
  });
});

describe('validateContact', () => {
  it('asks for a value when empty', () => {
    expect(validateContact('')).toBe('Podaj numer telefonu albo adres e-mail.');
  });

  it('explains what is wrong with an unrecognised value', () => {
    expect(validateContact('abc')).toContain('telefon ani e-mail');
  });

  it('accepts valid values', () => {
    expect(validateContact('600 100 200')).toBeUndefined();
    expect(validateContact('ty@firma.pl')).toBeUndefined();
  });
});

describe('validateArea', () => {
  const areas = ['prawo-spolek', 'umowy', 'nie-wiem'];

  it('accepts only listed values', () => {
    expect(validateArea('umowy', areas)).toBeUndefined();
    expect(validateArea('', areas)).toBeDefined();
    expect(validateArea('podatki', areas)).toBeDefined();
  });
});

describe('validateDescription', () => {
  it('requires a few sentences', () => {
    expect(validateDescription('krótko')).toContain('co najmniej 20');
    expect(validateDescription('x'.repeat(19))).toBeDefined();
    expect(validateDescription('x'.repeat(20))).toBeUndefined();
  });

  it('counts trimmed characters', () => {
    expect(validateDescription(`   ${'x'.repeat(19)}   `)).toBeDefined();
  });

  it('rejects text over the limit', () => {
    expect(validateDescription('x'.repeat(1500))).toBeUndefined();
    expect(validateDescription('x'.repeat(1501))).toContain('1500');
  });
});

describe('validateConsent', () => {
  it('requires the box to be ticked', () => {
    expect(validateConsent(false)).toBeDefined();
    expect(validateConsent(true)).toBeUndefined();
  });
});

describe('validateForm', () => {
  const valid: FormValues = {
    name: 'Ewa Nowak',
    contact: '600 100 200',
    area: 'umowy',
    description: 'Kontrahent przysłał umowę i chcę ją przejrzeć przed podpisem.',
    consent: true,
  };
  const areas = ['umowy', 'spory-sadowe'];

  it('returns no errors for a valid form', () => {
    expect(validateForm(valid, areas)).toEqual({});
  });

  it('returns an error for each invalid field, in form order', () => {
    const errors = validateForm(
      { name: '', contact: '', area: '', description: '', consent: false },
      areas,
    );
    expect(Object.keys(errors)).toEqual(['name', 'contact', 'area', 'description', 'consent']);
  });

  it('flags only the fields that are wrong', () => {
    const errors = validateForm({ ...valid, contact: 'nie wiem' }, areas);
    expect(Object.keys(errors)).toEqual(['contact']);
  });
});
