import React, { useRef } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import { cases } from './also';
import Cases from './cases';
import Repos from './repos';
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
      slug: 'sygnet',
      name: 'Sygnet',
      bg: '#d71920',
      fg: '#f6f3ec',
      chips: ['#000000', '#f6f3ec', '#d71920'],
    },
    {
      id: 'acc',
      slug: 'kajet',
      name: 'Kajet',
      bg: '#f4f4f4',
      fg: '#111111',
      chips: ['#111111', '#f4f4f4', '#8c8c8c'],
    },
    {
      id: 'den',
      slug: 'emalia',
      name: 'Emalia',
      bg: '#2d3bff',
      fg: '#e6e9fb',
      chips: ['#0e1747', '#2d3bff', '#d4f25a'],
    },
    {
      id: 'psy',
      slug: 'otoczak',
      name: 'Otoczak',
      bg: '#ece8e1',
      fg: '#2a2724',
      chips: ['#2a2724', '#ece8e1', '#8a7f6e'],
    },
    {
      id: 'est',
      slug: 'cegielnia-14',
      name: 'Cegielnia 14',
      bg: '#4a2414',
      fg: '#efe3cf',
      chips: ['#080504', '#efe3cf', '#6b3420'],
    },
    {
      id: 'bis',
      slug: 'szczypta',
      name: 'Szczypta',
      en: true,
      bg: '#6b1d22',
      fg: '#f3ead8',
      chips: ['#1d140e', '#f3ead8', '#6b1d22'],
    },
    {
      id: 'shop',
      slug: 'ziarnik',
      name: 'Ziarnik',
      bg: '#c99f6e',
      fg: '#24160d',
      chips: ['#24160d', '#e9dcc7', '#c99f6e'],
    },
    {
      id: 'flat',
      slug: 'klamka',
      name: 'Klamka',
      bg: '#faf9f5',
      fg: '#121212',
      chips: ['#121212', '#faf9f5', '#4a4944'],
    },
    {
      id: 'stay',
      slug: 'brelok',
      name: 'Brelok 1912',
      en: true,
      bg: '#17392c',
      fg: '#f1e7cf',
      chips: ['#17392c', '#f1e7cf', '#e8dcc0'],
    },
    {
      id: 'car',
      slug: 'nakretka',
      name: 'Nakrętka',
      bg: '#ffe400',
      fg: '#0b0b0a',
      chips: ['#0b0b0a', '#efede6', '#ffe400'],
    },
  ],
  pl: {
    anchor: 'wzornik',
    tag: 'Strona i platforma zamówień',
    meta: 'Firma krawiecka z Krakowa',
    desc: 'Strona na Odoo i własne moduły do zarządzania produktami. Do tego zamawianie bez cen, pod indywidualne oferty.',
    go: 'Zobacz projekt',
    gridTitle: 'Realizacje dla firm',
    showMore: 'Pokaż więcej',
    swTitle: 'Wzornik.',
    swLead:
      'Dziesięć przykładowych stron dla zmyślonych firm z różnych branż. Każda skrojona inaczej i każda działa.',
    swNote: 'firmy zmyślone, projekty moje',
    status:
      'Firmy są zmyślone, strony działają naprawdę. Koszyk, rezerwacja i formularze niczego nie wysyłają.',
    more: 'Otwórz wzornik w wersji dla klienta',
    trades: [
      'kancelaria prawna',
      'biuro rachunkowe',
      'gabinet stomatologiczny',
      'gabinet psychoterapii',
      'lofty w dawnej cegielni',
      'bistro',
      'palarnia kawy',
      'biuro nieruchomości',
      'hotel butikowy',
      'warsztat samochodowy',
    ],
    kinds: [
      'strona firmowa',
      'strona z panelem i kalkulatorem',
      'strona z cennikiem i zapisem',
      'wizytówka',
      'strona sprzedażowa',
      'strona z kartą, PL i EN',
      'sklep internetowy',
      'katalog ofert jak magazyn',
      'strona z rezerwacją, PL i EN',
      'strona z kalkulatorem ceny',
    ],
  },
  en: {
    anchor: 'swatch-book',
    tag: 'Website and order platform',
    meta: 'A tailoring company from Kraków',
    desc: 'A website on Odoo with custom product management modules. Plus ordering without prices, for individual offers.',
    go: 'See the project',
    gridTitle: 'Projects for companies',
    showMore: 'Show more',
    swTitle: 'Swatch book.',
    swLead:
      'Ten sample websites for made-up businesses in different trades. Each one cut differently, and each one works.',
    swNote: 'made-up businesses, my designs',
    status:
      'The businesses are made up, the websites really work. The cart, the booking and the forms send nothing.',
    polish: ', in Polish',
    more: 'Open the swatch book in the client edition',
    trades: [
      'law firm',
      'accounting office',
      'dental practice',
      'psychotherapy practice',
      'lofts in an old brickworks',
      'bistro',
      'coffee roastery',
      'estate agency',
      'boutique hotel',
      'car repair shop',
    ],
    kinds: [
      'company website',
      'website with a client panel and calculator',
      'website with prices and booking',
      'one-page business card',
      'sales website',
      'website with a menu, PL and EN',
      'online shop',
      'listings magazine',
      'website with booking, PL and EN',
      'website with a price calculator',
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
  const items = [
    {
      id: 'work-tailorcloth-h',
      to: routes.case[lang],
      name: copy.name,
      view: 'wide',
      shot: <Shot lang={lang} sizes={copy.sizes} />,
      tag: t.tag,
      meta: t.meta,
      desc: t.desc,
      tech: copy.tech,
    },
    ...(lang === 'pl' ? cases : []),
  ];
  const wzornik = `${routes.home[lang]}#${t.anchor}`;
  useFaces(list);

  return (
    <>
      <Cases
        items={items}
        go={t.go}
        title={t.gridTitle}
        titleId="work-pick-h"
        moreLabel={t.showMore}
      />
      <Repos lang={lang} id="work-repos" />
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
