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
          through Cloudflare Workers to my private Telegram chat. In a Cloudflare D1 database I
          store only the date, language, chosen service, budget, the page the form was sent from,
          the traffic source and a promo code, to count requests. Your contact details and project
          description are not stored in any database. Cloudflare and Telegram process the data as
          providers under their own privacy statements, including outside the European Economic
          Area.
        </p>
        <p>
          I use this data only to answer your request and prepare an offer. The legal basis is steps
          taken at your request before entering into a contract (Art. 6(1)(b) GDPR). Giving a
          contact is voluntary, but without it I cannot reply.
        </p>
        <h2 id="scanner">Accessibility scanner</h2>
        <p>
          The free accessibility scanner at /skaner/ is a service governed by its Polish terms at
          /regulamin-skanera/. I, Adrian Turbiński (Adrian Turbiński Software, Wrocław,
          contact@adrianturbinski.pl), am the controller.
        </p>
        <p>
          I collect the website address you enter, your email, your IP address, browser user agent,
          the time you sent the form and pressed the confirmation button on the page opened from the
          email link, the exact text and SHA-256 version of the terms and consent clauses you saw,
          the state of both checkboxes and any withdrawal. The report itself holds test results,
          screenshots and HTML snippets of the scanned site.
        </p>
        <p>
          Purposes and legal bases: confirming your email, running the scan, storing the report and
          emailing the link rest on the contract for the free service (Art. 6(1)(b) GDPR). Keeping
          proof of what you accepted rests on my duty to demonstrate consent (Art. 7(1) with Art.
          6(1)(c) GDPR) and my legitimate interest in defending claims (Art. 6(1)(f) GDPR). Up to 4
          marketing emails within 14 days about accessibility audits, WCAG and EAA fixes and an
          invitation to talk are sent only with your separate consent (Art. 6(1)(a) GDPR and Art.
          398 of the Polish Electronic Communications Law). Rate limits, Cloudflare Turnstile and a
          short notification to me rest on my legitimate interest in protecting the service (Art.
          6(1)(f) GDPR).
        </p>
        <p>
          Recipients: Cloudflare, Inc. (Workers, D1, R2) and Resend, run by Plus Five Five, Inc.,
          both in the United States and certified under the EU-US Data Privacy Framework, so
          transfers rely on the European Commission adequacy decision (Art. 45 GDPR). The scan
          itself runs on my server in Poland. The Telegram notification carries only the scanned
          domain, the number of issues and whether you consented to marketing, never your email or
          IP; Telegram may process it outside the EEA under its own policy.
        </p>
        <p>
          Retention: the report is deleted 30 days after the scan; an order not confirmed with the
          button within 24 hours is deleted no later than 48 hours after the form was sent; the
          order record and proof of your choices stay until 31 December of the third calendar year
          after the year the order was confirmed, matching the limitation period for business claims
          under Polish law; marketing data stays until you withdraw consent or the last email of the
          sequence is sent, with proof of consent and withdrawal kept until 31 December of the third
          calendar year after that. A daily job deletes expired data, so it is gone within a day
          after each period ends.
        </p>
        <p>
          You have the right to access, rectify, erase, restrict and port your data, to object to
          processing based on my legitimate interest (Art. 21 GDPR) and to object to marketing at
          any time, to withdraw consent at any time through the link in every email or by writing to
          contact@adrianturbinski.pl without affecting earlier processing, and to lodge a complaint
          with the Polish supervisory authority (UODO). The website address and email are needed to
          deliver a report; marketing consent is optional. The scanner is automated but does not
          profile you or take decisions about you within the meaning of Art. 22 GDPR.
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
          I also use Microsoft Clarity from Microsoft Corporation if you consent in the banner.
          Clarity collects data on how you scroll and where you click on my website. Based on the
          generated click heat maps and session replays I try to identify the parts of the site that
          may need improvement. All form fields, including the entire quote form, are masked in
          Clarity, so nothing you type is sent to it. Clarity stores the cookies _clck (for one
          year) and _clsk (for one day). Microsoft also stores cookies of its own, such as MUID (for
          one year). This processing is based on your consent (Article 6(1)(a) GDPR). Microsoft may
          process your data in the United States, under the EU-US Data Privacy Framework.
        </p>
        <p>
          If you do not consent, Clarity is not loaded at all. If you withdraw your consent using
          Statistics settings in the footer, the data collection stops and the _clck and _clsk
          cookies are deleted.
        </p>
        <h2>My publishing tools</h2>
        <p>
          I have a personal tool that serves my needs. It pushes my posts to my LinkedIn, my
          articles to this site and DEV Community, and my short videos to my own YouTube, Instagram,
          Facebook and TikTok accounts. My video and post metrics (views, shares, comments,
          reactions) are pulled from the official APIs of these services to help me decide what to
          make next.
        </p>
        <ul>
          <li>The tool only acts on my own account, with my own authorisation.</li>
          <li>
            No data about other users of these platforms is collected, stored or processed by the
            tool.
          </li>
          <li>
            The data stays on my own computer. I do not sell it, share it or use it for advertising.
          </li>
          <li>I can revoke the access at any time in the account settings of each platform.</li>
        </ul>
        <h2>Your rights</h2>
        <p>
          If you wrote to me, I keep the message only as long as the conversation needs it. You can
          ask me to delete it, or to show what I hold about you, by writing to
          contact@adrianturbinski.pl. You can also complain to the Polish data protection authority
          (UODO).
        </p>
        <p>Last updated: 30 October 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    path="/en/privacy/"
    title="Privacy policy, Adrian Turbiński"
    description="What this website, the accessibility scanner and the publishing tools of Adrian Turbiński Software do with data."
  />
);
