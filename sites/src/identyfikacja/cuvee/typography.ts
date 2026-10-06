const nonBreaking = ' ';
const shortWords = /(?<=^|[\s(„" ])([aiouwzAIOUWZ]) /g;
const abbreviations = /(?<=^|[\s(„" ])(nr|ul\.|np\.|ok\.|tel\.) /g;
const units =
  /(\d) (px|mm|cm|ml|l|ha|hl|em|s|%|MB|KB|obj\.|pokoi|pokoje|pokój|hektary|hektarów|hektolitrów|stron|razy|lat)(?![\p{L}])/gu;

export const nbsp = (text: string) =>
  text
    .replace(shortWords, `$1${nonBreaking}`)
    .replace(abbreviations, `$1${nonBreaking}`)
    .replace(units, `$1${nonBreaking}$2`)
    .replace(/ (obj\.)/g, `${nonBreaking}$1`);

const skipped = /(<(script|style|pre)\b[\s\S]*?<\/\2>)|>([^<]+)</g;

export const typesetHtml = (html: string) =>
  html.replace(skipped, (match, block, _tag, text) => (block ? match : `>${nbsp(text)}<`));
