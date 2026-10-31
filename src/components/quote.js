import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import { privacyPath, tie } from '../i18n';
import { phone, serviceKeys, services } from '../services';
import { readSource } from '../source';
import { track } from '../track';

const endpoint = 'https://api.adrianturbinski.pl/quote';
const mail = 'adrian.turbinski@gmail.com';

export const quoteId = { pl: 'wycena', en: 'quote' };

const copy = {
  pl: {
    label: 'Formularz wyceny',
    slip: 'Karta zlecenia',
    promise: 'Wycena na piśmie w dwa dni robocze',
    service: 'Co szyjemy?',
    other: 'Coś innego',
    budget: 'Budżet netto',
    budgets: [
      'do 5 tys. zł',
      '5 do 15 tys. zł',
      '15 do 40 tys. zł',
      'powyżej 40 tys. zł',
      'jeszcze nie wiem',
    ],
    message: 'Kilka zdań o projekcie',
    messageHint: 'Czym zajmuje się firma, co ma powstać i na kiedy.',
    contact: 'E-mail lub telefon',
    code: 'Kod',
    codeHint: 'Jeśli masz kod od mnie, wpisz go tutaj.',
    contactError: 'Podaj e-mail albo numer telefonu, żebym mógł odpowiedzieć.',
    send: 'Wyślij zapytanie',
    sending: 'Wysyłam…',
    privacy: 'Dane z formularza służą tylko do odpowiedzi na zapytanie.',
    privacyLink: 'Polityka prywatności',
    sentTitle: 'Dziękuję, zapytanie dotarło.',
    sentBody: `Odezwę się na podany kontakt. Jeśli sprawa jest pilna, zadzwoń: ${phone.label}.`,
    failBody: 'Nie udało się wysłać.',
    failMail: 'Wyślij to samo mailem',
    failOr: 'albo zadzwoń:',
    subject: 'Zapytanie o wycenę',
  },
  en: {
    label: 'Quote form',
    slip: 'Order slip',
    promise: 'Written quote in two working days',
    service: 'What are we making?',
    other: 'Something else',
    budget: 'Budget, net',
    budgets: ['under 5k PLN', '5k to 15k PLN', '15k to 40k PLN', 'over 40k PLN', 'not sure yet'],
    message: 'A few sentences about the project',
    messageHint: 'What the company does, what should be built and by when.',
    contact: 'Email or phone',
    code: 'Code',
    codeHint: 'If you have a code from me, enter it here.',
    contactError: 'Add an email or a phone number so I can reply.',
    send: 'Send the request',
    sending: 'Sending…',
    privacy: 'Form data is used only to answer your request.',
    privacyLink: 'Privacy policy',
    sentTitle: 'Thank you, the request arrived.',
    sentBody: `I will reply to the contact you gave. If it is urgent, call ${phone.intl}.`,
    failBody: 'Sending failed.',
    failMail: 'Send the same by email',
    failOr: 'or call',
    subject: 'Quote request',
  },
};

const reachable = contact =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || contact.replace(/\D/g, '').length >= 9;

function Chips({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="quote__row">
      <legend className="quote__label">{legend}</legend>
      <div className="quote__chips">
        {options.map(([key, text]) => (
          <label className="quote__chip" key={key}>
            <input
              type="radio"
              name={name}
              value={key}
              checked={value === key}
              onChange={() => onChange(key)}
            />
            <span>{tie(text)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Quote({ lang, service = '' }) {
  const t = copy[lang];
  const id = quoteId[lang];
  const opened = useRef(0);
  const [picked, setPicked] = useState(services[service]?.[lang].name ?? '');
  const [budget, setBudget] = useState('');
  const [state, setState] = useState('idle');
  const [invalid, setInvalid] = useState(false);
  const [fallback, setFallback] = useState('');
  const sourceField = useRef(null);

  useEffect(() => {
    sourceField.current.value = readSource();
  }, []);

  const serviceOptions = [
    ...serviceKeys.map(key => [services[key][lang].name, services[key][lang].name]),
    [t.other, t.other],
  ];
  const budgetOptions = t.budgets.map(text => [text, text]);

  const start = () => {
    if (opened.current) return;
    opened.current = Date.now();
    track('form_start', { form: 'quote', page: window.location.pathname });
  };

  const submit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const contact = String(data.contact).trim();
    if (!reachable(contact)) {
      setInvalid(true);
      form.elements.contact.focus();
      track('form_error', { reason: 'contact', form: 'quote', page: window.location.pathname });
      return;
    }
    setInvalid(false);
    setState('sending');
    const lead = {
      ...data,
      service: picked,
      code: String(data.code ?? '')
        .trim()
        .toUpperCase(),
      page: window.location.pathname,
      lang,
      source: readSource(),
      elapsed: opened.current ? Date.now() - opened.current : 0,
    };
    const ok = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
      .then(response => response.ok)
      .catch(() => false);
    if (ok) {
      setState('sent');
      track('generate_lead', {
        form: 'quote',
        service: picked || 'none',
        budget: lead.budget || 'none',
        page: lead.page,
        lead_source: lead.source,
        has_code: lead.code ? 'yes' : 'no',
      });
      return;
    }
    const body = [picked, lead.budget, lead.message, contact].filter(Boolean).join('\n\n');
    setFallback(
      `mailto:${mail}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`,
    );
    setState('failed');
    track('form_error', { reason: 'delivery', form: 'quote', page: lead.page });
  };

  if (state === 'sent') {
    return (
      <div className="quote quote--sent" id={id} role="status">
        <p className="quote__head">
          <span>{t.slip}</span>
        </p>
        <p className="quote__done">{tie(t.sentTitle)}</p>
        <p className="quote__note">{tie(t.sentBody)}</p>
      </div>
    );
  }

  return (
    <form
      data-clarity-mask="True"
      className="quote"
      id={id}
      action={endpoint}
      method="post"
      aria-label={t.label}
      onFocus={start}
      onSubmit={submit}
      noValidate>
      <p className="quote__head">
        <span>{t.slip}</span>
        <span className="quote__promise">{tie(t.promise)}</span>
      </p>
      <Chips
        name="service"
        legend={t.service}
        options={serviceOptions}
        value={picked}
        onChange={setPicked}
      />
      <Chips
        name="budget"
        legend={t.budget}
        options={budgetOptions}
        value={budget}
        onChange={setBudget}
      />
      <div className="quote__row">
        <label className="quote__label" htmlFor={`${id}-message`}>
          {t.message}
        </label>
        <textarea
          className="quote__area"
          id={`${id}-message`}
          name="message"
          rows="4"
          maxLength="2000"
          placeholder={t.messageHint}
        />
      </div>
      <div className="quote__row">
        <label className="quote__label" htmlFor={`${id}-contact`}>
          {t.contact}
        </label>
        <input
          className="quote__field"
          id={`${id}-contact`}
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email"
          maxLength="200"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-contact-error` : undefined}
          onInput={() => invalid && setInvalid(false)}
        />
        {invalid && (
          <p className="quote__error" id={`${id}-contact-error`}>
            {tie(t.contactError)}
          </p>
        )}
      </div>
      <div className="quote__row">
        <label className="quote__label" htmlFor={`${id}-code`}>
          {t.code}
        </label>
        <input
          className="quote__field quote__field--code"
          id={`${id}-code`}
          name="code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
          maxLength="20"
          placeholder={t.codeHint}
          onInput={event => {
            event.currentTarget.value = event.currentTarget.value.toUpperCase();
          }}
        />
      </div>
      <div className="quote__trap" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="source" ref={sourceField} defaultValue="direct" />
      <div className="quote__foot">
        <button className="btn btn--wool" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : tie(t.send)}
        </button>
        <p className="quote__privacy">
          {tie(t.privacy)} <Link to={privacyPath[lang]}>{t.privacyLink}</Link>
        </p>
      </div>
      {state === 'failed' && (
        <p className="quote__fail" role="alert">
          {tie(t.failBody)}{' '}
          <a className="link" href={fallback}>
            {t.failMail}
          </a>{' '}
          {t.failOr} <a href={phone.href}>{lang === 'pl' ? phone.label : phone.intl}</a>
        </p>
      )}
    </form>
  );
}
