export const langs = ['pl', 'en'] as const;

export type Lang = (typeof langs)[number];

export type Localized = Record<Lang, string>;
