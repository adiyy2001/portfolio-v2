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
          Its host, GitHub Pages, keeps standard server logs, including IP addresses, under its own
          privacy statement. I count visits and clicks on the contact buttons with GoatCounter, a
          cookieless counter that stores no personal data.
        </p>
        <h2>Quote form</h2>
        <p>
          The form sends what you type (service, budget, project description and email or phone)
          through Cloudflare Workers to my private Telegram chat. I do not store this data in any
          database. Cloudflare and Telegram process it as providers under their own privacy
          statements, including outside the European Economic Area.
        </p>
        <p>
          I use this data only to answer your request and prepare an offer. The legal basis is steps
          taken at your request before entering into a contract (Art. 6(1)(b) GDPR). Giving a
          contact is voluntary, but without it I cannot reply.
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
        <h2>Microsoft Clarity</h2>
        <p>
          If you agree in the banner, I also load Microsoft Clarity from Microsoft Corporation. It
          records how you scroll and where you click, and I look at the resulting click maps and
          session recordings to find the parts of the site that are unclear. Form fields, including
          the whole quote form, are masked, so what you type never reaches Clarity. Clarity sets the
          cookies _clck (one year) and _clsk (one day), and Microsoft sets its own, such as MUID
          (one year). The legal basis is your consent (Article 6(1)(a) GDPR). Microsoft may process
          the data in the United States under the EU-US Data Privacy Framework.
        </p>
        <p>
          Without consent Clarity does not load at all. Withdrawing consent with Statistics settings
          in the footer stops the recording and removes the _clck and _clsk cookies.
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
