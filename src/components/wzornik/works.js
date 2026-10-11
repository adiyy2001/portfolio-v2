import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { withPrefix } from 'gatsby';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { tie } from '../../i18n';
import { duration, ease, instant, spring, stagger } from '../../motion';

const rest = [-1.4, 0.9, -0.5, 1.2, -0.9, 0.6];

const fanned = k => ({ y: 20, rotate: (k - 2) * 4 });
const spread = k => ({ y: -6, rotate: (k - 2) * 13 });
const hand = k => ({ x: ['0%', '-26%', '26%'][k], y: 0, rotate: [0, -7, 7][k] });
const opened = k => ({
  x: ['0%', '-54%', '54%'][k],
  y: [-12, 6, 6][k],
  rotate: [0, -13, 13][k],
});
const bounce = { type: 'spring', ...spring.blade };

const moving = {
  list: { in: { transition: { staggerChildren: stagger.cards } } },
  card: {
    out: r => ({ opacity: 0, x: -26, y: -58, rotate: r - 8, scale: 1.07 }),
    in: r => ({
      opacity: 1,
      x: 0,
      y: 0,
      rotate: r,
      scale: 1,
      transition: { type: 'spring', ...spring.toss },
    }),
  },
  hold: {
    out: { y: 0, rotate: 0 },
    in: { y: 0, rotate: 0, transition: bounce },
    lift: r => ({ y: -8, rotate: -r, transition: bounce }),
  },
  strip: {
    out: fanned,
    in: k => ({ ...fanned(k), transition: bounce }),
    lift: k => ({ ...spread(k), transition: { ...bounce, delay: k * 0.025 } }),
  },
  screen: {
    out: hand,
    in: k => ({ ...hand(k), transition: bounce }),
    lift: k => ({ ...opened(k), transition: bounce }),
  },
  frame: {
    out: { scale: 1 },
    in: { scale: 1, transition: bounce },
    lift: { scale: 1.025, transition: bounce },
  },
  mark: on => ({
    pathLength: on ? 1 : 0,
    opacity: on ? 1 : 0,
    transition: { duration: on ? duration.stitch * 1.5 : 0.15, ease: ease.draw },
  }),
};

const still = {
  list: { in: {} },
  card: {
    out: r => ({ opacity: 1, rotate: r, transition: instant }),
    in: r => ({ opacity: 1, x: 0, y: 0, rotate: r, scale: 1, transition: instant }),
  },
  hold: {
    out: { y: 0, rotate: 0 },
    in: { y: 0, rotate: 0, transition: instant },
    lift: { transition: instant },
  },
  strip: {
    out: fanned,
    in: k => ({ ...fanned(k), transition: instant }),
    lift: k => ({ ...spread(k), transition: instant }),
  },
  screen: {
    out: hand,
    in: k => ({ ...hand(k), transition: instant }),
    lift: k => ({ ...hand(k), transition: instant }),
  },
  frame: {
    out: { scale: 1 },
    in: { scale: 1, transition: instant },
    lift: { transition: instant },
  },
  mark: on => ({ pathLength: on ? 1 : 0, opacity: on ? 1 : 0, transition: instant }),
};

const noop = () => () => {};

function Loop({ slug, live }) {
  const video = useRef(null);

  useEffect(() => {
    const node = video.current;
    if (!live || !('IntersectionObserver' in window)) {
      node.pause();
      return undefined;
    }
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.play().catch(() => {});
        else node.pause();
      },
      { threshold: 0.4 },
    );
    watcher.observe(node);
    return () => {
      watcher.disconnect();
      node.pause();
    };
  }, [live]);

  const base = `/wzornik/app-preview/${slug}/${slug}`;
  return (
    <video
      ref={video}
      className="wk__video"
      width="480"
      height="600"
      muted
      loop
      playsInline
      preload="none"
      poster={withPrefix(`/wzornik/app-preview/${slug}/posters/${slug}-tile.jpg`)}
      aria-hidden="true"
      tabIndex={-1}>
      <source src={withPrefix(`${base}-tile.webm`)} type="video/webm" />
      <source src={withPrefix(`${base}-tile.mp4`)} type="video/mp4" />
    </video>
  );
}

function Picture({ kind, item, lang, look, live }) {
  if (kind === 'id') {
    return (
      <span className="wk__pic wk__pic--id">
        <span className="wk__fan" aria-hidden="true">
          {item.palette.map((color, k) => (
            <m.i key={color} style={{ '--c': color }} custom={k} variants={look.strip} />
          ))}
        </span>
        <img
          src={withPrefix(`/media/wzornik/${item.slug}.webp`)}
          width="720"
          height="504"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }
  if (kind === 'aso') {
    const set = lang === 'en' ? 'en' : 'pl';
    return (
      <span className="wk__pic wk__pic--aso">
        {[1, 2, 3].map((n, k) => (
          <m.img
            key={n}
            className="wk__screen"
            src={withPrefix(`/wzornik/aso/${item.slug}/web/appstore-${set}-0${n}.webp`)}
            width="480"
            height="1043"
            alt=""
            loading="lazy"
            decoding="async"
            custom={k}
            variants={look.screen}
          />
        ))}
      </span>
    );
  }
  return (
    <m.span className={`wk__pic wk__pic--ap wk__pic--${item.slug}`} variants={look.frame}>
      <Loop slug={item.slug} live={live} />
    </m.span>
  );
}

export default function Works({ groups, t, lang }) {
  const reduce = useReducedMotion();
  const look = reduce ? still : moving;
  const box = useRef(null);
  const tabs = useRef([]);
  const seen = useInView(box, { once: true, amount: 0.15 });
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(null);
  const stopped = paused ?? (hydrated && Boolean(reduce));

  const step = event => {
    const moves = { ArrowRight: 1, ArrowLeft: -1 };
    let next = null;
    if (event.key in moves) next = (active + moves[event.key] + groups.length) % groups.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = groups.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="wk" ref={box}>
      <div className="wk__head">
        <h3 className="wk__h">{tie(t.more)}</h3>
        <div className="wk__tabs" role="tablist" aria-label={t.kinds}>
          {groups.map((group, i) => {
            const on = i === active;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                className="wk__tab"
                id={`wk-${group.id}-t`}
                ref={node => {
                  tabs.current[i] = node;
                }}
                aria-selected={on}
                aria-controls={`wk-${group.id}-p`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={step}>
                {group.tab}
                <svg
                  className="wk__mark"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  aria-hidden="true">
                  <m.path
                    className="stroke"
                    strokeWidth="2.2"
                    d="M3 8C28 3 58 11 86 6C98 4 108 5 117 7"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={look.mark(on)}
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
      {groups.map((group, i) => {
        const on = i === active;
        return (
          <div
            key={group.id}
            className={`wk__panel wk__panel--${group.kind}`}
            id={`wk-${group.id}-p`}
            role="tabpanel"
            aria-labelledby={`wk-${group.id}-t`}
            hidden={!on}>
            <div className="wk__intro">
              <p className="wk__lead">{tie(group.lead)}</p>
              {group.kind === 'ap' && (
                <button type="button" className="wk__pause" onClick={() => setPaused(!stopped)}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d={stopped ? 'M4 2.5V13.5L13 8Z' : 'M4 2.5H7V13.5H4ZM9 2.5H12V13.5H9Z'} />
                  </svg>
                  {stopped ? t.play : t.pause}
                </button>
              )}
            </div>
            <m.ul
              className="wk__list"
              variants={look.list}
              initial="out"
              animate={on && seen ? 'in' : 'out'}>
              {group.items.map((item, k) => (
                <m.li
                  key={item.slug}
                  className="wk__item"
                  data-reveal
                  custom={rest[k]}
                  variants={look.card}>
                  <m.a
                    className="wk__a"
                    href={withPrefix(`${group.href}${item.slug}/`)}
                    hrefLang={lang === 'en' ? 'pl' : undefined}
                    custom={rest[k]}
                    variants={look.hold}
                    initial="out"
                    animate="in"
                    whileHover="lift"
                    whileFocus="lift">
                    <Picture
                      kind={group.kind}
                      item={item}
                      lang={lang}
                      look={look}
                      live={on && !stopped}
                    />
                    <span className="wk__name">{item.name}</span>
                    <span className="wk__what">{tie(item[lang])}</span>
                  </m.a>
                </m.li>
              ))}
            </m.ul>
            <p className="wk__all">
              <a
                className="link"
                href={withPrefix(group.href)}
                hrefLang={lang === 'en' ? 'pl' : undefined}>
                {tie(group.all)}
              </a>
            </p>
          </div>
        );
      })}
    </div>
  );
}
