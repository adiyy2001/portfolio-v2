import React from 'react';
import { Link } from 'gatsby';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { routes } from '../i18n';

export default function Home() {
  return (
    <Hero
      id="home-h"
      sr="Adrian Turbiński, programista front-end i full-stack. "
      title="Na miarę."
      size="home">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Adrian Turbiński, programista front-end i full-stack z Wrocławia. Od 2019 roku buduję
        aplikacje webowe, na etacie i na zlecenie.
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={routes.rec.pl}>
          Szyte dla rekrutera
        </Link>
        <Link className="btn btn--line" to={routes.cli.pl}>
          Szyte dla klienta
        </Link>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="home"
    title="Adrian Turbiński, programista front-end i full-stack"
    description="Adrian Turbiński, programista front-end i full-stack z Wrocławia. Dwie wersje strony: dla rekrutera i dla klienta."
  />
);
