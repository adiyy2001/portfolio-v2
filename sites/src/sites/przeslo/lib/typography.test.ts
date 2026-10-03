import { describe, expect, it } from 'vitest';
import { tieDeep, tieShortWords } from './typography';

const nbsp = ' ';

describe('Polish typography', () => {
  it('keeps a number range on one line', () => {
    expect(tieShortWords('lata 1906-1908')).toBe('lata 1906\u2060-\u20601908');
  });

  it('ties single letter words to the next word', () => {
    expect(tieShortWords('Pokój w kamienicy z widokiem na Odrę i podwórze')).toBe(
      `Pokój w${nbsp}kamienicy z${nbsp}widokiem na Odrę i${nbsp}podwórze`,
    );
  });

  it('ties letters that follow each other', () => {
    expect(tieShortWords('a w z i o u')).toBe(`a${nbsp}w${nbsp}z${nbsp}i${nbsp}o${nbsp}u`);
  });

  it('ties a number to its unit', () => {
    expect(tieShortWords('17 m² i 340 zł za 2 noce, 5 minut pieszo')).toBe(
      `17${nbsp}m² i${nbsp}340${nbsp}zł za 2${nbsp}noce, 5${nbsp}minut pieszo`,
    );
  });

  it('leaves longer words and the end of the text alone', () => {
    expect(tieShortWords('Do recepcji na parterze')).toBe('Do recepcji na parterze');
    expect(tieShortWords('Do widzenia w')).toBe('Do widzenia w');
  });

  it('ties inside quotes', () => {
    expect(tieShortWords('Nazywamy to „w miarę cicho”')).toBe(`Nazywamy to „w${nbsp}miarę cicho”`);
  });

  it('walks nested copy without changing its shape', () => {
    const copy = { title: 'Pokój z widokiem', list: ['w domu', { note: 'o 7' }], count: 3 };
    expect(tieDeep(copy)).toEqual({
      title: `Pokój z${nbsp}widokiem`,
      list: [`w${nbsp}domu`, { note: `o${nbsp}7` }],
      count: 3,
    });
  });
});
