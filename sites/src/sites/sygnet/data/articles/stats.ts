import { plainText } from '../../lib/inline';
import { countWords, readingMinutes } from '../../lib/reading';
import type { Article, Block } from './types';

const blockWords = (block: Block): number => {
  if (block.type === 'p' || block.type === 'h2') return countWords(plainText(block.text));
  if (block.type === 'note') return countWords(`${block.title} ${plainText(block.text)}`);
  if (block.type === 'ul' || block.type === 'ol')
    return countWords(plainText(block.items.join(' ')));
  return countWords(plainText([block.caption, ...block.head, ...block.rows.flat()].join(' ')));
};

export const articleWords = (article: Article): number =>
  article.blocks.reduce((sum, block) => sum + blockWords(block), 0);

export const articleMinutes = (article: Article): number => readingMinutes(articleWords(article));
