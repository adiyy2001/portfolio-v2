export type InlinePart =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string };

const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export const parseInline = (source: string): InlinePart[] => {
  const parts: InlinePart[] = [];
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ kind: 'text', text: source.slice(cursor, index) });
    if (match[1] !== undefined) parts.push({ kind: 'strong', text: match[1] });
    else parts.push({ kind: 'link', text: match[2] ?? '', href: match[3] ?? '' });
    cursor = index + match[0].length;
  }
  if (cursor < source.length) parts.push({ kind: 'text', text: source.slice(cursor) });
  return parts;
};

export const plainText = (source: string): string =>
  parseInline(source)
    .map(part => part.text)
    .join('');
