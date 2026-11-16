export type AgentId = 'karolina' | 'adam';

export interface Agent {
  id: AgentId;
  name: string;
  area: string;
  role: string;
  credential: string;
  bio: string[];
  phone: string;
  phoneHref: string;
  email: string;
  districts: string[];
}

export const agents: Record<AgentId, Agent> = {
  karolina: {
    id: 'karolina',
    name: 'Karolina Mazur',
    area: 'Sprzedaż i kupno, Psie Pole i Leśnica',
    role: 'Pośrednik w obrocie nieruchomościami',
    credential:
      'Pośrednik w obrocie nieruchomościami, absolwentka podyplomowych studiów z wyceny nieruchomości. Ubezpieczona od odpowiedzialności cywilnej pośrednika.',
    bio: [
      'Karolina zaczyna od wyceny. Mierzy mieszkanie, sprawdza ostatnie transakcje z okolicy i dopiero wtedy mówi, za ile da się je sprzedać.',
      'Prowadzi oferty na Psim Polu i w Leśnicy, od nowych bloków przy Kiełczowskiej po mieszkania po remoncie przy Średzkiej.',
    ],
    phone: '+48 71 555 01 24',
    phoneHref: 'tel:+48715550124',
    email: 'karolina@psiepole.example',
    districts: ['Psie Pole', 'Leśnica'],
  },
  adam: {
    id: 'adam',
    name: 'Adam Wolny',
    area: 'Sprzedaż i kupno, Karłowice i Dąbie',
    role: 'Pośrednik w obrocie nieruchomościami',
    credential:
      'Pośrednik w obrocie nieruchomościami, przed ofertą sprawdza księgi wieczyste i stan prawny. Ubezpieczony od odpowiedzialności cywilnej pośrednika.',
    bio: [
      'Adam czyta księgę wieczystą, zanim mieszkanie trafi do katalogu. Sprawdza hipoteki, służebności i to, kto naprawdę jest właścicielem.',
      'Prowadzi oferty w Karłowicach i na Dąbiu: od kawalerki przy Sołtysowickiej po kamienicę przy Wróblewskiego.',
    ],
    phone: '+48 71 555 01 25',
    phoneHref: 'tel:+48715550125',
    email: 'adam@psiepole.example',
    districts: ['Karłowice', 'Dąbie'],
  },
};

export const agentList: Agent[] = [agents.karolina, agents.adam];
