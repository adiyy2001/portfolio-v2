import React from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { duration, ease, instant, spring, stagger } from '../motion';

const media = name => withPrefix(`/media/budujzdrowo/${name}`);

const live = 'https://budujzdrowo.pl/';

const entries = [
  { id: 'netto', name: 'Powierzchnia netto podłogi', unit: 'm2' },
  { id: 'plyta', name: 'Powierzchnia płyty fundamentowej', unit: 'm2' },
];

const groups = [
  { name: 'Rodzaj budynku', must: true, options: ['Parterowy', 'Piętrowy'] },
  { name: 'Strych ocieplony', options: ['Tak', 'Nie'] },
  { name: 'Ściana kolankowa', must: true, options: ['Tak', 'Nie'] },
  { name: 'Antresola', must: true, options: ['Tak', 'Nie'] },
  { name: 'Duże przeszklenia', must: true, options: ['Tak', 'Nie'] },
  {
    name: 'Ogrzewanie',
    must: true,
    options: ['Elektryczne, maty', 'Gazowe', 'Pompa ciepła + fotowoltaika'],
  },
  { name: 'Dach na wiązarach', must: true, options: ['Tak', 'Nie'] },
  {
    name: 'Kształt dachu',
    must: true,
    options: ['Dwuspadowy lub kopertowy', 'Wielospadowy, z lukarnami'],
  },
  {
    name: 'Pokrycie dachu',
    must: true,
    options: ['Blachodachówka lub blacha', 'Deskowanie + papa lub gont', 'Dachówka'],
  },
];

const results = [
  'Koszt budynku (brutto)',
  'Koszt płyty fundamentowej (brutto)',
  'Razem (brutto)',
  'Cena za m2 w stanie deweloperskim (brutto)',
];

const years = [
  {
    year: '2020',
    items: [{ place: 'Osowiec', what: 'Dom szkieletowy z wiązarami, stan deweloperski' }],
  },
  {
    year: '2021',
    items: [
      { place: 'Żabia Wola', what: 'Dom murowany i dach' },
      { place: 'Warszawa Białołęka', what: 'Hydroizolacja piwnicy i schody' },
    ],
  },
  {
    year: '2022',
    items: [
      { place: 'Milanówek', what: 'Dom szkieletowy, stan deweloperski', film: true },
      { place: 'Izdebno-Kościelne', what: 'Płyta fundamentowa pod dom murowany' },
      { place: 'Warszawa Białołęka', what: 'Wykończenie, dom z bala' },
    ],
  },
  {
    year: '2023',
    items: [
      { place: 'Warszawa', what: 'Dom szkieletowy z paczki Eneroo', film: true },
      {
        place: 'Konstancin-Jeziorna',
        what: 'Rozbudowa domu szkieletowego z dachem niestandardowym, 2023/24',
      },
    ],
  },
  {
    year: '2024',
    items: [
      { place: 'Skierniewice', what: 'Dom szkieletowy 103 m2' },
      { place: 'Pilawa k. Piaseczna', what: 'Przebudowa domu z bala w konstrukcji szkieletowej' },
      { place: 'Żelechów', what: 'Dom murowany, stan deweloperski' },
    ],
  },
  {
    year: '2025',
    items: [
      { place: 'Jaktorów', what: 'Dwa dachy z płyt Steico i dachówka' },
      { place: 'Klaudyn', what: 'Płyty Steico, okna i drzwi, elewacja' },
      { place: 'Milanówek', what: 'Izolacja i elewacja 600 m2' },
      { place: 'Młochów', what: 'Izolacja ścian i elewacja' },
      { place: 'Grzegorzewice', what: 'Remont generalny domu z bala' },
      { place: 'Budy Michałowskie', what: 'Lekka płyta pod dom modułowy' },
      { place: 'Kamieńczyk i Podlasie', what: 'Płyty fundamentowe pod domy modułowe' },
    ],
  },
];

const spec = [
  [
    'Menu',
    'Siedem podstron: Home, O firmie, Poznaj nas, Portfolio, Technologia, Wycena i Kontakt. Poza menu są podziękowanie po wycenie i polityka prywatności.',
  ],
  [
    'Strona główna',
    'Slider z przyciskiem Formularz wyceny, cztery usługi, powody, żeby wybrać firmę, pięć etapów budowy, kontakt z mapą Google.',
  ],
  [
    'Oferta',
    'Domy szkieletowe w technologii skandynawskiej z materiałów Steico, domy murowane, prace wykończeniowe i dodatkowe: kostka, ogrodzenia, wiaty, tarasy.',
  ],
  [
    'Formularz',
    'Imię, e-mail, telefon i wiadomość. Zamiast kodu obrazkowego pyta o stolicę Polski. Ten sam formularz jest na stronie głównej i na Kontakt.',
  ],
  [
    'Google',
    'Dane firmy w formacie strukturalnym, mapa strony dla wyszukiwarek i mapa Google w kontakcie.',
  ],
  ['Cookies', 'Baner zgody Cookiebot z wyborem, co zezwolić.'],
];

const area = [
  'Warszawa',
  'Milanówek',
  'Żabia Wola',
  'Skierniewice',
  'Konstancin-Jeziorna',
  'Jaktorów',
];

const stack = [
  'WordPress',
  'Elementor Pro',
  'Calculated Fields Form',
  'Contact Form 7',
  'Rank Math',
  'Cookiebot',
];

const total = years.reduce((sum, item) => sum + item.items.length, 0);

const arrow = (
  <svg viewBox="0 0 28 14" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
  </svg>
);

function Plan() {
  const reduce = useReducedMotion();
  const draw = delay => ({
    initial: reduce ? false : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: reduce ? instant : { duration: duration.thread, delay, ease: ease.draw },
  });
  const rise = i => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: reduce
      ? instant
      : { duration: duration.reveal, ease: ease.out, delay: i * stagger.cards },
  });

  return (
    <figure className="bz-plan__sheet" aria-labelledby="bz-plan-cap">
      <div className="bz-plan__corner" aria-hidden="true">
        <span>Rys. 1</span>
        <span>Kalkulator budowy domu szkieletowego</span>
        <span>Wycena online</span>
      </div>
      <div className="bz-plan__body">
        <div className="bz-plan__in">
          <h3 className="bz-plan__label">
            <span aria-hidden="true">A</span> Wpisujesz
          </h3>
          <ul className="bz-plan__fields">
            {entries.map((item, i) => (
              <m.li key={item.id} className="bz-field" {...rise(i)}>
                <span className="bz-field__name">{item.name}</span>
                <span className="bz-field__box" aria-hidden="true">
                  <i />
                  <b>{item.unit}</b>
                </span>
              </m.li>
            ))}
          </ul>
          <h3 className="bz-plan__label">
            <span aria-hidden="true">B</span> Zaznaczasz
          </h3>
          <ul className="bz-plan__groups">
            {groups.map((group, i) => (
              <m.li key={group.name} className="bz-group" {...rise(i + 2)}>
                <p className="bz-group__name">
                  <span className="bz-group__no" aria-hidden="true">
                    {i + 1}
                  </span>
                  {group.name}
                  {group.must && (
                    <abbr className="bz-group__must" title="pole wymagane">
                      *
                    </abbr>
                  )}
                </p>
                <ul className="bz-group__options">
                  {group.options.map(option => (
                    <li key={option}>
                      <span aria-hidden="true" />
                      {option}
                    </li>
                  ))}
                </ul>
              </m.li>
            ))}
          </ul>
        </div>

        <svg
          className="bz-plan__bus"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true">
          <m.path
            className="bz-plan__trunk"
            d="M0 2V98"
            vectorEffect="non-scaling-stroke"
            {...draw(0.1)}
          />
          {[12.5, 37.5, 62.5, 87.5].map((y, i) => (
            <m.path
              key={y}
              className="bz-plan__branch"
              d={`M0 50C50 50 50 ${y} 100 ${y}`}
              vectorEffect="non-scaling-stroke"
              {...draw(0.4 + i * 0.12)}
            />
          ))}
        </svg>

        <div className="bz-plan__out">
          <h3 className="bz-plan__label">
            <span aria-hidden="true">C</span> Widzisz na żywo
          </h3>
          <ol className="bz-plan__results">
            {results.map((name, i) => (
              <m.li key={name} className="bz-result" {...rise(i + 4)}>
                <span className="bz-result__name">{name}</span>
                <span className="bz-result__value" aria-hidden="true">
                  <i />
                  zł
                </span>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="bz-plan__cap" id="bz-plan-cap">
        {tie(
          'Gwiazdka oznacza pole wymagane. Pod wynikami strona zaznacza, że wycena jest szacunkowa.',
        )}
      </figcaption>
    </figure>
  );
}

function Skyline() {
  const reduce = useReducedMotion();
  return (
    <ol className="bz-sky">
      {years.map((column, c) => (
        <li key={column.year} className="bz-year">
          <h3 className="bz-year__label">{column.year}</h3>
          <ul className="bz-year__stack">
            {column.items.map((item, i) => (
              <m.li
                key={`${item.place}-${item.what}`}
                className="bz-house"
                initial={reduce ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  reduce
                    ? instant
                    : { ...spring.toss, type: 'spring', delay: c * 0.06 + i * stagger.cards }
                }>
                <p className="bz-house__place">{item.place}</p>
                <p className="bz-house__what">{item.what}</p>
                {item.film && <p className="bz-house__film">film z budowy</p>}
              </m.li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default function BudujZdrowo() {
  return (
    <>
      <section className="bz-hero" aria-labelledby="bz-h">
        <div className="bz-hero__top">
          <Link className="proj__back" to={routes.work.pl}>
            {arrow}
            <span>Wszystkie projekty</span>
          </Link>
          <h1 className="bz-hero__title" id="bz-h">
            <span className="bz-hero__name">
              <Split text="Budujzdrowo.pl," />
            </span>
            <span className="bz-hero__sub">
              <Split text="strona wykonawcy domów szkieletowych" />
            </span>
          </h1>
        </div>

        <div className="bz-hero__stage">
          <figure className="bz-hero__shot">
            <img
              src={media('strona.webp')}
              width="1200"
              height="595"
              decoding="async"
              fetchpriority="high"
              alt="Strona główna budujzdrowo.pl: zdjęcie szkieletu domu z logo Zdrowa Budowa, menu i przycisk Formularz wyceny"
            />
            <span className="bz-hero__target" aria-hidden="true" />
            <span className="bz-hero__lens" aria-hidden="true">
              <img src={media('strona.webp')} width="1200" height="595" alt="" />
            </span>
            <span className="bz-hero__note" aria-hidden="true">
              jedno kliknięcie do kalkulatora
            </span>
          </figure>

          <div className="bz-hero__card">
            <p className="proj__tag">Strona wykonawcy domów szkieletowych</p>
            <p className="proj__meta">
              {tie('Zdrowa Budowa, firma budująca domy szkieletowe i murowane, Mazowsze')}
            </p>
            <p className="lead bz-hero__lead">
              {tie(
                'Zbudowałem stronę ekipy, która stawia domy szkieletowe i murowane. Odwiedzający liczy szacunkowy koszt, ogląda 18 realizacji i wysyła zapytanie.',
              )}
            </p>
            <a className="link" href={live} target="_blank" rel="noopener noreferrer">
              budujzdrowo.pl
            </a>
          </div>
        </div>
      </section>

      <section className="paper bz-way" aria-labelledby="bz-way-h">
        <div className="sec-head">
          <h2 className="h2" id="bz-way-h">
            <Split text="Jedno kliknięcie." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Kto planuje dom, chce policzyć koszt, zanim zadzwoni. Z pierwszego slajdu przycisk Formularz wyceny prowadzi prosto do kalkulatora.',
            )}
          </p>
        </div>
        <div className="bz-way__rail">
          <Reveal className="bz-way__stop bz-way__stop--from">
            <p className="bz-way__no" aria-hidden="true">
              1
            </p>
            <h3 className="bz-way__name">Pierwszy ekran</h3>
            <div className="bz-way__frame bz-way__frame--hero">
              <img
                src={media('strona.webp')}
                width="1200"
                height="595"
                loading="lazy"
                decoding="async"
                alt="Przycisk Formularz wyceny na pierwszym slajdzie strony głównej budujzdrowo.pl"
              />
              <span className="bz-way__pin" aria-hidden="true" />
            </div>
            <p className="bz-way__text">
              Przycisk Formularz wyceny stoi pod hasłem o izolacji z włókien drzewnych.
            </p>
          </Reveal>

          <div className="bz-way__click" aria-hidden="true">
            <svg viewBox="0 0 200 60" preserveAspectRatio="none">
              <path
                d="M2 30C60 -10 140 70 190 30"
                className="bz-way__path"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M178 20L192 30L180 42"
                className="bz-way__head"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span>1 klik</span>
          </div>

          <Reveal className="bz-way__stop bz-way__stop--to">
            <p className="bz-way__no" aria-hidden="true">
              2
            </p>
            <h3 className="bz-way__name">Kalkulator</h3>
            <div className="bz-way__frame bz-way__frame--calc">
              <p className="bz-way__url" aria-hidden="true">
                budujzdrowo.pl/wycena/
              </p>
              <img
                src={media('kalkulator.webp')}
                width="1020"
                height="540"
                loading="lazy"
                decoding="async"
                alt="Podstrona Wycena: nagłówek Kalkulator budowy domu szkieletowego, dwa puste pola powierzchni i grupy opcji"
              />
            </div>
            <p className="bz-way__text">
              Dwa pola na powierzchnię i pierwsze grupy opcji są od razu pod nagłówkiem.
            </p>
          </Reveal>
        </div>
        <p className="bz-way__menu">
          {tie(
            'Pozycja Wycena jest też w menu na każdej podstronie, a na komputerze numer telefonu stoi w nagłówku.',
          )}
        </p>
      </section>

      <section className="bz-plan" aria-labelledby="bz-plan-h">
        <div className="sec-head">
          <h2 className="h2" id="bz-plan-h">
            <Split text="Plan kalkulatora." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Dwa pola na powierzchnię i dziewięć grup opcji spływają do czterech wyników, które strona przelicza na żywo.',
            )}
          </p>
        </div>
        <Plan />
      </section>

      <section className="paper bz-time" aria-labelledby="bz-time-h">
        <div className="sec-head">
          <h2 className="h2" id="bz-time-h">
            <Split text="Osiemnaście realizacji." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Portfolio liczy realizacje z lat 2020 do 2025. Każda ma własną galerię, a dwie mają link do filmu z budowy.',
            )}
          </p>
        </div>
        <div className="bz-time__stats">
          <p className="bz-stat">
            <b>{total}</b>
            <span>realizacji</span>
          </p>
          <p className="bz-stat">
            <b>2020 do 2025</b>
            <span>lata w portfolio</span>
          </p>
          <p className="bz-stat">
            <b>2</b>
            <span>filmy z budowy</span>
          </p>
        </div>
        <div className="bz-time__stage">
          <Skyline />
          <Reveal as="figure" className="bz-time__photos">
            <img
              src={media('galerie.webp')}
              width="755"
              height="830"
              loading="lazy"
              decoding="async"
              alt="Trzy galerie z portfolio, po osiem zdjęć: zbrojenie płyt fundamentowych, ściany z izolacją i gotowe elewacje domów"
            />
            <figcaption>
              {tie('Trzy z 18 galerii: Kamieńczyk i Podlasie, Młochów, Milanówek.')}
            </figcaption>
          </Reveal>
        </div>
        <ul className="bz-time__area" aria-label="Miejscowości z portfolio">
          {area.map(place => (
            <li key={place}>{place}</li>
          ))}
          <li className="bz-time__more">i inne na Mazowszu</li>
        </ul>
      </section>

      <section className="bz-spec" aria-labelledby="bz-spec-h">
        <div className="sec-head">
          <h2 className="h2" id="bz-spec-h">
            <Split text="Co jest na stronie." onView />
          </h2>
          <p className="sec-head__side">
            {tie('Strona jest tylko po polsku, a menu ma siedem pozycji.')}
          </p>
        </div>
        <div className="bz-spec__row">
          <div className="bz-spec__main">
            <dl className="bz-spec__list">
              {spec.map(([term, text], i) => (
                <Reveal key={term} className="bz-spec__item" style={{ '--i': i }}>
                  <dt>{term}</dt>
                  <dd>{tie(text)}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal className="proj__stack bz-spec__stack">
              <p className="proj__label bz-spec__label" id="bz-tech-h">
                Na stronie działa
              </p>
              <ul className="proj__tech bz-spec__tech" aria-labelledby="bz-tech-h">
                {stack.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="bz-phone">
            <h3 className="bz-phone__h">Na telefonie</h3>
            <div className="cc-phone">
              <img
                src={media('telefon.webp')}
                width="390"
                height="770"
                loading="lazy"
                decoding="async"
                alt="Podstrona Wycena na telefonie: nagłówek Kalkulator budowy domu szkieletowego, pola powierzchni i pierwsze opcje"
              />
            </div>
            <p className="bz-phone__text">
              {tie(
                'Przy szerokości 390 px strona nie przewija się na boki. Menu otwiera się na pełny ekran i mieści siedem pozycji. Pola formularzy układają się jedno pod drugim, a pola kalkulatora mają 330 px szerokości.',
              )}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bz-ask" aria-labelledby="bz-ask-h">
        <h2 className="bz-ask__h" id="bz-ask-h">
          Wyceń projekt
        </h2>
        <p className="bz-ask__text">
          {tie(
            'Prowadzisz firmę usługową i potrzebujesz strony z kalkulatorem, galerią realizacji i formularzem? Opiszę, co z tego ma sens u Ciebie, i podam wycenę.',
          )}
        </p>
        <Magnet className="btn" href="#wycena" data-cta="budujzdrowo-quote">
          Wyceń projekt
        </Magnet>
      </section>

      <div className="proj__end">
        <Link className="cross cross--back" to={routes.work.pl}>
          <svg viewBox="0 0 40 18" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M39 9H2M10 1L2 9L10 17" />
          </svg>
          <span>Wszystkie projekty</span>
        </Link>
      </div>
    </>
  );
}
