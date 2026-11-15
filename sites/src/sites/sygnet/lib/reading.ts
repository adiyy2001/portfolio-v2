const wordsPerMinute = 200;

export const countWords = (text: string): number =>
  text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;

export const readingMinutes = (words: number): number =>
  Math.max(1, Math.round(words / wordsPerMinute));
