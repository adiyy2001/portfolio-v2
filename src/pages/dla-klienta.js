import React from 'react';
import Case from '../components/case';
import Close from '../components/close';
import Fit from '../components/fit';
import Hero from '../components/hero';
import Magnet from '../components/magnet';
import Scene from '../components/scene';
import Seo from '../components/seo';
import Steps from '../components/steps';
import Tags from '../components/tags';
import Wzornik from '../components/wzornik';
import { tie } from '../i18n';

const mail = 'adrian.turbinski@gmail.com';

const copy = {
  title: 'Od pierwszej rozmowy | do produkcji.',
  lead: 'Robię całe aplikacje webowe dla firm: front, back i wdrożenie. Dostępne dla każdego, także z klawiatury i czytnika ekranu.',
  lead2:
    'Zlecenia biorę jako freelancer. Od wyceny przez wdrożenie po utrzymanie rozmawiasz ze mną.',
  cta: 'Opowiedz o projekcie',
  link: 'Zobacz projekt dla krawca',
  subject: 'Projekt',
};

export default function Client() {
  return (
    <>
      <Hero
        id="cli-h"
        sr="Adrian Turbiński, "
        title={copy.title}
        size="cli"
        aside={<Tags lang="pl" />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(copy.lead)}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(copy.lead2)}
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <Magnet className="btn" href={`mailto:${mail}?subject=${copy.subject}`}>
            {tie(copy.cta)}
          </Magnet>
          <a className="link" href="#tailorcloth">
            {tie(copy.link)}
          </a>
        </div>
      </Hero>
      <Scene lang="pl" />
      <Fit lang="pl" />
      <Case lang="pl" />
      <Wzornik lang="pl" />
      <Steps lang="pl" />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="cli"
    title="Adrian Turbiński dla klienta: aplikacje, strony i dostępność"
    description="Aplikacje webowe i strony dla firm, od wyceny po utrzymanie. Front, back, wdrożenie i dostępność według WCAG."
  />
);
