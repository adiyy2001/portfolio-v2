const noBreakSpace = String.fromCharCode(0xa0);
const wordJoiner = String.fromCharCode(0x2060);
const lonelyLetter = /(?<=^|[\s(„"'])([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż])\s+/g;
const numberBeforeUnit =
  /(\d)\s+(?=(?:zł|osób|osoby|osoba|os\.|min|km|ml|l|g|kg)(?:[\s.,;:!?)]|$))/g;
const numberRange = /(\d)-(?=\d)/g;

export const tie = (text: string) =>
  text
    .replace(lonelyLetter, `$1${noBreakSpace}`)
    .replace(numberBeforeUnit, `$1${noBreakSpace}`)
    .replace(numberRange, `$1-${wordJoiner}`);
