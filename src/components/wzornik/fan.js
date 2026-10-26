import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, withPrefix } from 'gatsby';
import { m, useReducedMotion, useSpring } from 'framer-motion';
import { routes, tie } from '../../i18n';
import { quoteId } from '../quote';
import { duration, ease, instant, spring, stagger } from '../../motion';

const top = -84;
const sweep = 78;
const folded = -6;

const angleOf = (i, count) => top + (sweep * i) / (count - 1);

function riffle(i, hover) {
  if (hover === null || hover === i) return 0;
  const gap = Math.abs(i - hover);
  return Math.sign(i - hover) * Math.max(0, 3.6 - (gap - 1) * 1.2);
}

const moving = {
  panel: {
    on: dir => ({
      opacity: [0, 1],
      x: [dir * 56, 0],
      rotate: [dir * 2.2, 0],
      transition: {
        type: 'spring',
        ...spring.stage,
        staggerChildren: 0.05,
        delayChildren: 0.06,
      },
    }),
    off: dir => ({
      opacity: 0,
      x: dir * -44,
      rotate: dir * -1.4,
      transition: { duration: 0.24, ease: ease.swap },
    }),
  },
  bit: {
    on: { opacity: [0, 1], y: [16, 0], transition: { duration: duration.uncover, ease: ease.out } },
    off: { opacity: 0, transition: { duration: 0.12 } },
  },
  pin: {
    on: {
      opacity: [0, 1],
      scale: [0.3, 1],
      rotate: [-48, 0],
      y: [-20, 0],
      transition: { type: 'spring', ...spring.pin, delay: 0.24 },
    },
    off: { opacity: 0, transition: { duration: 0.1 } },
  },
};

const still = {
  panel: {
    on: { opacity: 1, x: 0, rotate: 0, transition: instant },
    off: { opacity: 0, transition: instant },
  },
  bit: {
    on: { opacity: 1, y: 0, transition: instant },
    off: { opacity: 0, transition: instant },
  },
  pin: {
    on: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: instant },
    off: { opacity: 0, transition: instant },
  },
};

const noop = () => () => {};

export default function Fan({ sites, mocks, t, lang }) {
  const reduce = useReducedMotion();
  const look = reduce ? still : moving;
  const deck = useRef(null);
  const tabs = useRef([]);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [hover, setHover] = useState(null);
  const [closed, setClosed] = useState(false);
  const rotateX = useSpring(0, spring.tilt);
  const rotateY = useSpring(0, spring.tilt);
  const count = sites.length;

  useEffect(() => {
    if (reduce || !('IntersectionObserver' in window)) return undefined;
    let first = true;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.isIntersecting) {
            watcher.disconnect();
            return;
          }
          setClosed(true);
          return;
        }
        if (entry.intersectionRatio >= 0.4) {
          watcher.disconnect();
          setClosed(false);
        }
      },
      { threshold: [0, 0.4] },
    );
    watcher.observe(deck.current);
    return () => watcher.disconnect();
  }, [reduce]);

  const select = next => {
    if (next === active) return;
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  const step = event => {
    const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (event.key in moves) next = (active + moves[event.key] + count) % count;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = count - 1;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const tilt = event => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    rotateX.set(-((event.clientY - box.top) / box.height - 0.5) * 7);
    rotateY.set(((event.clientX - box.left) / box.width - 0.5) * 7);
  };

  const release = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const opening = closed || reduce ? instant : null;

  return (
    <div className="fan">
      <div className="fan__deck" ref={deck} onPointerLeave={() => setHover(null)}>
        <div className="fan__blades" role="tablist" aria-label={t.pick} aria-orientation="vertical">
          {sites.map((site, i) => {
            const on = i === active;
            const out = on ? '7%' : hover === i && !reduce ? '4%' : '0%';
            return (
              <m.div
                key={site.id}
                role="presentation"
                className={`blade fs--${site.id}`}
                style={{ zIndex: on ? count + 1 : i + 1 }}
                initial={false}
                animate={{ rotate: closed ? folded : angleOf(i, count) }}
                transition={
                  opening ?? {
                    type: 'spring',
                    ...spring.fan,
                    delay: (count - 1 - i) * stagger.blades,
                  }
                }>
                <m.button
                  type="button"
                  role="tab"
                  className="blade__tab"
                  id={`fan-${site.id}-t`}
                  ref={node => {
                    tabs.current[i] = node;
                  }}
                  aria-selected={on}
                  aria-controls={`fan-${site.id}-p`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={step}
                  onPointerEnter={event => {
                    if (event.pointerType === 'mouse') setHover(i);
                  }}
                  initial={false}
                  animate={{ rotate: reduce ? 0 : riffle(i, hover), x: out }}
                  transition={reduce ? instant : { type: 'spring', ...spring.blade }}>
                  <span className="blade__face">
                    <span className="blade__name">{site.name}</span>
                    <span className="sr">, {tie(t[site.id].trade)}</span>
                    <span className="blade__chips" aria-hidden="true">
                      {site.chips.map(chip => (
                        <i key={chip} style={{ '--c': chip }} />
                      ))}
                    </span>
                  </span>
                </m.button>
              </m.div>
            );
          })}
        </div>
        <m.span
          className="fan__rivet"
          aria-hidden="true"
          initial={false}
          animate={{ rotate: closed ? -150 : 0 }}
          transition={opening ?? { type: 'spring', ...spring.fan }}
        />
        <m.p
          className="fan__hint"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: closed ? 0 : 1 }}
          transition={opening ?? { duration: duration.reveal, delay: 0.9 }}>
          <span className="hand-note">{t.hint}</span>
          <svg viewBox="0 0 90 60">
            <path className="stroke" strokeWidth="1.8" d="M84 4C70 30 44 46 10 50" />
            <path className="stroke" strokeWidth="1.8" d="M20 40L8 50L22 57" />
          </svg>
        </m.p>
      </div>
      <div className="fan__stage" onPointerMove={tilt} onPointerLeave={release}>
        {sites.map((site, i) => {
          const on = i === active;
          const s = t[site.id];
          const Mock = mocks[site.id];
          const english = lang === 'en' && site.en;
          return (
            <m.div
              key={site.id}
              className={`stage fs--${site.id}${on ? ' is-on' : ''}`}
              id={`fan-${site.id}-p`}
              role="tabpanel"
              aria-labelledby={`fan-${site.id}-t`}
              inert={hydrated && !on ? '' : undefined}
              custom={dir}
              variants={look.panel}
              initial={false}
              animate={on ? 'on' : 'off'}>
              <m.div
                className="stage__shot"
                style={{ rotateX, rotateY, transformPerspective: 1200 }}>
                <m.span className="stage__pin" variants={look.pin} aria-hidden="true" />
                <div className={`mock mk--${site.id}`} role="img" aria-label={s.alt}>
                  <div className="mk" lang="pl">
                    <Mock />
                  </div>
                </div>
              </m.div>
              <div className="stage__info">
                <m.h3 className="stage__name" variants={look.bit}>
                  {site.name}
                </m.h3>
                <m.p className="stage__kind" variants={look.bit}>
                  {tie(`${s.trade}, ${s.kind}`)}
                </m.p>
                <m.dl className="stage__facts" variants={look.bit}>
                  <div>
                    <dt>{tie(t.who)}</dt>
                    <dd>{tie(s.who)}</dd>
                  </div>
                  <div>
                    <dt>{tie(t.inside)}</dt>
                    <dd>{tie(s.inside)}</dd>
                  </div>
                  <div>
                    <dt>{tie(t.cut)}</dt>
                    <dd>
                      {tie(s.cut)}
                      <span className="stage__chips" aria-hidden="true">
                        {site.chips.map(chip => (
                          <i key={chip} style={{ '--c': chip }} />
                        ))}
                      </span>
                    </dd>
                  </div>
                </m.dl>
                <m.p className="stage__go" variants={look.bit}>
                  <a
                    className="link"
                    href={withPrefix(`/wzornik/${site.slug}/${english ? 'en/' : ''}`)}>
                    {lang === 'en' && !site.en ? t.openPl : t.open}
                    <span className="sr">, {site.name}</span>
                  </a>
                  <Link
                    className="link stage__order"
                    to={`${routes['svc-sites'][lang]}#${quoteId[lang]}`}
                    data-cta="wzornik-order">
                    {t.order}
                  </Link>
                </m.p>
              </div>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
