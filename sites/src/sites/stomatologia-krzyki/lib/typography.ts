export const nbsp = (text: string) =>
  text.replace(/(^|[\s(„])([aiouwzAIOUWZ]) (?=\S)/g, '$1$2\u00a0');
