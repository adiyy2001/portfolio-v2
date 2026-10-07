import React from 'react';
import { Link } from 'gatsby';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';

const list = [
  {
    id: 'flagtide',
    line: 'Angular, TypeScript, RxJS, Java, Quarkus, WebSockets',
    pl: 'Serwis feature flag z propagacją na żywo. Back-end w Quarkusie, SDK w Angularze na npm, ten sam wynik w Javie i TypeScripcie.',
    en: 'A feature flag service with live propagation. A Quarkus back end, an Angular SDK on npm, the same answer in Java and TypeScript.',
  },
  {
    id: 'gridtwin',
    line: 'Angular, TypeScript, Three.js, Java, Quarkus, WebSockets',
    pl: 'Cyfrowy bliźniak sieci przesyłowej. Rozpływ mocy zgodny z MATPOWER, schemat jednokreskowy i stacja 3D w Angularze, back-end w Javie i Quarkusie.',
    en: 'A digital twin of a transmission network. A power flow that matches MATPOWER, a single-line diagram and a 3D substation in Angular, a Java and Quarkus back end.',
  },
  {
    id: 'coschema',
    line: 'Angular, TypeScript, Signals, Node.js, WebSockets, Yjs',
    pl: 'Edytor diagramów do pracy w kilka osób naraz. Angular, własny serwer synchronizacji na Yjs i symulator, który sprawdza zbieżność na 5000 przebiegów.',
    en: 'A real-time collaborative diagram editor. Angular, a sync server of my own on Yjs, and a simulator that checks convergence over 5,000 runs.',
  },
];

const copy = {
  pl: {
    title: 'Otwarty kod.',
    lead: 'Trzy publiczne repozytoria z demo na żywo. Każde ma stronę o tym, po co powstało, co było trudne, co zmierzyłem i czego nie zbudowałem.',
  },
  en: {
    title: 'Open source.',
    lead: 'Three public repositories with live demos. Each has a page on why it exists, what was hard, what I measured and what I did not build.',
  },
};

const arrow = (
  <svg viewBox="0 0 40 18" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
  </svg>
);

export default function Repos({ lang, id }) {
  const t = copy[lang];
  return (
    <section className="repos" aria-labelledby={`${id}-h`}>
      <div className="sec-head">
        <h2 className="h2" id={`${id}-h`}>
          <Split text={t.title} onView />
        </h2>
        <p className="sec-head__side">{tie(t.lead)}</p>
      </div>
      <ul className="repos__list">
        {list.map(item => (
          <Reveal as="li" key={item.id}>
            <Link className="repos__item" to={routes[item.id][lang]}>
              <span className="repos__name">{item.id}</span>
              <span className="repos__text">
                <span className="repos__desc">{tie(item[lang])}</span>
                <span className="repos__tech">{item.line}</span>
              </span>
              <span className="repos__go">{arrow}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
