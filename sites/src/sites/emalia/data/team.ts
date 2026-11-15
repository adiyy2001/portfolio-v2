export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  days: string;
  bio: readonly string[];
  treatments: readonly string[];
}

export const team: readonly TeamMember[] = [
  {
    id: 'marta-kowal',
    name: 'lek. dent. Marta Kowal',
    initials: 'MK',
    role: 'Lekarka dentystka',
    focus: 'stomatologia zachowawcza i wybielanie',
    days: 'poniedziałek, środa, piątek',
    bio: [
      'Marta prowadzi pierwsze wizyty i leczy próchnicę. Lubi, gdy pacjent widzi swoje zęby na ekranie, bo wtedy plan leczenia przestaje być abstrakcją.',
      'Wybielanie zaczyna od przeglądu, a odcień dobiera razem z pacjentem na skali od A1 do C1.',
    ],
    treatments: ['przeglad', 'wypelnienia', 'wybielanie', 'bol-zeba'],
  },
  {
    id: 'jan-wrona',
    name: 'lek. dent. Jan Wrona',
    initials: 'JW',
    role: 'Lekarz dentysta',
    focus: 'leczenie kanałowe pod mikroskopem',
    days: 'wtorek, czwartek, sobota',
    bio: [
      'Jan leczy zęby, które bez dobrego leczenia kanałowego trzeba byłoby usunąć. Pracuje pod mikroskopem i pokazuje pacjentowi zdjęcie przed i po.',
      'W soboty przyjmuje też pacjentów z bólem, którzy nie zdążyli w tygodniu.',
    ],
    treatments: ['leczenie-kanalowe', 'bol-zeba', 'przeglad'],
  },
  {
    id: 'alicja-nowicka',
    name: 'Alicja Nowicka',
    initials: 'AN',
    role: 'Higienistka stomatologiczna',
    focus: 'higienizacja i profilaktyka',
    days: 'poniedziałek do piątku',
    bio: [
      'Alicja prowadzi higienizacje i uczy szczotkowania na zębach pacjenta, a nie na modelu.',
      'Jeśli widzi, że dziąsła wymagają leczenia, mówi to jeszcze na fotelu i umawia wizytę u lekarza.',
    ],
    treatments: ['higienizacja'],
  },
];

export const findMember = (id: string) => {
  const member = team.find(entry => entry.id === id);
  if (!member) throw new Error(`Unknown team member: ${id}`);
  return member;
};

export const membersFor = (treatment: string) =>
  team.filter(member => member.treatments.includes(treatment));
