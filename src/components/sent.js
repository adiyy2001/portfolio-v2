import React from 'react';
import { Link } from 'gatsby';
import Hero from './hero';
import { routes, tie } from '../i18n';
import { phone } from '../services';

const copy = {
  pl: {
    title: 'Zapytanie | dotarło.',
    lead: 'Dziękuję. Odpowiem na podany kontakt z wyceną na piśmie, zwykle w ciągu dwóch dni roboczych.',
    urgent: `Pilna sprawa? Zadzwoń: ${phone.label}.`,
    back: 'Wróć na stronę główną',
    more: 'Zobacz usługi i ceny',
  },
  en: {
    title: 'Request | received.',
    lead: 'Thank you. I will reply to the contact you gave with a written quote, usually within two working days.',
    urgent: `Urgent? Call ${phone.intl}.`,
    back: 'Back to the home page',
    more: 'See services and prices',
  },
};

export default function Sent({ lang }) {
  const t = copy[lang];
  return (
    <Hero id="sent-h" title={t.title} size="work">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        {tie(t.lead)}
      </p>
      <p className="lead2" data-rise style={{ '--r': 1 }}>
        <a href={phone.href}>{tie(t.urgent)}</a>
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <Link className="btn" to={routes.home[lang]}>
          {tie(t.back)}
        </Link>
        <Link className="link" to={routes.services[lang]}>
          {tie(t.more)}
        </Link>
      </div>
    </Hero>
  );
}
