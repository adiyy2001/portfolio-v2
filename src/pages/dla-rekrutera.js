import React from 'react';
import Hero from '../components/hero';
import Seo from '../components/seo';

export default function Recruiter() {
  return (
    <Hero id="rec-h" sr="Adrian Turbiński, " title="Senior frontend. | Tech lead." size="rec">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Angular, TypeScript, RxJS i Node.js od 2019 roku. W PSE Innowacje buduję aplikację do
        modelowania i wizualizacji linii wysokiego napięcia.
      </p>
      <p className="lead2" data-rise style={{ '--r': 1 }}>
        Projektuję architekturę frontu i back-endu, prowadziłem mały zespół, wdrażam nowych
        inżynierów.
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <a className="btn" href="mailto:adrian.turbinski@gmail.com">
          Napisz do mnie
        </a>
        <a
          className="link"
          href="https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6"
          rel="noopener">
          LinkedIn
        </a>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    view="rec"
    title="Adrian Turbiński dla rekrutera: senior frontend, tech lead"
    description="Senior frontend i tech lead z Wrocławia. Angular, TypeScript, RxJS i Node.js od 2019 roku. CV do druku."
  />
);
