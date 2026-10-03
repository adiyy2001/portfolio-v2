import type { PriceItem } from '../data/prices';
import { plural, type PluralForms } from './format';

const bareToothNominative = /\bzab\b/g;

const trailingVowel = /[aeiouy]$/;

const minimumStemmedLength = 4;

const maxQueryLength = 80;

const foundForms: PluralForms = ['pozycję', 'pozycje', 'pozycji'];

export const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(bareToothNominative, 'zeb')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const stem = (token: string) =>
  token.length >= minimumStemmedLength && trailingVowel.test(token) ? token.slice(0, -1) : token;

export const tokenize = (query: string) => normalize(query).split(' ').filter(Boolean).map(stem);

export const searchText = (item: PriceItem, categoryName: string) =>
  normalize(
    [item.name, categoryName, item.unit ?? '', item.note ?? '', ...(item.keywords ?? [])].join(' '),
  );

export const matches = (text: string, tokens: readonly string[]) =>
  tokens.every(token => text.startsWith(token) || text.includes(` ${token}`));

export const readQuery = (search: string) =>
  (new URLSearchParams(search).get('q') ?? '').trim().slice(0, maxQueryLength);

export const queryString = (query: string) => {
  const trimmed = query.trim();
  return trimmed ? `?${new URLSearchParams({ q: trimmed }).toString()}` : '';
};

export const resultSummary = (count: number, total: number, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return `Wszystkie pozycje: ${total}.`;
  if (count === 0) return `Brak pozycji dla „${trimmed}”. Spróbuj krótszego słowa.`;
  return `Znaleziono ${count} ${plural(count, foundForms)} z ${total}.`;
};
