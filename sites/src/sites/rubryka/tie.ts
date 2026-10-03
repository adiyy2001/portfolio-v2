const NO_BREAK_SPACE = ' ';
const singleLetterWord = /(?<=^|[\s(„"])([aiouwzAIOUWZ])\s+(?=\S|$)/g;
const numberBeforeUnit = /(\d)\s+(zł|tys\.|mln|mld|r\.|proc\.|dni|godz\.)(?!\p{L})/gu;
const thousandsGroup = /(\d)\s+(?=\d{3}(?!\d))/g;
const abbreviationBeforeNumber = /\b(art\.|ust\.|pkt|nr|poz\.)\s+(?=\d)/g;
const tagOrText = /(<[^>]*>)/;
const tagName = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/;
const rawTextTags = new Set(['script', 'style', 'textarea', 'pre', 'code']);

export const tie = (text: string): string =>
  text
    .replace(singleLetterWord, `$1${NO_BREAK_SPACE}`)
    .replace(thousandsGroup, `$1${NO_BREAK_SPACE}`)
    .replace(numberBeforeUnit, `$1${NO_BREAK_SPACE}$2`)
    .replace(abbreviationBeforeNumber, `$1${NO_BREAK_SPACE}`);

export const tieHtml = (html: string): string => {
  let insideRawText: string | null = null;
  return html
    .split(tagOrText)
    .map(part => {
      if (!part.startsWith('<')) return insideRawText ? part : tie(part);
      const found = tagName.exec(part);
      if (found && rawTextTags.has((found[2] ?? '').toLowerCase())) {
        insideRawText = found[1] ? null : (found[2] ?? '').toLowerCase();
      }
      return part;
    })
    .join('');
};
