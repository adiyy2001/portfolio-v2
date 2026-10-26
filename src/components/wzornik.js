import React, { useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { instant } from '../motion';
import Split from './split';
import Acc from './wzornik/acc';
import Bis from './wzornik/bis';
import Den from './wzornik/den';
import Est from './wzornik/est';
import Fan from './wzornik/fan';
import Flat from './wzornik/flat';
import useFaces from './wzornik/fonts';
import Law from './wzornik/law';
import Psy from './wzornik/psy';
import Shop from './wzornik/shop';
import Stay from './wzornik/stay';
import Works from './wzornik/works';

const mocks = {
  law: Law,
  acc: Acc,
  den: Den,
  psy: Psy,
  est: Est,
  bis: Bis,
  shop: Shop,
  flat: Flat,
  stay: Stay,
};

const copy = {
  sites: [
    { id: 'law', slug: 'rozwaga', name: 'Rozwaga', chips: ['#121212', '#ffffff', '#b3122a'] },
    { id: 'acc', slug: 'rubryka', name: 'Rubryka', chips: ['#0f1f3d', '#f3f6fb', '#ff5b24'] },
    { id: 'den', slug: 'szkliwo', name: 'Szkliwo', chips: ['#1b1f2a', '#ffffff', '#ff6f5b'] },
    { id: 'psy', slug: 'tafla', name: 'Tafla', chips: ['#1f2d26', '#dfe8e1', '#2f5d50'] },
    { id: 'est', slug: 'przedza', name: 'Przędza', chips: ['#161616', '#d7d8d3', '#b4462e'] },
    {
      id: 'bis',
      slug: 'kminek',
      name: 'Kminek',
      en: true,
      chips: ['#2b1408', '#ffcf3a', '#d93a1f'],
    },
    { id: 'shop', slug: 'trzask', name: 'Trzask', chips: ['#0e110f', '#d3f33a', '#ffa21f'] },
    { id: 'flat', slug: 'prog', name: 'Próg', chips: ['#17151f', '#ffffff', '#4b30e8'] },
    {
      id: 'stay',
      slug: 'przeslo',
      name: 'Przęsło',
      en: true,
      chips: ['#1c1130', '#ffffff', '#b0245c'],
    },
  ],
  pl: {
    id: 'wzornik',
    title: 'Wzornik.',
    lead: 'Dziewięć przykładowych stron dla zmyślonych firm z różnych branż. Każda skrojona inaczej i każda działa.',
    note: 'firmy zmyślone, projekty moje',
    who: 'Dla kogo',
    inside: 'W środku',
    cut: 'Krój',
    open: 'Otwórz stronę',
    order: 'Chcę taką stronę',
    pick: 'Przykładowe strony',
    hint: 'wybierz pasek',
    more: 'Marki i aplikacje',
    kinds: 'Rodzaj realizacji',
    play: 'Odtwórz pętle',
    pause: 'Zatrzymaj pętle',
    identity: {
      tab: 'Identyfikacja',
      lead: 'Sześć realizacji z logo, kolorem, typografią, makietami, animacją i brand bookiem. Każda ze stylem dobranym do branży, z plikami do pobrania.',
      all: 'Wszystkie realizacje',
    },
    aso: {
      tab: 'Screenshoty',
      lead: 'Sześć zestawów screenshotów do App Store i Google Play dla zmyślonych aplikacji, po polsku i po angielsku. Każdy w innym stylu, z wariantem do testu A/B, ikonami i paczką plików.',
      all: 'Wszystkie zestawy',
    },
    appPreview: {
      tab: 'App preview',
      lead: 'Sześć animowanych podglądów aplikacji mobilnych dla zmyślonych firm: wersja do App Store, trzy formaty social, pętle na stronę i storyboard. Każdy w innym stylu, z własnym systemem ruchu.',
      all: 'Wszystkie podglądy',
    },
    law: {
      trade: 'kancelaria prawna',
      kind: 'strona firmowa',
      who: 'Radca prawny, który pracuje z firmami i chce, żeby nowy klient zaufał mu przed pierwszym telefonem.',
      inside: 'Specjalizacje z osobnymi stronami, zespół, artykuły, kontakt z mapą.',
      cut: 'Bodoni Moda, czerń, biel i czerwień pieczęci.',
      alt: 'Projekt strony kancelarii Rozwaga: nagłówek „Umowa, która wytrzyma spór.”, czerwona pieczęć i lista specjalizacji.',
    },
    acc: {
      trade: 'biuro rachunkowe',
      kind: 'strona usługowa z cennikiem',
      who: 'Biuro, które chce zdobywać małe firmy przez stronę, a nie tylko z polecenia.',
      inside: 'Usługi, pakiety z cenami, przewodnik po KSeF, formularz wyceny.',
      cut: 'Bricolage Grotesque, papier w kratkę, granat i pomarańcz.',
      alt: 'Projekt strony biura rachunkowego Rubryka: nagłówek „Księgowość bez zgadywania.” i karta miesiąca z fakturami z KSeF, VAT, ZUS i JPK.',
    },
    den: {
      trade: 'klinika stomatologiczna',
      kind: 'strona z cennikiem i zapisami',
      who: 'Klinika, której pacjenci porównują ceny i lekarzy, zanim zadzwonią.',
      inside: 'Zabiegi, cennik, zespół, zdjęcia przed i po, zapis przez zewnętrzny kalendarz.',
      cut: 'Outfit, biel, koral i kolornik zębów.',
      alt: 'Projekt strony kliniki Szkliwo: nagłówek „Uśmiech bez pośpiechu.” i kolornik z odcieniami zębów od A1 do D2.',
    },
    psy: {
      trade: 'gabinet psychoterapii',
      kind: 'wizytówka',
      who: 'Terapeuta, który pracuje sam i potrzebuje jednej spokojnej strony.',
      inside: 'O mnie, jak pracuję, cennik, kontakt. Jedna strona, szybka i czytelna.',
      cut: 'Newsreader, szałwia i głęboka zieleń.',
      alt: 'Projekt strony gabinetu Tafla: nagłówek „Możesz zacząć od jednej rozmowy.” i kręgi na wodzie.',
    },
    est: {
      trade: 'inwestycja mieszkaniowa',
      kind: 'strona sprzedażowa',
      who: 'Deweloper, który sprzedaje jedno osiedle i chce, żeby klient sam znalazł swoje mieszkanie.',
      inside:
        'Wyszukiwarka mieszkań na elewacji budynku, lokalizacja, galeria, kontakt do biura sprzedaży.',
      cut: 'Unbounded, beton, cegła i dach szedowy dawnej fabryki.',
      alt: 'Projekt strony osiedla Przędza: nagłówek „Mieszkania w dawnej przędzalni.”, filtr liczby pokoi i elewacja z zaznaczonym mieszkaniem.',
    },
    bis: {
      trade: 'bistro',
      kind: 'strona z kartą, PL i EN',
      who: 'Restauracja, do której przychodzą też turyści i która co tydzień zmienia kartę.',
      inside: 'Karta, wydarzenia, o nas, rezerwacja przez zewnętrzny system, wersja angielska.',
      cut: 'Gloock, musztarda, pomidor i biała karta.',
      alt: 'Projekt strony bistro Kminek: nagłówek „Kuchnia polska, podana od nowa.” i karta dnia z pierogami, żurkiem i kopytkami.',
    },
    shop: {
      trade: 'palarnia kawy',
      kind: 'sklep internetowy',
      who: 'Mała palarnia, która pali dwa razy w tygodniu i chce sprzedawać ziarno bez pośredników.',
      inside:
        'Sklep z filtrami, karta każdej kawy z krzywą palenia, koszyk, kasa na niby i subskrypcja.',
      cut: 'Big Shoulders Display, prawie czarny, limonka i bursztyn.',
      alt: 'Projekt strony palarni Trzask: nagłówek „Palimy we wtorki i czwartki.” i etykiety kaw z krzywą palenia.',
    },
    flat: {
      trade: 'biuro nieruchomości',
      kind: 'wyszukiwarka ofert',
      who: 'Trzyosobowe biuro, które sprzedaje i wynajmuje mieszkania i chce, żeby kupujący sami przeszukiwali oferty.',
      inside:
        'Oferty z filtrami i mapą dzielnic, karta każdej oferty z kalkulatorem kredytu, ulubione, wycena dla sprzedających.',
      cut: 'Archivo, biel, atrament i fiolet.',
      alt: 'Projekt strony biura nieruchomości Próg: nagłówek „Które okno będzie twoje?” i rysowane fasady kamienic z zaznaczonym oknem.',
    },
    stay: {
      trade: 'hotel',
      kind: 'strona z rezerwacją, PL i EN',
      who: 'Hotel na 24 pokoje w kamienicy nad Odrą, który chce, żeby goście rezerwowali bezpośrednio, a nie przez portale.',
      inside:
        'Pokoje, kalendarz z cenami, rezerwacja z dodatkami, moja rezerwacja, pakiety, bon podarunkowy, wersja angielska.',
      cut: 'Besley, bakłażan, malina i biel.',
      alt: 'Projekt strony hotelu Przęsło: nagłówek „Dwadzieścia cztery klucze nad Odrą.” i tablica recepcji z kluczami wolnych pokoi.',
    },
  },
  en: {
    id: 'swatch-book',
    title: 'Swatch book.',
    lead: 'Nine sample websites for made-up businesses in different trades. Each one cut differently, and each one works.',
    note: 'made-up businesses, my designs',
    who: "Who it's for",
    inside: 'Inside',
    cut: 'Cut',
    open: 'Open the website',
    order: 'I want a website like this',
    openPl: 'Open the website, in Polish',
    pick: 'Sample websites',
    hint: 'pick a strip',
    more: 'Brands and apps',
    kinds: 'Kind of work',
    play: 'Play the loops',
    pause: 'Pause the loops',
    identity: {
      tab: 'Identity',
      lead: 'Six identity case studies with a logo, colour, typography, mockups, animation and a brand book, each in a style matched to its trade, with downloadable files. The pages are in Polish.',
      all: 'All case studies, in Polish',
    },
    aso: {
      tab: 'Store screenshots',
      lead: 'Six App Store and Google Play screenshot sets for made-up apps, each in its own style, with an A/B test variant, icons and a ZIP of files. The pages are in Polish, while every set switches between Polish and English.',
      all: 'All sets, in Polish',
    },
    appPreview: {
      tab: 'App previews',
      lead: 'Six animated previews of mobile apps for made-up businesses: an App Store cut, three social formats, website loops and a storyboard, each in its own style with its own motion system. The pages are in Polish.',
      all: 'All previews, in Polish',
    },
    law: {
      trade: 'law firm',
      kind: 'company website',
      who: 'A legal adviser who works with companies and wants a new client to trust them before the first call.',
      inside: 'Practice areas with their own pages, the team, articles, contact with a map.',
      cut: 'Bodoni Moda, black, white and seal red.',
      alt: 'Design of the Rozwaga law firm website: the headline “Umowa, która wytrzyma spór.” (A contract that survives a dispute), a red seal and a list of practice areas.',
    },
    acc: {
      trade: 'accounting office',
      kind: 'service website with pricing',
      who: 'An office that wants to win small businesses through its website, not only by referral.',
      inside: 'Services, priced packages, a guide to KSeF e-invoicing, a quote form.',
      cut: 'Bricolage Grotesque, squared paper, navy and orange.',
      alt: 'Design of the Rubryka accounting office website: the headline “Księgowość bez zgadywania.” (Accounting without guesswork) and a month card with KSeF invoices, VAT, social security and JPK.',
    },
    den: {
      trade: 'dental clinic',
      kind: 'website with prices and booking',
      who: 'A clinic whose patients compare prices and dentists before they call.',
      inside:
        'Treatments, price list, team, before and after photos, booking through an external calendar.',
      cut: 'Outfit, white, coral and a tooth shade guide.',
      alt: 'Design of the Szkliwo dental clinic website: the headline “Uśmiech bez pośpiechu.” (A smile, unhurried) and a shade guide from A1 to D2.',
    },
    psy: {
      trade: 'psychotherapy practice',
      kind: 'one-page business card',
      who: 'A therapist who works alone and needs one calm page.',
      inside: 'About me, how I work, prices, contact. One page, fast and easy to read.',
      cut: 'Newsreader, sage and deep green.',
      alt: 'Design of the Tafla practice website: the headline “Możesz zacząć od jednej rozmowy.” (You can start with one conversation) and ripples on water.',
    },
    est: {
      trade: 'residential development',
      kind: 'sales website',
      who: 'A developer selling one estate who wants buyers to find their flat on their own.',
      inside: 'A flat finder on the building elevation, location, gallery, sales office contact.',
      cut: 'Unbounded, concrete, brick and the sawtooth roof of an old mill.',
      alt: 'Design of the Przędza estate website: the headline “Mieszkania w dawnej przędzalni.” (Flats in a former spinning mill), a room filter and the elevation with one flat highlighted.',
    },
    bis: {
      trade: 'bistro',
      kind: 'website with a menu, PL and EN',
      who: 'A restaurant that also gets tourists and changes its menu every week.',
      inside: 'Menu, events, about, booking through an external system, an English version.',
      cut: 'Gloock, mustard, tomato and a white menu card.',
      alt: 'Design of the Kminek bistro website: the headline “Kuchnia polska, podana od nowa.” (Polish food, served anew) and the menu of the day with pierogi, żurek and kopytka.',
    },
    shop: {
      trade: 'coffee roastery',
      kind: 'online shop',
      who: 'A small roastery that roasts twice a week and wants to sell its beans without a middleman.',
      inside:
        'A shop with filters, a page for every coffee with its roast curve, a cart, a pretend checkout and a subscription.',
      cut: 'Big Shoulders Display, near black, lime and amber.',
      alt: 'Design of the Trzask roastery website: the headline “Palimy we wtorki i czwartki.” (We roast on Tuesdays and Thursdays) and coffee labels with roast curves.',
    },
    flat: {
      trade: 'estate agency',
      kind: 'listings search',
      who: 'A three-person agency that sells and lets flats and wants buyers to search the offers on their own.',
      inside:
        'Listings with filters and a district map, a page for every offer with a mortgage calculator, favourites, a valuation request for owners.',
      cut: 'Archivo, white, ink and violet.',
      alt: 'Design of the Próg estate agency website: the headline “Które okno będzie twoje?” (Which window will be yours?) and drawn tenement facades with one window marked.',
    },
    stay: {
      trade: 'hotel',
      kind: 'website with booking, PL and EN',
      who: 'A 24-room hotel in a tenement by the Oder that wants guests to book direct instead of through portals.',
      inside:
        'Rooms, a calendar with prices, booking with extras, my booking, packages, a gift voucher, an English version.',
      cut: 'Besley, aubergine, raspberry and white.',
      alt: 'Design of the Przęsło hotel website: the headline “Dwadzieścia cztery klucze nad Odrą.” (Twenty-four keys by the Oder) and the reception key board with the keys of free rooms.',
    },
  },
};

const identity = [
  {
    slug: 'skibka',
    name: 'Skibka',
    pl: 'piekarnia na zakwasie, organiczny rzemieślniczy',
    en: 'sourdough bakery, organic craft',
    palette: ['#3A3128', '#8F5530', '#4F5B33', '#C9AD83', '#F2EDE2'],
  },
  {
    slug: 'nosna',
    name: 'Nośna',
    pl: 'festiwal sztuki nowych mediów, generatywna identyfikacja',
    en: 'new media art festival, generative identity',
    palette: ['#0E0E12', '#FF3D1F', '#00B3A4', '#FF2D95', '#E9E6DE'],
  },
  {
    slug: 'rzut',
    name: 'Rzut',
    pl: 'pracownia architektoniczna, szwajcarski modernizm',
    en: 'architecture studio, Swiss modernism',
    palette: ['#0A0A0A', '#FFFFFF', '#1F4BFF', '#BDBDB9', '#5A5A57'],
  },
  {
    slug: 'klamra',
    name: 'Klamra',
    pl: 'szkoła programowania online, neobrutalizm',
    en: 'online coding school, neo-brutalism',
    palette: ['#111111', '#FFE14A', '#FF5FA8', '#3DDC97', '#5CC8FF'],
  },
  {
    slug: 'cuvee',
    name: 'Cuvée',
    pl: 'hotel z winnicą, luksusowy edytorial',
    en: 'vineyard hotel, luxury editorial',
    palette: ['#15110E', '#F3ECDD', '#B08D57', '#D7BE8D', '#7A5A2A'],
  },
  {
    slug: 'wolnobieg',
    name: 'Wolnobieg',
    pl: 'serwis rowerowy, retro lata 70.',
    en: 'bike repair shop, 1970s retro',
    palette: ['#5B2F14', '#EC7424', '#E9A81D', '#7C8A2B', '#A64A0D'],
  },
];

const aso = [
  {
    slug: 'gran',
    name: 'Grań',
    pl: 'szlaki górskie w Sudetach, panorama ilustracyjna',
    en: 'mountain trails in the Sudetes, illustrated panorama',
  },
  {
    slug: 'szyld',
    name: 'Szyld',
    pl: 'zakupy w lokalnych sklepach, gradienty i przechylone urządzenia',
    en: 'shopping in local stores, gradients and tilted devices',
  },
  {
    slug: 'margines',
    name: 'Margines',
    pl: 'fiszki do nauki języków, odręczne adnotacje',
    en: 'language flashcards, handwritten notes',
  },
  {
    slug: 'chochla',
    name: 'Chochla',
    pl: 'przepisy i plan posiłków, memphis i pop-art',
    en: 'recipes and meal plans, Memphis and pop art',
  },
  {
    slug: 'kruszec',
    name: 'Kruszec',
    pl: 'budżet i inwestowanie, ciemne szkło premium',
    en: 'budgeting and investing, dark premium glass',
  },
  {
    slug: 'bis',
    name: 'Bis',
    pl: 'muzyka i koncerty, Y2K holograficzny chrom',
    en: 'music and gigs, Y2K holographic chrome',
  },
];

const appPreview = [
  {
    slug: 'kasownik',
    name: 'Kasownik',
    pl: 'bilety komunikacji miejskiej, natywny iOS, jasny i czysty',
    en: 'public transport tickets, native iOS, light and clean',
  },
  {
    slug: 'sztanga',
    name: 'Sztanga',
    pl: 'dziennik treningu siłowego, kinetyczna typografia',
    en: 'strength training log, kinetic type',
  },
  {
    slug: 'rygiel',
    name: 'Rygiel',
    pl: 'menedżer haseł z alertami wycieków, ciemny neon i cyber',
    en: 'password manager with breach alerts, dark neon cyber',
  },
  {
    slug: 'kielek',
    name: 'Kiełek',
    pl: 'pielęgnacja roślin domowych, claymorphism pastelowy',
    en: 'houseplant care, pastel claymorphism',
  },
  {
    slug: 'poziomka',
    name: 'Poziomka',
    pl: 'tracker nawyków z grywalizacją, ośmiobitowy pixel art',
    en: 'gamified habit tracker, 8-bit pixel art',
  },
  {
    slug: 'poludnie',
    name: 'Południe',
    pl: 'fotowoltaika i magazyn energii, izometryczny dashboard danych',
    en: 'solar panels and home battery, isometric data dashboard',
  },
];

export default function Wzornik({ lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const section = useRef(null);

  useFaces(section);

  const groups = [
    { id: 'identity', kind: 'id', href: '/wzornik/identyfikacja/', items: identity, ...t.identity },
    { id: 'aso', kind: 'aso', href: '/wzornik/aso/', items: aso, ...t.aso },
    {
      id: 'app-preview',
      kind: 'ap',
      href: '/wzornik/app-preview/',
      items: appPreview,
      ...t.appPreview,
    },
  ];

  return (
    <section className="wz" id={t.id} aria-labelledby="wz-h" ref={section}>
      <div className="sec-head">
        <h2 className="h2" id="wz-h">
          <Split text={t.title} onView />
        </h2>
        <p className="sec-head__side">{tie(t.lead)}</p>
      </div>
      <Fan sites={copy.sites} mocks={mocks} t={t} lang={lang} />
      <Works groups={groups} t={t} lang={lang} />
      <m.p
        className="hand-note"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={reduce ? instant : { duration: 0.7, delay: 0.3 }}>
        {tie(t.note)}
      </m.p>
    </section>
  );
}
