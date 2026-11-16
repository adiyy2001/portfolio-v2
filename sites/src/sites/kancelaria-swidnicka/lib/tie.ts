const NBSP = '\u00a0';
const WORD_JOINER = '\u2060';

const units =
  'zł|%|dni|dzień|dnia|tygodni|miesięcy|miesiące|miesiąc|lat|lata|rok|roku|godz\\.|godzinę|godzin|minut|minuty|min|stron|strony';
const months =
  'stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia';

const rules: Array<[RegExp, string]> = [
  [/(?<![\p{L}])(e)-(mail)/giu, `$1${WORD_JOINER}-${WORD_JOINER}$2`],
  [/(?<=^|[\s(„"])([aiouwzAIOUWZ]) (?=\S)/g, `$1${NBSP}`],
  [/(?<![\p{L}])(art|ust|pkt|nr|tel)(\.?) (?=[\d§])/gu, `$1$2${NBSP}`],
  [/§ (?=\d)/g, `§${NBSP}`],
  [/(?<![\p{L}])(ul)\. (?=\p{Lu})/gu, `$1.${NBSP}`],
  [/(?<=\d) (?=\d{3}(?!\d))/g, NBSP],
  [new RegExp(`(?<=\\d) (?=(?:${units})(?![\\p{L}]))`, 'gu'), NBSP],
  [new RegExp(`(?<=\\d{1,2}) (?=(?:${months})(?![\\p{L}]))`, 'gu'), NBSP],
  [new RegExp(`(?<=(?:${months})) (?=\\d{4}(?!\\d))`, 'gu'), NBSP],
];

export const tie = (text: string): string =>
  rules.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
