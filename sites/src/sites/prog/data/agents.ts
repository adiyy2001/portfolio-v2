import type { Agent, AgentId } from './types';

export const officePhone = '+48 71 000 00 08';
export const officePhoneHref = 'tel:+48710000008';
export const officeEmail = 'biuro@prog.example';
export const officeAddress = {
  street: 'ul. Sienkiewicza 24/1',
  city: '50-335 Wrocław',
  note: 'Parter, wejście od podwórka z szyldem na bramie.',
};

export const agents: readonly Agent[] = [
  {
    id: 'zofia',
    name: 'Zofia Brzezicka',
    firstName: 'Zofia',
    initials: 'ZB',
    role: 'Założycielka, sprzedaż mieszkań i kamienic',
    summary: 'Śródmieście, Nadodrze, Ołbin i okolice Dworca Głównego.',
    bio: [
      'Zofia założyła Próg w 2019 roku, po kilkunastu latach administrowania wspólnotami mieszkaniowymi. Zna księgi wieczyste, uchwały i fundusze remontowe od strony zarządcy, więc czyta dokumenty kamienicy szybciej, niż kupujący zdąży zapytać o dach.',
      'Sprzedaje głównie mieszkania w starych budynkach. Przed pierwszym oglądaniem sprawdza z klientem, ile w danej kamienicy kosztuje fundusz remontowy i co wspólnota uchwaliła w ostatnich trzech latach.',
    ],
    areas: [
      'Stare Miasto',
      'Nadodrze',
      'Ołbin',
      'Przedmieście Oławskie',
      'Przedmieście Świdnickie',
      'Plac Grunwaldzki',
      'Szczepin',
      'Kleczków',
    ],
    languages: ['polski', 'angielski'],
    email: 'zofia@prog.example',
    doorTone: 5,
  },
  {
    id: 'tymon',
    name: 'Tymon Osiecki',
    firstName: 'Tymon',
    initials: 'TO',
    role: 'Domy i nowe budynki',
    summary: 'Południe i zachód miasta, domy, szeregówki i nowe osiedla.',
    bio: [
      'Tymon skończył budownictwo i przez kilka lat pracował jako kierownik robót na osiedlach mieszkaniowych. Do biura trafił, bo zawsze był tym, kogo znajomi prosili o rzut oka na projekt przed zakupem.',
      'Czyta pozwolenia na budowę, projekty i protokoły odbioru, zanim pokaże dom klientowi. Przy nowych mieszkaniach prosi o harmonogram płatności i sprawdza, co dokładnie znaczy w umowie stan deweloperski.',
    ],
    areas: [
      'Krzyki-Partynice',
      'Borek',
      'Gaj',
      'Huby',
      'Grabiszyn',
      'Muchobór Mały',
      'Gajowice',
      'Powstańców Śląskich',
      'Tarnogaj',
      'Księże',
      'Jagodno',
    ],
    languages: ['polski', 'niemiecki'],
    email: 'tymon@prog.example',
    doorTone: 2,
  },
  {
    id: 'natalia',
    name: 'Natalia Wojtyra',
    firstName: 'Natalia',
    initials: 'NW',
    role: 'Wynajem i wyceny',
    summary: 'Biskupin, Zalesie, Karłowice oraz wynajem w całym mieście.',
    bio: [
      'Natalia szuka najemców dla właścicieli i właścicieli dla najemców, w tej kolejności zależnie od tego, kto zadzwoni pierwszy. Prowadzi też oględziny mieszkań przed wyceną, bo rozmowa o cenie ma sens dopiero po obejrzeniu okien i instalacji.',
      'Dla właścicieli przygotowuje protokół zdawczo-odbiorczy ze zdjęciami liczników, a dla najemców listę rzeczy, o które warto zapytać przed podpisaniem umowy. Najwięcej jeździ po Biskupinie, Zalesiu i Karłowicach.',
    ],
    areas: ['Biskupin', 'Zalesie', 'Karłowice', 'Kleczków', 'Wynajem w całym mieście'],
    languages: ['polski', 'angielski', 'ukraiński'],
    email: 'natalia@prog.example',
    doorTone: 0,
  },
];

export const agentById = (id: AgentId): Agent => {
  const found = agents.find(agent => agent.id === id);
  if (!found) throw new Error(`Unknown agent ${id}`);
  return found;
};
