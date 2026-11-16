export type NavKey = 'zabiegi' | 'cennik' | 'zespol' | 'pierwsza-wizyta' | 'kontakt';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'zabiegi', label: 'Zabiegi', path: '/stomatologia-krzyki/zabiegi/' },
  { key: 'cennik', label: 'Cennik', path: '/stomatologia-krzyki/cennik/' },
  { key: 'zespol', label: 'Zespół', path: '/stomatologia-krzyki/zespol/' },
  { key: 'pierwsza-wizyta', label: 'Wizyta', path: '/stomatologia-krzyki/pierwsza-wizyta/' },
  { key: 'kontakt', label: 'Kontakt', path: '/stomatologia-krzyki/kontakt/' },
];
