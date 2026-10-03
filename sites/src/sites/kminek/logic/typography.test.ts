import { describe, expect, it } from 'vitest';
import { tie } from './typography';

const bound = (text: string) =>
  text.replaceAll('~', String.fromCharCode(0xa0)).replaceAll('^', String.fromCharCode(0x2060));

describe('tie', () => {
  it('glues single letter words to the next word', () => {
    expect(tie('Śledź w oleju z jabłkiem i cebulą')).toBe(
      bound('Śledź w~oleju z~jabłkiem i~cebulą'),
    );
  });

  it('handles a lonely letter at the start of the text', () => {
    expect(tie('W poniedziałek jedziemy na targ')).toBe(bound('W~poniedziałek jedziemy na targ'));
  });

  it('handles neighbouring single letters', () => {
    expect(tie('w i z domu')).toBe(bound('w~i~z~domu'));
  });

  it('glues numbers to their unit', () => {
    expect(tie('34 zł za 8 osób, 0,4 l piwa')).toBe(bound('34~zł za 8~osób, 0,4~l~piwa'));
  });

  it('keeps time and number ranges on one line', () => {
    expect(tie('13:00-16:00')).toBe(bound('13:00-^16:00'));
    expect(tie('Wt-Nd 12:00-22:00')).toBe(bound('Wt-Nd 12:00-^22:00'));
  });

  it('leaves other spaces alone', () => {
    expect(tie('Kuchnia polska, podana od nowa')).toBe('Kuchnia polska, podana od nowa');
  });
});
