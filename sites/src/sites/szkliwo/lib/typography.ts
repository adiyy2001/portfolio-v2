const nonBreakingSpace = ' ';

const singleLetterWord = /(?<=^|[\s(„])([aAiIoOuUwWzZ])\s+/g;

const abbreviation = /\b(ul|al|pl|lek|dent|tel|np|ok|nr)\.\s+/g;

const quantity =
  /(\d)\s+(zł|min|minut|minuty|godz\.|godzin|godziny|godzinę|dni|dzień|tygodni|tygodnie|tygodnia|miesięcy|miesiące|miesiąc|lat|lata|mm|%)(?![\p{L}])/gu;

export const tie = (text: string) =>
  text
    .replace(singleLetterWord, `$1${nonBreakingSpace}`)
    .replace(abbreviation, `$1.${nonBreakingSpace}`)
    .replace(quantity, `$1${nonBreakingSpace}$2`);
