import React, { useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { duration, ease, instant, spring } from '../motion';

const media = name => withPrefix(`/media/ollabag/${name}`);

const live = 'https://www.ollabag.com/';

const path = [
  {
    name: 'Strona główna',
    text: 'Przycisk Shop Olla jest na pierwszym ekranie. Shop w menu też prowadzi prosto do karty produktu.',
    image: 'sciezka-1-home-m.webp',
    alt: 'Strona główna sklepu Olla Bag na telefonie: logo, tło ze zdjęciem otwartej torebki, hasło A handbag when you want it, a trolley when you need it i przycisk Shop Olla - £94.99',
  },
  {
    name: 'Karta produktu',
    text: 'Kolor wybiera się kółkiem: Black, Grey albo Brown. Niżej ilość, Buy with Shop Pay i Add to cart.',
    image: 'sciezka-2-produkt-m.webp',
    alt: 'Karta produktu Olla Bag na telefonie: kółka kolorów, pole ilości, przycisk Buy with Shop Pay, link More payment options, przycisk Add to cart i etykieta In stock, ready to ship',
  },
  {
    name: 'Koszyk',
    text: 'Po Add to cart wysuwa się panel z pozycją, kolorem, ilością i sumą, a na dole View cart oraz Check out.',
    image: 'sciezka-3-koszyk-m.webp',
    alt: 'Panel koszyka Olla Bag na telefonie: jedna sztuka Olla Bag, Color: Black, £94.99, Estimate total £94.99 GBP i przyciski View cart oraz Check out',
  },
  {
    name: 'Kasa',
    text: 'Check out prowadzi do kasy Shopify. Na górze Express checkout z przyciskami Shop, PayPal i Google Pay, niżej kontakt i dostawa.',
    image: 'sciezka-4-kasa-m.webp',
    alt: 'Kasa Shopify na telefonie: nagłówek Olla Bag, Order summary £94.99, Express checkout z przyciskami Shop, PayPal i Google Pay oraz pola Contact i Delivery',
  },
];

const mapWidth = 1440;
const mapHeight = 1610;

const map = [
  {
    name: 'Galeria',
    text: 'Duże zdjęcie i pasek miniatur. W galerii jest 16 zdjęć.',
    box: [105, 168, 601, 897],
  },
  {
    name: 'Cena',
    text: 'Cena promocyjna obok przekreślonej, niżej Tax included.',
    box: [750, 330, 190, 56],
  },
  {
    name: 'Opis',
    text: 'Cztery bloki tekstu: Do More, Carry Less., Handbag to trolley in seconds, Style that does the heavy lifting i lista Key features.',
    box: [750, 395, 475, 578],
  },
  {
    name: 'Kolor',
    text: 'Black, Grey i Brown. Wybór zmienia zdjęcie, adres strony i kolor w koszyku.',
    box: [750, 1015, 100, 66],
  },
  {
    name: 'Zakup',
    text: 'Ilość, Add to cart i Buy with Shop Pay, pod spodem More payment options.',
    box: [750, 1100, 590, 166],
  },
  {
    name: 'Dostępność',
    text: 'Zielona etykieta In stock, ready to ship.',
    box: [750, 1288, 244, 52],
  },
  {
    name: 'Szczegóły',
    text: 'Trzy rozwijane bloki: Materials, Shipping & returns i Care guide.',
    box: [750, 1358, 590, 228],
  },
];

const colours = [
  {
    id: 'black',
    name: 'Black',
    hex: '#000000',
    image: 'kolor-black.webp',
    href: 'https://www.ollabag.com/products/bag',
    alt: 'Czarna torebka Olla Bag trzymana za pasek, ze złotym logo na wieku',
  },
  {
    id: 'grey',
    name: 'Grey',
    hex: '#808080',
    image: 'kolor-grey.webp',
    href: 'https://www.ollabag.com/products/bag?variant=51012097048842',
    alt: 'Szara torebka Olla Bag trzymana za pasek, ze złotym logo na wieku',
  },
  {
    id: 'brown',
    name: 'Brown',
    hex: '#9a5630',
    image: 'kolor-brown.webp',
    href: 'https://www.ollabag.com/products/bag?variant=51012735500554',
    alt: 'Brązowa torebka Olla Bag trzymana za pasek, ze złotym logo na wieku',
  },
];

const blocks = [
  [
    'Pasek i menu',
    'Nad menu pasek Free UK & Europe delivery. W menu Home, Shop, How it works, Our story, FAQ i Contact.',
  ],
  [
    'Wideo na starcie',
    'Wideo bez dźwięku z hasłem A handbag when you want it, a trolley when you need it i przyciskiem Shop Olla.',
  ],
  [
    'Trzy tryby',
    "Nagłówek o torebce zamieniającej się w wózek i trzy karty: Carry it as a handbag, Open it up for space, Roll it when it's full.",
  ],
  ['Olla Bag in Real Life', 'Poziomy pas pionowych kadrów ze strzałkami.'],
  [
    'Three colours. One bag',
    'Sekcja ze zdjęciem trzech kolorów i kartą produktu: kółka koloru, cena i Add to cart.',
  ],
  [
    'Patent-pending',
    'Trzy cechy z ikonami (skóra i pasek, tkanina Cordura, podstawa EVA i 15 kg) oraz dwa zdjęcia z przyciskiem Shop all.',
  ],
  ['Details that hold up to real use', 'Trzy karty: skóra, kieszeń wewnętrzna, tkanina Cordura.'],
  ['One bag, three moods', 'Zdjęcie trzech trybów torebki i przycisk How to use it.'],
  ['Real dimensions', 'Trzy rysunki z wymiarami: Handbag mode, Expanded mode, Trolley mode.'],
  ['FAQ', 'Sześć pytań w rozwijanych blokach.'],
  [
    'Zamknięcie',
    "Zdanie Olla carries up to 15 kilograms so your shoulders don't have to, pod nim Do more, carry less. i przycisk Shop Olla.",
  ],
];

const pages = [
  [
    'How it works',
    'Wideo i rysunkowa instrukcja: pięć kroków rozkładania (Expanding) i dwa składania (Contracting). Na końcu przycisk Shop Olla.',
  ],
  ['Our story', 'Historia powstania torebki, od ręcznych szkiców z 2017 roku.'],
  [
    'FAQ',
    'Sześć pytań w rozwijanych blokach, pod nimi blok o zwrotach w 14 dni i przycisk Contact us.',
  ],
  [
    'Contact',
    'Formularz z polami First Name, Last Name, Email, Inquiry i Message oraz przyciskiem Send.',
  ],
  [
    'Stopka',
    'Linki Delivery & returns, Privacy policy, Contact information i Terms of service, dane firmy, pole zapisu na e-mail i ikony płatności.',
  ],
];

const facts = [
  ['Język', 'Sklep jest po angielsku i nie ma przełącznika języka.'],
  ['Waluta', 'Ceny są w funtach (GBP).'],
  [
    'Płatności',
    'W stopce ikony: American Express, Apple Pay, Google Pay, Klarna, Mastercard, PayPal, Shop Pay i Visa.',
  ],
  ['Dostawa', 'Pasek nad menu: Free UK & Europe delivery.'],
  ['Sprzedawca', 'Olla Bag Ltd, Wielka Brytania.'],
];

const stack = ['Shopify', 'Liquid'];

const percent = ([x, y, w, h]) => ({
  left: `${(x / mapWidth) * 100}%`,
  top: `${(y / mapHeight) * 100}%`,
  width: `${(w / mapWidth) * 100}%`,
  height: `${(h / mapHeight) * 100}%`,
});

const thread = 'M20 30C230 30 200 120 380 120S560 210 700 210S830 290 980 290';

function Shot({ image, width, height, alt, caption, priority, className }) {
  return (
    <figure className={`olla-shot${className ? ` ${className}` : ''}`}>
      <img
        src={media(image)}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? undefined : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
      />
      {caption && <figcaption>{tie(caption)}</figcaption>}
    </figure>
  );
}

function Spec({ rows, className = '' }) {
  return (
    <dl className={`olla-spec ${className}`}>
      {rows.map(([term, text]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{tie(text)}</dd>
        </div>
      ))}
    </dl>
  );
}

function Strip() {
  const reduce = useReducedMotion();
  return (
    <div className="olla-strip">
      <svg
        className="olla-strip__thread"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        aria-hidden="true">
        <m.path
          d={thread}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduce ? instant : { duration: duration.thread, ease: ease.draw }}
        />
      </svg>
      <ol className="olla-strip__steps">
        {path.map((step, i) => (
          <Reveal as="li" key={step.name} className="olla-step" style={{ '--i': i }}>
            <span className="olla-step__no" aria-hidden="true">
              {i + 1}
            </span>
            <Shot image={step.image} width="780" height="1688" alt={step.alt} />
            <h3 className="olla-step__name">{tie(step.name)}</h3>
            <p className="olla-step__text">{tie(step.text)}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function ProductMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(3);
  const item = map[active];
  return (
    <div className="olla-split">
      <div className="olla-map">
        <div className="olla-map__frame">
          <img
            src={media('karta-d.webp')}
            width={mapWidth}
            height={mapHeight}
            loading="lazy"
            decoding="async"
            alt="Karta produktu Olla Bag na komputerze: galeria ze zdjęciem czarnej torebki i miniaturami, nazwa, cena £94.99, opis, kółka koloru, przyciski zakupu, etykieta In stock i trzy rozwijane bloki"
          />
          <m.span
            className="pat-chalk"
            aria-hidden="true"
            initial={false}
            animate={percent(item.box)}
            transition={reduce ? instant : { ...spring.pin, type: 'spring' }}
          />
        </div>
        <p className="olla-map__cap">
          {tie('Karta produktu na komputerze, 1440 px, 10 listopada 2026.')}
        </p>
      </div>
      <div className="olla-split__list">
        <ol className="olla-order olla-order--pick">
          {map.map((entry, i) => (
            <li key={entry.name}>
              <button
                type="button"
                className="olla-order__btn"
                aria-pressed={i === active}
                onClick={() => setActive(i)}>
                <span className="olla-order__no" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <strong>{entry.name}</strong>
                  <span className="olla-order__text">{tie(entry.text)}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Picker() {
  const [pick, setPick] = useState(0);
  const colour = colours[pick];
  return (
    <div className="olla-picker">
      <div className="olla-picker__photo">
        {colours.map((item, i) => (
          <img
            key={item.id}
            src={media(item.image)}
            width="601"
            height="752"
            loading="lazy"
            decoding="async"
            alt={item.alt}
            data-on={i === pick || undefined}
          />
        ))}
      </div>
      <div className="olla-picker__card">
        <p className="olla-picker__brand">OLLA</p>
        <p className="olla-picker__name">Olla Bag</p>
        <fieldset className="olla-picker__set">
          <legend>COLOR</legend>
          <div className="olla-picker__dots">
            {colours.map((item, i) => (
              <label key={item.id} className="olla-dot" style={{ '--dot': item.hex }}>
                <input
                  type="radio"
                  name="olla-colour"
                  value={item.id}
                  checked={i === pick}
                  onChange={() => setPick(i)}
                />
                <span className="olla-dot__disc" />
                <span className="olla-dot__name">{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="olla-picker__now" aria-live="polite">
          Color: <strong>{colour.name}</strong>
        </p>
        <a className="btn btn--wool" href={colour.href} target="_blank" rel="noopener noreferrer">
          {tie('Ten kolor w sklepie')}
        </a>
      </div>
    </div>
  );
}

export default function Olla() {
  return (
    <>
      <section className="olla-hero" aria-labelledby="olla-h">
        <div className="olla-hero__top">
          <Link className="proj__back" to={routes.work.pl}>
            <svg viewBox="0 0 28 14" aria-hidden="true">
              <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
            </svg>
            <span>Wszystkie projekty</span>
          </Link>
          <h1 className="title title--case olla-hero__title" id="olla-h">
            <Split text="Olla Bag." />
          </h1>
        </div>
        <div className="olla-hero__text">
          <p className="proj__tag">Prawdziwe wdrożenie, sklep na Shopify</p>
          <p className="proj__meta">{tie('Olla Bag Ltd, Wielka Brytania')}</p>
          <p className="lead olla-hero__lead">
            {tie(
              'Cały sklep zbudowałem sam na Shopify, od A do Z. Sprzedaje jedną skórzaną torebkę, która zamienia się w wózek na kółkach.',
            )}
          </p>
          <a className="link" href={live} target="_blank" rel="noopener noreferrer">
            ollabag.com
          </a>
        </div>
        <div className="olla-stage">
          <div className="olla-stage__desk">
            <Shot
              image="home-d.webp"
              width="1440"
              height="900"
              priority
              alt="Strona główna ollabag.com na komputerze: pasek Free UK & Europe delivery, menu, logo Olla, zdjęcie kobiety z otwartą torebką, hasło A handbag when you want it, a trolley when you need it i przycisk Shop Olla - £94.99"
            />
          </div>
          <div className="olla-stage__phone">
            <Shot
              image="produkt-m.webp"
              width="780"
              height="1688"
              priority
              alt="Karta produktu ollabag.com na telefonie: zdjęcie czarnej torebki i miniatury pod nim"
            />
          </div>
          <p className="olla-stage__cap">
            {tie(
              'Strona główna na komputerze i karta produktu na telefonie, stan z 10 listopada 2026.',
            )}
          </p>
        </div>
      </section>

      <section className="olla-sec" aria-labelledby="olla-path-h">
        <div className="sec-head">
          <h2 className="h2" id="olla-path-h">
            <Split text="Ścieżka zakupu." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Cztery ekrany na telefonie 390 px, od strony głównej do kasy. Zrzuty z 10 listopada 2026, bez wpisywania danych.',
            )}
          </p>
        </div>
        <Strip />
      </section>

      <section className="paper olla-product" aria-labelledby="olla-product-h">
        <div className="sec-head">
          <h2 className="h2" id="olla-product-h">
            <Split text="Karta produktu." onView />
          </h2>
          <p className="sec-head__side">
            {tie('Sklep ma jeden produkt. Wybierz element z listy, a ramka pokaże go na zrzucie.')}
          </p>
        </div>
        <ProductMap />
        <h3 className="olla-sub">{tie('Kolor wybiera się kółkiem.')}</h3>
        <p className="olla-sub__text">
          {tie(
            'Odtworzone z karty produktu: te same zdjęcia, ceny i adresy wariantów. Zmiana koloru w sklepie zmienia zdjęcie, adres strony i kolor w koszyku.',
          )}
        </p>
        <Picker />
      </section>

      <section className="olla-sec" aria-labelledby="olla-home-h">
        <div className="sec-head">
          <h2 className="h2" id="olla-home-h">
            <Split text="Strona główna." onView />
          </h2>
          <p className="sec-head__side">
            {tie('Bloki od góry do dołu. Teksty zostają po angielsku, tak jak w sklepie.')}
          </p>
        </div>
        <div className="olla-split olla-split--flip">
          <Reveal className="olla-split__list">
            <ol className="olla-order">
              {blocks.map(([name, text]) => (
                <li key={name}>
                  <span>
                    <strong>{name}</strong>
                    {tie(text)}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <div className="olla-split__shots olla-overlap">
            <Reveal className="olla-overlap__a">
              <Shot
                image="kolory-d.webp"
                width="1440"
                height="900"
                alt="Sekcja Three colours. One bag na stronie głównej: trzy kobiety z torebkami w trzech kolorach i karta produktu z kółkami koloru, ceną £94.99 i przyciskiem Add to cart"
              />
            </Reveal>
            <Reveal className="olla-overlap__b">
              <Shot
                image="wymiary-d.webp"
                width="1440"
                height="900"
                alt="Sekcja Real dimensions, every configuration: trzy rysunki torebki z wymiarami w trybach Handbag, Expanded i Trolley"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="paper olla-pages" aria-labelledby="olla-pages-h">
        <div className="sec-head">
          <h2 className="h2" id="olla-pages-h">
            <Split text="Pozostałe strony." onView />
          </h2>
          <p className="sec-head__side">
            {tie('Menu ma cztery podstrony poza sklepem. Dwie z nich na zrzutach.')}
          </p>
        </div>
        <Reveal className="olla-pages__list">
          <Spec rows={pages} />
        </Reveal>
        <div className="olla-pair">
          <Reveal>
            <Shot
              image="jak-d.webp"
              width="1440"
              height="900"
              alt="Strona How it works: nagłówek Expanding i rysunkowe karty kroków od 01 Lift the lid do 05 Adjust the strap"
              caption="How it works."
            />
          </Reveal>
          <Reveal>
            <Shot
              image="faq-d.webp"
              width="1440"
              height="900"
              alt="Strona FAQ: sześć pytań w rozwijanych blokach, pod nimi blok Returns made simple"
              caption="FAQ."
            />
          </Reveal>
        </div>
      </section>

      <section className="paper olla-team" aria-labelledby="olla-team-h">
        <div className="sec-head">
          <h2 className="h2" id="olla-team-h">
            <Split text="Kto to szył." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Cały sklep zbudowałem sam, od A do Z. Klient zgodził się na nazwę i zrzuty ekranu.',
            )}
          </p>
        </div>
        <Reveal>
          <Spec rows={facts} />
        </Reveal>
        <Reveal className="proj__stack">
          <p className="proj__label" id="olla-tech-h">
            Narzędzia
          </p>
          <ul className="proj__tech" aria-labelledby="olla-tech-h">
            {stack.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
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
