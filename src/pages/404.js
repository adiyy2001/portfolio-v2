import React from 'react';
import { Link } from 'gatsby';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { routes } from '../i18n';

export default function NotFound() {
  return (
    <Hero id="nf-h" title="Nie ma takiej strony." size="rec">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Adres mógł się zmienić. Zacznij od strony głównej.
      </p>
      <p className="lead2" lang="en" data-rise style={{ '--r': 1 }}>
        This page doesn&apos;t exist. The address may have changed.
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <Link className="btn" to={routes.home.pl}>
          Strona główna
        </Link>
        <Link className="link" to={routes.home.en} lang="en" hrefLang="en">
          Home in English
        </Link>
      </div>
    </Hero>
  );
}

export const Head = () => <Seo lang="pl" title="Nie ma takiej strony, Adrian Turbiński" noindex />;
