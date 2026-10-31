import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { Link } from 'gatsby';
import { consentPending, saveConsent, subscribeConsent } from '../consent';
import { privacyPath, tie } from '../i18n';

const copy = {
  pl: {
    aria: 'Zgoda na statystyki',
    text: 'Za Twoją zgodą Google Analytics i Microsoft Clarity zapiszą ciasteczka, żebym wiedział, które strony są czytane i gdzie ktoś się gubi. Bez zgody liczę tylko anonimowe wejścia, bez ciasteczek.',
    policy: 'Polityka prywatności',
    accept: 'Zgadzam się',
    reject: 'Nie zgadzam się',
  },
  en: {
    aria: 'Consent to statistics',
    text: 'With your consent Google Analytics and Microsoft Clarity set cookies so I can see which pages get read and where people get stuck. Without it I only count anonymous visits, with no cookies.',
    policy: 'Privacy policy',
    accept: 'I agree',
    reject: 'I disagree',
  },
};

export default function Consent({ lang }) {
  const t = copy[lang];
  const open = useSyncExternalStore(subscribeConsent, consentPending, () => true);
  const box = useRef(null);
  const room = useRef(null);

  // The banner is fixed over the bottom of the page. The spacer keeps the footer links
  // (scanner, privacy, statistics settings) scrollable above it while no choice is made.
  useEffect(() => {
    if (!open || !box.current || !room.current) return undefined;
    const fit = () => {
      room.current.style.height = `${box.current.offsetHeight + 24}px`;
    };
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(box.current);
    return () => watch.disconnect();
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="consent-room" ref={room} aria-hidden="true" />
      <section className="consent" ref={box} aria-label={t.aria}>
        <p className="consent__text">
          {tie(t.text)} <Link to={privacyPath[lang]}>{t.policy}</Link>
        </p>
        <div className="consent__actions">
          <button type="button" className="btn btn--line" onClick={() => saveConsent('denied')}>
            {t.reject}
          </button>
          <button type="button" className="btn" onClick={() => saveConsent('granted')}>
            {t.accept}
          </button>
        </div>
      </section>
    </>
  );
}
