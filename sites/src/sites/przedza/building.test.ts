import { describe, expect, it } from 'vitest';
import { ceilingText, columnCount, exposureText, floorName, floors } from './building';

describe('ceilingText', () => {
  it('names the clear height of each floor', () => {
    expect(ceilingText(0)).toBe('3,9 m');
    expect(ceilingText(1)).toBe('3,5 m');
    expect(ceilingText(2)).toBe('3,4 m');
    expect(ceilingText(3)).toBe('3,4 m');
    expect(ceilingText(4)).toBe('od 3,6 do 5,2 m');
  });

  it('has a text for every floor', () => {
    for (const floor of floors) expect(ceilingText(floor).length).toBeGreaterThan(0);
  });
});

describe('exposureText', () => {
  it('adds the south side to the first column and the north side to the last', () => {
    expect(exposureText(1)).toBe('wschód, zachód i południe');
    expect(exposureText(columnCount)).toBe('wschód, zachód i północ');
  });

  it('gives every other column the street and the courtyard', () => {
    for (let column = 2; column < columnCount; column += 1) {
      expect(exposureText(column)).toBe('wschód i zachód');
    }
  });
});

describe('floorName', () => {
  it('calls the ground floor parter and counts the rest', () => {
    expect(floorName(0)).toBe('parter');
    expect(floorName(3)).toBe('piętro 3');
  });
});
