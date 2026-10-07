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
          {tie(
            'Jedno prawdziwe wdrożenie, trzy publiczne repozytoria i dziewięć przykładowych stron.',
          )}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(
            'Wdrożenie zrobiłem z zespołem. Repozytoria są moje, a strony to moje projekty dla zmyślonych firm.',
          )}
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
    description="Jedno prawdziwe wdrożenie dla firmy krawieckiej, trzy publiczne repozytoria z demo na żywo i dziewięć przykładowych stron dla zmyślonych firm."
  />
);
