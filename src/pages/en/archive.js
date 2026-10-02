import React from 'react';
import Hero from '../../components/hero';
import Seo from '../../components/seo';
import Work from '../../components/work';
import { tie } from '../../i18n';

export default function Archive() {
  return (
    <>
      <Hero id="work-h" sr="Projects, " title="From the | workshop." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('One real project and six concept websites.')}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie('I built the first with a team. The rest are my designs for made-up firms.')}
        </p>
      </Hero>
      <Work lang="en" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="work"
    title="Projects, Adrian Turbiński"
    description="One real project for a tailoring company and six concept websites for made-up firms."
  />
);
