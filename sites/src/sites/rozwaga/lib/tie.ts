const NBSP = ' ';

const months =
  'stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia';

const units = [
  'zł',
  'PLN',
  'EUR',
  'euro',
  'USD',
  '%',
  'dni',
  'dzień',
  'dnia',
  'tygodnie',
  'tygodni',
  'tydzień',
  'miesiące',
  'miesięcy',
  'miesiąc',
  'lat',
  'lata',
  'rok',
  'roku',
  'godz.',
  'godzin',
  'godziny',
  'godzinę',
  'minut',
  'minuty',
  'minutę',
  'min',
  'słów',
  'stron',
  'strony',
  'stronę',
  'm2',
  'km',
].join('|');

const WORD_JOINER = '\u2060';

const rules: [RegExp, string][] = [
  [/(?<![\p{L}])(e)-(mail)/giu, `$1${WORD_JOINER}-${WORD_JOINER}$2`],
  [/(?<=^|[\s(„"])([aiouwzAIOUWZ]) (?=\S)/g, `$1${NBSP}`],
  [/(?<![\p{L}])(art|ust|pkt|lit|nr|poz|tel|lok|str)(\.?) (?=[\d§])/gu, `$1$2${NBSP}`],
  [/§ (?=\d)/g, `§${NBSP}`],
  [/(?<![\p{L}])(ul|al|pl)\. (?=\p{Lu})/gu, `$1.${NBSP}`],
  [/(?<=\d) (?=\d{3}(?!\d))/g, NBSP],
  [new RegExp(`(?<=\\d) (?=(?:${units})(?![\\p{L}]))`, 'gu'), NBSP],
  [new RegExp(`(?<=\\d{1,2}) (?=(?:${months})(?![\\p{L}]))`, 'gu'), NBSP],
  [new RegExp(`(?<=(?:${months})) (?=\\d{4}(?!\\d))`, 'gu'), NBSP],
  [/(?<=\d{4}) (?=r\.)/g, NBSP],
];

export const tie = (text: string): string =>
  rules.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
