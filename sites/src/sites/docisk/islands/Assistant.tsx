import { useEffect, useRef, useState } from 'preact/hooks';
import {
  beginBooking,
  bookingsStorageKey,
  expectsPhone,
  logKindLabels,
  logStorageKey,
  parseBookings,
  parseLog,
  sendText,
  startSession,
} from '../assistant';
import type { Session } from '../assistant';
import { assistantEvent, assistantRootId } from '../request';

const readStore = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStore = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

const clearStore = (): void => {
  try {
    window.localStorage.removeItem(bookingsStorageKey);
    window.localStorage.removeItem(logStorageKey);
  } catch {
    return;
  }
};

const createSession = (): Session =>
  startSession(parseBookings(readStore(bookingsStorageKey)), parseLog(readStore(logStorageKey)));

const clock = () => ({ now: new Date() });

export const Assistant = () => {
  const [session, setSession] = useState<Session>(createSession);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const phoneMode = expectsPhone(session);

  useEffect(() => {
    writeStore(bookingsStorageKey, session.bookings);
    writeStore(logStorageKey, session.log);
  }, [session.bookings, session.log]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
    if (ready.current) inputRef.current?.focus({ preventScroll: true });
    ready.current = true;
  }, [session.messages.length]);

  useEffect(() => {
    const root = document.getElementById(assistantRootId);
    if (!root) return;
    const handle = () => {
      const request = root.dataset.request;
      if (!request) return;
      delete root.dataset.request;
      if (request === 'booking') setSession(current => beginBooking(current, clock()));
      else inputRef.current?.focus({ preventScroll: true });
    };
    handle();
    document.addEventListener(assistantEvent, handle);
    return () => document.removeEventListener(assistantEvent, handle);
  }, []);

  const submit = (text: string): void => {
    setSession(current => sendText(current, text, clock()));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    if (!draft.trim()) {
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    submit(draft);
    setDraft('');
  };

  const restart = (): void => {
    clearStore();
    setSession(startSession());
    setDraft('');
    inputRef.current?.focus({ preventScroll: true });
  };

  const entries = [...session.log].reverse();

  return (
    <div class="assistant">
      <section class="panel assistant__chat" aria-labelledby="chat-title">
        <div class="stripe-band panel__stripe" aria-hidden="true" />
        <div class="panel__body">
          <div class="chat__head">
            <h3 id="chat-title">Rozmowa</h3>
            <button class="text-button" type="button" onClick={restart}>
              Wyczyść pokaz
            </button>
          </div>
          <div
            class="chat__transcript"
            ref={transcriptRef}
            role="log"
            aria-live="polite"
            aria-label="Rozmowa z asystentem"
            tabIndex={0}>
            {session.messages.map(message => (
              <p key={message.id} class={`message message--${message.from}`}>
                <span class="visually-hidden">
                  {message.from === 'assistant' ? 'Asystent: ' : 'Ty: '}
                </span>
                {message.text}
              </p>
            ))}
          </div>
          <div class="chips" role="group" aria-label="Szybkie odpowiedzi">
            {session.chips.map(chip => (
              <button
                key={chip.label}
                class="chip"
                type="button"
                disabled={chip.disabled}
                onClick={() => submit(chip.label)}>
                {chip.label}
                {chip.note ? ' ' : null}
                {chip.note ? <span class="chip__note">{chip.note}</span> : null}
              </button>
            ))}
          </div>
          <form class="composer" onSubmit={onSubmit} noValidate>
            <label class="composer__label" for="assistant-input">
              {phoneMode ? 'Numer telefonu' : 'Twoja wiadomość'}
            </label>
            <div class="composer__row">
              <input
                id="assistant-input"
                class="composer__input"
                ref={inputRef}
                type="text"
                value={draft}
                inputMode={phoneMode ? 'tel' : 'text'}
                autoComplete={phoneMode ? 'tel' : 'off'}
                aria-invalid={session.error ? 'true' : undefined}
                aria-describedby="assistant-error"
                onInput={event => setDraft(event.currentTarget.value)}
              />
              <button class="composer__send" type="submit">
                Wyślij
              </button>
            </div>
            <p id="assistant-error" class="composer__error">
              {session.error ?? ''}
            </p>
          </form>
        </div>
      </section>
      <aside class="backstage" aria-labelledby="backstage-title">
        <h3 id="backstage-title">Co dzieje się w tle</h3>
        <p class="backstage__lead">
          Tak wygląda praca asystenta po stronie serwisu. Każdy krok trafia na tę listę.
        </p>
        {entries.length === 0 ? (
          <p class="backstage__empty">Lista jest pusta. Zadaj pytanie asystentowi.</p>
        ) : (
          <div
            class="backstage__scroll"
            role="region"
            aria-label="Lista kroków asystenta"
            tabIndex={0}>
            <ol class="backstage__list" aria-live="off">
              {entries.map((entry, index) => (
                <li key={index} class="backstage__item">
                  <time class="backstage__time">{entry.time}</time>
                  <span class="backstage__kind">{logKindLabels[entry.kind]}</span>
                  <span class="backstage__text">{entry.text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </div>
  );
};
