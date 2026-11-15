export type NavKey = 'oferty' | 'sprzedaj' | 'zespol' | 'kontakt' | 'ulubione';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'oferty', label: 'Oferty', path: '/klamka/oferty/' },
  { key: 'sprzedaj', label: 'Sprzedaj z nami', path: '/klamka/sprzedaj-z-nami/' },
  { key: 'zespol', label: 'Zespół', path: '/klamka/zespol/' },
  { key: 'kontakt', label: 'Kontakt', path: '/klamka/kontakt/' },
  { key: 'ulubione', label: 'Ulubione', path: '/klamka/ulubione/' },
];
