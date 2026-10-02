import React from 'react';
import Reveal from './reveal';
import Split from './split';
import { tie } from '../i18n';

const copy = {
  pl: {
    kitTitle: 'Czym pracuję.',
    k2: 'Diagramy i 3D',
    k3v: 'Node.js, Java i Quarkus, REST API, WebSockets, Oracle',
    k4: 'Testy i wdrożenia',
    k5: 'Architektura',
    k5v: 'architektura heksagonalna, DDD, monorepo Nx, feature flagi',
    k6: 'Dostępność',
    k6v: 'WCAG 2.1, klawiatura, czytniki ekranu, zarządzanie fokusem',
    k7: 'Projekt UI',
    k8: 'Sposób pracy',
    k8v: 'Scrum, code review, testy jednostkowe, integracyjne i e2e, optymalizacja wydajności',
    k9: 'Języki',
    k9v: 'polski ojczysty, angielski C1',
  },
  en: {
    kitTitle: 'What I work with.',
    k2: 'Diagrams and 3D',
    k3v: 'Node.js, Java and Quarkus, REST API, WebSockets, Oracle',
    k4: 'Testing and delivery',
    k5: 'Architecture',
    k5v: 'hexagonal architecture, DDD, Nx monorepo, feature flags',
    k6: 'Accessibility',
    k6v: 'WCAG 2.1, keyboard, screen readers, focus management',
    k7: 'UI design',
    k8: 'How I work',
    k8v: 'Scrum, code review, unit, integration and e2e tests, performance optimization',
    k9: 'Languages',
    k9v: 'Polish native, English C1',
  },
};

export default function Kit({ lang }) {
  const t = copy[lang];
  const rows = [
    ['Front-end', 'Angular, TypeScript, JavaScript, RxJS, Signals, NgRx, SignalStore, React'],
    [t.k2, 'GoJS, Three.js, WebGL'],
    ['Back-end', t.k3v],
    [t.k4, 'Jest, Karma, Jasmine, Cypress, Docker, GitHub Actions, CircleCI, Webpack, Git'],
    [t.k5, t.k5v],
    [t.k6, t.k6v],
    [t.k7, 'Figma, SCSS, Angular Material'],
    [t.k8, t.k8v],
    [t.k9, t.k9v],
  ];

  return (
    <section className="kit" aria-labelledby="kit-h">
      <div className="sec-head">
        <h2 className="h2" id="kit-h">
          <Split text={t.kitTitle} onView />
        </h2>
      </div>
      <dl className="spec">
        {rows.map(([term, detail]) => (
          <Reveal as="div" key={term}>
            <dt>{tie(term)}</dt>
            <dd>{tie(detail)}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
