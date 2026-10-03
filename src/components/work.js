import React, { useRef } from 'react';
import { Link } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import Shot from './shot';
import Split from './split';
import useFaces from './wzornik/fonts';
import { routes, tie } from '../i18n';
import { instant } from '../motion';

const copy = {
  name: 'TailorCloth',
  tech: 'Odoo, Python, JavaScript, PostgreSQL',
  sizes: '(min-width: 900px) 46vw, 92vw',
  swatches: [
    {
      id: 'law',
      name: 'Rozwaga',
      bg: '#121212',
      fg: '#ffffff',
      chips: ['#121212', '#ffffff', '#b3122a'],
    },
    {
      id: 'acc',
      name: 'Rubryka',
      bg: '#f3f6fb',
      fg: '#0f1f3d',
      chips: ['#0f1f3d', '#f3f6fb', '#ff5b24'],
    },
    {
      id: 'den',
      name: 'Szkliwo',
      bg: '#ff6f5b',
      fg: '#1b1f2a',
      chips: ['#1b1f2a', '#ffffff', '#ff6f5b'],
    },
    {
      id: 'psy',
      name: 'Tafla',
      bg: '#dfe8e1',
      fg: '#1f2d26',
      chips: ['#1f2d26', '#dfe8e1', '#2f5d50'],
    },
    {
      id: 'est',
      name: 'Przędza',
      bg: '#b4462e',
      fg: '#ffffff',
      chips: ['#161616', '#d7d8d3', '#b4462e'],
    },
    {
      id: 'bis',
      name: 'Kminek',
      bg: '#ffcf3a',
      fg: '#2b1408',
      chips: ['#2b1408', '#ffcf3a', '#d93a1f'],
    },
  ],
  pl: {
    anchor: 'wzornik',
    tag: 'Prawdziwe wdrożenie',
    meta: 'Firma krawiecka z Krakowa',
    desc: 'Strona na Odoo i własne moduły do zarządzania produktami. Do tego zamawianie bez cen, pod indywidualne oferty.',
    go: 'Zobacz projekt',
    swTitle: 'Wzornik.',
    swLead:
      'Sześć przykładowych stron dla branż, które najczęściej szukają strony. Każda skrojona inaczej.',
    swNote: 'firmy zmyślone, projekty moje',
    concept: 'Projekt koncepcyjny',
    status: 'Projekt koncepcyjny. Wersja na żywo w przygotowaniu.',
    more: 'Otwórz wzornik w wersji dla klienta',
    trades: [
      'kancelaria prawna',
      'biuro rachunkowe',
      'klinika stomatologiczna',
      'gabinet psychoterapii',
      'inwestycja mieszkaniowa',
      'bistro',
    ],
    kinds: [
      'strona firmowa',
      'strona usługowa z cennikiem',
      'strona z cennikiem i zapisami',
      'wizytówka',
      'strona sprzedażowa',
      'strona z kartą, PL i EN',
    ],
  },
  en: {
    anchor: 'swatch-book',
    tag: 'A real project',
    meta: 'A tailoring company from Kraków',
    desc: 'A website on Odoo with custom product management modules. Plus ordering without prices, for individual offers.',
    go: 'See the project',
    swTitle: 'Swatch book.',
    swLead:
      'Six sample websites for the trades that most often need one. Each one cut differently.',
    swNote: 'made-up firms, my designs',
    concept: 'Concept design',
    status: 'Concept design. Live version in progress.',
    more: 'Open the swatch book in the client edition',
    trades: [
      'law firm',
      'accounting office',
      'dental clinic',
      'psychotherapy practice',
      'residential development',
      'bistro',
    ],
    kinds: [
      'company website',
      'service website with pricing',
      'website with prices and booking',
      'one-page business card',
      'sales website',
      'website with a menu, PL and EN',
    ],
  },
};

const arrow = (
  <svg viewBox="0 0 40 18" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
  </svg>
);

export default function Work({ lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const list = useRef(null);
  const wzornik = `${routes.cli[lang]}#${t.anchor}`;
  useFaces(list);

  return (
    <>
      <section className="work__pick" aria-labelledby="work-pick-h">
        <div className="work__row">
          <Shot lang={lang} sizes={copy.sizes} />
          <Reveal className="work__text">
            <p className="work__tag">{tie(t.tag)}</p>
            <h2 className="work__name" id="work-pick-h">
              <Link className="work__link" to={routes.case[lang]}>
                {copy.name}
              </Link>
            </h2>
            <p className="work__meta">{tie(t.meta)}</p>
            <p className="work__desc">{tie(t.desc)}</p>
            <p className="work__tech">{copy.tech}</p>
            <p className="work__go" aria-hidden="true">
              <span>{t.go}</span>
              {arrow}
            </p>
          </Reveal>
          <Link className="work__cover" to={routes.case[lang]} aria-hidden="true" tabIndex={-1} />
        </div>
      </section>
      <section className="paper work__swatches" aria-labelledby="work-sw-h">
        <div className="sec-head">
          <h2 className="h2" id="work-sw-h">
            <Split text={t.swTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.swLead)}</p>
        </div>
        <m.p
          className="hand-note work__note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={reduce ? instant : { duration: 0.7, delay: 0.3 }}>
          {tie(t.swNote)}
        </m.p>
        <ul className="work__list" ref={list}>
          {copy.swatches.map((swatch, i) => (
            <Reveal as="li" key={swatch.name} className="work__item" style={{ '--i': i }}>
              <Link
                className={`ws ws--${swatch.id}`}
                to={wzornik}
                style={{
                  '--sb': swatch.bg,
                  '--sf': swatch.fg,
                  '--rot': '-0.25deg',
                }}>
                <span className="ws__name">{swatch.name}</span>
                <span className="ws__what">
                  <span className="ws__trade">{t.trades[i]}</span>
                  <span className="sr">, </span>
                  <span className="ws__kind">{t.kinds[i]}</span>
                </span>
                <span className="ws__side">
                  <span className="ws__chips" aria-hidden="true">
                    {swatch.chips.map(chip => (
                      <i key={chip} style={{ '--c': chip }} />
                    ))}
                  </span>
                  <span className="ws__state">
                    <span className="sr">, </span>
                    {tie(t.concept)}
                  </span>
                  {arrow}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="work__status">{tie(t.status)}</p>
      </section>
      <div className="work__end">
        <Link className="cross" to={wzornik}>
          <span>{tie(t.more)}</span>
          {arrow}
        </Link>
      </div>
    </>
  );
}
