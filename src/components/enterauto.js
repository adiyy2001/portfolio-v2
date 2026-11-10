import React, { useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { instant, spring, stagger } from '../motion';

const media = name => withPrefix(`/media/enterauto/${name}`);

const live = 'https://enterauto.pl/';

const ways = [
  {
    id: 'tel',
    kind: 'phone',
    label: '883 289 389',
    name: 'Zadzwoń',
    text: 'Krótka rozmowa wystarcza, żeby poznać wstępne warunki odkupu. Przycisk w hero dzwoni po jednym dotknięciu, a numer i godziny 8:00 do 22:00 są też w pasku nad menu.',
    to: live,
    link: 'enterauto.pl',
  },
  {
    id: 'online',
    kind: 'online',
    label: 'Wycena online',
    name: 'Wyślij zapytanie',
    text: 'Formularz ma 15 pól, ale obowiązkowe są tylko telefon i e-mail. Zdjęcia auta można dołączyć do sześciu pól.',
    to: `${live}wycena-online/`,
    link: 'enterauto.pl/wycena-online',
  },
  {
    id: 'scrap',
    kind: 'scrap',
    label: 'Wycena na kasację',
    name: 'Skasuj auto',
    text: 'Osobna strona o złomowaniu i kasacji z lawetą i zaświadczeniem. Krótki formularz pyta o imię, numer, miejscowość, markę, model, rocznik i jedno zdjęcie.',
    to: `${live}zlomowanie-aut-wroclaw/`,
    link: 'enterauto.pl/zlomowanie-aut-wroclaw',
  },
];

const terms = [
  'wycena darmowa',
  'bezpłatny odbiór własnym transportem',
  'gotówka do rąk',
  'umowa kupna-sprzedaży',
  'wypowiedzenie OC na życzenie',
];

const groups = [
  {
    name: 'O Tobie',
    fields: [
      { name: 'Imię' },
      { name: 'Numer telefonu', must: true },
      { name: 'E-mail', must: true },
      { name: 'Lokalizacja' },
    ],
  },
  {
    name: 'O aucie',
    fields: [
      { name: 'Marka', span: 2, hint: 'lista 67 pozycji z Pozostałe' },
      { name: 'Model', span: 2 },
      { name: 'Rok produkcji', span: 2, hint: '2026 do 1999 i starszy' },
      { name: 'Paliwo', span: 6, pills: ['Benzyna', 'LPG', 'Diesel', 'Hybryda', 'Elektryczny'] },
      { name: 'Pojemność silnika', span: 2, hint: 'ccm3' },
      { name: 'Skrzynia', span: 2, pills: ['Manualna', 'Automatyczna'] },
      { name: 'Przebieg', span: 2, hint: 'km' },
    ],
  },
  {
    name: 'Opis i warunki',
    fields: [
      { name: 'Opis', span: 6, hint: 'obecne awarie, ważne kwestie' },
      { name: 'Zdjęcia', span: 6, photos: true, hint: 'można wybrać kilka plików naraz' },
      {
        name: 'Jak długo jesteś właścicielem',
        span: 6,
        pills: ['0 do 6 miesięcy', '6 do 12 miesięcy', '1 do 2 lat', '2 do 5 lat', 'od nowości'],
      },
      { name: 'Oczekiwana cena', hint: 'PLN' },
    ],
  },
];

const short = ['Imię', 'Numer', 'Miejscowość', 'Marka, model, rocznik', 'Zdjęcie'];

const views = [
  { id: 'all', label: 'Wszystkie', count: 15 },
  { id: 'must', label: 'Wymagane', count: 2 },
  { id: 'photos', label: 'Zdjęcia', count: 6 },
];

const bands = [
  { name: 'Nagłówek z logo i menu', size: 157 },
  { name: 'Auto', size: 308 },
  { name: 'Tytuł', size: 180 },
  { size: 21 },
  { name: 'Przycisk z numerem', size: 51 },
  { size: 23 },
  { name: 'Wycena online', size: 64 },
  { name: 'Wycena na kasację tuż pod linią', size: 40, below: true },
];

const spec = [
  [
    'Menu',
    'Sześć pozycji: Strona główna, Blog, Wycena online, Obsługiwany obszar z podmenu, Złomowanie aut Wrocław i Kontakt.',
  ],
  [
    'Strona główna',
    'Pasek z telefonem i godzinami, hero z trzema przyciskami, widżet opinii z Google, lista skupowanych aut, trzy kroki sprzedaży i mapa Google.',
  ],
  [
    'Blog',
    'Baza wiedzy o skupie aut: 12 artykułów z lat 2022 do 2026, jedna kategoria i 20 tagów.',
  ],
  [
    'Kontakt',
    'Telefon, e-mail i adres bez formularza. Firma pracuje najczęściej mobilnie, więc prosi o kontakt przed przyjazdem.',
  ],
  [
    'Google',
    'Dane firmy w formacie strukturalnym, mapa strony z wpisami i stronami oraz mapa Google.',
  ],
  ['Cookies', 'Baner zgody CookieYes z opcjami Dostosuj, Odrzuć wszystkie i Akceptuj wszystko.'],
];

const stack = [
  'WordPress',
  'Elementor Pro',
  'Rank Math',
  'CookieYes',
  'Trustindex',
  'Google Site Kit',
];

const arrow = (
  <svg viewBox="0 0 28 14" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
  </svg>
);

const icons = {
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="stroke"
        strokeWidth="1.8"
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
      />
    </svg>
  ),
  online: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="stroke" strokeWidth="1.8" d="M5 3h14v18H5zM9 8h6M9 12h6M9 16h3" />
    </svg>
  ),
  scrap: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="stroke"
        strokeWidth="1.8"
        d="M7 4l-3 5h5M17 20l3-5h-5M4 9l3.5 6M20 15l-3.5-6M12 3l3 3M12 21l-3-3"
      />
    </svg>
  ),
};

function FormAnatomy() {
  const [view, setView] = useState('all');
  const pick = id => setView(id);

  return (
    <div className="ea-form" data-view={view}>
      <div className="ea-form__side">
        <p className="ea-form__big" aria-live="polite">
          <b>{views.find(item => item.id === view).count}</b>
          <span>
            {view === 'all' && 'pól w formularzu wyceny'}
            {view === 'must' && 'pola obowiązkowe: telefon i e-mail'}
            {view === 'photos' && 'miejsc na zdjęcia w jednym polu'}
          </span>
        </p>
        <div className="ea-form__tabs" role="group" aria-label="Pokaż pola">
          {views.map(item => (
            <button
              key={item.id}
              type="button"
              className="ea-tab"
              aria-pressed={view === item.id}
              onClick={() => pick(item.id)}>
              {item.label}
              <span aria-hidden="true">{item.count}</span>
            </button>
          ))}
        </div>
        <div className="ea-short">
          <h3 className="ea-short__h">Krótszy formularz kasacji</h3>
          <ul className="ea-short__list">
            {short.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ea-sheet">
        <p className="ea-sheet__tab">Wycena online</p>
        {groups.map(group => (
          <section key={group.name} className="ea-grp" aria-label={group.name}>
            <h3 className="ea-grp__name">{group.name}</h3>
            <ul className="ea-grp__fields">
              {group.fields.map(field => (
                <li
                  key={field.name}
                  className="ea-fld"
                  style={{ '--span': field.span ?? 3 }}
                  data-must={field.must ? '' : undefined}
                  data-photos={field.photos ? '' : undefined}>
                  <p className="ea-fld__name">
                    {field.name}
                    {field.must && <b className="ea-fld__must">wymagane</b>}
                  </p>
                  {field.pills ? (
                    <ul className="ea-fld__pills">
                      {field.pills.map(pill => (
                        <li key={pill}>{pill}</li>
                      ))}
                    </ul>
                  ) : field.photos ? (
                    <ul className="ea-fld__slots" aria-label="Sześć pól na zdjęcia">
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <li key={n} aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path className="stroke" strokeWidth="1.6" d="M12 6v12M6 12h12" />
                          </svg>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ea-fld__box" aria-hidden="true" />
                  )}
                  {field.hint && <p className="ea-fld__hint">{field.hint}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function EnterAuto() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="ea-hero" aria-labelledby="ea-h">
        <Link className="proj__back ea-hero__back" to={routes.work.pl}>
          {arrow}
          <span>Wszystkie projekty</span>
        </Link>
        <h1 className="ea-hero__title" id="ea-h">
          <span className="ea-hero__name">
            <Split text="Enter Auto," />
          </span>
          <span className="ea-hero__sub">
            <Split text="strona skupu aut we Wrocławiu" />
          </span>
        </h1>
        <div className="ea-hero__text">
          <p className="proj__tag">Strona skupu aut z formularzem wyceny</p>
          <p className="proj__meta">
            {tie('Enter Auto, skup i złomowanie aut, Wrocław i Dolny Śląsk')}
          </p>
          <p className="lead ea-hero__lead">
            {tie(
              'Zbudowałem stronę firmy, która skupuje i kasuje samochody. Na pierwszym ekranie odwiedzający widzi przycisk z telefonem i dwa przyciski do wyceny, więc do kontaktu wystarcza jedno kliknięcie.',
            )}
          </p>
          <a className="link" href={live} target="_blank" rel="noopener noreferrer">
            enterauto.pl
          </a>
        </div>

        <figure className="ea-hero__desk">
          <p className="ea-hero__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>enterauto.pl</span>
          </p>
          <img
            src={media('strona.webp')}
            width="1200"
            height="595"
            decoding="async"
            fetchpriority="high"
            alt="Strona główna enterauto.pl: niebieski Fiat 500, nagłówek Zaoferowali zbyt mało i przyciski z telefonem oraz wyceną online"
          />
        </figure>

        <figure className="ea-hero__phone">
          <div className="cc-phone cc-phone--tilt">
            <img
              src={media('telefon.webp')}
              width="390"
              height="844"
              decoding="async"
              fetchpriority="high"
              alt="Strona enterauto.pl na telefonie: logo, niebieski Fiat 500, nagłówek, przycisk z numerem telefonu i przycisk Wycena online"
            />
          </div>
          <figcaption className="ea-hero__note" aria-hidden="true">
            390 px: telefon i wycena
          </figcaption>
        </figure>
      </section>

      <section className="paper ea-ways" aria-labelledby="ea-ways-h">
        <div className="sec-head">
          <h2 className="h2" id="ea-ways-h">
            <Split text="Trzy drogi do wyceny." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Sprzedający chce szybko poznać warunki. Hero ma trzy przyciski i każdy działa po jednym kliknięciu.',
            )}
          </p>
        </div>
        <ol className="ea-ways__list">
          {ways.map((way, i) => (
            <m.li
              key={way.id}
              className={`ea-way ea-way--${way.kind}`}
              initial={reduce ? false : { opacity: 0, y: 48, rotate: i === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -1 : i === 1 ? 1 : -0.6 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                reduce ? instant : { ...spring.toss, type: 'spring', delay: i * stagger.cards * 2 }
              }>
              <p className="ea-way__no" aria-hidden="true">
                {i + 1}
              </p>
              {way.kind === 'phone' && <span className="ea-way__ghost">{icons.phone}</span>}
              <p className={`ea-btn ea-btn--${way.kind}`}>
                {icons[way.kind]}
                <span>{way.label}</span>
              </p>
              <h3 className="ea-way__name">{way.name}</h3>
              <p className="ea-way__text">{tie(way.text)}</p>
              <a
                className="link ea-way__link"
                href={way.to}
                target="_blank"
                rel="noopener noreferrer">
                {way.link}
              </a>
            </m.li>
          ))}
        </ol>
        <div className="ea-terms">
          <h3 className="ea-terms__h">Warunki ze strony</h3>
          <ul className="ea-terms__list">
            {terms.map(term => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ea-anatomy" aria-labelledby="ea-form-h">
        <div className="sec-head">
          <h2 className="h2" id="ea-form-h">
            <Split text="Formularz od środka." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Marka z listy 67 pozycji, rok od 2026 do 1999, paliwo, skrzynia, przebieg i do sześciu pól na zdjęcia. Obowiązkowe są tylko telefon i e-mail.',
            )}
          </p>
        </div>
        <Reveal className="ea-anatomy__wrap">
          <FormAnatomy />
        </Reveal>
      </section>

      <section className="paper ea-area" aria-labelledby="ea-area-h">
        <div className="sec-head">
          <h2 className="h2" id="ea-area-h">
            <Split text="Dokąd jadą." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Firma pracuje najczęściej mobilnie, więc strona pokazuje obszar działania na mapie.',
            )}
          </p>
        </div>
        <div className="ea-area__row">
          <Reveal className="ea-area__map">
            <img
              src={media('mapa.webp')}
              width="370"
              height="345"
              loading="lazy"
              decoding="async"
              alt="Mapa Polski z zaznaczonymi województwami dolnośląskim i opolskim oraz miastami Wrocław i Opole"
            />
          </Reveal>
          <Reveal className="ea-area__text">
            <ul className="ea-area__chips" aria-label="Obszar działania">
              <li>Wrocław</li>
              <li>Dolny Śląsk</li>
              <li>Opole</li>
            </ul>
            <p>
              {tie(
                'Osobna podstrona Obsługiwany obszar pokazuje mapę Polski z zaznaczonymi województwami. Podstrona Kontakt zbiera telefon, e-mail i adres we Wrocławiu i prosi o kontakt przed przyjazdem.',
              )}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="ea-spec" aria-labelledby="ea-spec-h">
        <div className="sec-head">
          <h2 className="h2" id="ea-spec-h">
            <Split text="Co jest na stronie." onView />
          </h2>
          <p className="sec-head__side">
            {tie('Strona jest tylko po polsku, a menu ma sześć pozycji.')}
          </p>
        </div>
        <div className="ea-spec__row">
          <div className="ea-spec__main">
            <dl className="ea-spec__list">
              {spec.map(([term, text], i) => (
                <Reveal key={term} className="ea-spec__item" style={{ '--i': i }}>
                  <dt>{term}</dt>
                  <dd>{tie(text)}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal className="proj__stack ea-spec__stack">
              <p className="proj__label ea-spec__label" id="ea-tech-h">
                Na stronie działa
              </p>
              <ul className="proj__tech ea-spec__tech" aria-labelledby="ea-tech-h">
                {stack.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="ea-screen">
            <h3 className="ea-screen__h">Pierwszy ekran telefonu</h3>
            <div
              className="ea-screen__bar"
              role="img"
              aria-label="Pasma pierwszego ekranu telefonu o wysokości 844 px: nagłówek, auto, tytuł, przycisk z numerem i przycisk Wycena online">
              {bands.map(band => (
                <span
                  key={band.name ?? band.size}
                  className={`ea-screen__band${band.name ? '' : ' ea-screen__band--gap'}${band.below ? ' ea-screen__band--below' : ''}`}
                  style={{ flexGrow: band.size }}>
                  {band.name}
                </span>
              ))}
            </div>
            <p className="ea-screen__text">
              {tie(
                'Przy szerokości 390 px strona nie przewija się na boki, a na pierwszym ekranie o wysokości 844 px mieszczą się nagłówek, tytuł, przycisk z numerem i Wycena online. Menu otwiera się na pełny ekran i mieści sześć pozycji. Pola formularza mają 338 px szerokości.',
              )}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="ea-ask" aria-labelledby="ea-ask-h">
        <h2 className="ea-ask__h" id="ea-ask-h">
          Wyceń projekt
        </h2>
        <p className="ea-ask__text">
          {tie(
            'Sprzedajesz usługę lokalnie i chcesz, żeby klient dzwonił albo wysyłał zapytanie ze zdjęciami bez szukania drogi? Opiszę, jak to ułożyć na Twojej stronie, i podam wycenę.',
          )}
        </p>
        <Magnet className="btn" href="#wycena" data-cta="enterauto-quote">
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
