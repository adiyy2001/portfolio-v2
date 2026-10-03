import { describe, expect, it } from 'vitest';
import { tie, tieHtml } from './tie';

const nbsp = ' ';

describe('tie', () => {
  it('glues single letter words to the next word', () => {
    expect(tie('Księga w biurze i w domu')).toBe(`Księga w${nbsp}biurze i${nbsp}w${nbsp}domu`);
  });

  it('handles capital letters, a leading letter and chains of letters', () => {
    expect(tie('A potem Z nami')).toBe(`A${nbsp}potem Z${nbsp}nami`);
    expect(tie('i w z domu')).toBe(`i${nbsp}w${nbsp}z${nbsp}domu`);
  });

  it('glues numbers to units', () => {
    expect(tie('od 229 zł, 10 tys. zł, 2 mln zł, 2026 r., 12 dni')).toBe(
      `od 229${nbsp}zł, 10${nbsp}tys. zł, 2${nbsp}mln zł, 2026${nbsp}r., 12${nbsp}dni`,
    );
  });

  it('keeps thousands groups together', () => {
    expect(tie('do 10 000 zł i 1 250 000 zł')).toBe(
      `do 10${nbsp}000${nbsp}zł i${nbsp}1${nbsp}250${nbsp}000${nbsp}zł`,
    );
    expect(tie('20 dnia 15')).toBe('20 dnia 15');
  });

  it('glues legal abbreviations to their numbers', () => {
    expect(tie('art. 106i ust. 1 pkt 2')).toBe(`art.${nbsp}106i ust.${nbsp}1 pkt${nbsp}2`);
  });

  it('keeps longer words apart', () => {
    expect(tie('ZUS do 20 dnia')).toBe('ZUS do 20 dnia');
  });
});

describe('tieHtml', () => {
  it('changes text nodes and leaves tags and attributes alone', () => {
    expect(tieHtml('<p class="a b" title="w domu">Mamy w domu <b>i w pracy</b></p>')).toBe(
      `<p class="a b" title="w domu">Mamy w${nbsp}domu <b>i${nbsp}w${nbsp}pracy</b></p>`,
    );
  });

  it('keeps a trailing single letter word with the next inline element', () => {
    expect(tieHtml('<p>Mamy w <b>domu</b></p>')).toBe(`<p>Mamy w${nbsp}<b>domu</b></p>`);
  });

  it('does not touch scripts and styles', () => {
    const source = '<style>a > a { color: red }</style><script>var a = 1; if (a  w) {}</script>';
    expect(tieHtml(source)).toBe(source);
  });
});
