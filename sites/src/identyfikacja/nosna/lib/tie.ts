const nbsp = '\u00a0';

const oneLetterWord = /(^|[\s(„"»>])(\p{L}) (?=[^\s<])/gu;
const numberUnit = /(\d) (?=(?:BPM|px|mm|KB|MB|GB|s|ms|cm|pt|ppi|dpi|%)(?![\p{L}\d]))/gu;
const abbreviation = /(^|[\s(„"»>])(ul|al|nr|np|tj|tzw|ok|r|godz|str)\. (?=\S)/gu;

export const tie = (text: string): string => {
  let result = text;
  for (let pass = 0; pass < 2; pass += 1) {
    result = result
      .replace(oneLetterWord, `$1$2${nbsp}`)
      .replace(numberUnit, `$1${nbsp}`)
      .replace(abbreviation, `$1$2.${nbsp}`);
  }
  return result;
};

const skipped =
  /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<astro-island\b[\s\S]*?<\/astro-island>|<svg\b[\s\S]*?<\/svg>|<[^>]*>)/gi;

export const tieHtml = (html: string): string =>
  html
    .split(skipped)
    .map((part, index) => (index % 2 === 1 ? part : tie(part)))
    .join('');
