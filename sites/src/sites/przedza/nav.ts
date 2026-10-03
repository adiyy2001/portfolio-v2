export type NavKey = 'mieszkania' | 'lokalizacja' | 'galeria' | 'biuro';

export const navItems: readonly { key: NavKey; label: string; path: string }[] = [
  { key: 'mieszkania', label: 'Mieszkania', path: '/przedza/#mieszkania' },
  { key: 'lokalizacja', label: 'Lokalizacja', path: '/przedza/lokalizacja/' },
  { key: 'galeria', label: 'Galeria', path: '/przedza/galeria/' },
  { key: 'biuro', label: 'Biuro sprzedaży', path: '/przedza/biuro-sprzedazy/' },
];
