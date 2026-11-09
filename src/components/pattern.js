import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { duration, ease, instant, spring, stagger } from '../motion';

const media = name => withPrefix(`/media/rewektor/${name}`);

const live = 'https://rewektor.com.pl/';

const useSafeLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const fields = [
  {
    id: 'nazwa',
    name: 'Nazwa',
    value: 'Stolik z maszyny',
    note: 'Nagłówek wpisu na wystawie. Numer obok nadaje strona sama.',
    panel: [0, 0, 100, 17.8],
    page: [0, 0, 57, 9.4],
  },
  {
    id: 'bylo',
    name: 'Było',
    value: 'maszyna do szycia',
    note: 'Od czego zaczęliśmy. Na stronie to największy tekst we wpisie, bo od niego zaczyna się historia mebla.',
    panel: [0, 17.8, 100, 19.5],
    page: [0, 9.4, 57, 51.3],
  },
  {
    id: 'jest',
    name: 'Jest',
    value: 'stolik',
    note: 'Czym mebel jest teraz. Na stronie i w panelu leży na desce, której słoje są rysowane w SVG.',
    panel: [0, 37.3, 100, 19.7],
    page: [0, 60.7, 57, 30.2],
  },
  {
    id: 'co',
    name: 'Co zrobiliśmy',
    value: 'Drewniany blat na żeliwnej podstawie maszyny.',
    note: 'Jedno, dwa zdania. Panel podpowiada długość, żeby wpis nie zamienił się w wypracowanie.',
    panel: [0, 57, 100, 17.2],
    page: [0, 90.9, 100, 9.1],
  },
  {
    id: 'zdjecia',
    name: 'Zdjęcia',
    value: 'Trzy',
    note: 'Do dwunastu, pierwsze jest główne. Każde wymaga opisu, więc na stronie nie ma zdjęcia bez tekstu alternatywnego.',
    panel: [0, 74.2, 65.7, 25.8],
    page: [57, 0, 43, 90.9],
  },
];

const cuts = [
  {
    id: 'sciana',
    name: 'Ściana',
    desc: 'Szeryfowy krój i zdjęcie w passe-partout, jak obraz w galerii.',
    alt: 'Kierunek Ściana: stolik z maszyny na stronie w stylu galerii, szeryfowe litery',
  },
  {
    id: 'rejestr',
    name: 'Rejestr',
    desc: 'Tabela z cienkimi liniami, jak księga z warsztatu. Wybrany.',
    alt: 'Kierunek Rejestr: stolik z maszyny w tabeli z liniami, pola Było i Jest',
    chosen: true,
  },
  {
    id: 'plakat',
    name: 'Plakat',
    desc: 'Wielkie wąskie litery i zieleń, jak afisz na płocie.',
    alt: 'Kierunek Plakat: duże napisy BYŁO i JEST na zielonym tle obok zdjęcia stolika',
  },
];

const spec = [
  [
    'Strona',
    'HTML składany przez PHP z bazy MySQL. Krój Switzer z własnego serwera, animacje w GSAP.',
  ],
  [
    'Panel',
    'Szkic albo „Na stronie”, kolejność strzałkami, do dwunastu zdjęć. Hasło tylko jako skrót PBKDF2, blokada po pięciu błędnych próbach.',
  ],
  ['Hosting', 'home.pl na koncie Wiktora. Strona, baza i domena są jego, nie moje.'],
  ['Drewno', 'Słoje rysowane w SVG. Zdjęcia z warsztatu jako tło były za głośne.'],
  [
    'Zdjęcia',
    'Panel zmniejsza je w przeglądarce do czterech szerokości WebP, od 480 do 1440 px. Telefon nie ciągnie wersji na monitor.',
  ],
  [
    'Google',
    'Canonical, Open Graph, JSON-LD, mapa strony ze zdjęciami i llms.txt z jednego skryptu.',
  ],
  ['Droga', 'Panel działał najpierw na Cloudflare. Potem przeniosłem go na PHP i MySQL u klienta.'],
];

const stack = ['PHP', 'MySQL', 'JavaScript', 'GSAP', 'SVG', 'home.pl'];

const box = (rect, area) => ({
  x: area.left + (rect[0] / 100) * area.width,
  y: area.top + (rect[1] / 100) * area.height,
  w: (rect[2] / 100) * area.width,
  h: (rect[3] / 100) * area.height,
});

const thread = (from, to) => {
  if (to.y > from.y + from.h) {
    const sx = from.x + 3;
    const sy = from.y + from.h / 2;
    const ex = to.x + 3;
    const ey = to.y + Math.min(to.h / 2, 40);
    return `M${sx} ${sy}C${sx - 34} ${sy} ${sx - 30} ${ey} ${ex} ${ey}`;
  }
  const sx = from.x + from.w;
  const sy = from.y + from.h / 2;
  const ex = to.x;
  const ey = to.y + to.h / 2;
  const sag = Math.abs(ex - sx) * 0.35 + 30;
  return `M${sx} ${sy}C${sx + sag} ${sy + sag} ${ex - sag} ${ey + sag} ${ex} ${ey}`;
};

const percent = rect => ({
  left: `${rect[0]}%`,
  top: `${rect[1]}%`,
  width: `${rect[2]}%`,
  height: `${rect[3]}%`,
});

function Pattern({ children }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);
  const stage = useRef(null);
  const panelShot = useRef(null);
  const pageShot = useRef(null);
  const tabs = useRef([]);
  const [path, setPath] = useState('');
  const field = fields[active];

  const measure = useCallback(() => {
    if (!stage.current || !panelShot.current || !pageShot.current) return;
    const origin = stage.current.getBoundingClientRect();
    const local = el => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - origin.left,
        top: r.top - origin.top,
        width: r.width,
        height: r.height,
      };
    };
    setPath(
      thread(box(field.panel, local(panelShot.current)), box(field.page, local(pageShot.current))),
    );
  }, [field]);

  useSafeLayout(() => {
    measure();
    if (typeof ResizeObserver === 'undefined' || !stage.current) return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(stage.current);
    return () => watch.disconnect();
  }, [measure]);

  const show = next => {
    setActive(next);
    const cloth = panelShot.current;
    if (!cloth) return;
    const box = cloth.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) {
      cloth.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  const pick = i => {
    const next = (i + fields.length) % fields.length;
    show(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  const onKey = event => {
    const keys = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: fields.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    pick(keys[event.key]);
  };

  const frame = reduce ? instant : { ...spring.pin, type: 'spring' };

  return (
    <>
      <div className="pat-hero__side">
        {children}
        <div className="pat-sheet">
          <p className="pat-sheet__label" id="pat-fields">
            {tie('Wykrój: jedno pole, dwa miejsca')}
          </p>
          <div className="pat-sheet__notches" role="tablist" aria-labelledby="pat-fields">
            {fields.map((item, i) => (
              <button
                key={item.id}
                ref={el => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`pat-tab-${item.id}`}
                aria-selected={i === active}
                aria-controls="pat-panel"
                tabIndex={i === active ? 0 : -1}
                className="pat-notch"
                onClick={() => show(i)}
                onKeyDown={onKey}>
                <span className="pat-notch__no" aria-hidden="true">
                  {i + 1}
                </span>
                {item.name}
              </button>
            ))}
          </div>
          <div
            className="pat-sheet__note"
            role="tabpanel"
            id="pat-panel"
            aria-labelledby={`pat-tab-${field.id}`}>
            <m.p
              key={field.id}
              className="pat-sheet__value"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? instant : { duration: duration.stitch, ease: ease.out }}>
              {field.value}
            </m.p>
            <p className="pat-sheet__text">{tie(field.note)}</p>
          </div>
        </div>
      </div>

      <div className="pat-stage" ref={stage}>
        <figure className="pat-piece pat-piece--panel">
          <figcaption className="pat-piece__cap">{tie('Panel. Tu Wiktor wpisuje.')}</figcaption>
          <div className="pat-piece__cloth">
            <div className="pat-piece__shot" ref={panelShot}>
              <img
                src={media('panel.webp')}
                width="1200"
                height="515"
                decoding="async"
                fetchpriority="high"
                alt="Panel ReWektor, edycja mebla Stolik z maszyny: pola Nazwa, Było, Jest, Co zrobiliśmy i trzy zdjęcia"
              />
              <m.span
                className="pat-chalk"
                aria-hidden="true"
                initial={false}
                animate={percent(field.panel)}
                transition={frame}
              />
            </div>
          </div>
        </figure>

        <figure className="pat-piece pat-piece--page">
          <figcaption className="pat-piece__cap">{tie('Strona. To widzi klient.')}</figcaption>
          <div className="pat-piece__cloth">
            <div className="pat-piece__shot" ref={pageShot}>
              <img
                src={media('strona.webp')}
                width="1200"
                height="595"
                decoding="async"
                alt="Strona rewektor.com.pl, pierwszy wpis na wystawie: Stolik z maszyny, było maszyna do szycia, jest stolik, ze zdjęciem"
              />
              <m.span
                className="pat-chalk"
                aria-hidden="true"
                initial={false}
                animate={percent(field.page)}
                transition={frame}
              />
            </div>
          </div>
        </figure>

        <svg className="pat-thread" aria-hidden="true">
          {path && (
            <g key={field.id}>
              {['halo', 'line'].map(part => (
                <m.path
                  key={part}
                  className={`pat-thread__${part}`}
                  d={path}
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={reduce ? instant : { duration: duration.stitch * 2, ease: ease.draw }}
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </>
  );
}

export default function Rewektor() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="pat-hero" aria-labelledby="pat-h">
        <div className="pat-hero__top">
          <Link className="proj__back" to={routes.work.pl}>
            <svg viewBox="0 0 28 14" aria-hidden="true">
              <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
            </svg>
            <span>Wszystkie projekty</span>
          </Link>
          <h1 className="title title--case pat-hero__title" id="pat-h">
            <Split text="ReWektor." />
          </h1>
        </div>
        <Pattern>
          <div className="pat-hero__text">
            <p className="proj__tag">Prawdziwe wdrożenie, strona i panel</p>
            <p className="proj__meta">{tie('Rodzinna firma stolarska z Wrocławia')}</p>
            <p className="lead pat-hero__lead">
              {tie(
                'Wiktor robi meble na wymiar i odnawia stare. Chciał sam dopisywać nowe, więc panel i strona są skrojone z jednego wykroju: te same pola w tej samej kolejności.',
              )}
            </p>
            <a className="link" href={live} target="_blank" rel="noopener noreferrer">
              rewektor.com.pl
            </a>
          </div>
        </Pattern>
      </section>

      <section className="paper pat-cuts" aria-labelledby="pat-cuts-h">
        <div className="sec-head">
          <h2 className="h2" id="pat-cuts-h">
            <Split text="Trzy kroje." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Wiktor dostał trzy kierunki na tym samym meblu i 4 listopada wybrał Rejestr. Poprosił tylko o więcej drewna i ruchu, a biel miała zostać na wierzchu.',
            )}
          </p>
        </div>
        <ol className="pat-cuts__table">
          {cuts.map((cut, i) => (
            <m.li
              key={cut.id}
              className={`pat-cut${cut.chosen ? ' pat-cut--chosen' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 40, rotate: (i - 1) * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: cut.chosen ? 0 : (i - 1) * 1.5 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduce ? instant : { ...spring.toss, type: 'spring', delay: i * stagger.cards }
              }>
              <figure className="pat-cut__piece">
                <img
                  src={media(`kierunek-${cut.id}.webp`)}
                  width="760"
                  height="475"
                  loading="lazy"
                  decoding="async"
                  alt={cut.alt}
                />
              </figure>
              <h3 className="pat-cut__name">{cut.name}</h3>
              <p className="pat-cut__desc">{tie(cut.desc)}</p>
              <p className="pat-cut__stamp">{cut.chosen ? 'wybrany 4.11' : 'odłożony'}</p>
            </m.li>
          ))}
        </ol>
      </section>

      <section className="pat-label" aria-labelledby="pat-label-h">
        <div className="sec-head">
          <h2 className="h2" id="pat-label-h">
            <Split text="Metryczka." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Pierwszy mebel na wystawie to stara maszyna do szycia, z której został stolik. Krawcowi trudno o lepszy przykład.',
            )}
          </p>
        </div>
        <div className="pat-label__row">
          <Reveal className="pat-label__photo">
            <img
              src={media('stolik.webp')}
              width="592"
              height="556"
              loading="lazy"
              decoding="async"
              alt="Stolik z drewnianym blatem na czarnej żeliwnej podstawie maszyny do szycia, w ogrodzie"
            />
          </Reveal>
          <m.div
            className="pat-tag"
            initial={reduce ? false : { rotate: -14, y: -30, opacity: 0 }}
            whileInView={{ rotate: -3, y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={reduce ? instant : { ...spring.tilt, type: 'spring' }}>
            <span className="pat-tag__hole" aria-hidden="true" />
            <dl className="pat-tag__list">
              <div>
                <dt>Nazwa</dt>
                <dd>Stolik z maszyny</dd>
              </div>
              <div>
                <dt>Było</dt>
                <dd className="pat-tag__big">maszyna do szycia</dd>
              </div>
              <div className="pat-tag__wood">
                <dt>Jest</dt>
                <dd className="pat-tag__big">stolik</dd>
              </div>
              <div>
                <dt>Co zrobiliśmy</dt>
                <dd>{tie('Drewniany blat na żeliwnej podstawie maszyny.')}</dd>
              </div>
            </dl>
          </m.div>
        </div>
      </section>

      <section className="paper pat-spec" aria-labelledby="pat-spec-h">
        <div className="sec-head">
          <h2 className="h2" id="pat-spec-h">
            <Split text="Co w środku." onView />
          </h2>
          <p className="sec-head__side">
            {tie(
              'Projekt, teksty, strona i panel zrobiłem sam. Wiktor ma się zajmować meblami, nie stroną.',
            )}
          </p>
        </div>
        <div className="pat-spec__row">
          <div className="pat-spec__main">
            <dl className="pat-spec__list">
              {spec.map(([term, text], i) => (
                <Reveal key={term} className="pat-spec__item" style={{ '--i': i }}>
                  <dt>{term}</dt>
                  <dd>{tie(text)}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal className="proj__stack pat-spec__stack">
              <p className="proj__label" id="pat-tech-h">
                Narzędzia
              </p>
              <ul className="proj__tech" aria-labelledby="pat-tech-h">
                {stack.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="pat-phone">
            <img
              src={media('telefon.webp')}
              width="390"
              height="844"
              loading="lazy"
              decoding="async"
              alt="Strona ReWektor na telefonie: nagłówek Meble na wymiar, stare odnawiamy, i przycisk zapytania o mebel"
            />
          </Reveal>
        </div>
      </section>

      <div className="proj__end">
        <Link className="cross cross--back" to={routes.work.pl}>
          <svg viewBox="0 0 40 18" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M39 9H2M10 1L2 9L10 17" />
          </svg>
          <span>Wszystkie projekty</span>
        </Link>
      </div>
    </>
  );
}
