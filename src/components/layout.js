import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, usePresence, useReducedMotion } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import Header from './header';
import Footer from './footer';
import { locate, ui } from '../i18n';
import { duration, ease, enterAfterSwap } from '../motion';

const useSyncEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const glideTransition = { duration: duration.reveal - 0.05, ease: ease.swap };

const glideFloor = 600;
const glideCeiling = 1800;

let saved = null;

export function keepScroll(position) {
  saved = position;
  document
    .querySelector('#main > .page[data-glide="in"]')
    ?.style.setProperty('--shift', `${-(position?.[1] ?? 0)}px`);
}

function canGlide(from, to) {
  if (!from.view || !to.view || from.lang !== to.lang) return false;
  if ([from.view, to.view].sort().join() !== 'case,work') return false;
  if (!document.documentElement.classList.contains('motion')) return false;
  if (document.getElementById('main')?.hasAttribute('data-glide')) return false;
  const frame = document.querySelector('#main [data-shared]');
  if (!frame) return false;
  const { top, bottom, height } = frame.getBoundingClientRect();
  const shown = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
  return shown >= height * 0.5;
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export const Swap = createContext(null);

function Page({ children }) {
  const [isPresent, safeToRemove] = usePresence();
  const { cover, reveal, glide, gliding } = useContext(Swap);
  const node = useRef(null);
  const acted = useRef(null);

  useSyncEffect(() => {
    if (gliding) node.current.dataset.glide = isPresent ? 'in' : 'out';
  }, [isPresent, gliding]);

  useEffect(() => {
    const state = isPresent ? 'in' : 'out';
    if (acted.current === state) return;
    acted.current = state;
    if (gliding) {
      const run = glide();
      if (!isPresent) run.then(safeToRemove);
    } else if (isPresent) reveal();
    else cover().then(safeToRemove);
  }, [isPresent, gliding, glide, cover, reveal, safeToRemove]);

  return (
    <div className="page" ref={node}>
      {children}
    </div>
  );
}

export default function Layout({ path, children }) {
  const { lang, view } = locate(path);
  const t = ui[lang];
  const reduce = useReducedMotion();
  const [, animate] = useAnimate();
  const swap = useRef(null);
  const main = useRef(null);
  const lenis = useRef(null);
  const still = useRef(false);
  const pending = useRef(null);
  const opening = useRef(null);
  const stage = useRef(null);
  const [trail, setTrail] = useState({ path, gliding: false });

  let { gliding } = trail;
  if (trail.path !== path) {
    gliding = !reduce && canGlide(locate(trail.path), { lang, view });
    setTrail({ path, gliding });
  }

  useEffect(() => {
    if (!gliding) stage.current?.settle(true);
  }, [path, gliding]);

  useEffect(() => {
    still.current = Boolean(reduce);
    if (reduce) return undefined;
    let gone = false;
    import('lenis')
      .then(({ default: Lenis }) => {
        if (!gone) lenis.current = new Lenis({ autoRaf: true });
      })
      .catch(() => {});
    return () => {
      gone = true;
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, [reduce]);

  const cover = useCallback(() => {
    if (pending.current) return pending.current;
    pending.current = (async () => {
      await opening.current;
      if (still.current) return;
      lenis.current?.stop();
      document.documentElement.style.setProperty('--enter', enterAfterSwap);
      const panel = swap.current;
      const word = panel.querySelector('.swap__word');
      const stitch = panel.querySelector('.swap__stitch path');
      panel.classList.add('on');
      await animate(
        panel,
        { transform: ['translateY(102%)', 'translateY(0%)'] },
        { duration: duration.cover, ease: ease.swap },
      );
      animate(
        word,
        {
          opacity: [0, 1],
          transform: ['translateY(10px) rotate(-3deg)', 'translateY(0px) rotate(-3deg)'],
        },
        { duration: duration.word, ease: ease.out },
      );
      await animate(
        stitch,
        { strokeDashoffset: [1, 0] },
        { duration: duration.stitch, ease: 'ease-out' },
      );
    })();
    return pending.current;
  }, [animate]);

  const reveal = useCallback(() => {
    const covered = pending.current;
    if (!covered) return;
    pending.current = null;
    opening.current = (async () => {
      await covered;
      const { hash } = window.location;
      const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
      const y = saved?.[1] ?? (target ? target.getBoundingClientRect().top + window.scrollY : 0);
      saved = null;
      if (lenis.current) {
        lenis.current.resize();
        lenis.current.scrollTo(y, { immediate: true, force: true });
      } else window.scrollTo(0, y);
      document.querySelector('#main h1')?.focus({ preventScroll: true });
      const panel = swap.current;
      if (!still.current) {
        await animate(
          panel,
          { transform: ['translateY(0%)', 'translateY(-102%)'] },
          { duration: duration.uncover, ease: ease.swap },
        );
      }
      panel.classList.remove('on');
      panel.querySelector('.swap__word').style.opacity = '0';
      panel.querySelector('.swap__stitch path').style.strokeDashoffset = '1';
      lenis.current?.start();
    })();
  }, [animate]);

  const glide = useCallback(() => {
    if (stage.current) return stage.current.done;
    const root = main.current;
    const out = root.querySelector(':scope > .page[data-glide="out"]');
    const inn = root.querySelector(':scope > .page[data-glide="in"]');
    if (!out || !inn) return Promise.resolve();
    const run = { settled: false };
    const landed = new Promise(resolve => {
      run.land = resolve;
    });
    run.done = new Promise(resolve => {
      run.over = resolve;
    });
    run.settle = abort => {
      if (run.settled) return;
      run.settled = true;
      stage.current = null;
      try {
        out.dataset.glide = 'gone';
        inn.removeAttribute('data-glide');
        inn.style.removeProperty('--shift');
        delete root.dataset.glide;
        if (!abort) {
          const y = saved?.[1] ?? 0;
          saved = null;
          if (lenis.current) {
            lenis.current.resize();
            lenis.current.scrollTo(y, { immediate: true, force: true });
          } else window.scrollTo({ top: y, behavior: 'instant' });
          inn.querySelector('h1')?.focus({ preventScroll: true });
        }
      } finally {
        if (!abort) lenis.current?.start();
        run.over();
      }
    };
    stage.current = run;
    lenis.current?.stop();
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    document.documentElement.style.setProperty('--enter', enterAfterSwap);
    root.dataset.glide = '';
    Promise.all([Promise.race([landed, pause(glideCeiling)]), pause(glideFloor)]).then(() =>
      run.settle(false),
    );
    return run.done;
  }, []);

  const land = useCallback(() => stage.current?.land(), []);

  useSyncEffect(() => {
    if (gliding) glide();
  }, [path, gliding, glide]);

  const flow = useMemo(
    () => ({ cover, reveal, glide, land, gliding }),
    [cover, reveal, glide, land, gliding],
  );

  return (
    <Swap.Provider value={flow}>
      <div className="cloth" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <Header lang={lang} view={view} />
      <main id="main" tabIndex={-1} ref={main}>
        <AnimatePresence mode={gliding ? 'sync' : 'wait'}>
          <Page key={path}>{children}</Page>
        </AnimatePresence>
      </main>
      <Footer lang={lang} />
      <div className="swap" ref={swap} aria-hidden="true">
        <p className="swap__word">{t.words[view] || t.words.home}</p>
        <svg className="swap__stitch" viewBox="0 0 560 20" preserveAspectRatio="none">
          <path
            className="stroke"
            pathLength="1"
            strokeWidth="2.2"
            d="M2 11C140 4 280 17 420 8S530 12 558 9"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Swap.Provider>
  );
}
