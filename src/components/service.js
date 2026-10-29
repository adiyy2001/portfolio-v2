import React from 'react';
import { Link } from 'gatsby';
import Case from './case';
import Close from './close';
import GuideShelf from './guides';
import Hero from './hero';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import Steps from './steps';
import { Tag } from './tags';
import { briefPath, routes, tie } from '../i18n';
import { phone, serviceKeys, services, servicesIndex } from '../services';
import { quoteId } from './quote';

const copy = {
  pl: {
    write: 'Wyceń projekt',
    call: `Zadzwoń: ${phone.label}`,
    includedTitle: 'Co dostajesz.',
    includedLabel: 'W cenie',
    whoTitle: 'Dla kogo.',
    samples: 'Przykładowe strony we Wzorniku',
    stepsTitle: 'Jak to szyjemy.',
    faqTitle: 'Pytania.',
    moreTitle: 'Inne usługi.',
    rackTitle: 'Cennik na wieszaku.',
    rackLabel: 'Ceny usług',
    rackLead: 'Ceny od, netto, dla typowego zakresu. Dokładną wycenę dostajesz na piśmie.',
    all: 'Wszystkie usługi i ceny',
    price: 'Cena',
    packagesTitle: 'Pakiety.',
    popular: 'Najczęściej',
    excludedTitle: 'Poza ceną',
    measureTitle: 'Co mierzymy.',
    measureLead: 'Przed startem spisujemy liczby, po miesiącu liczymy je drugi raz.',
  },
  en: {
    write: 'Get a quote',
    call: `Call: ${phone.intl}`,
    includedTitle: 'What you get.',
    includedLabel: 'Included',
    whoTitle: 'Who it is for.',
    samples: 'Sample sites in the Wzornik (Polish)',
    stepsTitle: 'How we sew it.',
    faqTitle: 'Questions.',
    moreTitle: 'Other services.',
    rackTitle: 'Prices on the rack.',
    rackLabel: 'Service prices',
    rackLead: 'Starting prices, net, for a typical scope. You get an exact written quote.',
    all: 'All services and prices',
    price: 'Price',
    packagesTitle: 'Packages.',
    popular: 'Most often',
    excludedTitle: 'Not in the price',
    measureTitle: 'What we measure.',
    measureLead: 'We write the numbers down before the start and count them again after a month.',
    briefLead: 'Preparing to ask for a quote? Fill in the free',
    briefLink: 'website brief template',
  },
};

function BriefNote({ lang, className }) {
  const t = copy[lang];
  if (!t.briefLead) return null;
  return (
    <p className={className}>
      {tie(t.briefLead)}{' '}
      <Link className="link" to={briefPath} data-cta="brief-link">
        {t.briefLink}
      </Link>
      .
    </p>
  );
}

function PriceTag({ s, n = 0, tilt = -2 }) {
  return (
    <Tag n={n} tilt={tilt}>
      <div>
        <p className="tags__name">{tie(s.price)}</p>
        <p className="tags__role">{tie(s.priceNote)}</p>
        <p className="tags__meta">{tie(s.time)}</p>
      </div>
    </Tag>
  );
}

function Contact({ lang }) {
  const t = copy[lang];
  return (
    <div className="cta" data-rise style={{ '--r': 1 }}>
      <Magnet className="btn" href={`#${quoteId[lang]}`} data-cta="service-quote">
        {tie(t.write)}
      </Magnet>
      <a className="link" href={phone.href}>
        {t.call}
      </a>
    </div>
  );
}

function Rack({ lang, current, headingId, title, label, lead, paper, children }) {
  const keys = serviceKeys.filter(key => key !== current);
  return (
    <section className={paper ? 'paper rack-svc' : 'rack-svc'} aria-labelledby={headingId}>
      <div className="sec-head">
        <h2 className="h2" id={headingId}>
          <Split text={title} onView />
          {label && <span className="h2__label">{label}</span>}
        </h2>
      </div>
      {lead && <p className="rack-svc__lead">{tie(lead)}</p>}
      <ul className="rack-svc__list">
        {keys.map((key, i) => {
          const s = services[key][lang];
          return (
            <Reveal as="li" className="rack-svc__item" key={key} style={{ '--i': i }}>
              <Link className="rack-svc__link" to={routes[`svc-${key}`][lang]}>
                <span className="rack-svc__name">{tie(s.name)}</span>
                <span className="rack-svc__short">{tie(s.short)}</span>
                <span className="rack-svc__price">
                  {tie(s.price)} <small>{tie(s.priceNote)}</small>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
      {children}
    </section>
  );
}

export function ServiceRack({ lang }) {
  const t = copy[lang];
  return (
    <Rack
      lang={lang}
      headingId="rack-svc-h"
      title={t.rackTitle}
      label={t.rackLabel}
      lead={t.rackLead}>
      <p className="rack-svc__all">
        <Link className="link" to={routes.services[lang]}>
          {tie(t.all)}
        </Link>
      </p>
      <BriefNote lang={lang} className="rack-svc__brief" />
    </Rack>
  );
}

export function ServicesIndex({ lang }) {
  const t = servicesIndex[lang];
  return (
    <>
      <Hero
        id="svc-h"
        title={t.title}
        size="work"
        aside={
          <div className="tags svc-price" role="group" aria-label={t.rateLabel}>
            <div className="tags__stack">
              <Tag n={0} tilt={-2}>
                <div>
                  <p className="tags__name">{tie(t.rate)}</p>
                  <p className="tags__role">{tie(t.rateNote)}</p>
                  <p className="tags__meta">{tie(t.rateMeta)}</p>
                </div>
              </Tag>
            </div>
          </div>
        }>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(t.lead)}
        </p>
        <Contact lang={lang} />
      </Hero>
      <Rack lang={lang} headingId="svc-list-h" title={`${t.label}.`} paper />
      {lang === 'pl' && <GuideShelf />}
      <Close lang={lang} edition="cli" />
    </>
  );
}

export default function Service({ id, lang }) {
  const s = services[id][lang];
  const t = copy[lang];
  return (
    <>
      <Hero
        id="svc-h"
        sr={`${s.name}, `}
        title={s.title}
        size="work"
        aside={
          <div className="tags svc-price" role="group" aria-label={t.price}>
            <div className="tags__stack">
              <PriceTag s={s} />
            </div>
          </div>
        }>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(s.lead)}
        </p>
        <Contact lang={lang} />
      </Hero>
      <section className="paper fit" aria-labelledby="svc-in-h">
        <div className="fit__grid">
          <div className="fit__text">
            <h2 className="h2" id="svc-in-h">
              <Split text={t.includedTitle} onView />
            </h2>
            <p className="fit__lead">{tie(s.body)}</p>
            <p className="fit__body">{tie(s.foot)}</p>
          </div>
          <Reveal className="care" role="group" aria-label={t.includedLabel}>
            <p className="care__big">{tie(s.time)}</p>
            <ul className="care__list">
              {s.includes.map(item => (
                <li key={item}>{tie(item)}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      {s.packages && (
        <section className="packs" aria-labelledby="packs-h">
          <div className="sec-head">
            <h2 className="h2" id="packs-h">
              <Split text={t.packagesTitle} onView />
            </h2>
            <p className="sec-head__side">{tie(s.packagesLead)}</p>
          </div>
          <ol className="packs__list">
            {s.packages.map((pack, i) => (
              <Reveal
                as="li"
                className={i === 1 ? 'packs__item packs__item--mid' : 'packs__item'}
                key={pack.name}
                style={{ '--i': i }}>
                {i === 1 && <span className="packs__flag">{tie(t.popular)}</span>}
                <h3 className="packs__name">{tie(pack.name)}</h3>
                <p className="packs__price">
                  {tie(pack.price)}
                  {pack.monthly && <small>+ {tie(pack.monthly)}</small>}
                </p>
                <p className="packs__time">{tie(pack.time)}</p>
                <p className="packs__text">{tie(pack.text)}</p>
                <ul className="packs__items">
                  {pack.items.map(item => (
                    <li key={item}>{tie(item)}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
          {s.care && <p className="packs__care">{tie(s.care)}</p>}
          {s.excluded && (
            <div className="packs__out">
              <h3 className="packs__out-h">{tie(t.excludedTitle)}</h3>
              <ul className="packs__out-list">
                {s.excluded.map(item => (
                  <li key={item}>{tie(item)}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
      <section className="who" aria-labelledby="who-h">
        <div className="sec-head">
          <h2 className="h2" id="who-h">
            <Split text={t.whoTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(s.whoLead)}</p>
        </div>
        <ol className="who__list">
          {s.who.map((item, i) => (
            <Reveal as="li" className="who__item" key={item} style={{ '--i': i }}>
              {tie(item)}
            </Reveal>
          ))}
        </ol>
        {id === 'sites' && (
          <p className="who__more">
            <a className="link" href="/wzornik/">
              {tie(t.samples)}
            </a>
          </p>
        )}
        {id === 'apps' && <BriefNote lang={lang} className="who__more" />}
      </section>
      <Steps lang={lang} items={s.steps} title={t.stepsTitle} />
      {s.measure && (
        <section className="measure" aria-labelledby="measure-h">
          <div className="sec-head">
            <h2 className="h2" id="measure-h">
              <Split text={t.measureTitle} onView />
            </h2>
            <p className="sec-head__side">{tie(t.measureLead)}</p>
          </div>
          <ol className="measure__list">
            {s.measure.map((item, i) => (
              <Reveal as="li" className="measure__item" key={item} style={{ '--i': i }}>
                {tie(item)}
              </Reveal>
            ))}
          </ol>
        </section>
      )}
      {services[id].proof && <Case lang={lang} />}
      <section className="faq" aria-labelledby="faq-h">
        <div className="sec-head">
          <h2 className="h2" id="faq-h">
            <Split text={t.faqTitle} onView />
          </h2>
        </div>
        <div className="faq__list">
          {s.faq.map(([q, a]) => (
            <details className="faq__item" key={q}>
              <summary className="faq__q">{tie(q)}</summary>
              <p className="faq__a">{tie(a)}</p>
            </details>
          ))}
        </div>
      </section>
      <Rack lang={lang} current={id} headingId="svc-more-h" title={t.moreTitle} />
      <Close lang={lang} edition="cli" service={id} />
    </>
  );
}
