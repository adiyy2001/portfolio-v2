export type NavKey = 'uslugi' | 'cennik' | 'umow-wizyte' | 'o-warsztacie' | 'kontakt' | 'credits';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'uslugi', label: 'Usługi', path: '/warsztat-szybowcowa/uslugi/' },
  { key: 'cennik', label: 'Cennik', path: '/warsztat-szybowcowa/cennik/' },
  { key: 'umow-wizyte', label: 'Umów wizytę', path: '/warsztat-szybowcowa/umow-wizyte/' },
  { key: 'o-warsztacie', label: 'O warsztacie', path: '/warsztat-szybowcowa/o-warsztacie/' },
  { key: 'kontakt', label: 'Kontakt', path: '/warsztat-szybowcowa/kontakt/' },
];
