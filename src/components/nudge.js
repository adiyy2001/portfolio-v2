import React from 'react';
import Magnet from './magnet';
import { quoteId } from './quote';
import { tie } from '../i18n';
import { phone } from '../services';

const copy = {
  pl: {
    id: 'zapytaj',
    title: 'Masz podobny projekt?',
    text: 'Opisz go w kilku zdaniach. Wycenę na piśmie dostajesz w dwa dni robocze.',
    cta: 'Wyceń projekt',
    call: 'albo zadzwoń:',
  },
  en: {
    id: 'ask',
    title: 'Got a similar project?',
    text: 'Describe it in a few sentences. You get a written quote within two working days.',
    cta: 'Get a quote',
    call: 'or call',
  },
};

export default function Nudge({ lang }) {
  const t = copy[lang];
  const headingId = `${t.id}-h`;
  return (
    <section className="nudge" id={t.id} aria-labelledby={headingId}>
      <h2 className="nudge__h" id={headingId}>
        {tie(t.title)}
      </h2>
      <p className="nudge__text">{tie(t.text)}</p>
      <div className="cta nudge__cta">
        <Magnet className="btn" href={`#${quoteId[lang]}`} data-cta="mid-quote">
          {tie(t.cta)}
        </Magnet>
        <p className="nudge__call">
          {t.call} <a href={phone.href}>{lang === 'pl' ? phone.label : phone.intl}</a>
        </p>
      </div>
    </section>
  );
}
