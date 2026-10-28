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
          Adrian Turbiński, sole proprietor trading as Adrian Turbiński Software, Wrocław, Poland.
          Email: contact@adrianturbinski.pl.
        </p>
        <h2>This site</h2>
        <p>
          You are free to view, link to and share any page on this website. Unless stated otherwise,
          all content on this site (including text, images, code and downloads) is owned by me. The
          downloads (including the cost sheet and the website brief template) can be modified and
          used in your own projects, but must not be resold as your own product.
        </p>
        <p>
          The articles and guides are general information and do not constitute legal or financial
          advice. The prices on the service pages are starting points. The binding price is the one
          in a written offer.
        </p>
        <h2>My publishing tool</h2>
        <p>
          Reels Studio is my personal tool for publishing my own short videos and posts to my own
          accounts on YouTube, Instagram, Facebook, TikTok, LinkedIn and DEV Community. It is not
          available to the public, and no other person can log in to it.
        </p>
        <ul>
          <li>It only acts on my own accounts and with my own permission.</li>
          <li>Every video is reviewed and approved by me before it is published.</li>
          <li>It follows the terms and developer policies of each platform it connects to.</li>
          <li>I can revoke its access at any time in the settings of each platform.</li>
        </ul>
        <h2>Liability</h2>
        <p>
          I try to keep the content on this site accurate and up to date, but I do not guarantee
          that it is free of errors. Links to external websites are provided for your convenience,
          and I am not responsible for the content of those sites.
        </p>
        <h2>Jurisdiction and contact</h2>
        <p>
          This site is governed by Polish law. For questions about these terms, email me at
          contact@adrianturbinski.pl. How I handle data is described in the privacy policy.
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
