const joiner = ' ';
const orphan = /(?<=^|[\s(„"])([aiouwzAIOUWZ])\s+(?=\S)/g;

export const nbsp = (text: string) => text.replace(orphan, `$1${joiner}`);

export const typo = <T>(value: T): T => {
  if (typeof value === 'string') return nbsp(value) as T;
  if (Array.isArray(value)) return value.map(item => typo(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typo(item)])) as T;
  }
  return value;
};
