import React from 'react';
import Case from '../components/case';
import Close from '../components/close';
import Fit from '../components/fit';
import Hero from '../components/hero';
import Scene from '../components/scene';
import Seo from '../components/seo';
import Steps from '../components/steps';
import Wzornik from '../components/wzornik';

export default function Client() {
  return (
    <>
      <Hero
        id="cli-h"
        sr="Adrian Turbiński, "
        title="Od pierwszej rozmowy | do produkcji."
        size="cli">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          Robię całe aplikacje webowe dla firm: front, back i wdrożenie. Dostępne dla każdego, także
          z klawiatury i czytnika ekranu.
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          Zlecenia biorę jako freelancer. Od wyceny przez wdrożenie po utrzymanie rozmawiasz ze mną.
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <a className="btn" href="mailto:adrian.turbinski@gmail.com?subject=Projekt">
            Opowiedz o projekcie
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
