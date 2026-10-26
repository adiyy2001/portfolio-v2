import React, { useEffect, useRef, useState } from 'react';
import { consentPending, subscribeConsent } from '../consent';
import { phone } from '../services';
import { quoteId } from './quote';

const copy = {
  pl: { label: 'Szybki kontakt', quote: 'Wyceń projekt', call: 'Zadzwoń' },
  en: { label: 'Quick contact', quote: 'Get a quote', call: 'Call' },
};

export default function Dock({ lang }) {
  const t = copy[lang];
  const anchor = useRef(null);
  const [past, setPast] = useState(false);
  const [atClose, setAtClose] = useState(false);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const sync = () => setPending(consentPending());
    sync();
    return subscribeConsent(sync);
  }, []);

  useEffect(() => {
    const close = anchor.current?.closest('section');
    let frame = 0;
    const measure = () => {
      frame = 0;
      setPast(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    const watch = new IntersectionObserver(([entry]) => setAtClose(entry.isIntersecting), {
      rootMargin: '0px 0px -20% 0px',
    });
    if (close) watch.observe(close);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      watch.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const shown = past && !atClose && !pending;

  return (
    <nav
      className={shown ? 'dock dock--on' : 'dock'}
      aria-label={t.label}
      ref={anchor}
      inert={shown ? undefined : ''}>
      <a className="dock__quote" href={`#${quoteId[lang]}`} data-cta="dock-quote">
        {t.quote}
      </a>
      <a className="dock__call" href={phone.href} aria-label={`${t.call} ${phone.intl}`}>
        {t.call}
      </a>
    </nav>
  );
}
