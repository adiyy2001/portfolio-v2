import React, { useRef, useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { duration, ease, instant, spring } from '../motion';

const media = name => withPrefix(`/media/psipawer/${name}`);

const live = 'https://psipawer.wixsite.com/psi-pawer';

const rows = [
  {
    name: 'Blokowanie strony (TBT)',
    before: 1380,
    after: 170,
    shown: ['1380 ms', '170 ms'],
    verdict: 'zwężone o 88%',
    kind: 'seam',
  },
  {
    name: 'Waga strony głównej',
    before: 3.34,
    after: 2.14,
    shown: ['3,34 MB', '2,14 MB'],
    verdict: 'lżej o 36%',
    kind: 'seam',
  },
  {
    name: 'Wynik PageSpeed Insights',
    before: 79,
    after: 83,
    shown: ['62 do 79', '83'],
    verdict: 'wyżej',
    kind: 'seam',
    note: 'PSI z serwerów Google, trzy wywołania na adres',
  },
  {
    name: 'Największy element (LCP)',
    before: 2.48,
    after: 5.63,
    shown: ['2,48 s', '5,63 s'],
    verdict: 'gorzej, przyczyny jeszcze nie znam',
    kind: 'baste',
    note: 'To zdjęcie w nagłówku, 24 KB, więc nie waga obrazu. Zmierzę jeszcze raz na domenie',
  },
  {
    name: 'Liczba żądań',
    before: 270,
    after: 282,
    shown: ['270', '282'],
    verdict: 'prawie bez zmian',
    kind: 'baste',
  },
];

const labels = [
  {
    side: 'Stara metka',
    title: 'Psi Pawer | szkolenie psów | konsultacje behawioralne | Wrocław, Poland',
    desc: 'Psi Pawer - Twoja droga do zrozumienia i wsparcia Twojego psa (szkolenie psów, psie przedszkole, treningi indywidualne i grupowe). Certyfikowana trenerka i behawiorystka…',
    count: '71 znaków tytułu, 375 znaków opisu',
    data: 'Dane strukturalne: LocalBusiness tylko na stronie głównej',
  },
  {
    side: 'Nowa metka',
    title: 'Szkolenie psów i behawiorystka, Wrocław | Psi Pawer',
    desc: 'Joanna Kostrzanowska, behawiorystka psów. Pracuję we Wrocławiu i okolicach z psami agresywnymi, lękliwymi i nadmiernie pobudliwymi oraz prowadzę zajęcia.',
    count: '51 znaków tytułu, 153 znaki opisu',
    data: 'Dane strukturalne: osoba i 12 usług z cenami',
  },
];

const pairs = [
  {
    name: 'Strona główna, telefon',
    before: 'tel-home-przed.webp',
    after: 'tel-home-po.webp',
    altBefore:
      'Stara strona główna na telefonie: logo, ikony mediów, hasło Psi Pawer zamieniam problemy w wyzwania i przycisk Zadzwoń',
    altAfter:
      'Nowa strona główna na telefonie: nagłówek Pracuję z wariatami, dla których często jestem ostatnią szansą, przycisk Umów konsultację i numer telefonu',
  },
  {
    name: 'Konsultacja, telefon',
    before: 'tel-konsultacja-przed.webp',
    after: 'tel-konsultacja-po.webp',
    altBefore: 'Stara strona konsultacji na telefonie: długi wyjustowany tekst, ceny na samym dole',
    altAfter:
      'Nowa strona konsultacji na telefonie: dwie ramki z cenami 280 zł i 230 zł, przycisk Zapisz się i numer telefonu',
  },
];

const stack = ['Wix Harmony', 'Lighthouse', 'PageSpeed Insights', 'schema.org'];

const teeth = 18;

const cut = x => {
  const points = ['0% 0%', `${x}% 0%`];
  for (let i = 0; i <= teeth; i++) {
    const y = (i / teeth) * 100;
    points.push(`calc(${x}% ${i % 2 ? '+' : '-'} 10px) ${y}%`);
  }
  points.push(`${x}% 100%`, '0% 100%');
  return `polygon(${points.join(', ')})`;
};

function Seam() {
  const reduce = useReducedMotion();
  const box = useRef(null);
  const [value, setValue] = useState(50);
  const [held, setHeld] = useState(false);
  const [moved, setMoved] = useState(false);
  const x = useSpring(50, reduce ? { stiffness: 1000, damping: 100 } : spring.pin);
  const clip = useTransform(x, cut);
  const left = useTransform(x, v => `${v}%`);

  const place = next => {
    const v = Math.min(96, Math.max(4, next));
    setValue(Math.round(v));
    setMoved(true);
    x.set(v);
  };

  const fromPointer = event => {
    const rect = box.current.getBoundingClientRect();
    place(((event.clientX - rect.left) / rect.width) * 100);
  };

  const down = event => {
    if (event.button !== undefined && event.button !== 0) return;
    setHeld(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    fromPointer(event);
  };

  const move = event => {
    if (held) fromPointer(event);
  };

  const up = () => setHeld(false);

  const key = event => {
    const step = event.shiftKey ? 20 : 5;
    const map = {
      ArrowLeft: value - step,
      ArrowDown: value - step,
      ArrowRight: value + step,
      ArrowUp: value + step,
      Home: 4,
      End: 96,
    };
    if (event.key in map) {
      event.preventDefault();
      place(map[event.key]);
    }
  };

  return (
    <figure className="alt-seam" data-held={held || undefined} data-moved={moved || undefined}>
      <div className="alt-seam__glow" aria-hidden="true" />
      <div
        className="alt-seam__cloth"
        ref={box}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}>
        <img
          className="alt-seam__img"
          src={media('home-po.webp')}
          width="1200"
          height="1250"
          alt="Nowa strona główna Psi Pawer na komputerze: czarne kontury, różowe wstawki i nagłówek Pracuję z wariatami, dla których często jestem ostatnią szansą"
          fetchpriority="high"
          decoding="async"
        />
        <m.img
          className="alt-seam__img alt-seam__img--old"
          src={media('home-przed.webp')}
          width="1200"
          height="1250"
          alt="Stara strona główna Psi Pawer na komputerze: różowy pas z hasłem zamieniam problemy w wyzwania, trzy białe karty i drobny tekst"
          decoding="async"
          style={{ clipPath: clip }}
        />
        <m.div className="alt-seam__line" style={{ left }} aria-hidden="true">
          <svg className="alt-seam__thread" viewBox="0 0 12 400" preserveAspectRatio="none">
            <m.path
              d="M6 0V400"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduce ? instant : { duration: duration.thread, ease: ease.draw, delay: 0.5 }
              }
            />
          </svg>
        </m.div>
        <m.div
          className="alt-seam__needle"
          style={{ left }}
          role="slider"
          tabIndex={0}
          aria-label="Szew między starą a nową stroną"
          aria-valuemin={4}
          aria-valuemax={96}
          aria-valuenow={value}
          aria-valuetext={`Stara strona zajmuje ${value}% kadru`}
          onKeyDown={key}>
          <svg viewBox="0 0 40 150" aria-hidden="true">
            <path className="alt-seam__tail" d="M20 14c14 10 16 30 4 44s-18 40-2 60 12 26 4 30" />
            <path
              className="alt-seam__steel"
              d="M20 2c3.2 0 4.6 3 4.6 7.2v13L21 146h-2l-3.6-123.8v-13C15.4 5 16.8 2 20 2z"
            />
            <ellipse className="alt-seam__eye" cx="20" cy="12" rx="1.6" ry="6" />
          </svg>
        </m.div>
        <span className="alt-seam__tag alt-seam__tag--old" aria-hidden="true">
          przed
        </span>
        <span className="alt-seam__tag alt-seam__tag--new" aria-hidden="true">
          po
        </span>
        <span className="alt-seam__hint" aria-hidden="true">
          przesuń igłę
        </span>
      </div>
      <figcaption>
        {tie(
          'Strona główna na komputerze. Z lewej stara wersja z 2 listopada 2026, z prawej nowa z 9 listopada.',
        )}
      </figcaption>
    </figure>
  );
}

function Tape({ row, top }) {
  const reduce = useReducedMotion();
  const was = row.before / top;
  const is = row.after / top;
  return (
    <div className={`alt-row alt-row--${row.kind}`}>
      <h3 className="alt-row__name">{tie(row.name)}</h3>
      <div className="alt-row__was">
        <span className="alt-row__value">{row.shown[0]}</span>
        <span className="alt-tape alt-tape--was" style={{ '--w': was }} aria-hidden="true" />
      </div>
      <div className="alt-row__is">
        <span className="alt-row__value">{row.shown[1]}</span>
        <m.span
          className="alt-tape alt-tape--is"
          aria-hidden="true"
          initial={reduce ? false : { scaleX: was }}
          whileInView={{ scaleX: is }}
          viewport={{ once: true, amount: 0.9 }}
          transition={reduce ? instant : { ...spring.stage, type: 'spring', delay: 0.15 }}
        />
        <span className="alt-row__verdict">{tie(row.verdict)}</span>
      </div>
      {row.note && <p className="alt-row__note">{tie(row.note)}</p>}
    </div>
  );
}

export default function Alteration() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="alt-hero" aria-labelledby="alt-h">
        <div className="alt-hero__top">
          <Link className="proj__back" to={routes.work.pl}>
            <svg viewBox="0 0 28 14" aria-hidden="true">
              <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
            </svg>
            <span>Wszystkie projekty</span>
          </Link>
          <h1 className="title title--case alt-hero__title" id="alt-h">
            <Split text="Psi Pawer." />
          </h1>
        </div>
        <div className="alt-hero__text">
          <p className="proj__tag">Przeróbka strony</p>
          <p className="proj__meta">{tie('Behawiorystka psów z Wrocławia')}</p>
          <p className="lead alt-hero__lead">
            {tie(
              'Starej strony nie wyrzuciłem. Wziąłem ją do przeróbki: nowy krój, czytelna oferta i lżejszy kod, dalej na Wixie.',
            )}
          </p>
          <a className="link" href={live} target="_blank" rel="noopener noreferrer">
            {tie('Nowa strona, adres roboczy')}
          </a>
        </div>
        <Seam />
      </section>

      <section className="paper alt-ticket" aria-labelledby="alt-ticket-h">
        <div className="sec-head">
          <h2 className="h2" id="alt-ticket-h">
            <Split text="Kwit przeróbki." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Strona główna, telefon. Lighthouse 13.6, mediana z trzech przebiegów, ten sam dzień i ta sama metoda przed i po: 4 listopada 2026.',
            )}
          </p>
        </div>
        <Reveal className="alt-ticket__body">
          <div className="alt-ticket__head" aria-hidden="true">
            <span />
            <span>Było</span>
            <span>Jest</span>
          </div>
          {rows.map(row => (
            <Tape key={row.name} row={row} top={Math.max(row.before, row.after)} />
          ))}
          <p className="alt-ticket__legend">
            <span className="alt-key alt-key--seam" aria-hidden="true" />
            {tie('Szew ciągły: zmierzone i lepiej.')}
            <span className="alt-key alt-key--baste" aria-hidden="true" />
            {tie('Fastryga: gorzej albo jeszcze do zmierzenia.')}
          </p>
          <p className="alt-ticket__pin">
            {tie(
              'Domena psipawer.pl wciąż pokazuje starą stronę. Wyniki po przepięciu domeny dopiszę tutaj, także te gorsze.',
            )}
          </p>
        </Reveal>
      </section>

      <section className="alt-labels" aria-labelledby="alt-labels-h">
        <div className="sec-head">
          <h2 className="h2" id="alt-labels-h">
            <Split text="Metki." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Tytuł i opis, które widać w Google. Stara metka mówiła wszystko naraz, nowa mówi kto, co i gdzie. Lighthouse SEO: 100 przed i 100 po.',
            )}
          </p>
        </div>
        <ol className="alt-labels__pair">
          {labels.map((label, i) => (
            <m.li
              key={label.side}
              className={`alt-label alt-label--${i ? 'new' : 'old'}`}
              initial={reduce ? false : { opacity: 0, rotate: i ? 0 : -9, y: 30 }}
              whileInView={{ opacity: 1, rotate: i ? 0 : -3, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={reduce ? instant : { ...spring.toss, type: 'spring', delay: i * 0.18 }}>
              <p className="alt-label__side">{label.side}</p>
              <p className="alt-label__title">{label.title}</p>
              <p className="alt-label__desc">{label.desc}</p>
              <p className="alt-label__count">{tie(label.count)}</p>
              <p className="alt-label__data">{tie(label.data)}</p>
            </m.li>
          ))}
        </ol>
      </section>

      <section className="alt-rail" aria-labelledby="alt-rail-h">
        <div className="sec-head">
          <h2 className="h2" id="alt-rail-h">
            <Split text="Nowy krój." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Ten sam znak i ten sam róż. Nowe są czarne kontury, oferta na górze i przycisk przy każdej usłudze.',
            )}
          </p>
        </div>
        <ul className="alt-rail__bar" aria-label="Strony przed i po na telefonie">
          {pairs.map((pair, i) => (
            <Reveal as="li" key={pair.name} className="alt-hanger" style={{ '--i': i }}>
              <svg className="alt-hanger__hook" viewBox="0 0 200 60" aria-hidden="true">
                <path
                  className="stroke"
                  strokeWidth="2"
                  d="M100 4c8 0 12 6 12 11s-5 9-12 9v6L8 58h184L100 30"
                />
              </svg>
              <h3 className="alt-hanger__name">{pair.name}</h3>
              <div className="alt-hanger__pair">
                <figure className="alt-hanger__shot alt-hanger__shot--old">
                  <img
                    src={media(pair.before)}
                    width="390"
                    height="1500"
                    loading="lazy"
                    decoding="async"
                    alt={pair.altBefore}
                  />
                  <figcaption>przed</figcaption>
                </figure>
                <figure className="alt-hanger__shot alt-hanger__shot--new">
                  <img
                    src={media(pair.after)}
                    width="390"
                    height="1500"
                    loading="lazy"
                    decoding="async"
                    alt={pair.altAfter}
                  />
                  <figcaption>po</figcaption>
                </figure>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="paper alt-team" aria-labelledby="alt-team-h">
        <div className="sec-head">
          <h2 className="h2" id="alt-team-h">
            <Split text="Kto to szył." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Projekt, teksty i wdrożenie w edytorze Wix Harmony. Logo i kolory marki zostały bez zmian, na prośbę klientki.',
            )}
          </p>
        </div>
        <Reveal className="proj__stack">
          <p className="proj__label" id="alt-tech-h">
            Narzędzia
          </p>
          <ul className="proj__tech" aria-labelledby="alt-tech-h">
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
