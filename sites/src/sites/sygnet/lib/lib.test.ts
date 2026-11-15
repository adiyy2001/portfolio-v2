import { describe, expect, it } from 'vitest';
import { formatLongDate } from './dates';
import { isOpen, warsawWallClock } from './hours';
import { parseInline, plainText } from './inline';
import { NBSP, formatPln, grossFromNet } from './money';
import { documentsLabel, pluralPl } from './plural';
import { countWords, readingMinutes } from './reading';
import { slugify, uniqueSlugs } from './slug';
import { tie } from './tie';
import {
  emptyContact,
  firstErrorField,
  isEmail,
  isPhone,
  normalizePhone,
  validateContact,
} from './validation';

const hours = { openMinute: 9 * 60, closeMinute: 17 * 60 };

describe('pluralPl', () => {
  it('picks the Polish plural form', () => {
    expect(pluralPl(1, 'dokument', 'dokumenty', 'dokumentów')).toBe('dokument');
    expect(pluralPl(2, 'dokument', 'dokumenty', 'dokumentów')).toBe('dokumenty');
    expect(pluralPl(5, 'dokument', 'dokumenty', 'dokumentów')).toBe('dokumentów');
    expect(pluralPl(12, 'dokument', 'dokumenty', 'dokumentów')).toBe('dokumentów');
    expect(pluralPl(22, 'dokument', 'dokumenty', 'dokumentów')).toBe('dokumenty');
  });

  it('labels document counts', () => {
    expect(documentsLabel(5)).toBe('5 dokumentów');
    expect(documentsLabel(1)).toBe('1 dokument');
  });
});

describe('money', () => {
  it('adds VAT to a net amount', () => {
    expect(grossFromNet(400, 23)).toBe(492);
    expect(grossFromNet(600, 23)).toBe(738);
  });

  it('formats złoty with non breaking spaces', () => {
    expect(formatPln(12000)).toBe(`12${NBSP}000${NBSP}zł`);
    expect(formatPln(0)).toBe(`0${NBSP}zł`);
  });
});

describe('slug', () => {
  it('removes Polish letters', () => {
    expect(slugify('Zachowek: komu się należy?')).toBe('zachowek-komu-sie-nalezy');
  });

  it('keeps repeated headings unique', () => {
    expect(uniqueSlugs(['Koszty', 'Koszty', 'Terminy'])).toEqual(['koszty', 'koszty-2', 'terminy']);
  });
});

describe('inline', () => {
  it('parses strong text and links', () => {
    expect(parseInline('To **ważne** i [tutaj](/a/) działa.')).toEqual([
      { kind: 'text', text: 'To ' },
      { kind: 'strong', text: 'ważne' },
      { kind: 'text', text: ' i ' },
      { kind: 'link', text: 'tutaj', href: '/a/' },
      { kind: 'text', text: ' działa.' },
    ]);
  });

  it('strips markup for plain text', () => {
    expect(plainText('To **ważne** i [tutaj](/a/).')).toBe('To ważne i tutaj.');
  });
});

describe('reading', () => {
  it('counts words and rounds minutes up to one', () => {
    expect(countWords('Ala ma kota, 2 psy i —')).toBe(6);
    expect(readingMinutes(10)).toBe(1);
    expect(readingMinutes(600)).toBe(3);
  });
});

describe('dates', () => {
  it('writes the month in the genitive', () => {
    expect(formatLongDate('2026-11-11')).toBe('11 listopada 2026');
  });
});

describe('tie', () => {
  it('ties single letters, units and numbers', () => {
    expect(tie('a w domu')).toBe(`a${NBSP}w${NBSP}domu`);
    expect(tie('20 minut i 0 zł')).toBe(`20${NBSP}minut i${NBSP}0${NBSP}zł`);
    expect(tie('art. 991')).toBe(`art.${NBSP}991`);
  });
});

describe('opening hours', () => {
  it('is open on weekdays between 9:00 and 17:00', () => {
    expect(isOpen({ weekday: 3, minutes: 9 * 60 }, hours)).toBe(true);
    expect(isOpen({ weekday: 5, minutes: 16 * 60 + 59 }, hours)).toBe(true);
  });

  it('is closed before opening, at closing and on weekends', () => {
    expect(isOpen({ weekday: 3, minutes: 8 * 60 + 59 }, hours)).toBe(false);
    expect(isOpen({ weekday: 3, minutes: 17 * 60 }, hours)).toBe(false);
    expect(isOpen({ weekday: 6, minutes: 12 * 60 }, hours)).toBe(false);
    expect(isOpen({ weekday: 7, minutes: 12 * 60 }, hours)).toBe(false);
  });

  it('reads the wall clock in Warsaw', () => {
    expect(warsawWallClock(new Date('2026-11-16T08:30:00Z'))).toEqual({
      weekday: 1,
      minutes: 9 * 60 + 30,
    });
    expect(warsawWallClock(new Date('2026-07-18T21:59:00Z'))).toEqual({
      weekday: 6,
      minutes: 23 * 60 + 59,
    });
  });
});

describe('validation', () => {
  const valid = {
    name: 'Jan Kowalski',
    contact: '600 700 800',
    matter: 'rodzina',
    message: 'Chcę zapytać o alimenty.',
  };

  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('reports every missing field in order', () => {
    const errors = validateContact(emptyContact);
    expect(Object.keys(errors)).toEqual(['name', 'contact', 'matter', 'message']);
    expect(firstErrorField(errors)).toBe('name');
  });

  it('accepts phone numbers and e-mails only', () => {
    expect(isPhone('+48 600-700-800')).toBe(true);
    expect(normalizePhone('0048 600 700 800')).toBe('600700800');
    expect(isPhone('12345')).toBe(false);
    expect(isEmail('jan@firma.example')).toBe(true);
    expect(isEmail('jan@firma')).toBe(false);
    expect(validateContact({ ...valid, contact: 'jan' }).contact).toBeDefined();
  });

  it('rejects an unknown matter and a short message', () => {
    const errors = validateContact({ ...valid, matter: 'x', message: 'krótko' });
    expect(errors.matter).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
