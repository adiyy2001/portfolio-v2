import React from 'react';
import Close from '../components/close';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { Guides, useGuides } from '../components/guides';
import { guidePath, tie } from '../i18n';

const copy = {
  title: 'Pytania | przed miarą.',
  lead: 'Ile kosztuje strona i czym właściwie jest aplikacja webowa. Każdy artykuł zaczyna się od krótkiej odpowiedzi, szczegóły są niżej.',
  lead2: 'Piszę o tym, o co klienci pytają mnie najczęściej, i podaję moje ceny tam, gdzie pasują.',
};

export default function Guide() {
  const guides = useGuides();
  return (
    <>
      <Hero id="guide-h" sr="Poradnik, " title={copy.title} size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(copy.lead)}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(copy.lead2)}
        </p>
      </Hero>
      <section className="guide-list" aria-label="Artykuły">
        <Guides guides={guides} />
      </section>
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="guide"
    path={guidePath}
    title="Poradnik dla firm: strony internetowe i aplikacje webowe, Adrian Turbiński"
    description="Krótkie odpowiedzi na pytania o strony internetowe i aplikacje webowe dla firm: ceny, utrzymanie, czas realizacji i wybór wykonawcy."
  />
);
