export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string };

const token = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export const parseInline = (source: string): Inline[] => {
  const parts: Inline[] = [];
  let cursor = 0;
  for (const match of source.matchAll(token)) {
    const start = match.index;
    if (start > cursor) parts.push({ kind: 'text', text: source.slice(cursor, start) });
    const [whole, strong, label, href] = match;
    if (strong !== undefined) parts.push({ kind: 'strong', text: strong });
    else if (label !== undefined && href !== undefined)
      parts.push({ kind: 'link', text: label, href });
    cursor = start + whole.length;
  }
  if (cursor < source.length) parts.push({ kind: 'text', text: source.slice(cursor) });
  return parts;
};

export const plainText = (source: string): string =>
  parseInline(source)
    .map(part => part.text)
    .join('');
