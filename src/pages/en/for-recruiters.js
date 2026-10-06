import React from 'react';
import Card from '../../components/card';
import Close from '../../components/close';
import Experience from '../../components/experience';
import Hero from '../../components/hero';
import Kit from '../../components/kit';
import Magnet from '../../components/magnet';
import Seo from '../../components/seo';
import Writing from '../../components/writing';
import { tie } from '../../i18n';

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
        aside={<Card lang="en" />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(
            "Angular, TypeScript, RxJS and Node.js since 2019. At PSE Innowacje I'm building an app that models and visualizes high-voltage power lines.",
          )}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(
            "I design frontend and backend architecture, I've led a small team, I onboard new engineers.",
          )}
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <Magnet className="btn" href="mailto:adrian.turbinski@gmail.com">
            Write to me
          </Magnet>
          <button type="button" className="btn btn--line" onClick={() => window.print()}>
            Printable resume
          </button>
          <a
            className="link"
            href="https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6"
            rel="noopener">
            LinkedIn
          </a>
        </div>
      </Hero>
      <Experience lang="en" />
      <Kit lang="en" />
      <Writing lang="en" />
      <Close lang="en" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="rec"
    title="Senior Angular developer Wrocław, tech lead: Adrian Turbiński"
    description="Senior frontend developer and tech lead from Wrocław. Angular, TypeScript, RxJS and Node.js since 2019. Printable resume."
  />
);
