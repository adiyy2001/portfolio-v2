import React from 'react';
import { Link } from 'gatsby';
import Close from '../../../components/close';
import Hero from '../../../components/hero';
import Project from '../../../components/project';
import Seo from '../../../components/seo';
import Shot from '../../../components/shot';
import { routes, tie } from '../../../i18n';

export default function Case() {
  return (
    <>
      <Hero
        id="case-h"
        title="TailorCloth."
        size="case"
        aside={<Shot lang="en" sizes="(min-width: 900px) 62vw, 92vw" />}>
        <Link className="proj__back" to={routes.work.en} data-rise style={{ '--r': 0 }}>
          <svg viewBox="0 0 28 14" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
          </svg>
          <span>All projects</span>
        </Link>
        <p className="proj__tag" data-rise style={{ '--r': 1 }}>
          A real project
        </p>
        <p className="proj__meta" data-rise style={{ '--r': 2 }}>
          A tailoring company from Kraków
        </p>
        <p className="lead" data-rise style={{ '--r': 3 }}>
          {tie('A website on Odoo with custom product management modules.')}
        </p>
        <div className="cta" data-rise style={{ '--r': 4 }}>
          <a className="link" href="https://tailorcloth.com/" rel="noopener">
            tailorcloth.com
          </a>
        </div>
      </Hero>
      <Project lang="en" />
      <Close lang="en" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="case"
    title="TailorCloth: a website and platform on Odoo, Adrian Turbiński"
    description="A website on Odoo with custom product management modules for a tailoring company from Kraków. Built with the team I led at Media Hunters."
  />
);
