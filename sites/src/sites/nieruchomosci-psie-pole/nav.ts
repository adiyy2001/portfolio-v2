export type NavKey = 'oferty' | 'sprzedaj' | 'zespol' | 'kontakt' | 'ulubione';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'oferty', label: 'Oferty', path: '/nieruchomosci-psie-pole/oferty/' },
  { key: 'sprzedaj', label: 'Sprzedaj z nami', path: '/nieruchomosci-psie-pole/sprzedaj-z-nami/' },
  { key: 'zespol', label: 'Zespół', path: '/nieruchomosci-psie-pole/zespol/' },
  { key: 'kontakt', label: 'Kontakt', path: '/nieruchomosci-psie-pole/kontakt/' },
  { key: 'ulubione', label: 'Ulubione', path: '/nieruchomosci-psie-pole/ulubione/' },
];
