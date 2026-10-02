import React from 'react';
import Hero from '../../components/hero';
import Seo from '../../components/seo';

export default function Recruiter() {
  return (
    <Hero id="rec-h" sr="Adrian Turbiński, " title="Senior frontend. | Tech lead." size="rec">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Angular, TypeScript, RxJS and Node.js since 2019. At PSE Innowacje I&apos;m building an app
        that models and visualizes high-voltage power lines.
      </p>
      <p className="lead2" data-rise style={{ '--r': 1 }}>
        I design frontend and backend architecture, I&apos;ve led a small team, I onboard new
        engineers.
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <a className="btn" href="mailto:adrian.turbinski@gmail.com">
          Write to me
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
    lang="en"
    view="rec"
    title="Adrian Turbiński for recruiters: senior frontend, tech lead"
    description="Senior frontend developer and tech lead from Wrocław. Angular, TypeScript, RxJS and Node.js since 2019. Printable resume."
  />
);
