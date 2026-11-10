import React from 'react';
import Split from './split';
import { tie } from '../i18n';

const copy = {
  pl: {
    title: 'Dane firmy.',
    label: 'Jednoosobowa działalność',
    side: 'Wystawiam faktury VAT dla firm.',
    items: [
      ['Nazwa', 'Adrian Turbiński, jednoosobowa działalność gospodarcza'],
      ['NIP', '8952236530'],
      ['REGON', '520691289'],
      ['Status VAT', 'czynny podatnik VAT'],
      ['Data rejestracji', '3 stycznia 2022'],
      ['Miasto', 'Wrocław'],
    ],
  },
  en: {
    title: 'Company details.',
    label: 'Sole proprietorship',
    side: 'I issue VAT invoices to companies.',
    items: [
      ['Business name', 'Adrian Turbiński, sole proprietorship'],
      ['Tax ID (NIP)', '8952236530'],
      ['REGON', '520691289'],
      ['VAT status', 'active VAT payer'],
      ['Registered', '3 January 2022'],
      ['City', 'Wrocław'],
    ],
  },
};

export function Facts({ items, label }) {
  return (
    <dl className="facts" aria-label={label}>
      {items.map(([name, value]) => (
        <div className="facts__row" key={name}>
          <dt>{name}</dt>
          <dd>{typeof value === 'string' ? tie(value) : value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CompanyFacts({ lang, paper }) {
  const t = copy[lang];
  return (
    <section className={paper ? 'paper trust' : 'trust'} aria-labelledby="company-h">
      <div className="sec-head">
        <h2 className="h2" id="company-h">
          <Split text={t.title} onView />
          <span className="h2__label">{t.label}</span>
        </h2>
        <p className="sec-head__side">{tie(t.side)}</p>
      </div>
      <Facts items={t.items} label={t.title} />
    </section>
  );
}
