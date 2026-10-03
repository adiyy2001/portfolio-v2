import { useMemo, useRef, useState } from 'preact/hooks';
import { voucherText } from '../content/voucher';
import type { Lang } from '../i18n/lang';
import { dayFromDate } from '../lib/dates';
import { formatDate, formatPln } from '../lib/format';
import {
  emptyVoucher,
  generateVoucherCode,
  isValidVoucherAmount,
  maxMessageLength,
  maxNameLength,
  validateVoucher,
  voucherAmounts,
  voucherExpiry,
  voucherValue,
  weekendVoucherPrice,
} from '../lib/voucher';
import type { VoucherDraft, VoucherErrors, VoucherKind } from '../lib/voucher';
import { Field } from './Field';

interface Props {
  lang: Lang;
}

const fieldIds = {
  amount: 'voucher-amount',
  recipient: 'voucher-recipient',
  sender: 'voucher-sender',
  message: 'voucher-message',
};

const parseAmount = (value: string): number => {
  const digits = value.replace(/\s+/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
};

export const VoucherBuilder = ({ lang }: Props) => {
  const text = voucherText[lang];
  const today = useMemo(() => dayFromDate(new Date()), []);
  const [draft, setDraft] = useState<VoucherDraft>(emptyVoucher);
  const [amountText, setAmountText] = useState(String(emptyVoucher.amount));
  const [attempted, setAttempted] = useState(false);
  const [finished, setFinished] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const errors: VoucherErrors = attempted ? validateVoucher(draft) : {};
  const errorFor = (key: keyof VoucherErrors, tooLong: string): string | undefined => {
    const problem = errors[key];
    if (!problem) return undefined;
    return problem === 'tooLong' ? tooLong : text.form.errors[problem];
  };
  const amountError = errorFor('amount', text.form.errors.tooLong);
  const recipientError = errorFor('recipient', text.form.tooLongName);
  const senderError = errorFor('sender', text.form.tooLongName);
  const messageError = errorFor('message', text.form.errors.tooLong);
  const summaryItems = [
    { id: fieldIds.amount, label: text.form.customAmount, message: amountError },
    { id: fieldIds.recipient, label: text.form.recipient, message: recipientError },
    { id: fieldIds.sender, label: text.form.sender, message: senderError },
    { id: fieldIds.message, label: text.form.message, message: messageError },
  ].filter(item => item.message !== undefined);

  const setKind = (kind: VoucherKind): void => setDraft(current => ({ ...current, kind }));

  const setAmount = (amount: number): void => {
    setAmountText(String(amount));
    setDraft(current => ({ ...current, amount }));
  };

  const typeAmount = (value: string): void => {
    setAmountText(value);
    setDraft(current => ({ ...current, amount: parseAmount(value) }));
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    setAttempted(true);
    const found = validateVoucher(draft);
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setFinished(generateVoucherCode(Math.random));
    window.setTimeout(() => doneRef.current?.focus(), 0);
  };

  const restart = (): void => {
    setFinished(null);
    setAttempted(false);
    window.scrollTo({ top: 0 });
  };

  const value = voucherValue(draft);
  const valueText = Number.isFinite(value) && value > 0 ? formatPln(value, lang) : '';
  const recipient = draft.recipient.trim();
  const sender = draft.sender.trim();
  const expiry = text.preview.validUntil(formatDate(voucherExpiry(today), lang));
  const preview = text.preview;

  const card = (
    <article class="voucher" data-kind={draft.kind} aria-label={preview.brand}>
      <div class="voucher-eyelet" aria-hidden="true" />
      <p class="voucher-brand">{preview.brand}</p>
      <p class="voucher-kind">{preview.kind[draft.kind]}</p>
      <p class="voucher-value num">{valueText || formatPln(0, lang)}</p>
      {draft.kind === 'package' ? (
        <p class="voucher-detail">
          <strong>{preview.packageTitle}</strong>
          <span>{preview.packageDetail}</span>
        </p>
      ) : null}
      <dl class="voucher-names">
        <div>
          <dt>{preview.forLabel}</dt>
          <dd data-empty={recipient === '' ? 'true' : undefined}>
            {recipient || preview.placeholderRecipient}
          </dd>
        </div>
        <div>
          <dt>{preview.fromLabel}</dt>
          <dd data-empty={sender === '' ? 'true' : undefined}>
            {sender || preview.placeholderSender}
          </dd>
        </div>
      </dl>
      <p class="voucher-message" data-empty={draft.message.trim() === '' ? 'true' : undefined}>
        {draft.message.trim() || preview.placeholderMessage}
      </p>
      <dl class="voucher-foot">
        <div>
          <dt>{preview.codeLabel}</dt>
          <dd class="voucher-code">{finished ?? preview.codePending}</dd>
        </div>
        <div>
          <dt>{preview.validLabel}</dt>
          <dd>{finished ? expiry : preview.validPending}</dd>
        </div>
      </dl>
      <p class="voucher-sample">{preview.sample}</p>
    </article>
  );

  if (finished) {
    return (
      <div class="voucher-done">
        <h2 tabIndex={-1} ref={doneRef}>
          {text.done.heading}
        </h2>
        <p class="notice notice--strong" role="status">
          {text.done.nothing}
        </p>
        <div class="voucher-sheet">{card}</div>
        <div class="btn-row">
          <button class="btn" type="button" onClick={() => window.print()}>
            {text.done.print}
          </button>
          <button class="btn btn--ghost" type="button" onClick={restart}>
            {text.done.again}
          </button>
        </div>
        <p class="step-note">{text.done.printHint}</p>
      </div>
    );
  }

  const amountIsPreset =
    voucherAmounts.includes(draft.amount) && isValidVoucherAmount(draft.amount);

  return (
    <div class="voucher-layout">
      <form class="voucher-form" onSubmit={submit} noValidate>
        <h2>{text.form.heading}</h2>
        {summaryItems.length > 0 ? (
          <div class="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
            <h3>{text.form.errorSummary}</h3>
            <ul>
              {summaryItems.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    {item.label}: {item.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <fieldset class="choice-group">
          <legend>{text.form.kindLegend}</legend>
          <div class="voucher-kinds">
            {(['amount', 'package'] as const).map(kind => (
              <label class="check" key={kind}>
                <input
                  type="radio"
                  name="voucher-kind"
                  checked={draft.kind === kind}
                  onChange={() => setKind(kind)}
                />
                <span>{text.form.kinds[kind]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {draft.kind === 'package' ? (
          <p class="notice">{text.form.packageText(formatPln(weekendVoucherPrice, lang))}</p>
        ) : (
          <fieldset class="choice-group">
            <legend>{text.form.amountLegend}</legend>
            <div class="voucher-amounts">
              {voucherAmounts.map(amount => (
                <label class="check" key={amount}>
                  <input
                    type="radio"
                    name="voucher-amount-preset"
                    checked={amountIsPreset && draft.amount === amount}
                    onChange={() => setAmount(amount)}
                  />
                  <span class="num">{formatPln(amount, lang)}</span>
                </label>
              ))}
            </div>
            <Field
              id={fieldIds.amount}
              label={text.form.customAmount}
              hint={text.form.customHint}
              value={amountText}
              error={amountError}
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              onInput={typeAmount}
            />
          </fieldset>
        )}
        <div class="form-grid">
          <Field
            id={fieldIds.recipient}
            label={text.form.recipient}
            hint={text.form.recipientHint}
            value={draft.recipient}
            error={recipientError}
            autoComplete="off"
            maxLength={maxNameLength + 20}
            onInput={recipientValue =>
              setDraft(current => ({ ...current, recipient: recipientValue }))
            }
          />
          <Field
            id={fieldIds.sender}
            label={text.form.sender}
            value={draft.sender}
            error={senderError}
            autoComplete="name"
            maxLength={maxNameLength + 20}
            onInput={senderValue => setDraft(current => ({ ...current, sender: senderValue }))}
          />
          <Field
            id={fieldIds.message}
            label={text.form.message}
            hint={text.form.messageHint}
            value={draft.message}
            error={messageError}
            multiline
            maxLength={maxMessageLength + 60}
            onInput={messageValue => setDraft(current => ({ ...current, message: messageValue }))}
            extra={
              <p class="count">{text.form.messageCount(draft.message.length, maxMessageLength)}</p>
            }
          />
        </div>
        <div class="btn-row">
          <button class="btn" type="submit">
            {text.form.submit}
          </button>
        </div>
      </form>
      <div class="voucher-preview" role="group" aria-labelledby="preview-title">
        <h2 id="preview-title">{preview.heading}</h2>
        {card}
      </div>
    </div>
  );
};
