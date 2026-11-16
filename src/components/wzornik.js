import React, { useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { instant } from '../motion';
import Split from './split';
import Acc from './wzornik/acc';
import Bis from './wzornik/bis';
import Car from './wzornik/car';
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
  car: Car,
};

const copy = {
  sites: [
    {
      id: 'law',
      slug: 'kancelaria-swidnicka',
      name: 'Kancelaria Świdnicka',
      blade: 'Kancelaria',
      chips: ['#000000', '#f6f3ec', '#d71920'],
    },
    {
      id: 'acc',
      slug: 'biuro-rachunkowe-gajowice',
      name: 'Biuro Rachunkowe Gajowice',
      blade: 'Biuro Rachunkowe',
      chips: ['#111111', '#f4f4f4', '#8c8c8c'],
    },
    {
      id: 'den',
      slug: 'stomatologia-krzyki',
      name: 'Stomatologia Krzyki',
      blade: 'Stomatologia',
      chips: ['#0e1747', '#2d3bff', '#d4f25a'],
    },
    {
      id: 'psy',
      slug: 'psychoterapia-biskupin',
      name: 'Psychoterapia Biskupin',
      blade: 'Psychoterapia',
      chips: ['#2a2724', '#ece8e1', '#8a7f6e'],
    },
    {
      id: 'est',
      slug: 'lofty-cegielniane',
      name: 'Lofty Cegielniane',
      blade: 'Lofty',
      chips: ['#080504', '#efe3cf', '#6b3420'],
    },
    {
      id: 'bis',
      slug: 'bistro-na-szczepinie',
      name: 'Bistro na Szczepinie',
      blade: 'Bistro',
      en: true,
      chips: ['#1d140e', '#f3ead8', '#6b1d22'],
    },
    {
      id: 'shop',
      slug: 'palarnia-kawy-nadodrze',
      name: 'Palarnia Kawy Nadodrze',
      blade: 'Palarnia Kawy',
      chips: ['#24160d', '#e9dcc7', '#c99f6e'],
    },
    {
      id: 'flat',
      slug: 'nieruchomosci-psie-pole',
      name: 'Nieruchomości Psie Pole',
      blade: 'Nieruchomości',
      chips: ['#121212', '#faf9f5', '#4a4944'],
    },
    {
      id: 'stay',
      slug: 'hotel-kamienica-1912',
      name: 'Hotel Kamienica 1912',
      blade: 'Hotel 1912',
      en: true,
      chips: ['#17392c', '#f1e7cf', '#e8dcc0'],
    },
    {
      id: 'car',
      slug: 'warsztat-szybowcowa',
      name: 'Warsztat Szybowcowa',
      blade: 'Warsztat',
      chips: ['#0b0b0a', '#efede6', '#ffe400'],
    },
  ],
  pl: {
    id: 'wzornik',
    title: 'Wzornik.',
    label: 'Przykładowe strony dla firm',
    lead: 'Dziesięć przykładowych stron dla zmyślonych firm z różnych branż. Każda skrojona inaczej i każda działa.',
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
      who: 'Kancelaria dwojga prawników, która chce, żeby klient przyszedł na pierwszą rozmowę z kompletem dokumentów.',
      inside:
        'Zakres spraw, przebieg sprawy w czterech krokach, lista dokumentów do wybranej sprawy, zespół z godzinami i formularz.',
      cut: 'Bodoni Moda, papierowa biel, czerń i jedna czerwień.',
      alt: 'Projekt strony Kancelarii Świdnickiej: nagłówek „Prowadzimy sprawy rodzinne, spadkowe, spółek i umów.”, spis treści z paragrafami i czerwony pas z numerem telefonu.',
    },
    acc: {
      trade: 'biuro rachunkowe',
      kind: 'strona z panelem i kalkulatorem',
      who: 'Biuro, które prowadzi księgi małych firm i chce pokazać, że zawsze wie, co i kiedy trzeba zapłacić.',
      inside:
        'Przykładowy panel klienta z kwotami i terminami, kalendarz biura, porównanie planów, kalkulator abonamentu, pytania i formularz wyceny. Wszystko obsłużysz z klawiatury.',
      cut: 'JetBrains Mono, same szarości i linie grubości piksela.',
      alt: 'Projekt strony Biura Rachunkowego Gajowice: panel klienta z kwotą 12 509,58 zł do zapłaty za październik, listą klientów i terminami ZUS, PIT i VAT.',
    },
    den: {
      trade: 'gabinet stomatologiczny',
      kind: 'strona z cennikiem i zapisem',
      who: 'Gabinet na Krzykach, którego pacjenci chcą znać cenę i czas wizyty, zanim usiądą na fotelu.',
      inside:
        'Cennik jako wykres, pierwsza wizyta rozpisana na minuty, suwak odcienia zębów, zespół, godziny przyjęć i formularz wizyty.',
      cut: 'Manrope, kobalt, limonka i granat.',
      alt: 'Projekt strony gabinetu Stomatologia Krzyki: nagłówek „Zęby, o których możesz zapomnieć.”, kobaltowy łuk z zębem i odcienie od A1 do C1.',
    },
    psy: {
      trade: 'gabinet psychoterapii',
      kind: 'wizytówka',
      who: 'Terapeutka z Biskupina, która pracuje sama i potrzebuje jednej spokojnej strony.',
      inside:
        'Jak wygląda pierwsze spotkanie, minuta na oddech, formy pracy z cenami, pytania i kontakt.',
      cut: 'Newsreader, biel i blady ciepły szary.',
      alt: 'Projekt strony gabinetu Psychoterapia Biskupin: zdjęcie gładkiego kamienia i pytanie „Od czego chcesz zacząć?”.',
    },
    est: {
      trade: 'lofty w dawnej cegielni',
      kind: 'strona sprzedażowa',
      who: 'Deweloper, który przerabia cegielnię z 1894 roku na lofty i sprzedaje je historią budynku.',
      inside:
        'Plany loftów z cenami, historia cegielni, suwak słońca ze światłem w mieszkaniu o każdej godzinie, adres i godziny pokazów.',
      cut: 'Archivo, szerokie wersaliki jak napisy w kinie, ciemny brąz i cegła.',
      alt: 'Projekt strony Loftów Cegielnianych: ceglany szczyt hali z łukowymi oknami o zmierzchu i nagłówek „W 1894 roku wypalono tu pierwszą cegłę.”',
    },
    bis: {
      trade: 'bistro',
      kind: 'strona z kartą, PL i EN',
      who: 'Bistro na Szczepinie, które co tydzień zmienia kartę i gości też turystów.',
      inside:
        'Karta tygodnia, śniadania, lunch i kolacje, przypisy do karty, rezerwacja stolika i wersja angielska.',
      cut: 'Cormorant Garamond, krem, bordo i mosiądz.',
      alt: 'Projekt strony Bistro na Szczepinie: zdjęcie dania, nagłówek „Polędwiczki w sosie pieprzowym”, kolacja za 42 zł i danie dnia z pierogami ruskimi.',
    },
    shop: {
      trade: 'palarnia kawy',
      kind: 'sklep internetowy',
      who: 'Mała palarnia na Nadodrzu, która sprzedaje ziarno w swoim sklepie i przez stronę.',
      inside:
        'Sklep z kawami i koszykiem, skala palenia od 1 do 12, krzywa palenia, mielenie pod sposób parzenia i kontakt z godzinami.',
      cut: 'Special Elite i odręczne pismo, papier, kraft i palony brąz.',
      alt: 'Projekt strony Palarni Kawy Nadodrze: odręczne słowo „KAWA”, ziarna kawy i notatka „partia 31, filtr”.',
    },
    flat: {
      trade: 'biuro nieruchomości',
      kind: 'katalog ofert jak magazyn',
      who: 'Biuro, które pokazuje oferty jak czasopismo: duże zdjęcia, a cena i adres w podpisie.',
      inside:
        'Katalog ofert z filtrem pokoi, osiedli i budżetu, reportaż o sprzedaży od wyceny do kluczy, ceny z osiedli i formularz wyceny.',
      cut: 'Newsreader, papierowa biel i czerń. Kolor dają tylko zdjęcia.',
      alt: 'Projekt strony biura Nieruchomości Psie Pole: okładka numeru z listopada 2026, trzy oferty ze zdjęciami, cenami i adresami oraz spis „W numerze”.',
    },
    stay: {
      trade: 'hotel butikowy',
      kind: 'strona z rezerwacją, PL i EN',
      who: 'Hotel na czternaście pokoi w kamienicy z 1912 roku, osiem minut pieszo od Rynku. Chce, żeby goście rezerwowali bezpośrednio.',
      inside:
        'Pokoje, doba w hotelu, wybór pokoju z liczbą dób i ceną, trasa na Rynek i wersja angielska.',
      cut: 'Cinzel Decorative, Pinyon Script i Playfair Display, butelkowa zieleń i krem.',
      alt: 'Projekt strony Hotelu Kamienica 1912: etykieta z brelokiem z literą K, rok 1912 i hasło „Czternaście pokoi i jeden klucz do miasta.”',
    },
    car: {
      trade: 'warsztat samochodowy',
      kind: 'strona z kalkulatorem ceny',
      who: 'Warsztat na Fabrycznej, którego klienci chcą znać cenę przeglądu, zanim zadzwonią.',
      inside:
        'Cennik z kalkulatorem, suwak momentu dokręcenia kół, naprawa od przyjęcia do odbioru, godziny, telefon i formularz.',
      cut: 'Anton i Playfair Display, czerń, szarości fotokopii i kwaśna żółć.',
      alt: 'Projekt strony warsztatu przy Szybowcowej: żółta kartka z momentem dokręcenia koła 110 Nm, klucz i przegląd od 189 zł.',
    },
  },
  en: {
    id: 'swatch-book',
    title: 'Swatch book.',
    label: 'Sample websites for companies',
    lead: 'Ten sample websites for made-up businesses in different trades. Each one cut differently, and each one works.',
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
      who: 'A two-lawyer firm that wants every client to bring the right documents to the first meeting.',
      inside:
        'Practice areas, a case in four steps, a document list for the chosen matter, the team with office hours, a contact form.',
      cut: 'Bodoni Moda, paper white, black and one red.',
      alt: 'Design of the Kancelaria Świdnicka law firm website: the headline “Prowadzimy sprawy rodzinne, spadkowe, spółek i umów.” (We handle family, inheritance, company and contract matters), a numbered table of contents and a red band with the phone number.',
    },
    acc: {
      trade: 'accounting office',
      kind: 'website with a client panel and calculator',
      who: 'An office that keeps the books of small businesses and wants to show it always knows what is due and when.',
      inside:
        'A sample client panel with amounts and deadlines, the office calendar, a plan comparison, a subscription calculator, FAQ and a quote form. All of it works from the keyboard.',
      cut: 'JetBrains Mono, greys only and one pixel rules.',
      alt: 'Design of the Biuro Rachunkowe Gajowice accounting office website: a client panel with 12 509,58 zł due for October, a client list and the ZUS, PIT and VAT deadlines.',
    },
    den: {
      trade: 'dental practice',
      kind: 'website with prices and booking',
      who: 'A practice in Krzyki whose patients want to know the price and length of a visit before they sit in the chair.',
      inside:
        'Prices as a chart, the first visit broken down by the minute, a tooth shade slider, the team, opening hours and a visit form.',
      cut: 'Manrope, cobalt, lime and navy.',
      alt: 'Design of the Stomatologia Krzyki dental practice website: the headline “Zęby, o których możesz zapomnieć.” (Teeth you can forget about), a cobalt arch with a tooth and shades from A1 to C1.',
    },
    psy: {
      trade: 'psychotherapy practice',
      kind: 'one-page business card',
      who: 'A therapist in Biskupin who works alone and needs one calm page.',
      inside:
        'What the first meeting looks like, a minute to breathe, forms of therapy with prices, questions and contact.',
      cut: 'Newsreader, white and one pale warm grey.',
      alt: 'Design of the Psychoterapia Biskupin practice website: a photo of a smooth stone and the question “Od czego chcesz zacząć?” (Where would you like to start?).',
    },
    est: {
      trade: 'lofts in an old brickworks',
      kind: 'sales website',
      who: 'A developer turning an 1894 brickworks into lofts and selling them through the story of the building.',
      inside:
        'Loft plans with prices, the history of the brickworks, a sun slider that shows the light in a flat at any hour, the address and viewing hours.',
      cut: 'Archivo, wide capitals like film credits, dark brown and brick.',
      alt: 'Design of the Lofty Cegielniane lofts website: the brick gable of the kiln hall with arched windows at dusk and the headline “W 1894 roku wypalono tu pierwszą cegłę.” (The first brick was fired here in 1894).',
    },
    bis: {
      trade: 'bistro',
      kind: 'website with a menu, PL and EN',
      who: 'A bistro in Szczepin that changes its menu every week and gets tourists too.',
      inside:
        'The weekly menu, breakfast, lunch and dinner, notes on the menu, table booking and an English version.',
      cut: 'Cormorant Garamond, cream, oxblood and brass.',
      alt: 'Design of the Bistro na Szczepinie website: a photo of a dish, the headline “Polędwiczki w sosie pieprzowym” (Pork tenderloin in pepper sauce), dinner for 42 zł and the dish of the day, pierogi ruskie.',
    },
    shop: {
      trade: 'coffee roastery',
      kind: 'online shop',
      who: 'A small roastery in Nadodrze that sells its beans in its own shop and online.',
      inside:
        'A shop with a cart, a roast scale from 1 to 12, the roast curve, a grind guide for each brewing method and contact with opening hours.',
      cut: 'Special Elite and handwriting, paper, kraft and roasted brown.',
      alt: 'Design of the Palarnia Kawy Nadodrze roastery website: the word “KAWA” (coffee) written by hand, coffee beans and the note “partia 31, filtr” (batch 31, filter).',
    },
    flat: {
      trade: 'estate agency',
      kind: 'listings magazine',
      who: 'An agency that presents its listings like a magazine: big photos, with the price and address in the caption.',
      inside:
        'A listings catalogue filtered by rooms, district and budget, a feature on a sale from valuation to handover, prices by district and a valuation form.',
      cut: 'Newsreader, paper white and black. All colour comes from the photos.',
      alt: 'Design of the Nieruchomości Psie Pole estate agency website: the cover of the November 2026 issue, three listings with photos, prices and addresses, and the contents list “W numerze” (In this issue).',
    },
    stay: {
      trade: 'boutique hotel',
      kind: 'website with booking, PL and EN',
      who: 'A fourteen-room hotel in a 1912 tenement, eight minutes on foot from the Market Square, that wants guests to book direct.',
      inside:
        'Rooms, a day at the hotel, room choice with nights and price, the walk to the Market Square and an English version.',
      cut: 'Cinzel Decorative, Pinyon Script and Playfair Display, bottle green and cream.',
      alt: 'Design of the Hotel Kamienica 1912 website: a label with a key fob marked K, the year 1912 and the line “Czternaście pokoi i jeden klucz do miasta.” (Fourteen rooms and one key to the city).',
    },
    car: {
      trade: 'car repair shop',
      kind: 'website with a price calculator',
      who: 'A garage in Fabryczna whose customers want to know the inspection price before they call.',
      inside:
        'Prices with a calculator, a wheel torque slider, the repair from drop-off to pick-up, hours, phone and a form.',
      cut: 'Anton and Playfair Display, black, photocopy greys and acid yellow.',
      alt: 'Design of the Warsztat Szybowcowa garage website: a yellow tag with the wheel torque of 110 Nm, a wrench and an inspection from 189 zł.',
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
          <span className="h2__label">{t.label}</span>
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
