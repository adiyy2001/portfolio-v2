import React from 'react';
import { Link } from 'gatsby';
import Close from './close';
import Hero from './hero';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import Steps from './steps';
import Tags from './tags';
import CompanyFacts from './trust';
import { quoteId } from './quote';
import { routes, tie } from '../i18n';
import { serviceKeys, services } from '../services';

const copy = {
  pl: {
    sr: 'O mnie, ',
    title: 'Programista | z Wrocławia.',
    lead: 'Jestem Adrian Turbiński, freelancer z Wrocławia. Robię aplikacje webowe i strony dla firm.',
    lead2: 'Od wyceny przez wdrożenie po utrzymanie rozmawiasz bezpośrednio ze mną.',
    quote: 'Wyceń projekt',
    contact: 'Dane kontaktowe',
    whoTitle: 'Kim jestem.',
    whoLead:
      'Programuję aplikacje webowe od 2019 roku, najczęściej w Angularze, TypeScripcie, RxJS i Node.js.',
    whoBody: [
      'Pracuję jako freelancer. Mam jednoosobową firmę we Wrocławiu i wystawiam faktury VAT dla firm.',
      'Na spotkanie przyjadę we Wrocławiu i na Dolnym Śląsku. Z resztą kraju wystarczy nam wideorozmowa. Projekt mogę prowadzić po polsku albo po angielsku.',
    ],
    stackLabel: 'Stos technologiczny',
    stackBig: 'od 2019',
    stack: ['Angular', 'TypeScript', 'RxJS i NgRx', 'Node.js', 'WCAG 2.1 AA'],
    doTitle: 'Co robię.',
    doLabel: 'Usługi',
    doSide: 'Do każdej usługi jest osobna strona z ceną i pytaniami.',
    stepsTitle: 'Jak pracuję.',
    expTitle: 'Doświadczenie.',
    expLabel: 'Gdzie się tego nauczyłem',
    expSide:
      'Z dużych projektów biorę to, co przydaje się małej firmie: porządny kod, testy i dostępność.',
    exp: [
      'Energetyka. W PSE Innowacje poprowadziłem prototyp aplikacji, która modeluje i pokazuje w przeglądarce linie wysokiego napięcia. Dziś rośnie z niego system produkcyjny, a ja odpowiadam za jego architekturę. Z tą samą starannością robię panel klienta albo stronę Twojej firmy.',
      'Agencja. W Media Hunters prowadziłem jako Tech Lead kilka aplikacji rozwijanych latami. Dodałem automatyczne testy i wdrożenia, interfejsy robiłem pod WCAG, a mój zespół zbudował TailorCloth. Stąd nawyk, który dostajesz w każdym projekcie: strona po oddaniu ma dalej działać, a nie tylko dobrze wyglądać w dniu startu.',
    ],
    expLink: 'Strona dla rekrutera',
    workTitle: 'Realizacje.',
    workLabel: 'Wybrane projekty dla firm',
    workSide: 'Każdy projekt ma osobną stronę z opisem.',
    work: [
      {
        to: routes.case.pl,
        name: 'TailorCloth',
        place: 'Kraków',
        short:
          'Strona na Odoo i własne moduły do zarządzania produktami dla firmy krawieckiej. Zrobiona z zespołem, który prowadziłem w Media Hunters.',
        meta: 'firma krawiecka',
      },
      {
        to: '/archive/rewektor/',
        name: 'ReWektor',
        place: 'Wrocław',
        short:
          'Strona z wystawą odnowionych mebli i panel, w którym właściciel sam dodaje kolejne.',
        meta: 'firma stolarska',
      },
      {
        to: '/archive/psi-pawer/',
        name: 'Psi Pawer',
        place: 'Wrocław',
        short: 'Przeróbka strony na Wixie: nowy krój, czytelna oferta i pomiary przed i po.',
        meta: 'behawiorystka psów',
      },
    ],
  },
  en: {
    sr: 'About, ',
    title: 'A developer | from Wrocław.',
    lead: "I'm Adrian Turbiński, a freelance developer from Wrocław. I build web applications and websites for companies.",
    lead2: 'From the quote through launch to maintenance, you talk to me directly.',
    quote: 'Get a quote',
    contact: 'Contact details',
    whoTitle: 'Who I am.',
    whoLead:
      'I have built web applications since 2019, mostly in Angular, TypeScript, RxJS and Node.js.',
    whoBody: [
      'I work as a freelancer. I run a sole proprietorship in Wrocław and issue VAT invoices to companies.',
      'In Wrocław and Lower Silesia I can come to a meeting in person. Anywhere else a video call is enough. I can run the project in Polish or in English.',
    ],
    stackLabel: 'Tech stack',
    stackBig: 'since 2019',
    stack: ['Angular', 'TypeScript', 'RxJS and NgRx', 'Node.js', 'WCAG 2.1 AA'],
    doTitle: 'What I do.',
    doLabel: 'Services',
    doSide: 'Every service has its own page with a price and questions.',
    stepsTitle: 'How I work.',
    expTitle: 'Experience.',
    expLabel: 'Where I learned it',
    expSide:
      'From large projects I take what a small business needs: clean code, tests and accessibility.',
    exp: [
      'Energy. At PSE Innowacje I led the prototype of an application that models high-voltage power lines and shows them in the browser. It is now growing into a production system, and I am responsible for its architecture. I bring the same care to a customer portal or a website for your company.',
      'Agency. At Media Hunters I was the Tech Lead on several applications developed over years. I added automated tests and deployments, built interfaces to WCAG, and my team built TailorCloth. That is where the habit comes from: a site should keep working after handover, not just look good on launch day.',
    ],
    expLink: 'Page for recruiters',
    workTitle: 'Projects.',
    workLabel: 'Selected projects for companies',
    workSide: 'Each project has its own page with a description.',
    work: [
      {
        to: routes.case.en,
        name: 'TailorCloth',
        place: 'Kraków',
        short:
          'An Odoo website with custom modules for managing products, for a tailoring company. Built with the team I led at Media Hunters.',
        meta: 'a tailoring company',
      },
      {
        to: '/archive/rewektor/',
        name: 'ReWektor',
        place: 'Wrocław',
        short:
          'A website with a showcase of restored furniture and an admin panel where the owner adds new pieces. The page is in Polish.',
        meta: 'a carpentry business',
        polish: true,
      },
      {
        to: '/archive/psi-pawer/',
        name: 'Psi Pawer',
        place: 'Wrocław',
        short:
          'A rework of a website on Wix: a new typeface, a clear offer and measurements before and after. The page is in Polish.',
        meta: 'a dog behaviourist',
        polish: true,
      },
    ],
  },
};

export default function About({ lang }) {
  const t = copy[lang];
  return (
    <>
      <Hero id="about-h" sr={t.sr} title={t.title} size="cli" aside={<Tags lang={lang} />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(t.lead)}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(t.lead2)}
        </p>
        <div className="cta" data-rise style={{ '--r': 2 }}>
          <Magnet className="btn" href={`#${quoteId[lang]}`} data-cta="about-quote">
            {tie(t.quote)}
          </Magnet>
          <Link className="link" to={routes.contact[lang]}>
            {t.contact}
          </Link>
        </div>
      </Hero>
      <section className="paper fit" aria-labelledby="about-who-h">
        <div className="fit__grid">
          <div className="fit__text">
            <h2 className="h2" id="about-who-h">
              <Split text={t.whoTitle} onView />
            </h2>
            <p className="fit__lead">{tie(t.whoLead)}</p>
            {t.whoBody.map(text => (
              <p className="fit__body" key={text}>
                {tie(text)}
              </p>
            ))}
          </div>
          <Reveal className="care" role="group" aria-label={t.stackLabel}>
            <p className="care__big">{t.stackBig}</p>
            <ul className="care__list">
              {t.stack.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <section className="who" aria-labelledby="about-do-h">
        <div className="sec-head">
          <h2 className="h2" id="about-do-h">
            <Split text={t.doTitle} onView />
            <span className="h2__label">{t.doLabel}</span>
          </h2>
          <p className="sec-head__side">{tie(t.doSide)}</p>
        </div>
        <ol className="who__list">
          {serviceKeys.map((key, i) => (
            <Reveal as="li" className="who__item" key={key} style={{ '--i': i }}>
              <span>
                <Link className="who__name" to={routes[`svc-${key}`][lang]}>
                  {tie(services[key][lang].name)}
                </Link>
                <span className="who__short">{tie(services[key][lang].short)}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </section>
      <Steps lang={lang} title={t.stepsTitle} />
      <section className="trust" aria-labelledby="about-exp-h">
        <div className="sec-head">
          <h2 className="h2" id="about-exp-h">
            <Split text={t.expTitle} onView />
            <span className="h2__label">{t.expLabel}</span>
          </h2>
          <p className="sec-head__side">{tie(t.expSide)}</p>
        </div>
        <div className="trust__text">
          {t.exp.map(text => (
            <p key={text}>{tie(text)}</p>
          ))}
          <p>
            <Link className="link" to={routes.rec[lang]}>
              {t.expLink}
            </Link>
          </p>
        </div>
      </section>
      <section className="paper rack-svc" aria-labelledby="about-work-h">
        <div className="sec-head">
          <h2 className="h2" id="about-work-h">
            <Split text={t.workTitle} onView />
            <span className="h2__label">{t.workLabel}</span>
          </h2>
          <p className="sec-head__side">{tie(t.workSide)}</p>
        </div>
        <ul className="rack-svc__list">
          {t.work.map((item, i) => (
            <Reveal as="li" className="rack-svc__item" key={item.name} style={{ '--i': i }}>
              <Link
                className="rack-svc__link"
                to={item.to}
                hrefLang={item.polish ? 'pl' : undefined}>
                <span className="rack-svc__name">{item.name}</span>
                <span className="rack-svc__short">{tie(item.short)}</span>
                <span className="rack-svc__price">
                  {item.place} <small>{tie(item.meta)}</small>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
      <CompanyFacts lang={lang} />
      <Close lang={lang} edition="cli" />
    </>
  );
}
