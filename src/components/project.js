import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';

const copy = {
  tech: ['Odoo', 'Python', 'JavaScript', 'PostgreSQL'],
  pl: {
    factsTitle: 'Zakres.',
    factsSide:
      'Projekt był duży. Skonfigurowałem go od systemu zamówień po stronę główną i dopilnowałem, żeby działał z nim CRM.',
    facts: [
      ['Strona', 'responsywna, na Odoo'],
      ['Produkty', 'własne moduły do zarządzania produktami'],
      ['Platforma', 'bezpieczna, dla zaufanych użytkowników'],
      ['Zamówienia', 'bez cen, pod indywidualne oferty'],
      ['Faktury', 'krajowe i zagraniczne'],
      ['Magazyn', 'zautomatyzowane procesy'],
      ['CRM', 'ustawiony do pracy z systemem'],
    ],
    flowTitle: 'Droga zamówienia.',
    flowLead:
      'Formularz ma siedem kroków i menu, które pokazuje je wszystkie naraz. Zrzuty pochodzą z platformy zamówień na tailorcloth.com.',
    railLabel: 'Siedem kroków formularza zamówienia',
    rail: [
      'Tkanina',
      'Wykończenie',
      'Inicjały',
      'Koszula bazowa',
      'Miary',
      'Ilość i termin',
      'Dane klienta',
    ],
    flow: [
      {
        key: 'order',
        step: 'Krok 1 z 7',
        title: 'Tkanina.',
        text: 'Dwie tkaniny w jednym kroku: główna i kontrastowa. Przy każdej widać kod, producenta, kolekcję, artykuł i skład, a przy głównej także grupę cenową.',
        hero: 'Zrzut tego kroku stoi na górze strony.',
        pointsLabel: 'Miejsce kontrastu na kołnierzu',
        points: ['Inside collar', 'Outside collar', 'Bottom of collar'],
      },
      {
        key: 'finishing',
        step: 'Krok 2 z 7',
        title: 'Wykończenie.',
        text: 'Wybór przodu koszuli: od gładkiego po smokingowy, ze spinkami albo z plisą. Wybrany wariant ma ramkę i ptaszek.',
        pointsLabel: 'Siedem wariantów przodu',
        points: [
          'Plain',
          'Imitation',
          'Covered',
          'Smoking with studs',
          'Tuxedo with studs',
          'Tuxedo covered',
          'Tuxedo with placket',
        ],
        alt: 'Krok wykończenia w formularzu zamówienia TailorCloth: siedem wariantów przodu koszuli od gładkiego po smokingowy, z menu kroków po lewej',
        caption: 'Wykończenie przodu, zrzut z tailorcloth.com',
      },
      {
        key: 'orders',
        step: 'Lista zamówień',
        title: 'Potwierdzone zamówienia.',
        text: 'Jeden wiersz to jedno zamówienie: data, numer, tkanina główna i kontrastowa, imię i nazwisko, Express i status, na zrzucie On hold albo Waiting. Każde zamówienie można ponowić albo poprawić, z formularza i z konfiguratora 3D.',
        pointsLabel: 'Przyciski w wierszu',
        points: ['Form: Order again, Edit', '3D configurator: Order again, Edit', 'Delete'],
        alt: 'Lista potwierdzonych zamówień w platformie TailorCloth: data, numer, próbka tkaniny, klient, status oraz przyciski ponownego zamówienia i edycji',
        caption: 'Potwierdzone zamówienia, zrzut z tailorcloth.com',
      },
    ],
    whoTitle: 'Kto z czego korzysta.',
    whoSide:
      'Według tailorcloth.com, stan na 10 listopada 2026, firma szyje dla partnerów B2B pod ich własną marką, a platforma jest dostępna po zalogowaniu.',
    who: [
      {
        key: 'ordering',
        title: 'Zamawiający',
        items: [
          'Bezpieczna platforma dla zaufanych użytkowników.',
          'Formularz zamówienia w siedmiu krokach.',
          'Lista zamówień z ponawianiem i edycją.',
          'Zamówienia bez cen, pod indywidualne oferty.',
        ],
      },
      {
        key: 'staff',
        title: 'Pracownicy firmy krawieckiej',
        items: [
          'Własne moduły do zarządzania produktami.',
          'Faktury krajowe i zagraniczne.',
          'Zautomatyzowane procesy magazynowe.',
          'CRM ustawiony do pracy z systemem.',
        ],
      },
    ],
    mapTitle: 'Jak to się łączy.',
    mapSide: 'Sześć części jednego systemu, który stoi na Odoo i PostgreSQL.',
    mapCore: 'Odoo i PostgreSQL',
    mapLabel: 'Części systemu',
    map: [
      ['Strona', 'Responsywna, razem ze stroną główną.'],
      ['Platforma zamówień', 'Bezpieczna, z formularzem siedmiu kroków i listą zamówień.'],
      ['Produkty', 'Własne moduły do zarządzania produktami.'],
      ['Faktury', 'Krajowe i zagraniczne.'],
      ['Magazyn', 'Zautomatyzowane procesy.'],
      ['CRM', 'Ustawiony tak, żeby działał z resztą.'],
    ],
    howTitle: 'Jak to działa.',
    howSide: 'Opis tego, co widać na zrzutach i na tailorcloth.com.',
    how: [
      ['Menu kroków', 'Po lewej stoją wszystkie kroki naraz, aktywny ma pionową kreskę.'],
      [
        'Wybór',
        'Wybrana opcja ma ramkę i ptaszek, przy przodzie koszuli i przy miejscu kontrastu.',
      ],
      [
        'Kontrast',
        'Tkanina kontrastowa ma osobne pole, a jej miejsce wybiera się z trzech rysunków kołnierza.',
      ],
      [
        'Lista',
        'Wiersze mają kolumny Express i status. Ponawianie i edycja są osobno dla formularza i dla konfiguratora 3D.',
      ],
      ['Ceny', 'Zamówienie może iść bez ceny, pod indywidualną ofertę.'],
      ['Dostęp', 'Wejście po zalogowaniu. Według tailorcloth.com partner widzi wtedy swoje logo.'],
    ],
    teamTitle: 'Kto to szył.',
    team: 'Zrobione z zespołem, który prowadziłem w Media Hunters. Konfigurację całego systemu zrobiłem sam, od systemu zamówień po stronę główną. Dziś stronę utrzymuje inna agencja. Opis powstał za zgodą klienta.',
    techLabel: 'Technologie',
    back: 'Wszystkie projekty',
  },
  en: {
    factsTitle: 'Scope.',
    factsSide:
      'The project was large. I configured it from the ordering system to the home page and made sure the CRM works with it.',
    facts: [
      ['Website', 'responsive, on Odoo'],
      ['Products', 'custom product management modules'],
      ['Platform', 'secure, for trusted users'],
      ['Orders', 'without prices, for individual offers'],
      ['Invoicing', 'domestic and international'],
      ['Warehouse', 'automated processes'],
      ['CRM', 'set up to work with the system'],
    ],
    flowTitle: 'The order path.',
    flowLead:
      'The form has seven steps and a menu that shows all of them at once. The screenshots come from the order platform on tailorcloth.com.',
    railLabel: 'The seven steps of the order form',
    rail: [
      'Fabric',
      'Finishing',
      'Initials',
      'Base shirt',
      'Measurements',
      'Quantity and deadline',
      'Customer data',
    ],
    flow: [
      {
        key: 'order',
        step: 'Step 1 of 7',
        title: 'Fabric.',
        text: 'Two fabrics in one step: main and contrast. Each shows a code, manufacturer, collection, article and composition, and the main one also shows a price group.',
        hero: 'A screenshot of this step is at the top of the page.',
        pointsLabel: 'Where the contrast goes on the collar',
        points: ['Inside collar', 'Outside collar', 'Bottom of collar'],
      },
      {
        key: 'finishing',
        step: 'Step 2 of 7',
        title: 'Finishing.',
        text: 'Choosing the shirt front, from plain to tuxedo, with studs or a placket. The chosen variant has a frame and a tick.',
        pointsLabel: 'Seven front variants',
        points: [
          'Plain',
          'Imitation',
          'Covered',
          'Smoking with studs',
          'Tuxedo with studs',
          'Tuxedo covered',
          'Tuxedo with placket',
        ],
        alt: 'The finishing step of the TailorCloth order form: seven shirt front variants from plain to tuxedo, with the step menu on the left',
        caption: 'The shirt front step, screenshot from tailorcloth.com',
      },
      {
        key: 'orders',
        step: 'Order list',
        title: 'Confirmed orders.',
        text: 'One row is one order: date, number, main and contrast fabric, name, Express and status, On hold or Waiting in the screenshot. Every order can be repeated or edited, from the form and from the 3D configurator.',
        pointsLabel: 'Buttons in a row',
        points: ['Form: Order again, Edit', '3D configurator: Order again, Edit', 'Delete'],
        alt: 'The confirmed orders list in the TailorCloth platform: date, number, fabric swatch, customer, status and buttons to re-order or edit',
        caption: 'Confirmed orders, screenshot from tailorcloth.com',
      },
    ],
    whoTitle: 'Who uses what.',
    whoSide:
      'According to tailorcloth.com, as of 10 November 2026, the company makes shirts for B2B partners under their own brand, and the platform is available after logging in.',
    who: [
      {
        key: 'ordering',
        title: 'The ordering customer',
        items: [
          'A secure platform for trusted users.',
          'An order form in seven steps.',
          'An order list with reorder and edit.',
          'Orders without prices, for individual offers.',
        ],
      },
      {
        key: 'staff',
        title: "The tailoring company's staff",
        items: [
          'Custom modules for managing products.',
          'Domestic and international invoices.',
          'Automated warehouse processes.',
          'A CRM set up to work with the system.',
        ],
      },
    ],
    mapTitle: 'How it connects.',
    mapSide: 'Six parts of one system that runs on Odoo and PostgreSQL.',
    mapCore: 'Odoo and PostgreSQL',
    mapLabel: 'Parts of the system',
    map: [
      ['Website', 'Responsive, with the home page.'],
      ['Order platform', 'Secure, with a seven-step form and an order list.'],
      ['Products', 'Custom modules for managing products.'],
      ['Invoices', 'Domestic and international.'],
      ['Warehouse', 'Automated processes.'],
      ['CRM', 'Set up to work with the rest.'],
    ],
    howTitle: 'How it works.',
    howSide: 'A description of what the screenshots and tailorcloth.com show.',
    how: [
      ['Step menu', 'All steps stand on the left at once, the active one has a vertical bar.'],
      [
        'Choice',
        'The chosen option has a frame and a tick, on the shirt front and on the contrast place.',
      ],
      [
        'Contrast',
        'The contrast fabric has its own field, and its place is picked from three collar drawings.',
      ],
      [
        'List',
        'Rows have Express and status columns. Reorder and edit are separate for the form and for the 3D configurator.',
      ],
      ['Prices', 'An order can go without a price, for an individual offer.'],
      [
        'Access',
        'Entry after logging in. According to tailorcloth.com the partner then sees their own logo.',
      ],
    ],
    teamTitle: 'Who stitched it.',
    team: 'Built with the team I led at Media Hunters. I configured the whole system myself, from the ordering system to the home page. Another agency maintains the site today. The client agreed to this write-up.',
    techLabel: 'Tech',
    back: 'All projects',
  },
};

const largest = srcSet => srcSet.split(',').pop().trim().split(' ')[0];

function Figure({ item, image }) {
  const { images, width, height } = image.childImageSharp.gatsbyImageData;

  return (
    <figure className="proj__fig">
      <a href={largest(images.fallback.srcSet)} target="_blank" rel="noopener noreferrer">
        <picture>
          {images.sources.map(source => (
            <source
              key={source.type}
              type={source.type}
              srcSet={source.srcSet}
              sizes={source.sizes}
            />
          ))}
          <img
            src={images.fallback.src}
            srcSet={images.fallback.srcSet}
            sizes={images.fallback.sizes}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            alt={item.alt}
          />
        </picture>
      </a>
      <figcaption>{tie(item.caption)}</figcaption>
    </figure>
  );
}

function Flow({ item, image, odd, labelLang }) {
  const className = ['proj__step', odd && 'proj__step--odd', !image && 'proj__step--text']
    .filter(Boolean)
    .join(' ');

  return (
    <Reveal as="article" className={className}>
      {image && <Figure item={item} image={image} />}
      <div className="proj__note">
        <p className="proj__label">{item.step}</p>
        <h3 className="proj__step-h">{item.title}</h3>
        <p>{tie(item.text)}</p>
        {!image && <p>{tie(item.hero)}</p>}
        <p className="proj__label proj__label--list" id={`proj-${item.key}-points`}>
          {item.pointsLabel}
        </p>
        <ul className="proj__points" aria-labelledby={`proj-${item.key}-points`}>
          {item.points.map(point => (
            <li key={point} lang={labelLang}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Project({ lang }) {
  const t = copy[lang];
  const { shots } = useStaticQuery(graphql`
    query {
      shots: allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          name: { in: ["tailorcloth-finishing", "tailorcloth-orders"] }
        }
      ) {
        nodes {
          name
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 1100
              breakpoints: [440, 660, 880, 1100, 1760]
              sizes: "(min-width: 900px) 62vw, 92vw"
              formats: [WEBP, AVIF]
              quality: 82
              placeholder: NONE
            )
          }
        }
      }
    }
  `);
  const imageFor = key => shots.nodes.find(node => node.name === `tailorcloth-${key}`);

  const labelLang = lang === 'pl' ? 'en' : undefined;

  return (
    <>
      <section className="proj__facts" aria-labelledby="proj-facts-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-facts-h">
            <Split text={t.factsTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.factsSide)}</p>
        </div>
        <dl className="spec">
          {t.facts.map(([term, detail]) => (
            <Reveal as="div" key={term}>
              <dt>{tie(term)}</dt>
              <dd>{tie(detail)}</dd>
            </Reveal>
          ))}
        </dl>
      </section>
      <section className="proj__flow" aria-labelledby="proj-flow-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-flow-h">
            <Split text={t.flowTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.flowLead)}</p>
        </div>
        <Reveal as="ol" className="tc-rail" aria-label={t.railLabel}>
          {t.rail.map((name, index) => (
            <li key={name}>
              <span className="tc-rail__no" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="tc-rail__name">{tie(name)}</span>
            </li>
          ))}
        </Reveal>
        {t.flow.map((item, index) => (
          <Flow
            key={item.key}
            item={item}
            image={imageFor(item.key)}
            odd={index % 2 === 1}
            labelLang={labelLang}
          />
        ))}
      </section>
      <section className="paper tc-who" aria-labelledby="proj-who-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-who-h">
            <Split text={t.whoTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.whoSide)}</p>
        </div>
        <div className="tc-who__pair">
          {t.who.map(group => (
            <Reveal as="article" className="tc-who__card" key={group.key}>
              <h3 className="tc-who__h">{tie(group.title)}</h3>
              <ul>
                {group.items.map(item => (
                  <li key={item}>{tie(item)}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="tc-map" aria-labelledby="proj-map-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-map-h">
            <Split text={t.mapTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.mapSide)}</p>
        </div>
        <Reveal className="tc-map__row">
          <p className="tc-map__core">{t.mapCore}</p>
          <ul className="tc-map__nodes" aria-label={t.mapLabel}>
            {t.map.map(([name, text]) => (
              <li key={name}>
                <span className="tc-map__name">{tie(name)}</span>
                <span className="tc-map__text">{tie(text)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <section className="tc-how" aria-labelledby="proj-how-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-how-h">
            <Split text={t.howTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.howSide)}</p>
        </div>
        <dl className="spec">
          {t.how.map(([term, detail]) => (
            <Reveal as="div" key={term}>
              <dt>{tie(term)}</dt>
              <dd>{tie(detail)}</dd>
            </Reveal>
          ))}
        </dl>
      </section>
      <section className="paper proj__team" aria-labelledby="proj-team-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-team-h">
            <Split text={t.teamTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.team)}</p>
        </div>
        <Reveal className="proj__stack">
          <p className="proj__label" id="proj-tech-h">
            {t.techLabel}
          </p>
          <ul className="proj__tech" aria-labelledby="proj-tech-h">
            {copy.tech.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Reveal>
      </section>
      <div className="proj__end">
        <Link className="cross cross--back" to={routes.work[lang]}>
          <svg viewBox="0 0 40 18" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M39 9H2M10 1L2 9L10 17" />
          </svg>
          <span>{t.back}</span>
        </Link>
      </div>
    </>
  );
}
