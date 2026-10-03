import type { ShadeName } from '../lib/shades';

export type TeamId = 'targowska' | 'kordylewski' | 'mrozowicka' | 'czarnomska' | 'pustelnik';

export type ToothShape = 'incisor' | 'canine' | 'premolar' | 'molar' | 'lateral';

export type ToolCue = 'endoFile' | 'implant' | 'aligner' | 'toothbrush' | 'mirror';

export interface Portrait {
  initials: string;
  tooth: ToothShape;
  shade: ShadeName;
  tool: ToolCue;
  background: string;
  handle: string;
}

export interface TeamMember {
  id: TeamId;
  name: string;
  title: string;
  role: string;
  focus: string;
  bio: string;
  days: string;
  languages: string;
  portrait: Portrait;
}

export const team: readonly TeamMember[] = [
  {
    id: 'targowska',
    name: 'Helena Targowska',
    title: 'lek. dent.',
    role: 'Prowadzi klinikę. Stomatologia zachowawcza i endodoncja.',
    focus: 'Przeglądy, wypełnienia, leczenie kanałowe, wybielanie.',
    bio: 'Stomatologię skończyła we Wrocławiu. Leczy kanałowo w powiększeniu i odbudowuje zęby kompozytem w koferdamie. Pierwszą wizytę zaczyna od rozmowy, a dopiero potem prosi o otwarcie ust.',
    days: 'Pon, wt, czw, pt',
    languages: 'polski, angielski',
    portrait: {
      initials: 'HT',
      tooth: 'incisor',
      shade: 'A1',
      tool: 'endoFile',
      background: '#ff6f5b',
      handle: '#1b1f2a',
    },
  },
  {
    id: 'kordylewski',
    name: 'Tymon Kordylewski',
    title: 'lek. dent.',
    role: 'Chirurgia stomatologiczna i implantologia.',
    focus: 'Usuwanie zębów, zęby mądrości, implanty, przeszczepy kości.',
    bio: 'Usuwa zęby mądrości i wszczepia implanty. Przed każdym zabiegiem pokazuje twoją tomografię na ekranie i tłumaczy, co zrobi i dlaczego w tym miejscu. Pyta, czy chcesz słuchać muzyki.',
    days: 'Wt, śr, pt, sob',
    languages: 'polski, angielski',
    portrait: {
      initials: 'TK',
      tooth: 'molar',
      shade: 'B1',
      tool: 'implant',
      background: '#1b1f2a',
      handle: '#ff6f5b',
    },
  },
  {
    id: 'mrozowicka',
    name: 'Zofia Mrozowicka',
    title: 'lek. dent., specjalista ortodoncji',
    role: 'Ortodoncja nakładkowa.',
    focus: 'Plany leczenia w 3D, nakładki, retainery, kontrola zgryzu.',
    bio: 'Planuje ruch zębów na ekranie i pokazuje go pacjentowi przed podpisaniem zgody. Pracuje z dorosłymi i młodzieżą. Gdy nakładki nie są najlepszym wyborem, mówi o tym na pierwszej wizycie.',
    days: 'Pon, śr, sob',
    languages: 'polski, angielski',
    portrait: {
      initials: 'ZM',
      tooth: 'premolar',
      shade: 'A2',
      tool: 'aligner',
      background: '#f1f3f6',
      handle: '#ff6f5b',
    },
  },
  {
    id: 'czarnomska',
    name: 'Ewelina Czarnomska',
    title: 'higienistka stomatologiczna',
    role: 'Higienizacja i profilaktyka.',
    focus: 'Skaling, piaskowanie, fluoryzacja, instruktaż higieny.',
    bio: 'Uczy szczotkowania na twoich zębach, nie na modelu. Pokazuje w lusterku, gdzie zbiera się osad, i dobiera szczoteczki międzyzębowe do przestrzeni, które naprawdę masz.',
    days: 'Pon-pt',
    languages: 'polski, ukraiński',
    portrait: {
      initials: 'EC',
      tooth: 'canine',
      shade: 'D2',
      tool: 'toothbrush',
      background: '#ffd9d2',
      handle: '#1b1f2a',
    },
  },
  {
    id: 'pustelnik',
    name: 'Dominika Pustelnik',
    title: 'higienistka stomatologiczna',
    role: 'Higienizacja i opieka nad pacjentami z aparatem.',
    focus: 'Higienizacja, asysta przy wybielaniu, kontrola higieny przy nakładkach.',
    bio: 'Opiekuje się pacjentami, którzy noszą nakładki lub aparat, bo wokół zaczepów osad zbiera się szybciej. Przy wybielaniu asystuje lekarzowi i tłumaczy, jak dbać o zęby przez pierwsze dwa dni.',
    days: 'Wt, śr, czw, sob',
    languages: 'polski, angielski',
    portrait: {
      initials: 'DP',
      tooth: 'lateral',
      shade: 'C1',
      tool: 'mirror',
      background: '#e3e7ed',
      handle: '#ff6f5b',
    },
  },
];

export const findMember = (id: TeamId) => {
  const member = team.find(entry => entry.id === id);
  if (!member) throw new Error(`Unknown team member: ${id}`);
  return member;
};
