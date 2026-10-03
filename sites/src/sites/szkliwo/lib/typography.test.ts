import { describe, expect, it } from 'vitest';
import { tie } from './typography';

const nbsp = ' ';

describe('tie', () => {
  it('binds single letter words to the next word', () => {
    expect(tie('Rano w gabinecie i w domu')).toBe(`Rano w${nbsp}gabinecie i${nbsp}w${nbsp}domu`);
  });

  it('binds a single letter word at the start of the text', () => {
    expect(tie('A potem kontrola')).toBe(`A${nbsp}potem kontrola`);
  });

  it('keeps longer words apart', () => {
    expect(tie('Zabieg na wizycie')).toBe('Zabieg na wizycie');
  });

  it('binds numbers to their units', () => {
    expect(tie('Zabieg trwa 45 minut i kosztuje 380 zł')).toBe(
      `Zabieg trwa 45${nbsp}minut i${nbsp}kosztuje 380${nbsp}zł`,
    );
  });

  it('does not glue a number to a longer word that only starts like a unit', () => {
    expect(tie('Mamy 3 minutnik')).toBe('Mamy 3 minutnik');
  });

  it('binds abbreviations to the name that follows', () => {
    expect(tie('lek. dent. Helena Targowska, ul. Pułaskiego')).toBe(
      `lek.${nbsp}dent.${nbsp}Helena Targowska, ul.${nbsp}Pułaskiego`,
    );
  });

  it('binds a quotation mark opening word', () => {
    expect(tie('To jest „w domu” dobrze')).toBe(`To jest „w${nbsp}domu” dobrze`);
  });
});
