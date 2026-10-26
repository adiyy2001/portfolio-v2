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
          The website has no forms. Its host, GitHub Pages, keeps standard server logs, including IP
          addresses, under its own privacy statement. I count visits with GoatCounter, a cookieless
          counter that stores no personal data.
        </p>
        <h2>Google Analytics</h2>
        <p>
          If you agree in the banner, Google Analytics 4 from Google Ireland Limited sets the
          cookies _ga and _ga_YPZS4964X7 for up to two years, so I can see which pages get read and
          where visitors come from. The legal basis is your consent (Article 6(1)(a) GDPR). Google
          may process the data in the United States under the EU-US Data Privacy Framework. I keep
          the reports for 14 months, and advertising features stay off.
        </p>
        <p>
          Until you agree, Google Analytics only receives cookieless signals without identifiers.
          You can change your choice at any time with Statistics settings in the footer; withdrawing
          consent removes the cookies.
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
          <li>
            The data stays on my own computer. I do not sell it, share it or use it for advertising.
          </li>
          <li>I can revoke the access at any time in my LinkedIn and DEV account settings.</li>
        </ul>
        <h2>Your rights</h2>
        <p>
          If you wrote to me, I keep the message only as long as the conversation needs it. You can
          ask me to delete it, or to show what I hold about you, by writing to
          contact@adrianturbinski.pl. You can also complain to the Polish data protection authority
          (UODO).
        </p>
        <p>Last updated: 26 October 2026.</p>
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
