import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';

const copy = {
  tech: ['Odoo', 'Python', 'JavaScript', 'PostgreSQL'],
  pl: {
    factsTitle: 'Co w środku.',
    facts: [
      ['Strona', 'responsywna, na Odoo'],
      ['Produkty', 'własne moduły do zarządzania produktami'],
      ['Platforma', 'bezpieczna, dla zaufanych użytkowników'],
      ['Faktury', 'krajowe i zagraniczne'],
      ['Magazyn', 'zautomatyzowane procesy'],
      ['Zamówienia', 'bez cen, pod indywidualne oferty'],
    ],
    flowTitle: 'Zamówienie krok po kroku.',
    flowLead:
      'Zrzuty platformy zamówień z tailorcloth.com. Formularz ma siedem kroków, a lista zamówień zbiera to, co już poszło do szycia.',
    flow: [
      {
        key: 'finishing',
        step: 'Krok 2 z 7',
        title: 'Wykończenie.',
        text: 'Wybór przodu koszuli: od gładkiego po smokingowy, ze spinkami albo z plisą. Dalej inicjały, koszula bazowa, miary, ilość z terminem i dane klienta.',
        alt: 'Krok wykończenia w formularzu zamówienia TailorCloth: siedem wariantów przodu koszuli od gładkiego po smokingowy, z menu kroków po lewej',
        caption: 'Wykończenie przodu, zrzut z tailorcloth.com',
      },
      {
        key: 'orders',
        step: 'Lista zamówień',
        title: 'Potwierdzone zamówienia.',
        text: 'Data, numer, tkanina, klient i status w jednym wierszu. Każde zamówienie można ponowić albo poprawić, z formularza i z konfiguratora 3D.',
        alt: 'Lista potwierdzonych zamówień w platformie TailorCloth: data, numer, próbka tkaniny, klient, status oraz przyciski ponownego zamówienia i edycji',
        caption: 'Potwierdzone zamówienia, zrzut z tailorcloth.com',
      },
    ],
    teamTitle: 'Kto to szył.',
    team: 'Zrobione z zespołem, który prowadziłem w Media Hunters. Dziś stronę utrzymuje inna agencja.',
    techLabel: 'Technologie',
    back: 'Wszystkie projekty',
  },
  en: {
    factsTitle: "What's inside.",
    facts: [
      ['Website', 'responsive, on Odoo'],
      ['Products', 'custom product management modules'],
      ['Platform', 'secure, for trusted users'],
      ['Invoicing', 'local and international'],
      ['Warehouse', 'automated processes'],
      ['Orders', 'without prices, for individual offers'],
    ],
    flowTitle: 'The order, step by step.',
    flowLead:
      'Screenshots of the order platform from tailorcloth.com. The form has seven steps, and the order list gathers what has already gone to the workshop.',
    flow: [
      {
        key: 'finishing',
        step: 'Step 2 of 7',
        title: 'Finishing.',
        text: 'Choosing the shirt front, from plain to tuxedo, with studs or a placket. Then initials, base shirt, measurements, quantity with a deadline and customer data.',
        alt: 'The finishing step of the TailorCloth order form: seven shirt front variants from plain to tuxedo, with the step menu on the left',
        caption: 'The shirt front step, screenshot from tailorcloth.com',
      },
      {
        key: 'orders',
        step: 'Order list',
        title: 'Confirmed orders.',
        text: 'Date, number, fabric, customer and status in one row. Every order can be repeated or edited, from the form and from the 3D configurator.',
        alt: 'The confirmed orders list in the TailorCloth platform: date, number, fabric swatch, customer, status and buttons to re-order or edit',
        caption: 'Confirmed orders, screenshot from tailorcloth.com',
      },
    ],
    teamTitle: 'Who stitched it.',
    team: 'Built with the team I led at Media Hunters. Another agency maintains the site today.',
    techLabel: 'Tech',
    back: 'All projects',
  },
};

const largest = srcSet => srcSet.split(',').pop().trim().split(' ')[0];

function Flow({ item, image, odd }) {
  const { images, width, height } = image.childImageSharp.gatsbyImageData;

  return (
    <Reveal as="article" className={odd ? 'proj__step proj__step--odd' : 'proj__step'}>
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
      <div className="proj__note">
        <p className="proj__label">{item.step}</p>
        <h3 className="proj__step-h">{item.title}</h3>
        <p>{tie(item.text)}</p>
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

  return (
    <>
      <section className="proj__facts" aria-labelledby="proj-facts-h">
        <div className="sec-head">
          <h2 className="h2" id="proj-facts-h">
            <Split text={t.factsTitle} onView />
          </h2>
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
        {t.flow.map((item, index) => (
          <Flow key={item.key} item={item} image={imageFor(item.key)} odd={index % 2 === 1} />
        ))}
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
