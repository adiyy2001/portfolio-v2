import { describe, expect, it } from 'vitest';
import { tie } from './tie';

const NBSP = ' ';

describe('tie', () => {
  it('joins one-letter words with the next word', () => {
    expect(tie('Umowa z kontrahentem w sporze')).toBe(`Umowa z${NBSP}kontrahentem w${NBSP}sporze`);
  });

  it('handles one-letter words at the start and after quotes or brackets', () => {
    expect(tie('A potem (o tym) „i tamto”')).toBe(`A${NBSP}potem (o${NBSP}tym) „i${NBSP}tamto”`);
  });

  it('keeps e-mail from breaking at the hyphen', () => {
    expect(tie('telefon lub e-mail')).toBe('telefon lub e\u2060-\u2060mail');
    expect(tie('wiadomość e-mailem')).toBe('wiadomość e\u2060-\u2060mailem');
  });

  it('handles a run of one-letter words', () => {
    expect(tie('a w z domu')).toBe(`a${NBSP}w${NBSP}z${NBSP}domu`);
  });

  it('does not touch letters inside words', () => {
    expect(tie('Dłużnik zapłacił')).toBe('Dłużnik zapłacił');
  });

  it('keeps article numbers and paragraph signs together', () => {
    expect(tie('art. 483 § 1 KC')).toBe(`art.${NBSP}483 §${NBSP}1 KC`);
    expect(tie('pkt 3 oraz ust. 2')).toBe(`pkt${NBSP}3 oraz ust.${NBSP}2`);
  });

  it('does not add a dot to abbreviations written without one', () => {
    expect(tie('nr 12')).toBe(`nr${NBSP}12`);
  });

  it('does not tie words that merely end with an abbreviation', () => {
    expect(tie('part 5 stron')).toBe(`part 5${NBSP}stron`);
  });

  it('keeps street abbreviations with the street name', () => {
    expect(tie('ul. Kuźnicza 40')).toBe(`ul.${NBSP}Kuźnicza 40`);
  });

  it('groups thousands', () => {
    expect(tie('od 2 400 zł')).toBe(`od 2${NBSP}400${NBSP}zł`);
    expect(tie('1 250 000 zł')).toBe(`1${NBSP}250${NBSP}000${NBSP}zł`);
  });

  it('keeps numbers with their units', () => {
    expect(tie('14 dni i 20 minut oraz 23 %')).toBe(
      `14${NBSP}dni i${NBSP}20${NBSP}minut oraz 23${NBSP}%`,
    );
  });

  it('does not tie a number to a longer word that only starts like a unit', () => {
    expect(tie('3 dniówki')).toBe('3 dniówki');
  });

  it('keeps day, month and year together', () => {
    expect(tie('2 października 2026 r.')).toBe(`2${NBSP}października${NBSP}2026${NBSP}r.`);
  });

  it('is idempotent', () => {
    const once = tie('Opłata wynosi 5 000 zł w 2026 roku (art. 13 § 1).');
    expect(tie(once)).toBe(once);
  });

  it('leaves text without anything to tie unchanged', () => {
    expect(tie('Kancelaria radcy prawnego')).toBe('Kancelaria radcy prawnego');
  });
});
