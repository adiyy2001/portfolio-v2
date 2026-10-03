const wordsPerMinute = 200;

export const countWords = (text: string): number =>
  text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;

export const readingMinutes = (words: number): number =>
  Math.max(1, Math.ceil(words / wordsPerMinute));

export const pluralForm = (
  count: number,
  forms: [one: string, few: string, many: string],
): string => {
  if (count === 1) return forms[0];
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew = lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14);
  return isFew ? forms[1] : forms[2];
};

export const readingTimeLabel = (minutes: number): string =>
  `${minutes} ${pluralForm(minutes, ['minuta', 'minuty', 'minut'])} czytania`;
