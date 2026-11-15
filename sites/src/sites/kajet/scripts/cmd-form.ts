import { facts } from '../data/site';
import { firstInvalidField, validateQuote } from '../lib/validation';
import { find, make } from './dom';

export const setupCmdForm = (): void => {
  const form = find(document, '#cmd', HTMLFormElement);
  const mail = find(form, '#cmd-mail', HTMLInputElement);
  const forma = find(form, '#cmd-forma', HTMLSelectElement);
  const faktur = find(form, '#cmd-faktur', HTMLInputElement);
  const log = find(form, '#cmd-log', HTMLElement);
  form.noValidate = true;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const errors = validateQuote(
      { email: mail.value, forma: forma.value, faktur: faktur.value, name: '', phone: '', consent: false },
      false,
    );
    const invalid = firstInvalidField(errors);
    log.classList.remove('done');
    if (invalid) {
      log.textContent = errors[invalid] ?? '';
      const target = invalid === 'email' ? mail : invalid === 'forma' ? forma : faktur;
      target.focus();
      return;
    }
    log.textContent = '';
    log.classList.add('done');
    log.append(
      make('b', '', 'to jest strona przykładowa, nic nie zostało wysłane. '),
      document.createTextNode(
        `Prawdziwe biuro odpisałoby na ${mail.value.trim()} w ciągu ${facts.replyHours} godzin w dni robocze.`,
      ),
    );
    form.reset();
  });
};
