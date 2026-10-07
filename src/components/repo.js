import React from 'react';
import { Link } from 'gatsby';
import Close from './close';
import Demo from './demo';
import Hero from './hero';
import Magnet from './magnet';
import Reveal from './reveal';
import Split from './split';
import { blogPath, routes, tie } from '../i18n';

const copy = {
  pl: {
    back: 'Wszystkie projekty',
    tag: 'Publiczne repozytorium',
    demo: 'Otwórz demo',
    code: 'Kod na GitHubie',
    npm: name => `${name} na npm`,
    whyTitle: 'Po co to zrobiłem.',
    tryTitle: 'Sprawdź w demo.',
    callsTitle: 'Trzy trudne miejsca.',
    callsLead: 'Każda decyzja ma w repozytorium swój ADR, razem z alternatywami, które przegrały.',
    adr: name => `${name} na GitHubie`,
    numsTitle: 'Liczby.',
    numsLead: 'Tylko to, co zmierzyły skrypty z repozytorium.',
    results: 'Pliki z wynikami w bench/results',
    gapsTitle: 'Czego nie ma.',
    nextTitle: 'Co dalej.',
    stack: 'Technologie',
    blog: 'Artykuł na blogu, po angielsku',
  },
  en: {
    back: 'All projects',
    tag: 'Public repository',
    demo: 'Open the live demo',
    code: 'Code on GitHub',
    npm: name => `${name} on npm`,
    whyTitle: 'Why I built it.',
    tryTitle: 'Try it in the demo.',
    callsTitle: 'Three hard parts.',
    callsLead: 'Each decision has its ADR in the repository, with the alternatives that lost.',
    adr: name => `${name} on GitHub`,
    numsTitle: 'Numbers.',
    numsLead: 'Only what the scripts in the repository measured.',
    results: 'The result files in bench/results',
    gapsTitle: 'What is not built.',
    nextTitle: 'What comes next.',
    stack: 'Tech',
    blog: 'Blog article',
  },
};

const out = { target: '_blank', rel: 'noopener noreferrer' };

export default function Repo({ data, lang }) {
  const t = data[lang];
  const ui = copy[lang];
  const key = data.id;

  return (
    <>
      <Hero id={`${key}-h`} title={`${data.name}.`} size="repo">
        <Link className="proj__back" to={routes.work[lang]} data-rise style={{ '--r': 0 }}>
          <svg viewBox="0 0 28 14" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M27 7H2M8 1L2 7L8 13" />
          </svg>
          <span>{ui.back}</span>
        </Link>
        <p className="proj__tag" data-rise style={{ '--r': 1 }}>
          {ui.tag}
        </p>
        <p className="proj__meta" data-rise style={{ '--r': 2 }}>
          {tie(t.meta)}
        </p>
        <p className="lead" data-rise style={{ '--r': 3 }}>
          {tie(t.lead)}
        </p>
        {t.model && (
          <p className="lead2" data-rise style={{ '--r': 4 }}>
            {tie(t.model)}
          </p>
        )}
        <div className="cta" data-rise style={{ '--r': 5 }}>
          <Magnet className="btn" href={data.demo} {...out}>
            {ui.demo}
          </Magnet>
          <a className="btn btn--line" href={data.repo} {...out}>
            {ui.code}
          </a>
          {data.packages?.map(item => (
            <a key={item.name} className="link" href={item.href} {...out}>
              {ui.npm(item.name)}
            </a>
          ))}
        </div>
      </Hero>
      <Demo
        id={key}
        name={data.name}
        lang={lang}
        clip={t.clip}
        note={t.note}
        width={data.video.width}
        height={data.video.height}
      />
      <section className="repo__sec" aria-labelledby={`${key}-why-h`}>
        <div className="sec-head">
          <h2 className="h2" id={`${key}-why-h`}>
            <Split text={ui.whyTitle} onView />
          </h2>
        </div>
        <Reveal className="repo__prose">
          {t.why.map(text => (
            <p key={text.slice(0, 24)}>{tie(text)}</p>
          ))}
        </Reveal>
      </section>
      <section className="repo__sec" aria-labelledby={`${key}-try-h`}>
        <div className="sec-head">
          <h2 className="h2" id={`${key}-try-h`}>
            <Split text={ui.tryTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.tryLead)}</p>
        </div>
        <dl className="rows">
          {t.features.map(([term, detail]) => (
            <Reveal as="div" key={term}>
              <dt>{tie(term)}</dt>
              <dd>{tie(detail)}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="repo__go">
          <a className="link" href={data.demo} {...out}>
            {data.demo.replace(/^https:\/\/|\/$/g, '')}
          </a>
        </p>
      </section>
      <section className="repo__sec" aria-labelledby={`${key}-calls-h`}>
        <div className="sec-head">
          <h2 className="h2" id={`${key}-calls-h`}>
            <Split text={ui.callsTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(ui.callsLead)}</p>
        </div>
        <ul className="calls">
          {t.calls.map(call => (
            <Reveal as="li" className="call" key={call.name}>
              <h3 className="call__name">{tie(call.name)}</h3>
              <div className="call__body">
                <p>{tie(call.text)}</p>
                <p className="call__cost">{tie(call.cost)}</p>
                <p className="call__lost">{tie(call.lost)}</p>
                <a className="link" href={call.adr[1]} {...out}>
                  {ui.adr(call.adr[0])}
                </a>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
      <section className="paper repo__nums" aria-labelledby={`${key}-nums-h`}>
        <div className="sec-head">
          <h2 className="h2" id={`${key}-nums-h`}>
            <Split text={ui.numsTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(ui.numsLead)}</p>
        </div>
        <dl className="nums">
          {t.numbers.map(([value, detail]) => (
            <Reveal as="div" key={value}>
              <dt>{value}</dt>
              <dd>{tie(detail)}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="repo__machine">
          <p>{tie(t.machine)}</p>
          <a className="link" href={data.results} {...out}>
            {ui.results}
          </a>
        </Reveal>
      </section>
      <section className="repo__sec" aria-labelledby={`${key}-gaps-h`}>
        <div className="sec-head">
          <h2 className="h2" id={`${key}-gaps-h`}>
            <Split text={ui.gapsTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(t.gapsLead)}</p>
        </div>
        <dl className="rows">
          {t.gaps.map(([term, detail]) => (
            <Reveal as="div" key={term}>
              <dt>{tie(term)}</dt>
              <dd>{tie(detail)}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="repo__next">
          <h3 className="repo__h3">{ui.nextTitle}</h3>
          <p>{tie(t.next)}</p>
          <a className="link" href={t.gapsAdr[1]} {...out}>
            {tie(t.gapsAdr[0])}
          </a>
        </Reveal>
      </section>
      <section className="repo__sec repo__stack" aria-labelledby={`${key}-stack-h`}>
        <Reveal>
          <h2 className="proj__label" id={`${key}-stack-h`}>
            {ui.stack}
          </h2>
          <ul className="proj__tech">
            {t.stack.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          {data.blog && (
            <p className="repo__blog">
              <span>{ui.blog}: </span>
              <Link className="link" to={`${blogPath}${data.blog.slug}/`} hrefLang="en">
                {data.blog.title}
              </Link>
            </p>
          )}
        </Reveal>
      </section>
      <div className="proj__end">
        <Link className="cross cross--back" to={routes.work[lang]}>
          <svg viewBox="0 0 40 18" aria-hidden="true">
            <path className="stroke" strokeWidth="1.8" d="M39 9H2M10 1L2 9L10 17" />
          </svg>
          <span>{ui.back}</span>
        </Link>
      </div>
      <Close lang={lang} edition="repo" />
    </>
  );
}
