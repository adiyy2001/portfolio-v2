import type { Article } from './types';
import { alimentyNaDziecko } from './alimenty-na-dziecko';
import { kaucjaZaMieszkanie } from './kaucja-za-mieszkanie';
import { spolkaZooS24CzyNotariusz } from './spolka-zoo-s24-czy-notariusz';
import { zachowekKomuSieNalezy } from './zachowek-komu-sie-nalezy';

export type { Article, Block } from './types';

export const articles: Article[] = [
  zachowekKomuSieNalezy,
  alimentyNaDziecko,
  spolkaZooS24CzyNotariusz,
  kaucjaZaMieszkanie,
].sort((a, b) => b.published.localeCompare(a.published));

export const articleBySlug = (slug: string) => articles.find(article => article.slug === slug);
