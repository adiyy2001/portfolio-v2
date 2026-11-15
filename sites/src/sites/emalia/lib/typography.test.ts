import { describe, expect, it } from 'vitest';
import { nbsp } from './typography';

describe('nbsp', () => {
  it('glues single letter words to the next word', () => {
    expect(nbsp('Badamy zęby i dziąsła w gabinecie')).toBe(
      'Badamy zęby i\u00a0dziąsła w\u00a0gabinecie',
    );
  });

  it('leaves longer words alone', () => {
    expect(nbsp('Ala ma kota')).toBe('Ala ma kota');
  });
});
