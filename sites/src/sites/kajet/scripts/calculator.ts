import { grossFrom, maxInvoices, type CompanyForm } from '../data/plans';
import { formatGrosze, formatPrice, invoicesLabel } from '../lib/format';
import { clampInvoices, recommendPlan } from '../lib/picker';
import { find, findAll, findOptional, groupKeys } from './dom';
import { clientEvent, type ClientEventDetail } from './panel';

const isForm = (value: string | undefined): value is CompanyForm =>
  value === 'osoba' || value === 'spolka';

const needIds = ['payroll', 'phone', 'office', 'partners'] as const;

export const setupCalculator = (): void => {
  const range = find(document, '#inv-range', HTMLInputElement);
  const number = find(document, '#inv-num', HTMLInputElement);
  const summary = find(document, '#calc-sum', HTMLElement);
  const note = findOptional(document, '#plan-note', HTMLElement);
  const group = find(document, '.calc-in [role="radiogroup"]', HTMLElement);
  const formButtons = findAll(group, '[data-form]', HTMLButtonElement);
  const planCells = findAll(document, '#plans [data-plan]', HTMLElement);
  const priceRows = findAll(document, '#plans [data-form]', HTMLElement);
  const quoteForma = findOptional(document, '#cmd-forma', HTMLSelectElement);
  const quoteFaktur = findOptional(document, '#cmd-faktur', HTMLInputElement);
  const needBoxes = needIds.map(id => ({
    id,
    input: findOptional(document, `input[data-need="${id}"]`, HTMLInputElement),
  }));
  const reasons = findOptional(document, '#calc-reasons', HTMLElement);
  const outPlan = findOptional(document, '#out-plan', HTMLElement);
  const outPrice = findOptional(document, '#out-price', HTMLElement);
  const outUnit = findOptional(document, '#out-unit', HTMLElement);
  const outGross = findOptional(document, '#out-gross', HTMLElement);
  const quoteLink = findOptional(document, '#calc-quote', HTMLAnchorElement);
  const state: { form: CompanyForm; invoices: number } = {
    form: 'osoba',
    invoices: clampInvoices(Number(range.value)),
  };
  let touched = false;

  const markManual = (): void => {
    touched = true;
    if (note) note.textContent = 'wpis ręczny';
  };

  const needValue = (id: (typeof needIds)[number]): boolean =>
    needBoxes.find(item => item.id === id)?.input?.checked ?? false;

  const render = (): void => {
    const { invoices, form } = state;
    const result = recommendPlan({
      form,
      invoices,
      payroll: needValue('payroll'),
      phone: needValue('phone'),
      office: needValue('office'),
      partners: needValue('partners'),
    });
    range.value = String(invoices);
    if (document.activeElement !== number) number.value = String(invoices);
    range.setAttribute('aria-valuetext', `${invoicesLabel(invoices)}, plan ${result.plan.name}`);
    for (const cell of planCells) {
      cell.classList.toggle('pick', Number(cell.dataset.plan) === result.index);
    }
    for (const row of priceRows) row.classList.toggle('dim', row.dataset.form !== form);
    const unit = invoices > 0 ? formatGrosze(Math.round((result.price * 100) / invoices)) : '0,00';
    summary.textContent = `${invoicesLabel(invoices)}, ${form === 'osoba' ? 'osoba fizyczna' : 'spółka'}, plan ${result.plan.name}: ${formatPrice(result.price)} zł netto miesięcznie, ${unit} zł za fakturę.`;
    if (outPlan) outPlan.textContent = result.plan.name;
    if (outPrice) outPrice.textContent = `${formatPrice(result.price)} zł`;
    if (outUnit) outUnit.textContent = `${unit} zł`;
    if (outGross) outGross.textContent = `${formatPrice(grossFrom(result.price))} zł`;
    if (reasons) {
      reasons.textContent = '';
      for (const text of result.reasons) {
        const li = document.createElement('li');
        li.textContent = text;
        reasons.append(li);
      }
    }
    if (quoteLink) {
      const base = quoteLink.dataset.base ?? '';
      const params = new URLSearchParams({
        forma: form,
        faktur: String(invoices),
        plan: result.plan.id,
      });
      quoteLink.href = `${base}?${params.toString()}#wycena`;
    }
    if (touched) {
      if (quoteForma) quoteForma.value = form === 'osoba' ? 'osoba fizyczna' : 'spółka z o.o.';
      if (quoteFaktur) quoteFaktur.value = String(invoices);
    }
  };

  const setForm = (form: CompanyForm): void => {
    state.form = form;
    for (const button of formButtons) {
      const on = button.dataset.form === form;
      button.setAttribute('aria-checked', on ? 'true' : 'false');
      button.tabIndex = on ? 0 : -1;
    }
    render();
  };

  range.addEventListener('input', () => {
    markManual();
    state.invoices = clampInvoices(Number(range.value));
    render();
  });
  number.addEventListener('input', () => {
    if (number.value === '') return;
    markManual();
    state.invoices = Math.max(0, Math.min(maxInvoices, Math.round(Number(number.value))));
    render();
  });
  number.addEventListener('blur', () => {
    number.value = String(state.invoices);
  });
  for (const button of formButtons) {
    button.addEventListener('click', () => {
      const form = button.dataset.form;
      if (!isForm(form)) return;
      markManual();
      setForm(form);
    });
  }
  groupKeys(group, '[data-form]', button => {
    const form = button.dataset.form;
    if (!isForm(form)) return;
    markManual();
    setForm(form);
  });
  for (const { input } of needBoxes) {
    input?.addEventListener('change', () => {
      markManual();
      render();
    });
  }

  document.addEventListener(clientEvent, event => {
    if (!(event instanceof CustomEvent)) return;
    const detail: ClientEventDetail = event.detail;
    state.invoices = clampInvoices(detail.invoices);
    touched = false;
    if (note) note.textContent = `z panelu: ${detail.name}`;
    setForm(detail.form);
  });

  render();
};
