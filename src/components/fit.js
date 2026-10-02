import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { instant } from '../motion';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';

const mail = 'adrian.turbinski@gmail.com';

const copy = {
  standard: 'WCAG 2.1 AA',
  pl: {
    id: 'dostepnosc',
    title: 'Pasuje na każdego.',
    lead: 'Sprawdzam i poprawiam aplikacje pod WCAG 2.1 na poziomie AA: obsługa z klawiatury, czytniki ekranu, kontrast, fokus, formularze.',
    body: 'Robiłem to w interfejsach pełnych diagramów. Od 28 czerwca 2025 Europejski akt o dostępności obejmuje w UE między innymi sklepy internetowe i bankowość.',
    cta: 'Zapytaj o dostępność',
    subject: 'Dostępność',
    careLabel: 'Co sprawdzam',
    checks: [
      'klawiatura',
      'czytnik ekranu',
      'kontrast 4,5:1',
      'widoczny fokus',
      'etykiety formularzy',
      'ograniczone animacje',
    ],
    foot: 'Skład: semantyczny HTML, ARIA tylko tam, gdzie trzeba.',
  },
  en: {
    id: 'accessibility',
    title: 'Fits everyone.',
    lead: 'I check and fix apps against WCAG 2.1 level AA: keyboard use, screen readers, contrast, focus, forms.',
    body: "I've done it in diagram-heavy interfaces. Since 28 June 2025 the European Accessibility Act covers online shops and banking in the EU, among other services.",
    cta: 'Ask about accessibility',
    subject: 'Accessibility',
    careLabel: 'What I check',
    checks: [
      'keyboard',
      'screen reader',
      'contrast 4.5:1',
      'visible focus',
      'form labels',
      'reduced motion',
    ],
    foot: 'Contents: semantic HTML, ARIA only where needed.',
  },
};

const seen = { once: true, amount: 0.6 };

export default function Fit({ lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const underline = {
    bare: { strokeDashoffset: 1 },
    drawn: {
      strokeDashoffset: 0,
      transition: reduce ? instant : { duration: 1, delay: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="paper fit" id={t.id} aria-labelledby="fit-h">
      <div className="fit__grid">
        <div className="fit__text">
          <h2 className="h2" id="fit-h">
            <m.span className="fit__u" initial="bare" whileInView="drawn" viewport={seen}>
              <Split text={t.title} onView />
              <svg
                viewBox="0 0 400 16"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false">
                <m.path
                  className="stroke fit__stroke"
                  pathLength="1"
                  strokeWidth="3"
                  d="M3 9C80 3 150 13 220 7S340 10 397 5"
                  vectorEffect="non-scaling-stroke"
                  variants={underline}
                />
              </svg>
            </m.span>
          </h2>
          <p className="fit__lead">{tie(t.lead)}</p>
          <p className="fit__body">{tie(t.body)}</p>
          <Magnet
            className="btn btn--wool"
            href={`mailto:${mail}?subject=${encodeURIComponent(t.subject)}`}>
            {tie(t.cta)}
          </Magnet>
        </div>
        <Reveal className="care" role="group" aria-label={t.careLabel}>
          <p className="care__big">{copy.standard}</p>
          <ul className="care__list">
            {t.checks.map(check => (
              <li key={check}>{tie(check)}</li>
            ))}
          </ul>
          <p className="care__foot">{tie(t.foot)}</p>
        </Reveal>
      </div>
    </section>
  );
}
