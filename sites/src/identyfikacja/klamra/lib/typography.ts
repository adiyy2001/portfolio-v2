const NBSP = ' ';
const short = /(^|[\s(„"'>])([aiouwzAIOUWZK]) (?=[^\s<])/g;
const shortWithUnit = /(\d) (px|mm|pt|KB|MB|s)(?![\p{L}\d])/gu;
const skipped = /(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]*>)/;

export const glue = (text: string) => {
  let current = text;
  let previous = '';
  while (current !== previous) {
    previous = current;
    current = current.replace(short, `$1$2${NBSP}`);
  }
  return current.replace(shortWithUnit, `$1${NBSP}$2`);
};

export const glueHtml = (html: string) =>
  html
    .split(skipped)
    .map((part, index) => (index % 2 === 0 ? glue(part) : part))
    .join('');
