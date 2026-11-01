import React from 'react';
import { Link } from 'gatsby';
import Case from '../../components/case';
import Close from '../../components/close';
import Fit from '../../components/fit';
import Hero from '../../components/hero';
import Magnet from '../../components/magnet';
import Scene from '../../components/scene';
import { ServiceRack } from '../../components/service';
import Seo from '../../components/seo';
import Tags from '../../components/tags';
import Wzornik from '../../components/wzornik';
import { scanPath, tie } from '../../i18n';

const copy = {
  kicker: 'Freelancer, Wrocław and remote',
  title: 'Websites and apps | for businesses.',
  lead: 'I build whole web apps for companies: front end, back end and deployment. Usable by everyone, keyboard and screen reader included.',
  lead2:
    'I take on contracts as a freelancer and invoice B2B. From the quote through launch to maintenance, you talk to me.',
  cta: 'Get a quote',
  scan: 'Check accessibility for free',
  scanNote: 'the report is in Polish',
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
        aside={<Tags lang="en" />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(copy.lead)}
        </p>
        <div className="cta cta--hero" data-rise style={{ '--r': 1 }}>
          <Magnet className="btn" href="#quote" data-cta="hero-quote">
            {tie(copy.cta)}
          </Magnet>
          <span className="cta__scan">
            <Link className="btn btn--line" to={scanPath} data-cta="hero-scan" hrefLang="pl">
              {tie(copy.scan)}
            </Link>
            <span className="cta__note">{copy.scanNote}</span>
          </span>
        </div>
        <p className="lead2" data-rise style={{ '--r': 2 }}>
          {tie(copy.lead2)}
        </p>
      </Hero>
      <Scene lang="en" />
      <Fit lang="en" />
      <ServiceRack lang="en" />
      <Case lang="en" />
      <Wzornik lang="en" />
      <Close lang="en" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="home"
    title="Freelance web developer in Wrocław: apps and sites, Adrian Turbiński"
    description="Freelance developer in Wrocław: web apps and websites for companies, from the quote to maintenance. Front end, back end, deployment and WCAG accessibility."
  />
);
