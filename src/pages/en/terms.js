import React from 'react';
import Hero from '../../components/hero';
import Seo from '../../components/seo';
import { tie } from '../../i18n';

export default function Terms() {
  return (
    <>
      <Hero id="terms-h" sr="Terms of service, " title="Terms of | service." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('The rules for this website and my publishing tools, in plain words.')}
        </p>
      </Hero>
      <section className="prose" aria-label="Terms of service">
        <h2>Who runs it</h2>
        <p>
          Adrian Turbiński, a sole proprietor trading as Adrian Turbiński Software, Wrocław, Poland.
          Contact: contact@adrianturbinski.pl.
        </p>
        <h2>This website</h2>
        <p>
          You can read, link to and share the pages of this website. The texts, graphics, code
          samples and downloads stay my property unless a page says otherwise. The free downloads,
          such as the website brief template and the cost sheet, may be used and edited for your own
          projects, but not resold as your own product.
        </p>
        <p>
          The guides and articles are general information, not legal or financial advice. Prices on
          the service pages are starting points; the binding price is the one in a written offer.
        </p>
        <h2>My publishing tools</h2>
        <p>
          Reels Studio is a private tool I use to publish my own short videos and posts to my own
          accounts on YouTube, Instagram, Facebook, TikTok, LinkedIn and DEV Community. It is not
          offered to other users and nobody else can sign in to it.
        </p>
        <ul>
          <li>It acts only on my own accounts, with my own authorisation.</li>
          <li>Every video is reviewed and approved by me before it is published.</li>
          <li>It follows the terms and developer policies of each platform it connects to.</li>
          <li>I can revoke its access at any time in the settings of each platform.</li>
        </ul>
        <h2>Liability</h2>
        <p>
          I take care that the information here is correct and current, but I cannot guarantee that
          it is free of errors. Links to other websites are provided for convenience; I am not
          responsible for their content.
        </p>
        <h2>Law and contact</h2>
        <p>
          Polish law applies. Questions about these terms go to contact@adrianturbinski.pl. How I
          handle data is described in the privacy policy.
        </p>
        <p>Last updated: 28 October 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    path="/en/terms/"
    title="Terms of service, Adrian Turbiński"
    description="Terms of use for the website and the publishing tools of Adrian Turbiński Software."
  />
);
