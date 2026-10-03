import { countWords, readingMinutes } from '../lib/reading-time';
import { plainText } from '../lib/inline';
import type { Article, Block } from './articles';

const blockText = (block: Block): string => {
  switch (block.type) {
    case 'p':
    case 'h2':
    case 'h3':
      return plainText(block.text);
    case 'ul':
    case 'ol':
      return block.items.map(plainText).join(' ');
    case 'note':
      return `${block.title} ${plainText(block.text)}`;
    case 'table':
      return [...block.head, ...block.rows.flat()].join(' ');
  }
};

export const articleWords = (article: Article): number =>
  countWords(article.blocks.map(blockText).join(' '));

export const articleMinutes = (article: Article): number => readingMinutes(articleWords(article));
