import React from 'react';
import { Link } from 'gatsby';
import Hero from '../../components/hero';
import Seo from '../../components/seo';
import { routes } from '../../i18n';

export default function Home() {
  return (
    <Hero
      id="home-h"
      sr="Adrian Turbiński, front-end and full-stack developer. "
      title="Made to | measure."
      size="home">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Adrian Turbiński, front-end and full-stack developer from Wrocław. Building web apps since
        2019, both as an employee and as a contractor.
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={routes.rec.en}>
          Cut for recruiters
        </Link>
        <Link className="btn btn--line" to={routes.cli.en}>
          Cut for clients
        </Link>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="home"
    title="Adrian Turbiński, front-end and full-stack developer"
    description="Adrian Turbiński, front-end and full-stack developer from Wrocław. Two editions of the site: for recruiters and for clients."
  />
);
