import { describe, expect, it } from 'vitest';
import { capitalize, formatPrice, tie, tieHtml } from './format';

const NBSP = ' ';

describe('tie', () => {
  it('joins a single-letter word with the next word', () => {
    expect(tie('Pracuję w gabinecie i online.')).toBe(`Pracuję w${NBSP}gabinecie i${NBSP}online.`);
  });

  it('handles single-letter words that follow each other', () => {
    expect(tie('o i w domu')).toBe(`o${NBSP}i${NBSP}w${NBSP}domu`);
  });

  it('handles capital letters at the start of a sentence', () => {
    expect(tie('W domu. A potem Z nami.')).toBe(`W${NBSP}domu. A${NBSP}potem Z${NBSP}nami.`);
  });

  it('joins a number with the word that follows it', () => {
    expect(tie('Sesja trwa 50 minut i kosztuje 240 zł.')).toBe(
      `Sesja trwa 50${NBSP}minut i${NBSP}kosztuje 240${NBSP}zł.`,
    );
  });

  it('keeps the groups of a phone number together', () => {
    expect(tie('Zadzwoń: 800 70 2222.')).toBe(`Zadzwoń: 800${NBSP}70${NBSP}2222.`);
  });

  it('joins an address abbreviation with the street name', () => {
    expect(tie('ul. Sienkiewicza 41/6')).toBe(`ul.${NBSP}Sienkiewicza 41/6`);
  });

  it('leaves longer words and punctuation alone', () => {
    expect(tie('Ala ma kota, a kot ma Alę.')).toBe(`Ala ma kota, a${NBSP}kot ma Alę.`);
    expect(tie('Zadzwoń pod numer 112.')).toBe('Zadzwoń pod numer 112.');
  });
});

describe('tieHtml', () => {
  it('changes text and keeps tags and attributes intact', () => {
    expect(tieHtml('<p class="a i b" title="w domu">Tak w domu</p>')).toBe(
      `<p class="a i b" title="w domu">Tak w${NBSP}domu</p>`,
    );
  });

  it('does not touch script and style blocks', () => {
    const html =
      '<script>const a = "w domu";</script><style>.a { content: "i w"; }</style><p>i w domu</p>';
    expect(tieHtml(html)).toBe(
      `<script>const a = "w domu";</script><style>.a { content: "i w"; }</style><p>i${NBSP}w${NBSP}domu</p>`,
    );
  });

  it('does not touch comments', () => {
    expect(tieHtml('<!-- w domu --><b>w domu</b>')).toBe(`<!-- w domu --><b>w${NBSP}domu</b>`);
  });
});

describe('formatPrice', () => {
  it('writes the amount with a non-breaking space before the currency', () => {
    expect(formatPrice(240)).toBe(`240${NBSP}zł`);
    expect(formatPrice(1200)).toBe(`1200${NBSP}zł`);
  });
});

describe('capitalize', () => {
  it('raises the first letter', () => {
    expect(capitalize('lęk, napady paniki')).toBe('Lęk, napady paniki');
  });

  it('handles Polish letters', () => {
    expect(capitalize('łzy')).toBe('Łzy');
    expect(capitalize('żałoba')).toBe('Żałoba');
  });

  it('leaves an empty string alone', () => {
    expect(capitalize('')).toBe('');
  });
});
