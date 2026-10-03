const polishLetters: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, letter => polishLetters[letter] ?? letter)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const uniqueSlugs = (texts: string[]): string[] => {
  const seen = new Map<string, number>();
  return texts.map(text => {
    const base = slugify(text) || 'sekcja';
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
};
