import React, { useSyncExternalStore } from 'react';
import { Link } from 'gatsby';
import { consentPending, saveConsent, subscribeConsent } from '../consent';
import { privacyPath, tie } from '../i18n';

const copy = {
  pl: {
    aria: 'Zgoda na statystyki',
    text: 'Za Twoją zgodą Google Analytics zapisze ciasteczka, żebym wiedział, które strony są czytane. Bez zgody liczę tylko anonimowe wejścia, bez ciasteczek.',
    policy: 'Polityka prywatności',
    accept: 'Zgadzam się',
    reject: 'Nie zgadzam się',
  },
  en: {
    aria: 'Consent to statistics',
    text: 'With your consent Google Analytics sets cookies so I can see which pages get read. Without it I only count anonymous visits, with no cookies.',
    policy: 'Privacy policy',
    accept: 'I agree',
    reject: 'I disagree',
  },
};

export default function Consent({ lang }) {
  const t = copy[lang];
  const open = useSyncExternalStore(subscribeConsent, consentPending, () => true);

  if (!open) return null;

  return (
    <section className="consent" aria-label={t.aria}>
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
  );
}
