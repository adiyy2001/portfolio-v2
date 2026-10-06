import React from 'react';
import Hero from '../../components/hero';
import Rack from '../../components/rack';
import Seo from '../../components/seo';
import { routes, tie } from '../../i18n';

const labels = [
  {
    to: routes.rec.en,
    tilt: -3,
    for: 'Cut for',
    who: 'recruiters',
    what: 'Experience, stack and a printable resume.',
    go: 'Open',
    note: ['from', 'LinkedIn?'],
  },
  {
    to: routes.cli.en,
    tilt: 2.4,
    for: 'Cut for',
    who: 'clients',
    what: 'What I build, how I work, how to start.',
    go: 'Open',
    note: ['got a', 'project?'],
  },
];

export default function Home() {
  return (
    <Hero
      id="home-h"
      sr="Adrian Turbiński, front-end and full-stack developer. "
      title="Made to | measure."
      size="home"
      aside={<Rack labels={labels} />}>
      <p className="lead" data-rise style={{ '--r': 0 }}>
        {tie(
          'Adrian Turbiński, front-end and full-stack developer from Wrocław. Building web apps since 2019, both as an employee and as a contractor.',
        )}
      </p>
      <h2 className="ask" data-rise style={{ '--r': 1 }}>
        Who&apos;s looking?
      </h2>
      <p className="ask__sub" data-rise style={{ '--r': 2 }}>
        This site comes in two cuts. Pick yours.
      </p>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="home"
    title="Front-end and Angular developer in Wrocław, Adrian Turbiński"
    description="Front-end and full-stack developer from Wrocław. Angular, TypeScript, Node.js, web apps, websites and WCAG accessibility for companies. Editions for recruiters and for clients."
  />
);
