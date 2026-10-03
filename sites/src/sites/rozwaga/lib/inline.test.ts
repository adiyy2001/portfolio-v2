import { describe, expect, it } from 'vitest';
import { parseInline, plainText } from './inline';

describe('parseInline', () => {
  it('returns plain text as a single part', () => {
    expect(parseInline('Zwykły tekst.')).toEqual([{ kind: 'text', text: 'Zwykły tekst.' }]);
  });

  it('parses strong text', () => {
    expect(parseInline('To jest **ważne** zdanie.')).toEqual([
      { kind: 'text', text: 'To jest ' },
      { kind: 'strong', text: 'ważne' },
      { kind: 'text', text: ' zdanie.' },
    ]);
  });

  it('parses links with their targets', () => {
    expect(parseInline('Zobacz [umowy](/specjalizacje/umowy/).')).toEqual([
      { kind: 'text', text: 'Zobacz ' },
      { kind: 'link', text: 'umowy', href: '/specjalizacje/umowy/' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('parses several tokens in a row', () => {
    const parts = parseInline('**A** i [B](/b/) oraz **C**');
    expect(parts.map(part => part.kind)).toEqual(['strong', 'text', 'link', 'text', 'strong']);
  });

  it('leaves unmatched markers as text', () => {
    expect(parseInline('Cena **bez końca')).toEqual([{ kind: 'text', text: 'Cena **bez końca' }]);
    expect(parseInline('[bez celu]')).toEqual([{ kind: 'text', text: '[bez celu]' }]);
  });

  it('returns nothing for an empty string', () => {
    expect(parseInline('')).toEqual([]);
  });
});

describe('plainText', () => {
  it('strips the markup and keeps the words', () => {
    expect(plainText('To **ważne** i [link](/x/) tu.')).toBe('To ważne i link tu.');
  });
});
