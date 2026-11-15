export type NavKey = 'uslugi' | 'cennik' | 'umow-wizyte' | 'o-warsztacie' | 'kontakt' | 'credits';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'uslugi', label: 'Usługi', path: '/nakretka/uslugi/' },
  { key: 'cennik', label: 'Cennik', path: '/nakretka/cennik/' },
  { key: 'umow-wizyte', label: 'Umów wizytę', path: '/nakretka/umow-wizyte/' },
  { key: 'o-warsztacie', label: 'O warsztacie', path: '/nakretka/o-warsztacie/' },
  { key: 'kontakt', label: 'Kontakt', path: '/nakretka/kontakt/' },
];
