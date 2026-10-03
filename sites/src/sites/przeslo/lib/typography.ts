const noBreakSpace = ' ';
const wordJoiner = '\u2060';

const singleLetterWords = /(^|[\s(„"])([aiouwzAIOUWZ]) (?=\S)/gu;
const numberRange = /(\d)-(?=\d)/gu;
const numberBeforeUnit = /(\d) (?=[\p{L}²]{1,6}(?![\p{L}²]))/gu;

export const tieShortWords = (text: string): string =>
  text
    .replace(
      singleLetterWords,
      (_match, before: string, letter: string) => `${before}${letter}${noBreakSpace}`,
    )
    .replace(
      singleLetterWords,
      (_match, before: string, letter: string) => `${before}${letter}${noBreakSpace}`,
    )
    .replace(numberRange, `$1${wordJoiner}-${wordJoiner}`)
    .replace(numberBeforeUnit, `$1${noBreakSpace}`);

export const tieDeep = <T>(value: T): T => {
  if (typeof value === 'string') return tieShortWords(value) as T;
  if (Array.isArray(value)) return value.map(item => tieDeep(item)) as T;
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, tieDeep(item)]),
    ) as T;
  }
  return value;
};
