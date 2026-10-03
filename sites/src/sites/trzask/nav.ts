export type NavKey =
  'sklep' | 'subskrypcja' | 'o-palarni' | 'dostawa' | 'kontakt' | 'koszyk' | 'kasa';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'sklep', label: 'Sklep', path: '/trzask/sklep/' },
  { key: 'subskrypcja', label: 'Subskrypcja', path: '/trzask/subskrypcja/' },
  { key: 'o-palarni', label: 'O palarni', path: '/trzask/o-palarni/' },
  { key: 'dostawa', label: 'Dostawa i zwroty', path: '/trzask/dostawa-i-zwroty/' },
  { key: 'kontakt', label: 'Kontakt', path: '/trzask/kontakt/' },
];
