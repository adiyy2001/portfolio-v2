import React, { useRef, useState, useSyncExternalStore } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { instant } from '../motion';
import Reveal from './reveal';
import Split from './split';
import Acc from './wzornik/acc';
import Bis from './wzornik/bis';
import Den from './wzornik/den';
import Est from './wzornik/est';
import useFaces from './wzornik/fonts';
import Law from './wzornik/law';
import Psy from './wzornik/psy';

const mocks = { law: Law, acc: Acc, den: Den, psy: Psy, est: Est, bis: Bis };

const copy = {
  sites: [
    { id: 'law', name: 'Rozwaga', chips: ['#121212', '#ffffff', '#b3122a'] },
    { id: 'acc', name: 'Rubryka', chips: ['#0f1f3d', '#f3f6fb', '#ff5b24'] },
    { id: 'den', name: 'Szkliwo', chips: ['#1b1f2a', '#ffffff', '#ff6f5b'] },
    { id: 'psy', name: 'Tafla', chips: ['#1f2d26', '#dfe8e1', '#2f5d50'] },
    { id: 'est', name: 'Przędza', chips: ['#161616', '#d7d8d3', '#b4462e'] },
    { id: 'bis', name: 'Kminek', chips: ['#2b1408', '#ffcf3a', '#d93a1f'] },
  ],
  pl: {
    id: 'wzornik',
    title: 'Wzornik.',
    lead: 'Sześć przykładowych stron dla branż, które najczęściej szukają strony. Każda skrojona inaczej.',
    note: 'firmy zmyślone, projekty moje',
    who: 'Dla kogo',
    inside: 'W środku',
    cut: 'Krój',
    state: 'Projekt koncepcyjny. Wersja na żywo w przygotowaniu.',
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
  },
  en: {
    id: 'swatch-book',
    title: 'Swatch book.',
    lead: 'Six sample websites for the trades that most often need one. Each one cut differently.',
    note: 'made-up firms, my designs',
    who: "Who it's for",
    inside: 'Inside',
    cut: 'Cut',
    state: 'Concept design. Live version in progress.',
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
  },
};

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
        {copy.sites.map(({ id, name, chips }, i) => {
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
                      <p className="sw__state">{tie(t.state)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </Reveal>
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
