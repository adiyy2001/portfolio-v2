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

export const glueTail = (text: string) => {
  const words = text.trimEnd().split(' ');
  if (words.length < 3 || words.slice(-2).some(word => word.includes(nbsp))) return text;
  const tail = words.splice(-2).join(nbsp);
  return `${words.join(' ')} ${tail}`;
};

const tailKeys = new Set(['title', 'text']);

export const glueDeep = <T>(value: T): T => {
  if (typeof value === 'string') return glue(value) as T;
  if (Array.isArray(value)) return value.map(item => glueDeep(item)) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        typeof item === 'string' && tailKeys.has(key) ? glueTail(glue(item)) : glueDeep(item),
      ]),
    ) as T;
  return value;
};
