export const matterOptions = [
  { value: 'rodzina', label: 'Rodzinna' },
  { value: 'spolka', label: 'Spółka' },
  { value: 'spadek', label: 'Spadek' },
  { value: 'umowa', label: 'Umowa' },
  { value: 'inna', label: 'Inna sprawa' },
] as const;

export type MatterValue = (typeof matterOptions)[number]['value'];

export const matterLabel = (value: string): string =>
  matterOptions.find(option => option.value === value)?.label ?? '';

export const minimumMessageLength = 10;
