import React from 'react';
import Card from '../components/card';
import Close from '../components/close';
import Experience from '../components/experience';
import Hero from '../components/hero';
import Kit from '../components/kit';
import Magnet from '../components/magnet';
import Repos from '../components/repos';
import Seo from '../components/seo';
import Writing from '../components/writing';
import { tie } from '../i18n';

export default function Recruiter() {
  return (
    <>
      <p className="print-only print-name">Adrian Turbiński</p>
      <Hero
        id="rec-h"
        sr="Adrian Turbiński, "
        title="Senior frontend. | Tech lead."
        size="rec"
        contact="Wrocław, adrian.turbinski@gmail.com, linkedin.com/in/adrian-turbiński-b266b21a6, github.com/adiyy2001"
        aside={<Card lang="pl" />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(
            'Angular, TypeScript, RxJS i Node.js od 2019 roku. W PSE Innowacje buduję aplikację do modelowania i wizualizacji linii wysokiego napięcia.',
          )}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(
            'Projektuję architekturę frontu i back-endu, prowadziłem mały zespół, wdrażam nowych inżynierów.',
          )}
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <Magnet className="btn" href="mailto:adrian.turbinski@gmail.com">
            Napisz do mnie
          </Magnet>
          <button type="button" className="btn btn--line" onClick={() => window.print()}>
            CV do druku
          </button>
          <a
            className="link"
            href="https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6"
            rel="noopener">
            LinkedIn
          </a>
        </div>
      </Hero>
      <Experience lang="pl" />
      <Kit lang="pl" />
      <Repos lang="pl" id="rec-repos" />
      <Writing lang="pl" />
      <Close lang="pl" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="rec"
    title="Senior Angular developer Wrocław, tech lead: Adrian Turbiński"
    description="Senior frontend developer i tech lead z Wrocławia. Angular, TypeScript, RxJS, NgRx i Node.js od 2019 roku. CV do druku."
  />
);
