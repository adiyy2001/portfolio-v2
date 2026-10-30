import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import consent from '../scanner/consent.json';
import { scanPrivacyPath, scanTermsPath, tie } from '../i18n';
import { track } from '../track';

const endpoint = process.env.GATSBY_SCAN_ENDPOINT || 'https://api.adrianturbinski.pl/scan';
const siteKey = process.env.GATSBY_TURNSTILE_SITEKEY;
const turnstileSrc = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const mail = 'contact@adrianturbinski.pl';
const texts = consent.pl;

const copy = {
  label: 'Formularz darmowego skanu dostępności',
  url: 'Adres strony',
  urlHint: 'Na przykład sklep.pl albo https://sklep.pl/oferta',
  email: 'Twój e-mail',
  emailHint: 'Na ten adres przyślę link potwierdzający i raport.',
  send: 'Zleć skan',
  sending: 'Wysyłam…',
  readTerms: 'Przeczytaj regulamin skanera',
  newTab: '(otwiera się w nowej karcie)',
  privacyLink: 'Polityka prywatności, część o skanerze',
  termsLink: 'Regulamin skanera',
  errors: {
    url: 'Podaj adres strony, na przykład sklep.pl.',
    email: 'Podaj poprawny adres e-mail, na przykład jan@firma.pl.',
    terms: 'Żeby zlecić skan, zaznacz zgodę na regulamin.',
    turnstile: 'Poczekaj chwilę na weryfikację zabezpieczenia i spróbuj jeszcze raz.',
  },
  sent: 'Sprawdź skrzynkę i kliknij link potwierdzający. Skan ruszy po potwierdzeniu, raport przyjdzie w ciągu kilkunastu minut.',
  version:
    'Regulamin zmienił się od chwili, gdy otworzyłeś tę stronę. Odśwież ją i wyślij formularz jeszcze raz.',
  rate: {
    domain: 'Ta strona miała już dziś skan. Spróbuj jutro albo podaj inny adres.',
    ip: 'Z tego połączenia wysłano dziś już maksymalną liczbę skanów. Spróbuj jutro.',
    email:
      'Na ten adres e-mail zlecono dziś już maksymalną liczbę skanów. Spróbuj jutro albo użyj innego adresu.',
    other: 'Wysłano zbyt wiele zgłoszeń. Spróbuj ponownie jutro.',
  },
  failed: 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę albo napisz na',
};

let consentHashPromise;

function consentHash() {
  consentHashPromise ??= crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(JSON.stringify(consent)))
    .then(buffer =>
      [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join(''),
    );
  return consentHashPromise;
}

const hasScheme = value => /^[a-z][a-z0-9+.-]*:\/\//i.test(value);

export function normalizeUrl(raw) {
  const value = raw.trim();
  if (!value) return null;
  const candidate = hasScheme(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(candidate);
    const web = parsed.protocol === 'https:' || parsed.protocol === 'http:';
    return web && parsed.hostname.includes('.') && !/\s/.test(value) ? candidate : null;
  } catch {
    return null;
  }
}

const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${turnstileSrc}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve(window.turnstile), { once: true });
    script.addEventListener('error', reject, { once: true });
    if (!existing) {
      script.src = turnstileSrc;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

function Failure({ outcome }) {
  if (outcome.kind === 'version') return <>{copy.version}</>;
  if (outcome.kind === 'rate') return <>{copy.rate[outcome.reason] ?? copy.rate.other}</>;
  return (
    <>
      {copy.failed}{' '}
      <a className="scan__mail" href={`mailto:${mail}`}>
        {mail}
      </a>
      .
    </>
  );
}

export default function ScanForm() {
  const started = useRef(0);
  const startedTick = useRef(0);
  const token = useRef('');
  const widget = useRef(null);
  const slot = useRef(null);
  const statusNode = useRef(null);
  const formNode = useRef(null);
  const [state, setState] = useState('idle');
  const [errors, setErrors] = useState({});
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    if (!siteKey || !slot.current) return undefined;
    let gone = false;
    loadTurnstile()
      .then(turnstile => {
        if (gone || !turnstile) return;
        widget.current = turnstile.render(slot.current, {
          sitekey: siteKey,
          language: 'pl',
          callback: value => {
            token.current = value;
          },
          'expired-callback': () => {
            token.current = '';
          },
          'error-callback': () => {
            token.current = '';
          },
        });
      })
      .catch(() => {});
    return () => {
      gone = true;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  useEffect(() => {
    if (state === 'sent') statusNode.current?.focus();
  }, [state]);

  const page = () => window.location.pathname;

  const start = () => {
    if (started.current) return;
    started.current = Date.now();
    startedTick.current = performance.now();
    track('form_start', { form: 'scan', page: page() });
  };

  const refreshWidget = () => {
    token.current = '';
    if (widget.current !== null) window.turnstile?.reset(widget.current);
  };

  const reject = (found, reason) => {
    setErrors(found);
    const first = ['url', 'email', 'terms'].find(name => found[name]);
    if (first) formNode.current.elements[first].focus();
    track('form_error', { reason, form: 'scan', page: page() });
  };

  const clear = name => () => errors[name] && setErrors(current => ({ ...current, [name]: '' }));

  const submit = async event => {
    event.preventDefault();
    if (state === 'sending') return;
    const form = event.currentTarget;
    const url = normalizeUrl(form.elements.url.value);
    const email = form.elements.email.value.trim();
    const terms = form.elements.terms.checked;
    const marketing = form.elements.marketing.checked;
    const found = {
      url: url ? '' : copy.errors.url,
      email: validEmail(email) ? '' : copy.errors.email,
      terms: terms ? '' : copy.errors.terms,
    };
    const firstInvalid = ['url', 'email', 'terms'].find(name => found[name]);
    if (firstInvalid) {
      reject(found, firstInvalid);
      return;
    }
    if (siteKey && !token.current) {
      setErrors({});
      setOutcome({ kind: 'turnstile' });
      track('form_error', { reason: 'turnstile', form: 'scan', page: page() });
      return;
    }
    setErrors({});
    setOutcome(null);
    setState('sending');
    const fillMs = startedTick.current ? Math.round(performance.now() - startedTick.current) : 0;
    const hash = await consentHash().catch(() => '');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        email,
        terms: true,
        marketing,
        lang: 'pl',
        consentVersion: consent.version,
        consentHash: hash,
        turnstile: token.current,
        page: page(),
        startedAt: started.current || Date.now(),
        fillMs,
      }),
    }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) : {};
    if (response?.status === 202) {
      setState('sent');
      track('generate_lead', { form: 'scan', marketing, page: page() });
      return;
    }
    setState('idle');
    refreshWidget();
    if (response?.status === 409) {
      setOutcome({ kind: 'version' });
      track('form_error', { reason: 'consent_version', form: 'scan', page: page() });
      return;
    }
    if (response?.status === 429) {
      setOutcome({ kind: 'rate', reason: body.reason });
      track('form_error', { reason: `rate_${body.reason ?? 'other'}`, form: 'scan', page: page() });
      return;
    }
    if (response?.status === 422 && ['url', 'email', 'terms'].includes(body.error)) {
      reject({ [body.error]: copy.errors[body.error] }, `server_${body.error}`);
      return;
    }
    setOutcome({ kind: 'failed' });
    track('form_error', {
      reason: response ? `http_${response.status}` : 'network',
      form: 'scan',
      page: page(),
    });
  };

  const sending = state === 'sending';
  const sent = state === 'sent';

  return (
    <form
      data-clarity-mask="True"
      className="scan"
      ref={formNode}
      id="skan"
      action={endpoint}
      method="post"
      aria-label={copy.label}
      aria-busy={sending}
      onFocus={start}
      onSubmit={submit}
      noValidate>
      <div className="scan__status" role="status" ref={statusNode} tabIndex={-1}>
        {sent && <span className="scan__done">{tie(copy.sent)}</span>}
      </div>
      <div className="scan__fields" hidden={sent}>
        <div className="scan__row">
          <label className="scan__label" htmlFor="scan-url">
            {copy.url}
          </label>
          <input
            className="scan__field"
            id="scan-url"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck="false"
            maxLength="300"
            required
            aria-invalid={errors.url ? 'true' : undefined}
            aria-describedby={errors.url ? 'scan-url-hint scan-url-error' : 'scan-url-hint'}
            onInput={clear('url')}
          />
          <p className="scan__hint" id="scan-url-hint">
            {copy.urlHint}
          </p>
          {errors.url && (
            <p className="scan__error" id="scan-url-error">
              {errors.url}
            </p>
          )}
        </div>
        <div className="scan__row">
          <label className="scan__label" htmlFor="scan-email">
            {copy.email}
          </label>
          <input
            className="scan__field"
            id="scan-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength="200"
            required
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'scan-email-hint scan-email-error' : 'scan-email-hint'}
            onInput={clear('email')}
          />
          <p className="scan__hint" id="scan-email-hint">
            {copy.emailHint}
          </p>
          {errors.email && (
            <p className="scan__error" id="scan-email-error">
              {errors.email}
            </p>
          )}
        </div>
        <fieldset className="scan__row scan__row--checks">
          <legend className="sr">Zgody</legend>
          <div className="scan__check">
            <input
              className="scan__box"
              id="scan-terms"
              name="terms"
              type="checkbox"
              required
              aria-invalid={errors.terms ? 'true' : undefined}
              aria-describedby={errors.terms ? 'scan-terms-error' : undefined}
              onChange={clear('terms')}
            />
            <label className="scan__box-label" htmlFor="scan-terms">
              {texts.terms}
            </label>
          </div>
          <p className="scan__read">
            <Link to={scanTermsPath} target="_blank" rel="noopener">
              {copy.readTerms}
              <span className="sr"> {copy.newTab}</span>
            </Link>
          </p>
          {errors.terms && (
            <p className="scan__error" id="scan-terms-error">
              {errors.terms}
            </p>
          )}
          <div className="scan__check">
            <input
              className="scan__box"
              id="scan-marketing"
              name="marketing"
              type="checkbox"
              defaultChecked={false}
            />
            <label className="scan__box-label" htmlFor="scan-marketing">
              {texts.marketing}
            </label>
          </div>
        </fieldset>
        {siteKey && <div className="scan__turnstile" ref={slot} />}
        <div className="scan__foot">
          <button className="btn btn--wool scan__send" type="submit" disabled={sending}>
            {sending ? copy.sending : tie(copy.send)}
          </button>
        </div>
        {outcome && (
          <p className="scan__fail" role="alert">
            {outcome.kind === 'turnstile' ? copy.errors.turnstile : <Failure outcome={outcome} />}
          </p>
        )}
        <div className="scan__legal">
          {texts.info && <p>{texts.info}</p>}
          <p className="scan__links">
            <Link to={scanTermsPath}>{copy.termsLink}</Link>
            <Link to={scanPrivacyPath}>{copy.privacyLink}</Link>
          </p>
          {texts.disclaimer && <p className="scan__disclaimer">{texts.disclaimer}</p>}
        </div>
      </div>
    </form>
  );
}
