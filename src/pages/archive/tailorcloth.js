import React from 'react';
import { Link } from 'gatsby';
import Close from '../../components/close';
import Hero from '../../components/hero';
import Project from '../../components/project';
import Seo from '../../components/seo';
import Shot from '../../components/shot';
import { routes, tie } from '../../i18n';

export default function Case() {
  return (
    <>
      <Hero
        id="case-h"
        title="TailorCloth."
        size="case"
        aside={<Shot lang="pl" sizes="(min-width: 900px) 62vw, 92vw" />}>
        <Link className="proj__back" to={routes.work.pl} data-rise style={{ '--r': 0 }}>
          <svg viewBox="0 0 28 14" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
          </svg>
          <span>Wszystkie projekty</span>
        </Link>
        <p className="proj__tag" data-rise style={{ '--r': 1 }}>
          Prawdziwe wdrożenie
        </p>
        <p className="proj__meta" data-rise style={{ '--r': 2 }}>
          Firma krawiecka z Krakowa
        </p>
        <p className="lead" data-rise style={{ '--r': 3 }}>
          {tie('Strona na Odoo i własne moduły do zarządzania produktami.')}
        </p>
        <div className="cta" data-rise style={{ '--r': 4 }}>
          <a
            className="link"
            href="https://tailorcloth.com/"
            target="_blank"
            rel="noopener noreferrer">
            tailorcloth.com
          </a>
        </div>
      </Hero>
      <Project lang="pl" />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="case"
    title="TailorCloth: strona i platforma na Odoo, Adrian Turbiński"
    description="Strona na Odoo i własne moduły do zarządzania produktami dla firmy krawieckiej z Krakowa. Zrobione z zespołem, który prowadziłem w Media Hunters."
  />
);
