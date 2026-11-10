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
            'Sześć wdrożeń dla firm, sześć publicznych repozytoriów i dziesięć przykładowych stron.',
          )}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(
            'TailorCloth zrobiłem z zespołem, pozostałe pięć sam. Repozytoria są moje, a strony to moje projekty dla zmyślonych firm.',
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
    description="Sześć wdrożeń, między innymi dla firmy krawieckiej, stolarza, sklepu z torebkami i firmy budującej domy, sześć publicznych repozytoriów z demo na żywo i dziesięć przykładowych stron dla zmyślonych firm."
  />
);
