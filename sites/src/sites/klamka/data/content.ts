import { figures } from './business';

export interface Photo {
  key: string;
  widths: number[];
  width: number;
  height: number;
  alt: string;
}

export interface ProcessStep {
  photo: Photo;
  frame: string;
  title: string;
  text: string;
}

export const processSteps: ProcessStep[] = [
  {
    photo: {
      key: 'wycena',
      widths: [480, 960, 1400],
      width: 1400,
      height: 935,
      alt: 'Dłoń z miarką przy ościeżnicy okna',
    },
    frame: 'Kadr 1 z 3',
    title: 'Wycena',
    text: `Przychodzimy, mierzymy i porównujemy z transakcjami z okolicy. Wycenę masz w ${figures.valuationHours} godzin od oględzin.`,
  },
  {
    photo: {
      key: 'ogladanie',
      widths: [480, 960, 1500],
      width: 1500,
      height: 1001,
      alt: 'Jasny pokój z narożnym oknem i widokiem na miasto',
    },
    frame: 'Kadr 2 z 3',
    title: 'Oglądanie',
    text: 'Pokazujemy mieszkanie w umówione dni. Kupujący dostają komplet dokumentów przed wizytą.',
  },
  {
    photo: {
      key: 'klucze',
      widths: [480, 960, 1400],
      width: 1400,
      height: 933,
      alt: 'Dłoń podająca klucz z breloczkiem w kształcie domku',
    },
    frame: 'Kadr 3 z 3',
    title: 'Klucze',
    text: 'Umowa przedwstępna, notariusz, przekazanie. Klucze oddajesz Ty, resztę pilnujemy my.',
  },
];

export const marketPhoto: Photo = {
  key: 'poddasze',
  widths: [480, 960, 1500],
  width: 1500,
  height: 1001,
  alt: 'Puste poddasze z ceglanym słupem i oknami dachowymi',
};

export const sellPhoto: Photo = processSteps[0]!.photo;

export const sellSteps: Array<{ title: string; text: string }> = [
  {
    title: 'Oględziny i wycena',
    text: `Agent przychodzi na oględziny, mierzy mieszkanie i zbiera dokumenty. Wycenę z uzasadnieniem dostajesz w ${figures.valuationHours} godzin.`,
  },
  {
    title: 'Zdjęcia i opis',
    text: 'Fotografujemy mieszkanie i piszemy opis. Oferta trafia do katalogu dopiero po tym, jak agent przeczyta księgę wieczystą.',
  },
  {
    title: 'Oglądanie',
    text: 'Oglądania odbywają się w dniach, które ustalimy z Tobą. Każdy kupujący dostaje komplet dokumentów jeszcze przed wizytą.',
  },
  {
    title: 'Umowa przedwstępna',
    text: `Negocjujemy cenę i terminy, potem podpisujecie umowę przedwstępną. Od pierwszej wyceny do niej mija u nas średnio ${figures.daysToPreliminary} dni.`,
  },
  {
    title: 'Notariusz i klucze',
    text: 'Podpisujecie akt notarialny i dostajesz płatność. Na koniec spisujemy protokół przekazania, a Ty oddajesz kupującemu klucze.',
  },
];

export const sellCosts: Array<{ label: string; value: string }> = [
  { label: 'Wycena', value: 'bezpłatna' },
  {
    label: 'Prowizja',
    value: `${figures.commissionPercent}% ceny sprzedaży plus VAT, płatna przy akcie notarialnym`,
  },
  { label: 'Zdjęcia i opis', value: 'w cenie prowizji' },
  { label: 'Kupujący', value: 'nie płaci nam prowizji' },
  { label: 'Gdy mieszkanie się nie sprzeda', value: 'nie płacisz nic' },
];

export const sellFaq: Array<{ question: string; answer: string }> = [
  {
    question: 'Czy wycena zobowiązuje mnie do umowy?',
    answer:
      'Nie. Wycena jest bezpłatna, a umowę pośrednictwa podpisujesz dopiero wtedy, gdy cena i warunki Ci odpowiadają.',
  },
  {
    question: 'Co przygotować na oględziny?',
    answer:
      'Numer księgi wieczystej, dokument własności i ostatnie rachunki za czynsz. Jeśli czegoś brakuje, agent powie, jak to odtworzyć.',
  },
  {
    question: 'Kiedy dostanę wycenę?',
    answer: `W ${figures.valuationHours} godzin od oględzin, razem z listą transakcji, z którymi porównywaliśmy mieszkanie.`,
  },
  {
    question: 'Mieszkanie jest z kredytem. Mogę je sprzedać?',
    answer:
      'Tak. Agent sprawdza stan księgi i ustala z bankiem spłatę z ceny sprzedaży przy akcie notarialnym.',
  },
];

export const principles: Array<{ title: string; text: string }> = [
  {
    title: 'Najpierw księga wieczysta',
    text: 'Księgę wieczystą czytamy przed wystawieniem oferty: hipoteki, służebności i to, kto jest właścicielem.',
  },
  {
    title: 'Cena z porównania',
    text: 'Wycena opiera się na transakcjach z okolicy i na tym, co widzimy na oględzinach.',
  },
  {
    title: 'Jeden agent od początku do kluczy',
    text: 'Każdą ofertę prowadzi jedna osoba, więc zawsze wiesz, do kogo zadzwonić.',
  },
];

export const credits: Array<{
  key: string;
  use: string;
  author: string;
  source: string;
  licence: 'Unsplash License' | 'Pexels License';
}> = [
  {
    key: 'czajkowskiego',
    use: 'Oferta Nr 01, ul. Czajkowskiego',
    author: 'Prydumano Design',
    source: 'https://unsplash.com/photos/VZ2z8ozzy10',
    licence: 'Unsplash License',
  },
  {
    key: 'kielczowska',
    use: 'Oferta Nr 02, ul. Kiełczowska',
    author: 'artbovich',
    source: 'https://www.pexels.com/photo/7511695/',
    licence: 'Pexels License',
  },
  {
    key: 'wroblewskiego',
    use: 'Oferta Nr 03, ul. Wróblewskiego',
    author: 'van-anh-nguyen',
    source: 'https://www.pexels.com/photo/29353199/',
    licence: 'Pexels License',
  },
  {
    key: 'sredzka',
    use: 'Oferta Nr 04, ul. Średzka',
    author: 'nadin-sh',
    source: 'https://www.pexels.com/photo/33537442/',
    licence: 'Pexels License',
  },
  {
    key: 'gorlicka',
    use: 'Oferta Nr 05, ul. Gorlicka',
    author: 'artbovich',
    source: 'https://www.pexels.com/photo/7195739/',
    licence: 'Pexels License',
  },
  {
    key: 'soltysowicka',
    use: 'Oferta Nr 06, ul. Sołtysowicka',
    author: 'artbovich',
    source: 'https://www.pexels.com/photo/8146330/',
    licence: 'Pexels License',
  },
  {
    key: 'wycena',
    use: 'Reportaż, kadr 1: wycena',
    author: 'kseniachernaya',
    source: 'https://www.pexels.com/photo/5691534/',
    licence: 'Pexels License',
  },
  {
    key: 'ogladanie',
    use: 'Reportaż, kadr 2: oglądanie',
    author: 'artbovich',
    source: 'https://www.pexels.com/photo/6077368/',
    licence: 'Pexels License',
  },
  {
    key: 'klucze',
    use: 'Reportaż, kadr 3: klucze',
    author: 'rdne',
    source: 'https://www.pexels.com/photo/8292791/',
    licence: 'Pexels License',
  },
  {
    key: 'poddasze',
    use: 'Rynek, zdjęcie pod liczbami',
    author: 'artbovich',
    source: 'https://www.pexels.com/photo/8082324/',
    licence: 'Pexels License',
  },
];
