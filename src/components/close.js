import React from 'react';
import { Link } from 'gatsby';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';

const mail = 'adrian.turbinski@gmail.com';

const links = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6' },
  { name: 'GitHub', href: 'https://github.com/adiyy2001' },
];

const copy = {
  pl: {
    recCloseTitle: 'Porozmawiajmy o roli.',
    recHint: 'Napisz, jaki to zespół, jaki produkt i jaki stack.',
    recMail2: 'Napisz do mnie',
    recPrint2: 'CV do druku',
    recCross: 'Masz projekt do zrobienia? Jest też edycja dla klienta.',
  },
  en: {
    recCloseTitle: "Let's talk about the role.",
    recHint: 'Tell me about the team, the product and the stack.',
    recMail2: 'Write to me',
    recPrint2: 'Printable resume',
    recCross: "Got a project to build? There's a client edition too.",
  },
};

export default function Close({ lang }) {
  const t = copy[lang];
  return (
    <section className="close" aria-labelledby="rec-close-h">
      <h2 className="h2 close__h" id="rec-close-h">
        <Split text={t.recCloseTitle} onView />
      </h2>
      <Reveal className="close__grid">
        <div className="close__act">
          <a className="close__mail" href={`mailto:${mail}`}>
            {mail}
          </a>
          <p className="close__hint">{tie(t.recHint)}</p>
          <div className="cta">
            <Magnet className="btn" href={`mailto:${mail}`}>
              {tie(t.recMail2)}
            </Magnet>
            <button type="button" className="btn btn--line" onClick={() => window.print()}>
              {tie(t.recPrint2)}
            </button>
          </div>
        </div>
        <ul className="close__links">
          {links.map(({ name, href }) => (
            <li key={name}>
              <a href={href} rel="noopener">
                <span>{name}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <Link className="cross" to={routes.cli[lang]}>
        <span>{tie(t.recCross)}</span>
        <svg viewBox="0 0 40 18" aria-hidden="true">
          <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
        </svg>
      </Link>
    </section>
  );
}
