import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Marta Wilk',
  role: 'gospodyni hotelu',
  street: 'ul. Winna 12',
  city: '55-050 Sobótka',
  phone: '+48 71 000 00 05',
  phoneHref: 'tel:+48710000005',
  email: 'recepcja@cuvee.example',
  hours: [
    ['recepcja', '8:00 do 22:00'],
    ['śniadanie', '8:30 do 11:00'],
    ['degustacja w piwnicy', 'piątek i sobota, 17:00'],
  ],
} as const;

export const content: CaseContent = {
  lead: 'Hotel, który mówi szeptem i podpisuje się rocznikiem.',
  client: {
    paragraphs: [
      'Cuvée to dwanaście pokoi i cztery hektary winnicy pod Ślężą. Hotel działa w dawnym folwarku, a gospodarze sami tłoczą wino z odmian, które dobrze znoszą dolnośląską zimę: solarisa, johanniter, regenta i trochę pinot noir.',
      'Goście przyjeżdżają na weekend z Wrocławia, Berlina i Pragi. Czytają stronę hotelu jak magazyn, zanim zdecydują o rezerwacji, a potem biorą ze sobą butelkę do domu. Do tej pory nazwę pisano na tablicy przy bramie, a karty dań drukowano w edytorze tekstu.',
      'Zadanie: identyfikacja, która nie krzyczy. Ma wyglądać jak dobrze wydana książka, działać na szyldzie, etykiecie i karcie śniadaniowej i dać się utrzymać w porządku przez dziesięć lat.',
    ],
    facts: [
      ['Branża', 'butikowy hotel z własną winnicą'],
      ['Miejsce', 'Dolny Śląsk, u stóp Ślęży'],
      ['Zakres', 'strategia, logo, system, makiety, animacja, brand book'],
      ['Odbiorcy', 'pary i małe grupy, 30 do 55 lat, z Wrocławia, Berlina i Pragi'],
    ],
  },
  direction: {
    title: 'Cisza jako luksus',
    paragraphs: [
      'W hotelu, który sprzedaje spokój, identyfikacja nie może hałasować. Dlatego Cuvée ma najmniej elementów ze wszystkich możliwych: ciepła czerń, kość słoniowa i jeden mosiężny akcent, bez gradientów i bez efektu folii. Mosiądz jest zwykłym kolorem, nie błyskiem.',
      'Krój nagłówkowy to szeryf o wysokim kontraście, w lekkich grubościach i w kapitalikach ze światłem, jak w tytule książki. Tekst składa drugi, spokojniejszy szeryf. Pomiędzy nimi zostaje dużo pustego papieru, bo pusta przestrzeń jest tu częścią oferty. Cienkie linie prowadzą oko, a ikony pojawiają się wyłącznie tam, gdzie gość musi znaleźć drogę.',
    ],
    keywords: ['cisza', 'winnica', 'kontrast'],
  },
  strategy: {
    audience:
      'Pary i małe grupy w wieku 30 do 55 lat z Wrocławia, Berlina i Pragi, które rezerwują weekend dla ciszy, wina i dobrego jedzenia i czytają hotel jak magazyn.',
    values: [
      { title: 'Spokój', text: 'Dwanaście pokoi, brak animatora i brak hałasu o poranku.' },
      { title: 'Ziemia', text: 'Wino rośnie za oknem i trafia na stół z tego samego wzgórza.' },
      { title: 'Czas', text: 'Rytm hotelu wyznacza winobranie, a nie sezon promocji.' },
    ],
    personality: ['powściągliwa', 'elegancka', 'cicha'],
    avoids: 'głośnych kolorów, ikon dla ozdoby, zaokrągleń, efektów i rabatów',
    positioning:
      'Cuvée to dwanaście pokoi i cztery hektary winnicy pod Ślężą, hotel dla gości, którzy wolą ciszę i dobre wino od atrakcji.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech szkiców, narysowanych szybko i surowo. Każdy odpowiada na inne pytanie: czy znak ma być napisem, rysunkiem czy pieczęcią. Jeden poszedł dalej.',
    rejected: [
      {
        id: 'kursywa',
        title: 'Kursywa z kropką',
        text: 'Mała kursywa cuvée z mosiężną kropką nad ostatnią literą.',
        reason:
          'Odpadła, bo kursywa w małych literach jest ciepła i piękna, ale brzmi jak pracownia ceramiki albo kawiarnia. Hotel z dwunastoma pokojami potrzebuje powagi kapitalików.',
        thumb: 'figures/direction-kursywa.svg',
      },
      {
        id: 'linia',
        title: 'Jedna linia',
        text: 'Pojedyncza kreska rysująca liść i kiść winogron.',
        reason:
          'Odpadła, bo jest ilustracją, a brief tej realizacji wyklucza ozdobniki. Linia dobrze wygląda duża, ale przy 24 pikselach rozpada się w szum i nie da się jej przybić ani wytłoczyć.',
        thumb: 'figures/direction-linia.svg',
      },
    ],
    chosen: {
      title: 'Wersalik',
      reason:
        'Rozstrzelone kapitaliki Cuvée, cienka linia w kolorze mosiądzu i napis Hotel, Winnica w kapitalikach dają znak, który wygląda jak okładka dobrej książki. Sygnet to litera C w podwójnym cienkim kole, spokojna jak pieczęć na kopercie, i dobrze zastępuje napis tam, gdzie brakuje miejsca.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Przy dużym rozstawie liter pary UV i VÉ musiały zbliżyć się o ułamek, bo przekątne V zostawiały dziury, a CU i ÉE pozostały prawie bez zmian. Napis Hotel, Winnica rozciągnięto tak, żeby kończył się dokładnie pod ostatnią literą nazwy.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Okrągłe C i U wystają ponad i pod linię o ułamek wysokości, a akcent w É został wysoko, jak w druku książkowym. Mosiężna linia ma tę samą szerokość co napis i prawie nie ma grubości.',
      },
      {
        title: 'Test czytelności',
        text: 'Pełny sygnet z dwoma cienkimi kołami działa od 48 pikseli. Poniżej zastępuje go sygnet uproszczony: jedno grube koło i grubsza litera, która czyta się w 16 pikselach jako ikona karty przeglądarki.',
      },
    ],
  },
  tone: [
    {
      title: 'Mówimy cicho',
      text: 'Gość przyjechał po spokój. Piszemy krótko i nie podnosimy głosu.',
      yes: 'Śniadanie od 8:30. Stolik przy oknie czeka.',
      no: 'Niesamowite śniadania, których nie możesz przegapić!',
    },
    {
      title: 'Rocznik zamiast promocji',
      text: 'Czas pokazujemy rocznikiem, nie rabatem. Nie obniżamy cen hasłem.',
      yes: 'Rocznik 2024, zbierany ręcznie w drugim tygodniu października.',
      no: 'Tylko teraz minus 20 procent na weekend w winnicy.',
    },
    {
      title: 'Konkret zamiast przymiotników',
      text: 'Podajemy odmianę, godzinę, liczbę pokoi. Przymiotniki zostawiamy winu.',
      yes: 'Solaris i johanniter, trzydzieści hektolitrów z czterech hektarów.',
      no: 'Wyjątkowe, ekskluzywne wina najwyższej jakości.',
    },
    {
      title: 'Gość ma czas',
      text: 'Nie ponaglamy, nie pytamy o decyzję w ostatniej chwili.',
      yes: 'Pokój będzie czekał do piątku. Odpowiedź może poczekać do rana.',
      no: 'Zostały ostatnie dwa pokoje, rezerwuj natychmiast!',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Sygnet w kolorze kości na czerni i nic więcej. Druk 85 na 55 mm, spad 3 mm.',
      image: 'mockups/cuvee-card-front.jpg',
      alt: 'Awers wizytówki Cuvée: czarna karta z sygnetem, literą C w cienkim podwójnym kole.',
    },
    {
      id: 'karta-rewers',
      title: 'Wizytówka, rewers',
      caption: 'Dane kontaktowe na kości, w kapitalikach i lekkim szeryfie.',
      image: 'mockups/cuvee-card-back.jpg',
      alt: 'Rewers wizytówki Cuvée z nazwiskiem gospodyni, adresem i telefonem na kremowym papierze.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Wąska kolumna listu w szerokich marginesach i jedna mosiężna linia.',
      image: 'mockups/cuvee-letterhead.jpg',
      alt: 'Papier firmowy Cuvée w formacie A4 z krótkim listem do gościa.',
    },
    {
      id: 'etykieta',
      title: 'Etykieta wina i zawieszka na drzwi',
      caption:
        'Zastosowanie dla hotelu z winnicą: etykieta cuvée z rocznikiem, zawieszka Nie przeszkadzać i karta śniadaniowa.',
      image: 'mockups/cuvee-application.jpg',
      alt: 'Etykieta wina Cuvée z rocznikiem i odmianami, zawieszka na drzwi Nie przeszkadzać i karta śniadaniowa na ciemnym tle.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML w tabelach, logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/cuvee-email-signature.jpg',
      alt: 'Podpis e-mail Cuvée z poziomym logo, telefonem i adresem pod krótką wiadomością do gościa.',
    },
  ],
  deliverables: {
    intro:
      'Wszystko, co dostaje hotel, leży w jednej paczce ZIP i osobno na liście poniżej. Rozwiń grupę, żeby zobaczyć pliki z wymiarami.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk, zwłaszcza dla mosiądzu. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twoja marka też może mówić ciszej',
    text: 'Opowiedz mi o swoim miejscu i o ludziach, którzy do niego wracają. Zaproponuję kierunek, pokażę trzy szkice logo i dowiozę komplet plików na każdą okazję.',
  },
};

export const grapes = [
  { id: 'solaris', name: 'Solaris', note: 'biała, dojrzała i pachnąca miodem', tone: 'biała' },
  { id: 'johanniter', name: 'Johanniter', note: 'biała, świeża, z nutą jabłka', tone: 'biała' },
  { id: 'riesling', name: 'Riesling', note: 'biała, mineralna, długa', tone: 'biała' },
  { id: 'regent', name: 'Regent', note: 'czerwona, ciemna, jagodowa', tone: 'czerwona' },
  { id: 'pinot-noir', name: 'Pinot Noir', note: 'czerwona, lekka, wiśniowa', tone: 'czerwona' },
] as const;

export const vintages = [2020, 2021, 2022, 2023, 2024, 2025] as const;

export const extras = {
  typeScale: [
    { name: 'Tytuł', font: 'display', size: 64, line: 1.02, weight: 200, use: 'okładki i hasła' },
    { name: 'Nagłówek', font: 'display', size: 36, line: 1.12, weight: 300, use: 'sekcje i karty' },
    { name: 'Kapitaliki', font: 'caps', size: 15, line: 1.4, weight: 400, use: 'etykiety, numery i nazwy sekcji, rozstaw 0,22 em' },
    { name: 'Tekst', font: 'text', size: 18, line: 1.6, weight: 400, use: 'akapity, opisy, menu' },
    { name: 'Podpis', font: 'text', size: 14, line: 1.45, weight: 400, use: 'podpisy, adresy, drobny druk' },
  ],
  specimen: 'Winorośl pamięta każdy rok. Cisza też ma rocznik.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 „”·×',
  graphics: [
    {
      title: 'Wzór szpaleru',
      text: 'Cienkie przekątne, jak druty między palami w winnicy, i mosiężne punkty tam, gdzie się krzyżują. Wzór jest rzadki, kafel nie ma szwu i nigdy nie wypełnia całej strony.',
    },
    {
      title: 'Cienka linia',
      text: 'Jedna linia o grubości jednego piksela dzieli sekcje, prowadzi podpis i rysuje ramkę etykiety. Linie są proste, bez zaokrągleń i bez cieni.',
    },
    {
      title: 'Ikony jak tablice w hotelu',
      text: 'Dwanaście piktogramów rysowanych cienką kreską z prostymi zakończeniami. Służą wyłącznie do znalezienia drogi, na planie, na karcie pokoju i w księdze, nigdy jako ozdoba.',
    },
  ],
  layoutRules: [
    'Jedna wąska kolumna, szerokość do 52 znaków, w szerokich marginesach.',
    'Czarna okładka, jasne wnętrze, jeden mosiężny akcent na ekran.',
    'Linie mają jeden piksel i kończą się ostro. Zaokrągleń nie używamy.',
    'Animacja jest wolna i bez odbicia: tylko zanikanie i rozsuwanie liter.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: światło dzienne, miękkie, od okna lub przed zachodem słońca. Dużo ciemności i cienia, jedno źródło światła, ciemne tło z ciepłymi zielenią i brązem. Kadry nieruchome, symetryczne albo spokojnie asymetryczne, z dużą ilością wolnego miejsca na tekst. Winnica w mgle, szklanka na parapecie, ręka na klamce, nigdy uśmiechnięci goście pozujący do obiektywu. Kolory przygaszone, bez nasycenia, bez filtrów.',
  animation:
    'Cienkie linie rysują się, rozstaw liter zwalnia z szerokiego do końcowego, a znak wygasa w jednej chwili. Całość trwa trzy sekundy, bez odbicia i bez przesunięć. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe wysokości litery C z napisu Cuvée. Żaden tekst ani brzeg strony nie wchodzi w ten obszar.',
  minimum: {
    symbol: '16 px na ekranie, 6 mm w druku (uproszczony sygnet)',
    fullStamp: '48 px na ekranie, 14 mm w druku (pełny sygnet z dwoma kołami)',
    primary: '140 px szerokości, 30 mm w druku',
  },
  social: [
    { id: 'post-1', headline: 'Winobranie', body: 'Zaczynamy w poniedziałek o świcie. Solaris, johanniter, regent.', foot: 'Cuvée, Sobótka' },
    { id: 'post-2', headline: 'Cisza ma rocznik.', body: 'Rocznik 2024, pierwsza butelka.', foot: 'Cuvée, hotel i winnica' },
    { id: 'post-3', headline: 'Dwanaście pokoi', body: 'Cztery hektary winnicy pod Ślężą.', foot: 'ul. Winna 12, Sobótka' },
  ],
  label: {
    appellation: 'Dolny Śląsk, pod Ślężą',
    note: 'Zbierane ręcznie, leżakowane w piwnicy hotelu.',
    volume: '0,75 l',
    strength: '12,5 % obj.',
  },
  doorHanger: {
    title: 'Nie przeszkadzać',
    sub: 'Śpimy. Cisza też jest usługą.',
    back: 'Proszę o sprzątanie',
    breakfast: [
      ['8:30', 'chleb z piekarni w Sobótce, masło, konfitury'],
      ['9:30', 'jajka od sąsiada, szynka, ser'],
      ['10:30', 'kawa i ciasto z winogron'],
    ],
  },
} as const;
