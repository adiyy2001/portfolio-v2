import React from 'react';
import { Link } from 'gatsby';
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
    teamTitle: 'Who stitched it.',
    team: 'Built with the team I led at Media Hunters. Another agency maintains the site today.',
    techLabel: 'Tech',
    back: 'All projects',
  },
};

export default function Project({ lang }) {
  const t = copy[lang];

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
