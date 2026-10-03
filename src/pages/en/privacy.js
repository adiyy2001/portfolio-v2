import React from 'react';
import Hero from '../../components/hero';
import Seo from '../../components/seo';
import { tie } from '../../i18n';

export default function Privacy() {
  return (
    <>
      <Hero id="privacy-h" sr="Privacy policy, " title="Privacy | policy." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('What this website and my tools do with data, in plain words.')}
        </p>
      </Hero>
      <section className="prose" aria-label="Privacy policy">
        <h2>Who is responsible</h2>
        <p>
          Adrian Turbiński, a sole proprietor trading as Adrian Turbiński Software, Wrocław, Poland.
          Contact: contact@adrianturbinski.pl.
        </p>
        <h2>This website</h2>
        <p>
          The website sets no cookies and has no forms. Its host, GitHub Pages, keeps standard server
          logs, including IP addresses, under its own privacy statement. If I add a visitor counter,
          it will be a cookieless one that stores no personal data, and this page will say so.
        </p>
        <h2>My publishing tools</h2>
        <p>
          I run a private tool for my own work. It publishes my posts to my LinkedIn profile and my
          articles to this website and to DEV Community, and it reads the statistics of my own posts
          (impressions, reactions, comments, shares) through the official LinkedIn and DEV APIs to
          plan what I write next.
        </p>
        <ul>
          <li>The tool only acts on my own account, with my own authorisation.</li>
          <li>It does not collect, store or process data about other LinkedIn members.</li>
          <li>The data stays on my own computer. I do not sell it, share it or use it for advertising.</li>
          <li>I can revoke the access at any time in my LinkedIn and DEV account settings.</li>
        </ul>
        <h2>Your rights</h2>
        <p>
          If you wrote to me, I keep the message only as long as the conversation needs it. You can ask me
          to delete it, or to show what I hold about you, by writing to contact@adrianturbinski.pl. You can
          also complain to the Polish data protection authority (UODO).
        </p>
        <p>Last updated: 3 October 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    path="/en/privacy/"
    title="Privacy policy, Adrian Turbiński"
    description="What this website and the publishing tools of Adrian Turbiński Software do with data."
  />
);
