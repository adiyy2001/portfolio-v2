import React from 'react';
import Hero from '../components/hero';
import Rack from '../components/rack';
import Seo from '../components/seo';
import { routes, tie } from '../i18n';

const labels = [
  {
    to: routes.rec.pl,
    tilt: -3,
    for: 'Szyte dla',
    who: 'rekrutera',
    what: 'Doświadczenie, stack i CV do druku.',
    go: 'Otwórz',
    note: 'z LinkedIna?',
  },
  {
    to: routes.cli.pl,
    tilt: 2.4,
    for: 'Szyte dla',
    who: 'klienta',
    what: 'Co zbuduję, jak pracuję i jak zacząć.',
    go: 'Otwórz',
    note: 'masz projekt?',
  },
];

export default function Home() {
  return (
    <Hero
      id="home-h"
      sr="Adrian Turbiński, programista front-end i full-stack. "
      title="Na miarę."
      size="home"
      aside={<Rack labels={labels} />}>
      <p className="lead" data-rise style={{ '--r': 0 }}>
        {tie(
          'Adrian Turbiński, programista front-end i full-stack z Wrocławia. Od 2019 roku buduję aplikacje webowe, na etacie i na zlecenie.',
        )}
      </p>
      <h2 className="ask" data-rise style={{ '--r': 1 }}>
        Kto patrzy?
      </h2>
      <p className="ask__sub" data-rise style={{ '--r': 2 }}>
        Ta strona ma dwa kroje. Wybierz swój.
      </p>
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
