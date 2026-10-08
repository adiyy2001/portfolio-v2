const nbsp = ' ';

export const glue = (text: string) =>
  text
    .replace(
      /(^|[\s(„])([aiouwzAIOUWZ]|\d+)\s+/g,
      (_, lead: string, word: string) => `${lead}${word}${nbsp}`,
    )
    .replace(
      /(^|[\s(„])([aiouwzAIOUWZ])\s+/g,
      (_, lead: string, word: string) => `${lead}${word}${nbsp}`,
    );

export const glueDeep = <T>(value: T): T => {
  if (typeof value === 'string') return glue(value) as T;
  if (Array.isArray(value)) return value.map(item => glueDeep(item)) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, glueDeep(item)]),
    ) as T;
  return value;
};
