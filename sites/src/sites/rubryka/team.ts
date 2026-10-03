export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  email: string;
}

export const team: readonly TeamMember[] = [
  {
    name: 'Marta',
    role: 'główna księgowa',
    focus: 'Prowadzi pełną księgowość i rozmowy z urzędem skarbowym.',
    email: 'marta@rubryka.example',
  },
  {
    name: 'Tomasz',
    role: 'kadry i płace',
    focus: 'Listy płac, umowy i rozliczenia ZUS pracowników.',
    email: 'tomasz@rubryka.example',
  },
  {
    name: 'Agnieszka',
    role: 'VAT i JPK',
    focus: 'Pilnuje rozliczeń VAT i wysyłki plików JPK_V7.',
    email: 'agnieszka@rubryka.example',
  },
  {
    name: 'Kuba',
    role: 'KSeF i wdrożenia',
    focus: 'Zakłada dostęp do KSeF, nadaje uprawnienia i uczy wystawiać pierwszą fakturę.',
    email: 'kuba@rubryka.example',
  },
];
