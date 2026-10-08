import React, { useRef, useState, useSyncExternalStore } from 'react';
import { withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { instant } from '../motion';
import Reveal from './reveal';
import Split from './split';
import Acc from './wzornik/acc';
import Bis from './wzornik/bis';
import Den from './wzornik/den';
import Est from './wzornik/est';
import Flat from './wzornik/flat';
import useFaces from './wzornik/fonts';
import Law from './wzornik/law';
import Psy from './wzornik/psy';
import Shop from './wzornik/shop';
import Stay from './wzornik/stay';

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
    identity: {
      title: 'Identyfikacja wizualna',
      lead: 'Sześć realizacji z logo, kolorem, typografią, makietami, animacją i brand bookiem. Każda ze stylem dobranym do branży, z plikami do pobrania.',
      all: 'Wszystkie realizacje',
    },
    appPreview: {
      title: 'App preview',
      lead: 'Sześć animowanych podglądów aplikacji mobilnych dla zmyślonych firm: wersja do App Store, trzy formaty social, pętle na stronę i storyboard. Każdy w innym stylu i z własnym systemem ruchu.',
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
    openPl: 'Open the website, in Polish',
    identity: {
      title: 'Visual identity',
      lead: 'Six identity case studies with a logo, colour, typography, mockups, animation and a brand book, each in a style matched to its trade, with downloadable files. The pages are in Polish.',
      all: 'All case studies, in Polish',
    },
    appPreview: {
      title: 'App previews',
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
    trade: 'piekarnia na zakwasie',
    style: 'organiczny rzemieślniczy',
  },
  {
    slug: 'nosna',
    name: 'Nośna',
    trade: 'festiwal sztuki nowych mediów',
    style: 'generatywna identyfikacja',
  },
  {
    slug: 'rzut',
    name: 'Rzut',
    trade: 'pracownia architektoniczna',
    style: 'szwajcarski modernizm',
  },
  { slug: 'klamra', name: 'Klamra', trade: 'szkoła programowania online', style: 'neobrutalizm' },
  { slug: 'cuvee', name: 'Cuvée', trade: 'hotel z winnicą', style: 'luksusowy edytorial' },
  { slug: 'wolnobieg', name: 'Wolnobieg', trade: 'serwis rowerowy', style: 'retro lata 70.' },
];

const appPreview = [
  {
    slug: 'kasownik',
    name: 'Kasownik',
    trade: 'bilety komunikacji miejskiej',
    style: 'natywny iOS, jasny i czysty',
  },
  {
    slug: 'sztanga',
    name: 'Sztanga',
    trade: 'dziennik treningu siłowego',
    style: 'kinetyczna typografia',
  },
  {
    slug: 'rygiel',
    name: 'Rygiel',
    trade: 'menedżer haseł z alertami wycieków',
    style: 'ciemny neon i cyber',
  },
  {
    slug: 'kielek',
    name: 'Kiełek',
    trade: 'pielęgnacja roślin domowych',
    style: 'claymorphism pastelowy',
  },
  {
    slug: 'poziomka',
    name: 'Poziomka',
    trade: 'tracker nawyków z grywalizacją',
    style: 'pixel art 8-bit',
  },
  {
    slug: 'poludnie',
    name: 'Południe',
    trade: 'domowa fotowoltaika i magazyn energii',
    style: 'izometryczny dashboard danych',
  },
];

const noop = () => () => {};

export default function Wzornik({ lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const section = useRef(null);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState({ law: true });

  useFaces(section);

  const toggle = id => setOpen(state => ({ ...state, [id]: !state[id] }));

  return (
    <section className="wz" id={t.id} aria-labelledby="wz-h" ref={section}>
      <div className="sec-head">
        <h2 className="h2" id="wz-h">
          <Split text={t.title} onView />
        </h2>
        <p className="sec-head__side">{tie(t.lead)}</p>
      </div>
      <Reveal as="ol" className="book">
        {copy.sites.map(({ id, slug, name, en, chips }, i) => {
          const s = t[id];
          const Mock = mocks[id];
          const isOpen = Boolean(open[id]);
          return (
            <li
              key={id}
              className={`sw sw--${id}${isOpen ? ' is-open' : ''}`}
              style={{ '--i': i + 1 }}>
              <h3 className="sw__h">
                <button
                  type="button"
                  className="sw__btn"
                  id={`sw-${id}-b`}
                  aria-expanded={isOpen}
                  aria-controls={`sw-${id}-p`}
                  onClick={() => toggle(id)}>
                  <span className="sw__name">{name}</span>
                  <span className="sw__trade">{tie(s.trade)}</span>
                  <span className="sw__kind">{tie(s.kind)}</span>
                  <span className="sw__ico" aria-hidden="true" />
                </button>
              </h3>
              <div
                className="sw__panel"
                id={`sw-${id}-p`}
                role="region"
                aria-labelledby={`sw-${id}-b`}
                inert={hydrated && !isOpen ? '' : undefined}>
                <div className="sw__in">
                  <div className="sw__grid">
                    <div className="sw__shot">
                      <div className={`mock mk--${id}`} role="img" aria-label={s.alt}>
                        <div className="mk" lang="pl">
                          <Mock />
                        </div>
                      </div>
                    </div>
                    <div className="sw__info">
                      <div>
                        <p className="sw__label">{tie(t.who)}</p>
                        <p className="sw__text">{tie(s.who)}</p>
                      </div>
                      <div>
                        <p className="sw__label">{tie(t.inside)}</p>
                        <p className="sw__text">{tie(s.inside)}</p>
                      </div>
                      <div>
                        <p className="sw__label">{tie(t.cut)}</p>
                        <p className="sw__text">{tie(s.cut)}</p>
                        <p className="sw__chips" aria-hidden="true">
                          {chips.map(chip => (
                            <i key={chip} style={{ '--c': chip }} />
                          ))}
                        </p>
                      </div>
                      <p className="sw__state">
                        <a
                          className="link"
                          href={withPrefix(`/wzornik/${slug}/${lang === 'en' && en ? 'en/' : ''}`)}>
                          {lang === 'en' && !en ? t.openPl : t.open}
                          <span className="sr">, {name}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </Reveal>
      <div className="wz-id">
        <h3 className="wz-id__h">{t.identity.title}</h3>
        <p className="wz-id__lead">{tie(t.identity.lead)}</p>
        <ul className="wz-id__list">
          {identity.map(({ slug, name, trade, style }) => (
            <li key={slug}>
              <a className="link" href={withPrefix(`/wzornik/identyfikacja/${slug}/`)}>
                {name}
              </a>
              <span>
                {trade}, {style}
              </span>
            </li>
          ))}
        </ul>
        <p className="wz-id__all">
          <a className="link" href={withPrefix('/wzornik/identyfikacja/')}>
            {t.identity.all}
          </a>
        </p>
      </div>
      <div className="wz-id">
        <h3 className="wz-id__h">{t.appPreview.title}</h3>
        <p className="wz-id__lead">{tie(t.appPreview.lead)}</p>
        <ul className="wz-id__list">
          {appPreview.map(({ slug, name, trade, style }) => (
            <li key={slug}>
              <a className="link" href={withPrefix(`/wzornik/app-preview/${slug}/`)}>
                {name}
              </a>
              <span>
                {trade}, {style}
              </span>
            </li>
          ))}
        </ul>
        <p className="wz-id__all">
          <a className="link" href={withPrefix('/wzornik/app-preview/')}>
            {t.appPreview.all}
          </a>
        </p>
      </div>
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
