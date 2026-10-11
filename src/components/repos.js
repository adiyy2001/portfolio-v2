import React, { useEffect, useRef, useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import { useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';

const list = [
  {
    id: 'flagtide',
    size: [960, 540],
    line: 'Angular, TypeScript, RxJS, Java, Quarkus, WebSockets',
    pl: 'Serwis feature flag z propagacją na żywo. Back-end w Quarkusie, SDK w Angularze na npm, ten sam wynik w Javie i TypeScripcie.',
    en: 'A feature flag service with live propagation. A Quarkus back end, an Angular SDK on npm, the same answer in Java and TypeScript.',
  },
  {
    id: 'gridtwin',
    size: [900, 563],
    line: 'Angular, TypeScript, Three.js, Java, Quarkus, WebSockets',
    pl: 'Cyfrowy bliźniak sieci przesyłowej. Rozpływ mocy zgodny z MATPOWER, schemat jednokreskowy i stacja 3D w Angularze, back-end w Javie i Quarkusie.',
    en: 'A digital twin of a transmission network. A power flow that matches MATPOWER, a single-line diagram and a 3D substation in Angular, a Java and Quarkus back end.',
  },
  {
    id: 'coschema',
    size: [820, 564],
    line: 'Angular, TypeScript, Signals, Node.js, WebSockets, Yjs',
    pl: 'Edytor diagramów do pracy w kilka osób naraz. Angular, własny serwer synchronizacji na Yjs i symulator, który sprawdza zbieżność na 5000 przebiegów.',
    en: 'A real-time collaborative diagram editor. Angular, a sync server of my own on Yjs, and a simulator that checks convergence over 5,000 runs.',
  },
  {
    id: 'signal-timeline',
    size: [960, 540],
    line: 'Angular, TypeScript, NgRx SignalStore, Signals, npm',
    pl: 'Cofanie i historia dla NgRx SignalStore na npm. Gałęzie, skok do dowolnego wpisu i tani zapis każdej zmiany.',
    en: 'Undo and history for NgRx SignalStore on npm. Branches, a jump to any entry and cheap recording of every change.',
  },
  {
    id: 'eventhorizon',
    size: [760, 600],
    line: 'TypeScript, WebGPU, WGSL, Playwright',
    pl: 'Ray tracer w czasie rzeczywistym, który zakrzywia światło wokół czarnej dziury Schwarzschilda. Shadery WGSL sprawdzane z referencją w float64.',
    en: 'A real-time ray tracer that bends light around a Schwarzschild black hole. WGSL shaders checked against a float64 reference.',
  },
  {
    id: 'fieldline',
    size: [1000, 624],
    line: 'Angular, TypeScript, WebGPU, WGSL, NgRx SignalStore, Web Workers',
    pl: 'Pole elektryczne i magnetyczne wokół linii wysokiego napięcia liczone na GPU, z konturami ekspozycji i optymalizatorem faz. Model 2D odtwarza 13 z 14 przypadków z opublikowanego badania.',
    en: 'The electric and magnetic field around a high-voltage line computed on the GPU, with exposure contours and a phasing optimizer. The 2D model reproduces 13 of 14 cases from a published study.',
  },
];

const copy = {
  pl: {
    title: 'Otwarty kod.',
    lead: 'Sześć publicznych repozytoriów z demo na żywo. Każde ma stronę o tym, po co powstało, co było trudne, co zmierzyłem i czego nie zbudowałem.',
  },
  en: {
    title: 'Open source.',
    lead: 'Six public repositories with live demos. Each has a page on why it exists, what was hard, what I measured and what I did not build.',
  },
};

function Shot({ id, size: [width, height], live }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = video.current;
    if (live) node.play().catch(() => {});
    else node.pause();
  }, [live]);

  const media = path => withPrefix(`/media/${id}-${path}`);
  return (
    <span className="repos__shot">
      <img
        src={media('poster.webp')}
        width={width}
        height={height}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <video
        ref={video}
        className={live && playing ? 'is-on' : undefined}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}>
        <source src={media('demo.webm')} type="video/webm" />
        <source src={media('demo.mp4')} type="video/mp4" />
      </video>
    </span>
  );
}

function Card({ item, lang }) {
  const reduce = useReducedMotion();
  const [live, setLive] = useState(false);
  const wake = () => setLive(!reduce);
  const rest = () => setLive(false);
  return (
    <Link
      className="repos__card"
      to={routes[item.id][lang]}
      onPointerEnter={event => {
        if (event.pointerType === 'mouse') wake();
      }}
      onPointerLeave={rest}
      onFocus={wake}
      onBlur={rest}>
      <Shot id={item.id} size={item.size} live={live} />
      <span className="repos__name">{item.id}</span>
      <span className="repos__desc">{tie(item[lang])}</span>
      <span className="repos__tech">{item.line}</span>
    </Link>
  );
}

export default function Repos({ lang, id }) {
  const t = copy[lang];
  return (
    <section className="repos" aria-labelledby={`${id}-h`}>
      <div className="repos__head">
        <h2 className="h2" id={`${id}-h`}>
          <Split text={t.title} onView />
        </h2>
        <p className="repos__lead">{tie(t.lead)}</p>
      </div>
      <ul className="repos__grid">
        {list.map(item => (
          <Reveal as="li" key={item.id} viewport={{ once: true, amount: 0.1 }}>
            <Card item={item} lang={lang} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
