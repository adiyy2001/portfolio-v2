import { klientNiePlaciFaktury } from './klient-nie-placi-faktury';
import { najemLokaluNaFirme } from './najem-lokalu-na-firme';
import type { Article } from './types';
import { wspolnicyPoPolowie } from './wspolnicy-po-polowie';

export type { Article, Block } from './types';

export const articles: Article[] = [wspolnicyPoPolowie, klientNiePlaciFaktury, najemLokaluNaFirme];

export const articleBySlug = (slug: string): Article | undefined =>
  articles.find(article => article.slug === slug);
