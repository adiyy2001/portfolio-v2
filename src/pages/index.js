import React from 'react';
import { Link } from 'gatsby';
import Nudge from '../components/nudge';
import Case from '../components/case';
import Close from '../components/close';
import Fit from '../components/fit';
import GuideShelf from '../components/guides';
import Hero from '../components/hero';
import Magnet from '../components/magnet';
import Scene from '../components/scene';
import { ServiceRack } from '../components/service';
import Seo from '../components/seo';
import Tags from '../components/tags';
import Wzornik from '../components/wzornik';
import { scanPath, tie } from '../i18n';

const copy = {
  kicker: 'Freelancer, Wrocław i zdalnie',
  title: 'Strony i aplikacje | dla firm.',
  lead: 'Robię całe aplikacje webowe dla firm: front, back i wdrożenie. Dostępne dla każdego, także z klawiatury i czytnika ekranu.',
  lead2:
    'Zlecenia biorę jako freelancer, rozliczam się na fakturę B2B. Od wyceny przez wdrożenie po utrzymanie rozmawiasz ze mną.',
  cta: 'Wyceń projekt',
  scan: 'Sprawdź dostępność za darmo',
  scanNote: 'raport w kilkanaście minut',
};

export default function Client() {
  return (
    <>
      <Hero
        id="cli-h"
        sr="Adrian Turbiński, "
        kicker={copy.kicker}
        title={copy.title}
        size="cli"
        aside={<Tags lang="pl" />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(copy.lead)}
        </p>
        <div className="cta cta--hero" data-rise style={{ '--r': 1 }}>
          <Magnet className="btn" href="#wycena" data-cta="hero-quote">
            {tie(copy.cta)}
          </Magnet>
          <span className="cta__scan">
            <Link className="btn btn--line" to={scanPath} data-cta="hero-scan">
              {tie(copy.scan)}
            </Link>
            <span className="cta__note">{copy.scanNote}</span>
          </span>
        </div>
        <p className="lead2" data-rise style={{ '--r': 2 }}>
          {tie(copy.lead2)}
        </p>
      </Hero>
      <ServiceRack lang="pl" />
      <Case lang="pl" />
      <Nudge lang="pl" />
      <Scene lang="pl" />
      <Fit lang="pl" />
      <Wzornik lang="pl" />
      <GuideShelf />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="home"
    title="Strony internetowe i aplikacje webowe dla firm, Wrocław, Adrian Turbiński"
    description="Freelancer z Wrocławia: aplikacje webowe i strony internetowe dla firm, od wyceny po utrzymanie. Front, back, wdrożenie i dostępność według WCAG."
  />
);
