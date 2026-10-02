import React from 'react';
import { Link } from 'gatsby';
import Hero from '../../components/hero';
import Seo from '../../components/seo';
import { routes } from '../../i18n';

export default function Archive() {
  return (
    <Hero id="work-h" title="Projects." size="rec">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        The TailorCloth project and the sample websites are in the client edition.
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={routes.cli.en}>
          Cut for clients
        </Link>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="work"
    title="Projects, Adrian Turbiński"
    description="Projects by Adrian Turbiński."
  />
);
