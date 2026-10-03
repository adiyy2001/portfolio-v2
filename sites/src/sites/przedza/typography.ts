const nbsp = String.fromCharCode(0xa0);

const singleLetters = /(^|[\s(„"»])((?:[aiouwzAIOUWZ]\s+)+)(?=\S)/g;
const numberUnit =
  /(\d)\s(?=(?:m²|m³|m2|m|km|cm|mm|min|godz\.|zł|kW|kWh|kg|%|mln|tys\.|lat)(?![\p{L}\d]))/gu;
const abbreviation = /\b(art\.|ust\.|poz\.|nr|ul\.|al\.)\s(?=\S)/g;

export const glueText = (text: string) =>
  text
    .replace(
      singleLetters,
      (_, lead: string, letters: string) => lead + letters.replace(/\s+/g, nbsp),
    )
    .replace(numberUnit, `$1${nbsp}`)
    .replace(abbreviation, `$1${nbsp}`);

const markup = /<(script|style|textarea)\b[\s\S]*?<\/\1>|<[^>]*>/gi;

export const glueHtml = (html: string) => {
  let result = '';
  let last = 0;
  for (const match of html.matchAll(markup)) {
    const index = match.index ?? 0;
    result += glueText(html.slice(last, index)) + match[0];
    last = index + match[0].length;
  }
  return result + glueText(html.slice(last));
};
