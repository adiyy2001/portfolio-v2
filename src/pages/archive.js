import React from 'react';
import { Link } from 'gatsby';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { routes } from '../i18n';

export default function Archive() {
  return (
    <Hero id="work-h" title="Projekty." size="rec">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Wdrożenie dla TailorCloth i przykładowe strony są w wersji dla klienta.
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={routes.cli.pl}>
          Szyte dla klienta
        </Link>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="work"
    title="Projekty, Adrian Turbiński"
    description="Projekty Adriana Turbińskiego."
  />
);
