import { describe, expect, it } from 'vitest';
import { countWords, pluralForm, readingMinutes, readingTimeLabel } from './reading-time';

describe('countWords', () => {
  it('counts words separated by any whitespace', () => {
    expect(countWords('Kara umowna\n należy się\twierzycielowi')).toBe(5);
  });

  it('ignores stray punctuation and empty strings', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('  ...  ')).toBe(0);
  });

  it('counts numbers as words', () => {
    expect(countWords('art. 483 KC')).toBe(3);
  });
});

describe('readingMinutes', () => {
  it('rounds up to whole minutes at 200 words per minute', () => {
    expect(readingMinutes(1000)).toBe(5);
    expect(readingMinutes(1001)).toBe(6);
  });

  it('never returns less than one minute', () => {
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(30)).toBe(1);
  });
});

describe('pluralForm', () => {
  const forms: [string, string, string] = ['minuta', 'minuty', 'minut'];

  it('uses the singular for one', () => {
    expect(pluralForm(1, forms)).toBe('minuta');
  });

  it('uses the few form for 2 to 4, except the teens', () => {
    expect(pluralForm(2, forms)).toBe('minuty');
    expect(pluralForm(4, forms)).toBe('minuty');
    expect(pluralForm(22, forms)).toBe('minuty');
    expect(pluralForm(12, forms)).toBe('minut');
    expect(pluralForm(14, forms)).toBe('minut');
  });

  it('uses the many form for everything else', () => {
    expect(pluralForm(5, forms)).toBe('minut');
    expect(pluralForm(11, forms)).toBe('minut');
    expect(pluralForm(21, forms)).toBe('minut');
  });
});

describe('readingTimeLabel', () => {
  it('builds the label shown on article pages', () => {
    expect(readingTimeLabel(1)).toBe('1 minuta czytania');
    expect(readingTimeLabel(3)).toBe('3 minuty czytania');
    expect(readingTimeLabel(7)).toBe('7 minut czytania');
  });
});
