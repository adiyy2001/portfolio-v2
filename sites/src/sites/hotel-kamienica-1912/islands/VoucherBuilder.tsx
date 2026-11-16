import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { forms } from '../content/forms';
import { voucherText } from '../content/voucher';
import { hotel } from '../data/hotel';
import { pagePath } from '../i18n/lang';
import type { Lang } from '../i18n/lang';
import { formatDate, todayIso } from '../lib/dates';
import { formatMoney } from '../lib/format';
import { browserStore, saveVoucher } from '../lib/storage';
import { validateName } from '../lib/validation';
import { buildVoucher, maxVoucherMessage, validUntil } from '../lib/voucher';
import type { Voucher } from '../lib/voucher';
import { Field } from './Field';

interface Props {
  lang: Lang;
}

interface Draft {
  amount: number;
  recipient: string;
  sender: string;
  message: string;
}

interface Problem {
  id: string;
  text: string;
}

const fieldIds = { recipient: 'vc-recipient', sender: 'vc-sender', message: 'vc-message' };

const VoucherCard = ({
  lang,
  amount,
  recipient,
  sender,
  message,
  codeLine,
  until,
}: {
  lang: Lang;
  amount: number;
  recipient: string;
  sender: string;
  message: string;
  codeLine: string;
  until: string;
}) => {
  const text = voucherText[lang];
  return (
    <div class="voucher-card">
      <div class="vc-in">
        <p class="vc-brand">
          <span class="mark-big">{hotel.shortName}</span>
          <span class="mark-sub">Hotel 1912</span>
        </p>
        <span class="vc-amount">{formatMoney(amount, lang)}</span>
        <p class="vc-to">
          {recipient === '' ? text.previewPlaceholder : `${text.previewTo}: ${recipient}`}
        </p>
        <p class="vc-msg">{message === '' ? text.previewMessage : message}</p>
        <p class="vc-msg">
          {sender === '' ? text.previewSenderPlaceholder : `${text.previewFrom}: ${sender}`}
        </p>
        <p class="vc-code">{codeLine}</p>
        <p class="vc-until">{until}</p>
      </div>
    </div>
  );
};

export const VoucherBuilder = ({ lang }: Props) => {
  const text = voucherText[lang];
  const common = forms[lang];
  const [draft, setDraft] = useState<Draft>({
    amount: hotel.voucherAmounts[1],
    recipient: '',
    sender: '',
    message: '',
  });
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState<Voucher | null>(null);
  const [failed, setFailed] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    if (saved) doneRef.current?.focus();
  }, [saved]);

  const change = (patch: Partial<Draft>): void => {
    setDraft(current => ({ ...current, ...patch }));
    setFailed(false);
  };

  const problems = (): Problem[] => {
    const found: Problem[] = [];
    const recipient = validateName(draft.recipient);
    if (recipient)
      found.push({
        id: fieldIds.recipient,
        text: recipient === 'required' ? text.recipientRequired : text.recipientInvalid,
      });
    const sender = validateName(draft.sender);
    if (sender)
      found.push({
        id: fieldIds.sender,
        text: sender === 'required' ? text.senderRequired : text.senderInvalid,
      });
    return found;
  };

  const shown = attempted ? problems() : [];
  const messageFor = (id: string): string | undefined => shown.find(item => item.id === id)?.text;

  const submit = (event: Event): void => {
    event.preventDefault();
    const found = problems();
    if (found.length > 0) {
      setAttempted(true);
      window.setTimeout(() => document.getElementById(found[0].id)?.focus(), 0);
      return;
    }
    const voucher = buildVoucher(draft);
    if (!saveVoucher(browserStore(), voucher)) {
      setFailed(true);
      return;
    }
    setSaved(voucher);
  };

  const reset = (): void => {
    setDraft({ amount: hotel.voucherAmounts[1], recipient: '', sender: '', message: '' });
    setSaved(null);
    setAttempted(false);
    setFailed(false);
  };

  if (saved) {
    return (
      <div class="karta">
        <div class="karta-in single">
          <div class="confirm done" id="voucher-done">
            <h2 class="confirm-h" tabIndex={-1} ref={doneRef}>
              {text.doneHeading}
            </h2>
            <p class="confirm-lead">{text.doneLead}</p>
            <VoucherCard
              lang={lang}
              amount={saved.amount}
              recipient={saved.recipient}
              sender={saved.sender}
              message={saved.message}
              codeLine={text.code(saved.code)}
              until={text.validity(formatDate(saved.validUntil, lang))}
            />
            <p class="notice" role="status">
              {text.doneSaved} {common.sampleNothingSent}
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
        <div class="flow">
          <form class="flow-main" onSubmit={submit} noValidate aria-label={text.heading}>
            <fieldset class="choices two">
              <legend>{text.amountLegend}</legend>
              {hotel.voucherAmounts.map(amount => {
                const id = `vc-amount-${amount}`;
                return (
                  <div class="choice" key={amount}>
                    <input
                      type="radio"
                      name="amount"
                      id={id}
                      value={amount}
                      checked={amount === draft.amount}
                      onChange={() => change({ amount })}
                    />
                    <label for={id}>
                      <span>
                        <span class="c-main">{formatMoney(amount, lang)}</span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </fieldset>
            <div class="fields">
              <Field
                id={fieldIds.recipient}
                name="recipient"
                label={text.recipient}
                value={draft.recipient}
                hint={text.recipientHint}
                error={messageFor(fieldIds.recipient)}
                autoComplete="off"
                maxLength={60}
                onInput={value => change({ recipient: value })}
              />
              <Field
                id={fieldIds.sender}
                name="sender"
                label={text.sender}
                value={draft.sender}
                hint={text.senderHint}
                error={messageFor(fieldIds.sender)}
                autoComplete="name"
                maxLength={60}
                onInput={value => change({ sender: value })}
              />
              <Field
                id={fieldIds.message}
                name="message"
                label={text.message}
                value={draft.message}
                hint={text.messageCount(draft.message.length)}
                multiline
                required={false}
                maxLength={maxVoucherMessage}
                onInput={value => change({ message: value })}
              />
            </div>
            {shown.length > 0 ? (
              <div class="flow-error" role="alert">
                <strong>{text.errorsHeading}</strong>
                <ul>
                  {shown.map(item => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {failed ? (
              <p class="flow-error" role="alert">
                {text.saveFailed}
              </p>
            ) : null}
            <div class="flow-nav">
              <span></span>
              <button class="ticket rev" type="submit">
                {text.create}
              </button>
            </div>
          </form>
          <aside class="flow-side" aria-label={text.previewLabel}>
            <VoucherCard
              lang={lang}
              amount={draft.amount}
              recipient={draft.recipient.trim()}
              sender={draft.sender.trim()}
              message={draft.message.trim()}
              codeLine={text.previewCode}
              until={text.validity(formatDate(validUntil(todayIso()), lang))}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};
