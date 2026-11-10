import React from 'react';
import Close from './close';
import Hero from './hero';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import { Tag } from './tags';
import CompanyFacts, { Facts } from './trust';
import { quoteId } from './quote';
import { tie } from '../i18n';
import { phone } from '../services';

const mail = 'contact@adrianturbinski.pl';

const copy = {
  pl: {
    sr: 'Kontakt, ',
    title: 'Napisz | albo zadzwoń.',
    lead: 'Rozmawiasz bezpośrednio ze mną: telefon, e-mail albo formularz na dole tej strony.',
    lead2: 'Wycenę na piśmie dostajesz w dwa dni robocze.',
    quote: 'Wyceń projekt',
    call: `Zadzwoń: ${phone.intl}`,
    hoursLabel: 'Godziny pracy',
    hoursBig: '9:00 do 18:00',
    hoursRole: 'poniedziałek do piątku',
    hoursMeta: 'Wrocław i zdalnie',
    detailsTitle: 'Dane kontaktowe.',
    detailsLabel: 'Jak mnie złapać',
    detailsSide: 'Telefon, e-mail albo formularz niżej.',
    details: [
      ['Telefon', 'phone'],
      ['E-mail', 'mail'],
      ['Godziny', 'poniedziałek do piątku, 9:00 do 18:00'],
      ['Spotkania', 'Wrocław i Dolny Śląsk na miejscu, reszta kraju przez wideo'],
      ['Języki', 'polski i angielski'],
      ['Rozliczenie', 'faktura VAT B2B'],
    ],
    afterTitle: 'Po wiadomości.',
    afterLabel: 'Co dalej',
    afterSide: 'Od pierwszego pytania do wyceny.',
    after: [
      'Piszesz albo dzwonisz. Kilka zdań wystarczy: czym zajmuje się firma, co ma powstać i na kiedy.',
      'Rozmawiamy o zakresie: kto będzie korzystał z rozwiązania i co ma w nim zrobić. We Wrocławiu i na Dolnym Śląsku mogę przyjechać, z resztą kraju rozmawiamy przez wideo.',
      'Spisuję zakres, a wycenę na piśmie dostajesz w ciągu dwóch dni roboczych.',
      'Jeśli wycena ci odpowiada, ustalamy start. Rozliczam się na fakturę B2B.',
    ],
  },
  en: {
    sr: 'Contact, ',
    title: 'Write | or call.',
    lead: 'You talk to me directly: by phone, by email or with the form at the bottom of this page.',
    lead2: 'You get a written quote in two working days.',
    quote: 'Get a quote',
    call: `Call: ${phone.intl}`,
    hoursLabel: 'Working hours',
    hoursBig: '9:00 to 18:00',
    hoursRole: 'Monday to Friday',
    hoursMeta: 'Wrocław and remote',
    detailsTitle: 'Contact details.',
    detailsLabel: 'How to reach me',
    detailsSide: 'Phone, email or the form below.',
    details: [
      ['Phone', 'phone'],
      ['Email', 'mail'],
      ['Hours', 'Monday to Friday, 9:00 to 18:00'],
      ['Meetings', 'Wrocław and Lower Silesia in person, elsewhere by video'],
      ['Languages', 'Polish and English'],
      ['Billing', 'B2B VAT invoice'],
    ],
    afterTitle: 'After you write.',
    afterLabel: 'What happens next',
    afterSide: 'From the first question to the quote.',
    after: [
      'You write or call. A few sentences are enough: what the company does, what should be built and by when.',
      'We talk about the scope: who will use the solution and what it has to do. In Wrocław and Lower Silesia I can come over, elsewhere we talk by video.',
      'I write down the scope and you get a written quote within two working days.',
      'If the quote suits you, we agree on a start. I invoice B2B.',
    ],
  },
};

export default function Contact({ lang }) {
  const t = copy[lang];
  const details = t.details.map(([name, value]) => [
    name,
    value === 'phone' ? (
      <a className="facts__link" href={phone.href}>
        {phone.intl}
      </a>
    ) : value === 'mail' ? (
      <a className="facts__link" href={`mailto:${mail}`}>
        {mail}
      </a>
    ) : (
      value
    ),
  ]);
  return (
    <>
      <Hero
        id="contact-h"
        sr={t.sr}
        title={t.title}
        size="work"
        aside={
          <div className="tags svc-price" role="group" aria-label={t.hoursLabel}>
            <div className="tags__stack">
              <Tag n={0} tilt={-2}>
                <div>
                  <p className="tags__name">{tie(t.hoursBig)}</p>
                  <p className="tags__role">{tie(t.hoursRole)}</p>
                  <p className="tags__meta">{tie(t.hoursMeta)}</p>
                </div>
              </Tag>
            </div>
          </div>
        }>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(t.lead)}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(t.lead2)}
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <Magnet className="btn" href={`#${quoteId[lang]}`} data-cta="contact-quote">
            {tie(t.quote)}
          </Magnet>
          <a className="link" href={phone.href}>
            {t.call}
          </a>
        </div>
      </Hero>
      <section className="paper trust" aria-labelledby="details-h">
        <div className="sec-head">
          <h2 className="h2" id="details-h">
            <Split text={t.detailsTitle} onView />
            <span className="h2__label">{t.detailsLabel}</span>
          </h2>
          <p className="sec-head__side">{tie(t.detailsSide)}</p>
        </div>
        <Facts items={details} label={t.detailsTitle} />
      </section>
      <section className="who" aria-labelledby="after-h">
        <div className="sec-head">
          <h2 className="h2" id="after-h">
            <Split text={t.afterTitle} onView />
            <span className="h2__label">{t.afterLabel}</span>
          </h2>
          <p className="sec-head__side">{tie(t.afterSide)}</p>
        </div>
        <ol className="who__list">
          {t.after.map((item, i) => (
            <Reveal as="li" className="who__item" key={item} style={{ '--i': i }}>
              {tie(item)}
            </Reveal>
          ))}
        </ol>
      </section>
      <CompanyFacts lang={lang} paper />
      <Close lang={lang} edition="cli" />
    </>
  );
}
