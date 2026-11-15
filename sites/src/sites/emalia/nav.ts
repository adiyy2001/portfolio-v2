export type NavKey = 'zabiegi' | 'cennik' | 'zespol' | 'pierwsza-wizyta' | 'kontakt';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'zabiegi', label: 'Zabiegi', path: '/emalia/zabiegi/' },
  { key: 'cennik', label: 'Cennik', path: '/emalia/cennik/' },
  { key: 'zespol', label: 'Zespół', path: '/emalia/zespol/' },
  { key: 'pierwsza-wizyta', label: 'Wizyta', path: '/emalia/pierwsza-wizyta/' },
  { key: 'kontakt', label: 'Kontakt', path: '/emalia/kontakt/' },
];
