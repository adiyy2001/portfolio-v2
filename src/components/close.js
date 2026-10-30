import React from 'react';
import { Link } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Dock from './dock';
import Magnet from './magnet';
import Quote from './quote';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { phone } from '../services';
import { duration, ease, instant } from '../motion';

const mail = 'adrian.turbinski@gmail.com';

const links = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/adrianturbinski' },
  { name: 'GitHub', href: 'https://github.com/adiyy2001' },
];

const copy = {
  pl: {
    recCloseTitle: 'Porozmawiajmy o roli.',
    recHint: 'Napisz, jaki to zespół, jaki produkt i jaki stack.',
    recMail2: 'Napisz do mnie',
    recPrint2: 'CV do druku',
    repoCv: 'Doświadczenie i CV',
    recCross: 'Masz projekt do zrobienia? Jest też edycja dla klienta.',
    cliId: 'kontakt',
    cliSubject: 'Projekt',
    cliCloseTitle: 'Masz projekt? Napisz.',
    cliHint: 'Wolisz bez formularza? Napisz albo zadzwoń, wystarczy kilka zdań o projekcie.',
    cliCross: 'Rekrutujesz? Jest też edycja dla rekrutera.',
    signSmall: 'Adrian Turbiński, programista z Wrocławia',
  },
  en: {
    recCloseTitle: "Let's talk about the role.",
    recHint: 'Tell me about the team, the product and the stack.',
    recMail2: 'Write to me',
    recPrint2: 'Printable resume',
    repoCv: 'Experience and resume',
    recCross: "Got a project to build? There's a client edition too.",
    cliId: 'contact',
    cliSubject: 'Project',
    cliCloseTitle: 'Got a project? Write.',
    cliHint: 'Prefer no form? Write or call, a few sentences about the project are enough.',
    cliCross: "Hiring? There's a recruiter edition too.",
    signSmall: 'Adrian Turbiński, developer from Wrocław',
  },
};

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1 },
};

const drawing = {
  pathLength: { duration: duration.thread, delay: 0.3, ease: ease.draw },
  opacity: { duration: 0, delay: 0.3 },
};

function Sign({ small }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className="sign"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}>
      <p className="sign__hand" aria-hidden="true">
        Adrian
        <svg viewBox="0 0 300 22" preserveAspectRatio="none">
          <m.path
            className="stroke sign__stroke"
            strokeWidth="2.4"
            d="M4 14C60 4 120 18 180 9S260 12 296 6"
            vectorEffect="non-scaling-stroke"
            variants={draw}
            transition={reduce ? instant : drawing}
          />
        </svg>
      </p>
      <p className="sign__small">{tie(small)}</p>
    </m.div>
  );
}

export default function Close({ lang, edition = 'rec', service }) {
  const t = copy[lang];
  const cli = edition === 'cli';
  const headingId = `${edition}-close-h`;
  const mailto = cli ? `mailto:${mail}?subject=${t.cliSubject}` : `mailto:${mail}`;
  const text = cli
    ? {
        title: t.cliCloseTitle,
        hint: t.cliHint,
        cross: t.cliCross,
        to: routes.rec[lang],
      }
    : {
        title: t.recCloseTitle,
        hint: t.recHint,
        cta: t.recMail2,
        cross: t.recCross,
        to: routes.home[lang],
      };

  return (
    <section className="close" id={cli ? t.cliId : undefined} aria-labelledby={headingId}>
      <h2 className="h2 close__h" id={headingId}>
        <Split text={text.title} onView />
      </h2>
      <Reveal className={cli ? 'close__grid close__grid--quote' : 'close__grid'}>
        {cli && <Quote lang={lang} service={service} />}
        <div className="close__act">
          <a className="close__mail" href={mailto}>
            {mail}
          </a>
          {cli && (
            <a className="close__tel" href={phone.href}>
              {lang === 'pl' ? phone.label : phone.intl}
            </a>
          )}
          <p className="close__hint">{tie(text.hint)}</p>
          {!cli && (
            <div className="cta">
              <Magnet className="btn" href={mailto}>
                {tie(text.cta)}
              </Magnet>
              {edition === 'rec' && (
                <button type="button" className="btn btn--line" onClick={() => window.print()}>
                  {tie(t.recPrint2)}
                </button>
              )}
              {edition === 'repo' && (
                <Link className="btn btn--line" to={routes.rec[lang]}>
                  {tie(t.repoCv)}
                </Link>
              )}
            </div>
          )}
        </div>
        <ul className="close__links">
          {links.map(({ name, href }) => (
            <li key={name}>
              <a href={href} rel="noopener">
                <span>{name}</span>
                <svg viewBox="0 0 40 18" aria-hidden="true">
                  <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <Link className="cross" to={text.to}>
        <span>{tie(text.cross)}</span>
        <svg viewBox="0 0 40 18" aria-hidden="true">
          <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
        </svg>
      </Link>
      {cli && <Sign small={t.signSmall} />}
      {cli && <Dock lang={lang} />}
    </section>
  );
}
