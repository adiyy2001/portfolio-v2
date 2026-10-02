import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { tie } from '../i18n';
import { instant } from '../motion';

const copy = {
  pl: {
    title: 'Jak to szyjemy.',
    note: 'przymiarek bywa więcej niż jedna',
    steps: [
      {
        name: 'Miara.',
        text: 'Rozmawiamy o tym, co aplikacja ma robić i dla kogo. Spisuję zakres i wyceniam go.',
      },
      {
        name: 'Przymiarki.',
        text: 'Widzisz działające wersje w trakcie, nie dopiero na końcu. Uwagi wchodzą od razu.',
      },
      {
        name: 'Oddanie.',
        text: 'Wdrażam aplikację na produkcję. Kod i dostępy zostają u ciebie.',
      },
      {
        name: 'Poprawki.',
        text: 'Po starcie zostaję przy aplikacji. Naprawiam błędy, aktualizuję zależności i dokładam funkcje, kiedy ich potrzebujesz.',
      },
    ],
  },
  en: {
    title: 'How we sew it.',
    note: "there's usually more than one fitting",
    steps: [
      {
        name: 'Measure.',
        text: 'We talk about what the app should do and for whom. I write down the scope and price it.',
      },
      {
        name: 'Fittings.',
        text: 'You see working versions along the way, not only at the end. Changes go in right away.',
      },
      {
        name: 'Handover.',
        text: 'I deploy the app to production. The code and the access stay with you.',
      },
      {
        name: 'Alterations.',
        text: 'After launch I stay with the app. I fix bugs, update dependencies and add features when you need them.',
      },
    ],
  },
};

export default function Steps({ lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();

  return (
    <section className="paper steps" aria-labelledby="steps-h">
      <div className="sec-head">
        <h2 className="h2" id="steps-h">
          <Split text={t.title} onView />
        </h2>
      </div>
      <ol className="steps__list">
        {t.steps.map(({ name, text }) => (
          <Reveal as="li" className="step" key={name}>
            <h3 className="step__name">{name}</h3>
            <p className="step__text">{tie(text)}</p>
          </Reveal>
        ))}
      </ol>
      <m.p
        className="hand-note"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={reduce ? instant : { duration: 0.7, delay: 0.3 }}>
        {tie(t.note)}
      </m.p>
    </section>
  );
}
