export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; title: string; text: string }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] };

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  lead: string;
  published: string;
  authorSlug: string;
  areaSlug: string;
  blocks: Block[];
}
