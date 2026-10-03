const NON_BREAKING_SPACE = ' ';

const singleLetterWord = /(?<=^|[\s(„"'])([aiouwzAIOUWZ])\s+(?=\S)/g;
const abbreviationBeforeName = /\b(ul|al|pl|nr)\.\s+/g;
const numberBeforeWord = /(\d)\s+(?=[\p{L}\d])/gu;
const markupOrText = /(<(script|style)\b[\s\S]*?<\/\2>|<!--[\s\S]*?-->|<[^>]*>)|([^<]+)/gi;

export const tie = (text: string) =>
  text
    .replace(singleLetterWord, `$1${NON_BREAKING_SPACE}`)
    .replace(abbreviationBeforeName, `$1.${NON_BREAKING_SPACE}`)
    .replace(numberBeforeWord, `$1${NON_BREAKING_SPACE}`);

export const tieHtml = (html: string) =>
  html.replace(
    markupOrText,
    (
      whole: string,
      markup: string | undefined,
      _name: string | undefined,
      text: string | undefined,
    ) => (markup === undefined ? tie(text ?? whole) : whole),
  );

export const formatPrice = (amount: number) => `${amount}${NON_BREAKING_SPACE}zł`;

export const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('pl') + text.slice(1);
