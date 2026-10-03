import React, { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';
import { ease, instant } from '../motion';
import Reveal from './reveal';
import Split from './split';

const copy = {
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  nowAt: '97.917%',
  bars: [
    { id: 'brainode', l: '7.292%', w: '17.708%', lane: 0, full: 'BRAINODE', short: 'BRAINODE' },
    { id: 'cobiro', l: '38.542%', w: '7.292%', lane: 0, full: 'Cobiro', short: 'Cobiro' },
    { id: 'roche', l: '25%', w: '13.542%', lane: 1, full: 'Roche', short: 'Roche' },
    { id: 'ttms', l: '45.833%', w: '12.5%', lane: 1, full: 'TTMS', short: 'TTMS' },
    { id: 'mh', l: '58.333%', w: '16.667%', lane: 0, full: 'Media Hunters', short: 'MH' },
    { id: 'pse', l: '75%', w: '22.917%', lane: 1, full: 'PSE Innowacje', short: 'PSE' },
  ],
  jobs: [
    {
      id: 'pse',
      name: 'PSE Innowacje',
      role: 'Senior Software Engineer',
      tech: 'Angular 19, GoJS 3, TypeScript, RxJS, Java, Quarkus, Oracle, Jest, Karma',
    },
    {
      id: 'mh',
      name: 'Media Hunters',
      role: 'Tech Lead',
      tech: 'Angular, TypeScript, NgRx, RxJS, Node.js, Jest, Cypress',
    },
    {
      id: 'ttms',
      name: 'Transition Technologies MS',
      role: 'Software Engineer',
      tech: 'Angular, GoJS, NgRx, RxJS, Jest, Karma, Cypress',
    },
    {
      id: 'cobiro',
      name: 'Cobiro',
      role: 'Frontend Engineer',
      tech: 'Angular, JavaScript, Nx, CircleCI',
    },
    {
      id: 'roche',
      name: 'Roche',
      role: 'Frontend Engineer',
      tech: 'Angular, TypeScript, RxJS, Jest, Karma',
    },
    {
      id: 'brainode',
      name: 'BRAINODE',
      role: 'Junior Frontend Developer',
      tech: 'Angular, TypeScript, Three.js, WebGL, WebSockets',
    },
  ],
  pl: {
    id: 'doswiadczenie',
    title: 'Sześć firm od 2019.',
    note: 'taśma w latach, nie w centymetrach',
    now: 'dziś',
    jobsNote: 'Procenty przy pracach to moje szacunki z tamtych projektów, tak jak w CV.',
    detail: {
      pse: {
        when: 'od stycznia 2025, etat, Wrocław',
        desc: 'Poprowadziłem proof of concept aplikacji do modelowania i wizualizacji linii wysokiego napięcia, a teraz rozwijamy z niej system produkcyjny. Prowadzę architekturę całości, frontu i back-endu. Front to Angular 19 i GoJS, prowadziłem migrację na GoJS 3. Back-end zaprojektowałem w Quarkusie: przetwarzanie wsadowe, REST API, architektura heksagonalna, strojenie Oracle. W pięcioosobowym zespole wdrażam nowych inżynierów, ustalam standardy i strategię testów, robię code review.',
      },
      mh: {
        when: 'od września 2023 do grudnia 2024, samozatrudnienie',
        desc: 'Odpowiadałem za kilka długo rozwijanych aplikacji webowych, od kodu po decyzje architektoniczne. Zaprojektowałem i rozwijałem platformę SaaS dla wielu klientów naraz. Wprowadziłem CI i testy w Jest i Cypress. Interfejsy robiłem zgodnie z WCAG. Prowadziłem mały zespół i przeglądałem jego kod.',
        win: 'projekty o 30% sprawniejsze dzięki Agile i DevOps',
      },
      ttms: {
        when: 'od września 2022 do sierpnia 2023, samozatrudnienie, zdalnie',
        desc: 'Piaskownica, w której elektrycy projektują i sprawdzają złożone schematy, między innymi wież wysokiego napięcia. Grafowy stan interfejsu trzymałem w NgRx. Wdrożyłem WCAG 2.1 w interfejsie pełnym diagramów: klawiatura, czytniki ekranu i zarządzanie fokusem.',
        win: 'praca elektryków usprawniona o 25%',
      },
      cobiro: {
        when: 'od lutego 2022 do sierpnia 2022, samozatrudnienie',
        desc: 'Przebudowywałem stary front w stronę architektury heksagonalnej, małymi krokami, przy stabilnej produkcji. Pomogłem wprowadzić CI. Robiłem feature flagi do eksperymentów i stopniowych wdrożeń z szybkim wycofaniem.',
        win: 'o 40% mniej zduplikowanego kodu po przejściu na monorepo Nx',
      },
      roche: {
        when: 'od stycznia 2021 do stycznia 2022, kontrakt, zdalnie',
        desc: 'Wewnętrzne aplikacje, w których badacze analizują i walidują dane kliniczne. Środowisko regulowane, mała tolerancja na błędy. Przyspieszyłem je lazy loadingiem tras i oszczędniejszym użyciem API.',
      },
      brainode: {
        when: 'od sierpnia 2019 do grudnia 2020, kontrakt, hybrydowo',
        desc: 'Sklep z produktami pokazywanymi w 3D na żywo, w Angularze i Three.js. Współtworzyłem własną warstwę renderowania w WebGL. Zrobiłem wymianę walut w czasie rzeczywistym na WebSocketach, odporną na niestabilną sieć.',
      },
    },
  },
  en: {
    id: 'experience',
    title: 'Six companies since 2019.',
    note: 'a tape in years, not inches',
    now: 'today',
    jobsNote:
      'The percentages next to jobs are my own estimates from those projects, as in my resume.',
    detail: {
      pse: {
        when: 'since January 2025, full-time, Wrocław',
        desc: 'I led the proof of concept of an app that models and visualizes high-voltage power lines, and now we are growing it into the production system. I lead the architecture of the whole thing, frontend and backend. The frontend is Angular 19 and GoJS, and I drove the migration to GoJS 3. I designed the backend layer in Quarkus: batch processing, REST API, hexagonal architecture, Oracle tuning. In a team of five I onboard new engineers, set standards and the testing strategy, and review code.',
      },
      mh: {
        when: 'September 2023 to December 2024, self-employed',
        desc: 'I was responsible for several long-lived web apps, from the code to the architecture decisions. I designed and evolved a multi-tenant SaaS platform. I introduced CI and tests in Jest and Cypress. I built the interfaces to WCAG. I led a small team and reviewed its code.',
        win: 'projects 30% more efficient through Agile and DevOps',
      },
      ttms: {
        when: 'September 2022 to August 2023, self-employed, remote',
        desc: 'A sandbox where electricians design and validate complex diagrams, high-voltage towers among them. I kept the graph-shaped UI state in NgRx. I implemented WCAG 2.1 in a diagram-heavy interface: keyboard, screen readers and focus management.',
        win: "electricians' workflows improved by 25%",
      },
      cobiro: {
        when: 'February 2022 to August 2022, self-employed',
        desc: 'I moved a legacy frontend towards hexagonal architecture in small steps, keeping production stable. I helped introduce CI. I built feature flags for experiments and gradual rollouts with fast rollback.',
        win: '40% less duplicated code after the move to an Nx monorepo',
      },
      roche: {
        when: 'January 2021 to January 2022, contract, remote',
        desc: 'Internal apps where researchers analyze and validate clinical data. A regulated environment with little tolerance for errors. I made them faster with route-based lazy loading and leaner API usage.',
      },
      brainode: {
        when: 'August 2019 to December 2020, contract, hybrid',
        desc: 'A high-end shop with real-time 3D product views, in Angular and Three.js. I helped build a custom WebGL rendering layer. I implemented real-time currency exchange over WebSockets that holds up on unstable networks.',
      },
    },
  },
};

const grow = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1 },
};

const wipe = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  shown: { clipPath: 'inset(0 0% 0 0)' },
};

const fade = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

export default function Experience({ lang }) {
  const { years, nowAt, bars, jobs } = copy;
  const t = copy[lang];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);

  return (
    <section className="paper exp" id={t.id} aria-labelledby="exp-h">
      <div className="sec-head">
        <h2 className="h2" id="exp-h">
          <Split text={t.title} onView />
        </h2>
        <m.p
          className="hand-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={reduce ? instant : { duration: 0.7, delay: 0.3 }}>
          {tie(t.note)}
        </m.p>
      </div>
      <m.div
        className="tl"
        aria-hidden="true"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}>
        <ol className="tl__years">
          {years.map((year, i) => (
            <li key={year} style={{ left: `${i * 12.5}%` }}>
              {year}
            </li>
          ))}
        </ol>
        <m.div
          className="tl__ruler"
          variants={grow}
          transition={{ duration: 1.3, ease: ease.out }}
        />
        <div className="tl__lanes">
          {bars.map((bar, i) => (
            <m.span
              key={bar.id}
              className={active === bar.id ? 'tl__seg is-on' : 'tl__seg'}
              data-job={bar.id}
              style={{ '--l': bar.l, '--w': bar.w, '--lane': bar.lane }}
              variants={wipe}
              transition={
                reduce ? instant : { duration: 0.7, ease: ease.out, delay: 0.5 + i * 0.14 }
              }>
              <span className="tl__full">{bar.full}</span>
              <span className="tl__short">{bar.short}</span>
            </m.span>
          ))}
        </div>
        <m.span
          className="tl__now"
          style={{ '--l': nowAt }}
          variants={fade}
          transition={reduce ? instant : { duration: 0.5, delay: 1.5 }}>
          <span>{tie(t.now)}</span>
        </m.span>
      </m.div>
      <ol className="jobs">
        {jobs.map(job => {
          const { when, desc, win } = t.detail[job.id];
          return (
            <Reveal
              as="li"
              key={job.id}
              className="job"
              data-job={job.id}
              onPointerEnter={event => {
                if (!reduce && event.pointerType === 'mouse') setActive(job.id);
              }}
              onPointerLeave={() => setActive(null)}>
              <div className="job__main">
                <h3 className="job__name">{job.name}</h3>
                <p className="job__role">{job.role}</p>
                <p className="job__when">{tie(when)}</p>
              </div>
              <div className="job__body">
                <p className="job__desc">{tie(desc)}</p>
                {win && <p className="job__win">{tie(win)}</p>}
                <p className="job__tech">{job.tech}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
      <p className="jobs__note">{tie(t.jobsNote)}</p>
    </section>
  );
}
