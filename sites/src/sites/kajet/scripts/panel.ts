import { clients, type Client } from '../data/clients';
import {
  calcMonth,
  clientDeadlines,
  generateInvoices,
  type ClientDeadline,
  type Invoice,
  type MonthResult,
} from '../lib/billing';
import {
  dayMonth,
  dayMonthYear,
  inDaysLabel,
  monthNames,
  monthNamesShort,
  monthRefs,
  type MonthRef,
} from '../lib/dates';
import { formatGrosze, formatZloty, invoicesLabel, pad, plural } from '../lib/format';
import { find, findAll, groupKeys, listKeys, make, prefersReducedMotion, setSelected } from './dom';
import { isKeysOn } from './keys';

type Filter = 'all' | 'pending' | 'late';

interface LedgerRow {
  key: keyof MonthResult;
  label: string;
  className: string;
}

const ledgerRows: readonly LedgerRow[] = [
  { key: 'sales', label: 'przychody netto', className: '' },
  { key: 'costs', label: 'koszty netto', className: '' },
  { key: 'out', label: 'vat należny', className: '' },
  { key: 'inn', label: 'vat naliczony', className: '' },
  { key: 'vat', label: 'vat do zapłaty', className: 'sub' },
  { key: 'base', label: 'podstawa podatku', className: '' },
  { key: 'tax', label: 'zaliczka', className: 'sub' },
  { key: 'zus', label: 'składki zus', className: 'sub' },
  { key: 'total', label: 'razem do zapłaty', className: 'sum' },
];

const filterOrder: readonly Filter[] = ['all', 'pending', 'late'];

const isFilter = (value: string | undefined): value is Filter =>
  value === 'all' || value === 'pending' || value === 'late';

interface Current {
  client: Client;
  month: MonthRef;
  result: MonthResult;
  deadlines: ClientDeadline[];
}

export const clientEvent = 'kajet:client';

export interface ClientEventDetail {
  form: 'osoba' | 'spolka';
  invoices: number;
  name: string;
}

export const setupPanel = (): {
  handleKey: (event: KeyboardEvent) => boolean;
  focusSearch: () => void;
} => {
  let now = new Date();
  const months = monthRefs(now, 6);
  const reduce = prefersReducedMotion();
  const state = { client: 1, month: 0, filter: 'all' as Filter, query: '', invoice: 0 };
  let current: Current | null = null;
  let invoiceData: Invoice[] = [];

  const clientsBox = find(document, '#clients', HTMLElement);
  const select = find(document, '#client-select', HTMLSelectElement);
  const query = find(document, '#client-q', HTMLInputElement);
  const historyBox = find(document, '#history', HTMLElement);
  const invoicesBox = find(document, '#invoices', HTMLElement);
  const ledger = find(document, '#ledger', HTMLElement);
  const filterBox = find(document, '#inv-filter', HTMLElement);
  const hero = find(document, '#rozliczenie', HTMLElement);
  const clientCount = find(document, '#client-count', HTMLElement);
  const figLabel = find(document, '#fig-label', HTMLElement);
  const figTotal = find(document, '#fig-total', HTMLOutputElement);
  const clientTitle = find(document, '#client-title', HTMLElement);
  const clientMeta = find(document, '#client-meta', HTMLElement);
  const deadlinesList = find(document, '#deadlines', HTMLElement);
  const deadlineMonth = find(document, '#dl-month', HTMLElement);
  const countdown = find(document, '#countdown', HTMLElement);
  const ruler = find(document, '#ruler', HTMLElement);
  const invoiceCount = find(document, '#inv-count', HTMLElement);
  const invoiceSum = find(document, '#inv-sum', HTMLElement);

  const clientOf = (): Client => {
    const client = clients[state.client];
    if (!client) throw new Error('Unknown client');
    return client;
  };
  const monthOf = (): MonthRef => {
    const month = months[state.month];
    if (!month) throw new Error('Unknown month');
    return month;
  };

  const ledgerCells = new Map<
    keyof MonthResult,
    { label: HTMLElement; basis: HTMLElement; amount: HTMLElement; term: HTMLElement }
  >();
  for (const row of ledgerRows) {
    const tr = make('tr', row.className);
    const label = make('td', 'label', row.label);
    const basis = make('td', 'basis');
    const amount = make('td', 'num');
    const term = make('td', 'num muted');
    tr.append(label, basis, amount, term);
    ledger.append(tr);
    ledgerCells.set(row.key, { label, basis, amount, term });
  }

  const flash = (node: HTMLElement, text: string): void => {
    if (node.textContent === text) return;
    node.textContent = text;
    if (reduce) return;
    node.classList.add('flash');
    window.setTimeout(() => node.classList.remove('flash'), 140);
  };

  const visibleClients = (): Array<{ client: Client; index: number }> => {
    const text = state.query.trim().toLowerCase();
    return clients
      .map((client, index) => ({ client, index }))
      .filter(
        ({ client }) =>
          !text || client.name.toLowerCase().includes(text) || client.id.toLowerCase().includes(text),
      );
  };

  const syncClientSelection = (): void => {
    for (const button of findAll(clientsBox, '.c-row', HTMLElement)) {
      setSelected(button, Number(button.dataset.i) === state.client);
    }
    select.value = String(state.client);
  };

  const renderClients = (): void => {
    const visible = visibleClients();
    clientsBox.textContent = '';
    clientCount.textContent = `${visible.length} z ${clients.length}`;
    const first = visible[0];
    if (!first) {
      clientsBox.append(make('p', 'empty', 'brak klientów dla tego wyszukiwania'));
      return;
    }
    const hasSelected = visible.some(item => item.index === state.client);
    for (const { client, index } of visible) {
      const button = make('button', 'c-row');
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.id = `c-${index}`;
      button.dataset.i = String(index);
      setSelected(button, hasSelected ? index === state.client : index === first.index);
      button.append(
        make('span', 'c-id', client.id),
        make('span', 'c-name', client.name),
        make(
          'span',
          'c-meta',
          `${client.form === 'jdg' ? 'jdg' : 'spółka'} · ${invoicesLabel(client.invoices)}`,
        ),
      );
      clientsBox.append(button);
    }
    if (!hasSelected) setClient(first.index, false);
  };

  for (const [index, client] of clients.entries()) {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${client.id} ${client.name}`;
    select.append(option);
  }

  const historyRows = months.map((month, index) => {
    const button = make('button', 'h-row');
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.id = `m-${index}`;
    button.dataset.i = String(index);
    const bar = make('span', 'h-bar');
    bar.setAttribute('aria-hidden', 'true');
    const fill = make('span', 'h-fill');
    bar.append(fill);
    const value = make('span', 'h-val');
    button.append(make('span', 'h-m', `${monthNamesShort[month.m]} ${month.y}`), bar, value);
    historyBox.append(button);
    return { button, fill, value };
  });

  const renderHistory = (): void => {
    const client = clientOf();
    const totals = months.map(month => calcMonth(client, month).total);
    const max = Math.max(...totals);
    historyRows.forEach((row, index) => {
      const total = totals[index] ?? 0;
      row.value.textContent = formatZloty(total);
      row.fill.style.width = `${Math.max(1, Math.round((total / max) * 100))}%`;
      setSelected(row.button, index === state.month);
    });
  };

  const renderRuler = (): void => {
    if (!current) return;
    ruler.textContent = '';
    const reference = current.deadlines[0]?.date;
    if (!reference) return;
    const daysInMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 0).getDate();
    const marks = new Set(current.deadlines.map(item => item.date.getDate()));
    const todayDay =
      now.getFullYear() === reference.getFullYear() && now.getMonth() === reference.getMonth()
        ? now.getDate()
        : 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const isMark = marks.has(day);
      const tick = make(
        'span',
        `rl-t${isMark ? ' mark' : ''}${day === todayDay ? ' today' : ''}${day % 5 === 0 ? ' five' : ''}`,
      );
      tick.style.setProperty('--x', `${((day - 0.5) / daysInMonth) * 100}%`);
      if (isMark || day === todayDay) {
        tick.append(make('span', 'rl-l', day === todayDay && !isMark ? `dziś ${day}` : String(day)));
      }
      ruler.append(tick);
    }
  };

  const countdownText = (ms: number): string => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days} d ${pad(hours)}:${pad(minutes)}`;
  };

  const renderCountdown = (): void => {
    if (!current) return;
    const open = current.deadlines
      .filter(item => item.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const first = open[0];
    if (!first) {
      countdown.textContent = `wszystkie terminy za ${monthNames[current.month.m]} minęły, płatności rozliczone`;
      return;
    }
    const names = open
      .filter(item => item.date.getTime() === first.date.getTime())
      .map(item => item.name)
      .join(', ');
    countdown.textContent = '';
    countdown.append(
      document.createTextNode('najbliższy termin: '),
      make('b', '', names),
      document.createTextNode(`, ${dayMonthYear(first.date)}, za `),
      make('b', '', countdownText(first.date.getTime() - now.getTime())),
    );
  };

  const renderDeadlines = (): void => {
    if (!current) return;
    deadlinesList.textContent = '';
    deadlineMonth.textContent = `za ${monthNamesShort[current.month.m]} ${current.month.y}`;
    const open = current.deadlines.filter(item => item.date > now);
    const firstTime = open.length ? Math.min(...open.map(item => item.date.getTime())) : 0;
    for (const item of current.deadlines) {
      const li = make('li');
      if (open.length && item.date.getTime() === firstTime) li.className = 'next';
      li.append(
        make('span', 'nm', item.name),
        make('span', 'amt', formatZloty(item.amount)),
        make('span', 'when', dayMonthYear(item.date)),
        make('span', 'st', item.date > now ? inDaysLabel(item.date, now) : 'rozliczone'),
      );
      deadlinesList.append(li);
    }
  };

  const renderLedger = (): void => {
    const client = clientOf();
    const month = monthOf();
    const result = calcMonth(client, month);
    const deadlines = clientDeadlines(client, month, result);
    const byKey = new Map(deadlines.map(item => [item.key, item]));
    const costPercent = String(Math.round((result.costs / result.sales) * 1000) / 10).replace('.', ',');
    const basis: Record<keyof MonthResult, string> = {
      sales: invoicesLabel(invoiceData.length),
      costs: `${costPercent}% przychodów`,
      out: `${Math.round(client.vatOut * 100)}% od ${formatGrosze(result.sales)}`,
      inn:
        client.vatShare < 1
          ? `23% od ${Math.round(client.vatShare * 100)}% kosztów`
          : `23% od ${formatGrosze(result.vatBase)}`,
      vat: 'należny minus naliczony',
      base: client.form === 'jdg' ? 'dochód minus składki społeczne' : 'przychody minus koszty',
      tax: `${Math.round(client.taxRate * 100)}% od ${formatGrosze(result.base)}`,
      zus:
        client.form === 'jdg'
          ? `w tym społeczne ${formatGrosze(client.zusDed)}`
          : `${client.staff} ${plural(client.staff, 'pracownik', 'pracowników', 'pracowników')}`,
      total: '3 płatności',
    };
    for (const row of ledgerRows) {
      const cells = ledgerCells.get(row.key);
      if (!cells) continue;
      cells.label.textContent = row.key === 'tax' ? client.taxName : row.label;
      flash(cells.basis, basis[row.key]);
      flash(cells.amount, formatGrosze(result[row.key]));
      const deadline = byKey.get(row.key as ClientDeadline['key']);
      cells.term.textContent = deadline ? dayMonth(deadline.date) : '';
    }
    figLabel.textContent = `razem do zapłaty za ${monthNames[month.m]} ${month.y}`;
    const total = formatZloty(result.total);
    if (figTotal.textContent !== total) figTotal.textContent = total;
    clientTitle.textContent = client.name;
    clientMeta.textContent = `NIP ${client.nip} · ${client.form === 'jdg' ? 'jednoosobowa działalność' : 'spółka z o.o.'} · ${client.rateLabel}`;
    current = { client, month, result, deadlines };
    renderDeadlines();
    renderCountdown();
    renderRuler();
  };

  const statusText = (invoice: Invoice): string => {
    if (invoice.status === 'paid') return 'zapłacona';
    const date = `${pad(invoice.due.getDate())}.${pad(invoice.due.getMonth() + 1)}`;
    return invoice.status === 'late' ? `po terminie od ${date}` : `oczekuje do ${date}`;
  };

  const renderInvoices = (restoreFocus: boolean): void => {
    const client = clientOf();
    const month = monthOf();
    invoiceData = generateInvoices(client, month, calcMonth(client, month), now);
    const counts: Record<Filter, number> = {
      all: invoiceData.length,
      pending: invoiceData.filter(item => item.status === 'pending').length,
      late: invoiceData.filter(item => item.status === 'late').length,
    };
    for (const button of findAll(filterBox, 'button', HTMLButtonElement)) {
      const filter = button.dataset.f;
      if (isFilter(filter)) find(button, '.n', HTMLElement).textContent = String(counts[filter]);
    }
    const shown = invoiceData.filter(item => state.filter === 'all' || item.status === state.filter);
    invoicesBox.textContent = '';
    invoiceCount.textContent = `${monthNamesShort[month.m]} ${month.y}`;
    if (!shown.length) invoicesBox.append(make('p', 'empty', 'brak faktur w tym filtrze'));
    if (state.invoice >= shown.length) state.invoice = 0;
    shown.forEach((invoice, index) => {
      const button = make('button', `i-row${invoice.status === 'late' ? ' late' : ''}`);
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.id = `i-${index}`;
      button.dataset.no = invoice.no;
      setSelected(button, index === state.invoice);
      button.append(
        make('span', 'i-no', invoice.no),
        make('span', 'i-amt', formatGrosze(invoice.net)),
        make('span', 'i-who', invoice.who),
        make('span', 'i-st', statusText(invoice)),
      );
      invoicesBox.append(button);
    });
    invoiceSum.textContent = '';
    const shownSum = shown.reduce((sum, item) => sum + item.net, 0);
    invoiceSum.append(
      make(
        'span',
        '',
        state.filter === 'all' ? 'suma netto = przychody' : `suma netto, ${invoicesLabel(shown.length)}`,
      ),
      make('span', '', formatGrosze(shownSum)),
    );
    if (restoreFocus) {
      const target = invoicesBox.querySelector('[aria-selected="true"]');
      if (target instanceof HTMLElement) target.focus();
    }
  };

  const announceClient = (): void => {
    const client = clientOf();
    const detail: ClientEventDetail = {
      form: client.form === 'jdg' ? 'osoba' : 'spolka',
      invoices: client.invoices,
      name: client.name,
    };
    document.dispatchEvent(new CustomEvent<ClientEventDetail>(clientEvent, { detail }));
  };

  function setClient(index: number, focusOption: boolean): void {
    state.client = index;
    state.invoice = 0;
    syncClientSelection();
    renderInvoices(false);
    renderLedger();
    renderHistory();
    announceClient();
    if (focusOption) {
      const button = clientsBox.querySelector(`#c-${index}`);
      if (button instanceof HTMLElement) button.focus();
    }
  }

  const setMonth = (index: number, focusOption: boolean): void => {
    if (index < 0 || index > months.length - 1) return;
    const hadInvoiceFocus = invoicesBox.contains(document.activeElement);
    state.month = index;
    state.invoice = 0;
    renderInvoices(hadInvoiceFocus);
    renderLedger();
    renderHistory();
    if (focusOption) historyRows[index]?.button.focus();
  };

  const setInvoice = (option: HTMLElement): void => {
    const options = findAll(invoicesBox, '[role="option"]', HTMLElement);
    for (const item of options) setSelected(item, item === option);
    state.invoice = options.indexOf(option);
  };

  const setFilter = (filter: Filter, focusButton: boolean): void => {
    state.filter = filter;
    state.invoice = 0;
    for (const button of findAll(filterBox, 'button', HTMLButtonElement)) {
      const on = button.dataset.f === filter;
      setSelected(button, on);
      if (on && focusButton) button.focus();
    }
    renderInvoices(false);
  };

  clientsBox.addEventListener('click', event => {
    const target = event.target;
    const button = target instanceof Element ? target.closest('.c-row') : null;
    if (button instanceof HTMLElement) setClient(Number(button.dataset.i), true);
  });
  listKeys(clientsBox, option => setClient(Number(option.dataset.i), true));

  historyBox.addEventListener('click', event => {
    const target = event.target;
    const button = target instanceof Element ? target.closest('.h-row') : null;
    if (button instanceof HTMLElement) setMonth(Number(button.dataset.i), true);
  });
  listKeys(historyBox, option => setMonth(Number(option.dataset.i), true));

  listKeys(invoicesBox, option => {
    setInvoice(option);
    option.focus();
  });
  invoicesBox.addEventListener('click', event => {
    const target = event.target;
    const row = target instanceof Element ? target.closest('.i-row') : null;
    if (row instanceof HTMLElement) setInvoice(row);
  });

  filterBox.addEventListener('click', event => {
    const target = event.target;
    const button = target instanceof Element ? target.closest('button') : null;
    const filter = button?.dataset.f;
    if (isFilter(filter)) setFilter(filter, false);
  });
  groupKeys(filterBox, 'button', button => {
    const filter = button.dataset.f;
    if (isFilter(filter)) setFilter(filter, false);
  });

  select.addEventListener('change', () => setClient(Number(select.value), false));
  query.addEventListener('input', () => {
    state.query = query.value;
    renderClients();
  });

  let heroRatio = 1;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      entries => {
        heroRatio = entries[0]?.intersectionRatio ?? 1;
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
    ).observe(hero);
  }

  renderClients();
  setClient(state.client, false);

  document.addEventListener('kajet:tick', event => {
    if (event instanceof CustomEvent && event.detail instanceof Date) now = event.detail;
    renderCountdown();
  });

  const handleKey = (event: KeyboardEvent): boolean => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('input,select,textarea')) {
      if (event.key === 'Escape' && target === query) {
        query.value = '';
        state.query = '';
        renderClients();
        query.blur();
        return true;
      }
      return false;
    }
    if (!isKeysOn() || heroRatio < 0.6) return false;
    const key = event.key;
    const inGroup =
      target instanceof Element && target.closest('[role="tablist"],[role="radiogroup"]') !== null;
    if (key === 'f') {
      const next = filterOrder[(filterOrder.indexOf(state.filter) + 1) % filterOrder.length];
      if (next) setFilter(next, false);
      return true;
    }
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && !inGroup) {
      event.preventDefault();
      setMonth(state.month + (key === 'ArrowLeft' ? 1 : -1), false);
      return true;
    }
    if (key === 'j' || key === 'k') {
      const visible = visibleClients();
      const position = visible.findIndex(item => item.index === state.client);
      if (position < 0) return false;
      const next = Math.max(0, Math.min(visible.length - 1, position + (key === 'j' ? 1 : -1)));
      event.preventDefault();
      const destination = visible[next];
      if (destination && next !== position) setClient(destination.index, false);
      return true;
    }
    return false;
  };

  const focusSearch = (): void => {
    window.scrollTo({ top: 0 });
    query.focus();
  };

  return { handleKey, focusSearch };
};
