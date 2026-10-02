import React from 'react';
import Hero from '../components/hero';
import Seo from '../components/seo';
import Work from '../components/work';
import { tie } from '../i18n';

export default function Archive() {
  return (
    <>
      <Hero id="work-h" sr="Projekty, " title="Z warsztatu." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('Jedno prawdziwe wdrożenie i sześć stron koncepcyjnych.')}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie('Pierwsze zrobiłem z zespołem. Pozostałe to moje projekty dla wymyślonych firm.')}
        </p>
      </Hero>
      <Work lang="pl" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="work"
    title="Projekty, Adrian Turbiński"
    description="Jedno prawdziwe wdrożenie dla firmy krawieckiej i sześć stron koncepcyjnych dla wymyślonych firm."
  />
);
