import React, { useRef } from 'react';
import { Link, withPrefix } from 'gatsby';
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
      slug: 'rozwaga',
      name: 'Rozwaga',
      bg: '#121212',
      fg: '#ffffff',
      chips: ['#121212', '#ffffff', '#b3122a'],
    },
    {
      id: 'acc',
      slug: 'rubryka',
      name: 'Rubryka',
      bg: '#f3f6fb',
      fg: '#0f1f3d',
      chips: ['#0f1f3d', '#f3f6fb', '#ff5b24'],
    },
    {
      id: 'den',
      slug: 'szkliwo',
      name: 'Szkliwo',
      bg: '#ff6f5b',
      fg: '#1b1f2a',
      chips: ['#1b1f2a', '#ffffff', '#ff6f5b'],
    },
    {
      id: 'psy',
      slug: 'tafla',
      name: 'Tafla',
      bg: '#dfe8e1',
      fg: '#1f2d26',
      chips: ['#1f2d26', '#dfe8e1', '#2f5d50'],
    },
    {
      id: 'est',
      slug: 'przedza',
      name: 'Przędza',
      bg: '#b4462e',
      fg: '#ffffff',
      chips: ['#161616', '#d7d8d3', '#b4462e'],
    },
    {
      id: 'bis',
      slug: 'kminek',
      name: 'Kminek',
      en: true,
      bg: '#ffcf3a',
      fg: '#2b1408',
      chips: ['#2b1408', '#ffcf3a', '#d93a1f'],
    },
    {
      id: 'shop',
      slug: 'trzask',
      name: 'Trzask',
      bg: '#d3f33a',
      fg: '#0e110f',
      chips: ['#0e110f', '#d3f33a', '#ffa21f'],
    },
    {
      id: 'flat',
      slug: 'prog',
      name: 'Próg',
      bg: '#4b30e8',
      fg: '#ffffff',
      chips: ['#17151f', '#ffffff', '#4b30e8'],
    },
    {
      id: 'stay',
      slug: 'przeslo',
      name: 'Przęsło',
      en: true,
      bg: '#1c1130',
      fg: '#f4c6dc',
      chips: ['#1c1130', '#ffffff', '#b0245c'],
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
      'Dziewięć przykładowych stron dla zmyślonych firm z różnych branż. Każda skrojona inaczej i każda działa.',
    swNote: 'firmy zmyślone, projekty moje',
    status:
      'Firmy są zmyślone, strony działają naprawdę. Koszyk, rezerwacja i formularze niczego nie wysyłają.',
    more: 'Otwórz wzornik w wersji dla klienta',
    trades: [
      'kancelaria prawna',
      'biuro rachunkowe',
      'klinika stomatologiczna',
      'gabinet psychoterapii',
      'inwestycja mieszkaniowa',
      'bistro',
      'palarnia kawy',
      'biuro nieruchomości',
      'hotel',
    ],
    kinds: [
      'strona firmowa',
      'strona usługowa z cennikiem',
      'strona z cennikiem i zapisami',
      'wizytówka',
      'strona sprzedażowa',
      'strona z kartą, PL i EN',
      'sklep internetowy',
      'wyszukiwarka ofert',
      'strona z rezerwacją, PL i EN',
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
      'Nine sample websites for made-up businesses in different trades. Each one cut differently, and each one works.',
    swNote: 'made-up businesses, my designs',
    status:
      'The businesses are made up, the websites really work. The cart, the booking and the forms send nothing.',
    polish: ', in Polish',
    more: 'Open the swatch book in the client edition',
    trades: [
      'law firm',
      'accounting office',
      'dental clinic',
      'psychotherapy practice',
      'residential development',
      'bistro',
      'coffee roastery',
      'estate agency',
      'hotel',
    ],
    kinds: [
      'company website',
      'service website with pricing',
      'website with prices and booking',
      'one-page business card',
      'sales website',
      'website with a menu, PL and EN',
      'online shop',
      'listings search',
      'website with booking, PL and EN',
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
          {copy.swatches.map((swatch, i) => {
            const english = lang === 'en' && swatch.en;
            return (
              <Reveal as="li" key={swatch.slug} className="work__item" style={{ '--i': i }}>
                <a
                  className={`ws ws--${swatch.id}`}
                  href={withPrefix(`/wzornik/${swatch.slug}/${english ? 'en/' : ''}`)}
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
                    {lang === 'en' && !swatch.en && <span className="sr">{t.polish}</span>}
                  </span>
                  <span className="ws__side">
                    <span className="ws__chips" aria-hidden="true">
                      {swatch.chips.map(chip => (
                        <i key={chip} style={{ '--c': chip }} />
                      ))}
                    </span>
                    {arrow}
                  </span>
                </a>
              </Reveal>
            );
          })}
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
