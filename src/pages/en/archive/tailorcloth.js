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
          {tie(
            'A website on Odoo, custom product modules and an order platform for made-to-measure shirts. I configured it all, from the ordering system to the home page.',
          )}
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
      <Project lang="en" />
      <Close lang="en" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="case"
    title="TailorCloth: a made-to-measure order platform on Odoo, Adrian Turbiński"
    description="Case study: an Odoo website, product modules and a seven-step order platform for made-to-measure shirts for a tailoring company from Kraków. Configured end to end."
  />
);
