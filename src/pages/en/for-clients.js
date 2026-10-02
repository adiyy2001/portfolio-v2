import React from 'react';
import Hero from '../../components/hero';
import Seo from '../../components/seo';

export default function Client() {
  return (
    <Hero
      id="cli-h"
      sr="Adrian Turbiński, "
      title="From the first call | to production."
      size="cli">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        I build whole web apps for companies: front end, back end and deployment. Usable by
        everyone, keyboard and screen reader included.
      </p>
      <p className="lead2" data-rise style={{ '--r': 1 }}>
        I take on contracts as a freelancer. From the quote through launch to maintenance, you talk
        to me.
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <a className="btn" href="mailto:adrian.turbinski@gmail.com?subject=Project">
          Tell me about the project
        </a>
      </div>
    </Hero>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="cli"
    title="Adrian Turbiński for clients: web apps, websites and accessibility"
    description="Web apps and websites for companies, from the quote to maintenance. Front end, back end, deployment and WCAG accessibility."
  />
);
