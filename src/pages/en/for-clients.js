import React from 'react';
import Case from '../../components/case';
import Close from '../../components/close';
import Fit from '../../components/fit';
import Hero from '../../components/hero';
import Magnet from '../../components/magnet';
import Scene from '../../components/scene';
import Seo from '../../components/seo';
import Steps from '../../components/steps';
import Tags from '../../components/tags';
import Wzornik from '../../components/wzornik';
import { tie } from '../../i18n';

const mail = 'adrian.turbinski@gmail.com';

const copy = {
  title: 'From the first call | to production.',
  lead: 'I build whole web apps for companies: front end, back end and deployment. Usable by everyone, keyboard and screen reader included.',
  lead2:
    'I take on contracts as a freelancer and invoice B2B. From the quote through launch to maintenance, you talk to me.',
  cta: 'Tell me about the project',
  link: 'See the project for a tailor',
  subject: 'Project',
};

export default function Client() {
  return (
    <>
      <Hero
        id="cli-h"
        sr="Adrian Turbiński, "
        title={copy.title}
        size="cli"
        aside={<Tags lang="en" />}>
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
      <Scene lang="en" />
      <Fit lang="en" />
      <Case lang="en" />
      <Wzornik lang="en" />
      <Steps lang="en" />
      <Close lang="en" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="cli"
    title="Freelance web developer in Wrocław: apps, sites, WCAG"
    description="Freelance developer in Wrocław: web apps and websites for companies, from the quote to maintenance. Front end, back end, deployment and WCAG accessibility."
  />
);
