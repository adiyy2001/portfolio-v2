import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { contactText, topicIds } from '../content/contact';
import type { TopicId } from '../content/contact';
import { forms, problemText } from '../content/forms';
import { hotel } from '../data/hotel';
import { pagePath } from '../i18n/lang';
import type { Lang } from '../i18n/lang';
import { validateEmail, validateName, validateText } from '../lib/validation';
import type { FieldProblem } from '../lib/validation';
import { Field } from './Field';

interface Props {
  lang: Lang;
}

type FieldName = 'name' | 'email' | 'message';

interface Draft {
  name: string;
  email: string;
  topic: TopicId;
  message: string;
}

const minMessage = 10;
const fieldIds: Record<FieldName, string> = {
  name: 'ct-name',
  email: 'ct-email',
  message: 'ct-message',
};

const emptyDraft = (): Draft => ({ name: '', email: '', topic: 'stay', message: '' });

export const ContactForm = ({ lang }: Props) => {
  const text = contactText[lang];
  const common = forms[lang];
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [attempted, setAttempted] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    if (sentName !== null) doneRef.current?.focus();
  }, [sentName]);

  const problems = (): { field: FieldName; problem: FieldProblem }[] => {
    const checks: [FieldName, FieldProblem | null][] = [
      ['name', validateName(draft.name)],
      ['email', validateEmail(draft.email)],
      ['message', validateText(draft.message, minMessage)],
    ];
    return checks.flatMap(([field, problem]) => (problem ? [{ field, problem }] : []));
  };

  const shown = attempted ? problems() : [];
  const messageFor = (field: FieldName): string | undefined => {
    const found = shown.find(item => item.field === field);
    return found ? problemText(lang, field, found.problem) : undefined;
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    const found = problems();
    if (found.length > 0) {
      setAttempted(true);
      window.setTimeout(() => document.getElementById(fieldIds[found[0].field])?.focus(), 0);
      return;
    }
    setSentName(draft.name.trim());
  };

  const reset = (): void => {
    setDraft(emptyDraft());
    setAttempted(false);
    setSentName(null);
  };

  if (sentName !== null) {
    return (
      <div class="karta">
        <div class="karta-in single">
          <div class="confirm done" id="contact-done">
            <h2 class="confirm-h" tabIndex={-1} ref={doneRef}>
              {text.doneHeading}
            </h2>
            <p class="confirm-lead">{text.doneLead(sentName)}</p>
            <p class="notice" role="status">
              {common.sampleNothingSent}
            </p>
            <p class="confirm-call">
              <a class="confirm-tel" href={hotel.phoneHref}>
                {hotel.phone}
              </a>
            </p>
            <p class="confirm-extra">
              <a href={link(pagePath('booking', lang))}>{text.ctaBooking}</a>
              <button type="button" class="linkish" onClick={reset}>
                {text.another}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="karta">
      <div class="karta-in single">
        <div class="flow solo">
          <form class="flow-main contact-form" onSubmit={submit} noValidate aria-labelledby="ct-h">
            <h2 class="step-h" id="ct-h">
              {text.formHeading}
            </h2>
            <p class="sub-lead">{text.formLead}</p>
            <div class="fields">
              <Field
                id={fieldIds.name}
                name="name"
                label={common.name}
                value={draft.name}
                autoComplete="name"
                error={messageFor('name')}
                onInput={value => setDraft(current => ({ ...current, name: value }))}
              />
              <Field
                id={fieldIds.email}
                name="email"
                label={common.email}
                type="email"
                inputMode="email"
                value={draft.email}
                autoComplete="email"
                error={messageFor('email')}
                onInput={value => setDraft(current => ({ ...current, email: value }))}
              />
            </div>
            <fieldset class="choices two">
              <legend>{text.topicLegend}</legend>
              {topicIds.map(id => (
                <div class="choice" key={id}>
                  <input
                    type="radio"
                    name="topic"
                    id={`ct-topic-${id}`}
                    value={id}
                    checked={draft.topic === id}
                    onChange={() => setDraft(current => ({ ...current, topic: id }))}
                  />
                  <label for={`ct-topic-${id}`}>
                    <span>
                      <span class="c-main">{text.topics[id]}</span>
                    </span>
                  </label>
                </div>
              ))}
            </fieldset>
            <Field
              id={fieldIds.message}
              name="message"
              label={common.message}
              value={draft.message}
              multiline
              maxLength={1000}
              error={messageFor('message')}
              onInput={value => setDraft(current => ({ ...current, message: value }))}
            />
            {shown.length > 0 ? (
              <div class="flow-error" role="alert">
                <strong>{common.errorsHeading}</strong>
                <ul>
                  {shown.map(item => (
                    <li key={item.field}>{problemText(lang, item.field, item.problem)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div class="flow-nav">
              <span></span>
              <button class="ticket rev" type="submit">
                {text.send}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
