import { useRef, useState } from 'preact/hooks';
import { contactText } from '../content/contact';
import type { Lang } from '../i18n/lang';
import {
  contactTopics,
  emptyContact,
  isContactTopic,
  maxContactMessageLength,
  validateContact,
} from '../lib/contact';
import type { ContactDraft, ContactErrors } from '../lib/contact';
import { Field } from './Field';

interface Props {
  lang: Lang;
}

const ids = {
  name: 'contact-name',
  email: 'contact-email',
  topic: 'contact-topic',
  message: 'contact-message',
};

export const ContactForm = ({ lang }: Props) => {
  const copy = contactText[lang].form;
  const [draft, setDraft] = useState<ContactDraft>(emptyContact);
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  const errors: ContactErrors = attempted ? validateContact(draft) : {};
  const messageFor = (key: keyof ContactErrors): string | undefined => {
    const problem = errors[key];
    return problem ? copy.errors[problem] : undefined;
  };
  const nameError = messageFor('name');
  const emailError = messageFor('email');
  const messageError = messageFor('message');
  const summary = [
    { id: ids.name, label: copy.name, message: nameError },
    { id: ids.email, label: copy.email, message: emailError },
    { id: ids.message, label: copy.message, message: messageError },
  ].filter(item => item.message !== undefined);

  const submit = (event: Event): void => {
    event.preventDefault();
    setAttempted(true);
    if (Object.keys(validateContact(draft)).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setSent(true);
    window.setTimeout(() => sentRef.current?.focus(), 0);
  };

  const reset = (): void => {
    setDraft(emptyContact);
    setAttempted(false);
    setSent(false);
  };

  if (sent) {
    return (
      <div class="contact-sent">
        <h3 tabIndex={-1} ref={sentRef}>
          {copy.sentHeading}
        </h3>
        <p class="notice notice--strong" role="status">
          {copy.sentNothing}
        </p>
        <p>{copy.sentText}</p>
        <div class="btn-row">
          <button class="btn btn--ghost" type="button" onClick={reset}>
            {copy.again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form class="contact-form" onSubmit={submit} noValidate>
      <p class="step-note">{copy.lead}</p>
      {summary.length > 0 ? (
        <div class="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <h3>{copy.errorSummary}</h3>
          <ul>
            {summary.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`}>
                  {item.label}: {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Field
        id={ids.name}
        label={copy.name}
        value={draft.name}
        error={nameError}
        autoComplete="name"
        onInput={name => setDraft(current => ({ ...current, name }))}
      />
      <Field
        id={ids.email}
        label={copy.email}
        type="email"
        value={draft.email}
        error={emailError}
        autoComplete="email"
        onInput={email => setDraft(current => ({ ...current, email }))}
      />
      <div class="field">
        <label for={ids.topic}>{copy.topic}</label>
        <select
          id={ids.topic}
          name={ids.topic}
          value={draft.topic}
          onChange={event => {
            const topic = event.currentTarget.value;
            if (isContactTopic(topic)) setDraft(current => ({ ...current, topic }));
          }}>
          {contactTopics.map(topic => (
            <option value={topic} key={topic}>
              {copy.topics[topic]}
            </option>
          ))}
        </select>
      </div>
      <Field
        id={ids.message}
        label={copy.message}
        hint={copy.messageHint}
        value={draft.message}
        error={messageError}
        multiline
        maxLength={maxContactMessageLength + 100}
        onInput={message => setDraft(current => ({ ...current, message }))}
        extra={
          <p class="count">{copy.messageCount(draft.message.length, maxContactMessageLength)}</p>
        }
      />
      <div class="btn-row">
        <button class="btn" type="submit">
          {copy.submit}
        </button>
      </div>
    </form>
  );
};
