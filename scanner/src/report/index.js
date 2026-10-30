import { IMPACT_PL } from '../mapping.js';
import { WCAG_21_LABEL, WCAG_22_LABEL } from '../wcag-pl.js';
import { DECLARATION_IDS } from '../extras.js';
import { loadConsentTexts } from './consent-text.js';
import { markup, plural, raw, safeBase64 } from './escape.js';
import { REPORT_CSS } from './styles.js';

const CONTACT_EMAIL = 'contact@adrianturbinski.pl';
const MAX_PAGE_ROWS = 15;
const MAX_EXAMPLES = 3;

function formatDate(date) {
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Warsaw',
  }).format(date);
}

function shortPath(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}` || '/';
  } catch {
    return url;
  }
}

function impactBadge(impact) {
  return markup`<span class="badge badge-${impact}">${IMPACT_PL[impact] ?? impact}</span>`;
}

const MAX_CHALK_STROKES = 30;
const SEVERITIES = [
  ['critical', 'Krytyczne'],
  ['serious', 'Poważne'],
  ['moderate', 'Umiarkowane'],
  ['minor', 'Drobne'],
];

function cardNumber(context) {
  const day = context.generatedAt.toISOString().slice(0, 10).replaceAll('-', '');
  let hash = 5381;
  for (const char of `${context.host}${context.generatedAt.toISOString()}`) {
    hash = (hash * 33 + char.codePointAt(0)) % 65536;
  }
  return `${day}-${hash.toString(16).toUpperCase().padStart(4, '0')}`;
}

function handNote(text) {
  return markup`<p class="hand-note" aria-hidden="true">${text}</p>`;
}

function chalkMarks(count) {
  const strokes = Math.min(count, MAX_CHALK_STROKES);
  if (strokes === 0) return '';
  const groups = Math.ceil(strokes / 5);
  const paths = [];
  for (let group = 0; group < groups; group += 1) {
    const left = group * 34;
    const inGroup = Math.min(5, strokes - group * 5);
    for (let index = 0; index < Math.min(inGroup, 4); index += 1) {
      const x = left + 4 + index * 7 + ((index + group) % 3) - 1;
      paths.push(`M${x} ${3 + (index % 2)}L${x + ((index + 1) % 2) - 0.5} ${21 - (group % 2)}`);
    }
    if (inGroup === 5) paths.push(`M${left} 18L${left + 29} 6`);
  }
  const overflow = count > MAX_CHALK_STROKES;
  if (overflow) paths.push(`M${groups * 34 + 6} 12H${groups * 34 + 18}M${groups * 34 + 12} 6V18`);
  const width = groups * 34 + (overflow ? 22 : 0);
  return markup`<span class="chalk" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="${width * 1.25}" height="30" viewBox="0 0 ${width} 24" focusable="false"><path d="${paths.join('')}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg></span>`;
}

function tapeMeasure(totals) {
  const segments = SEVERITIES.filter(([key]) => totals[key] > 0);
  if (segments.length === 0) return '';
  return markup`<div class="measure" aria-hidden="true">
    <div class="tape">
      <div class="tape-body">
        ${segments.map(
          ([key]) =>
            markup`<span class="seg seg-${key}" style="flex-grow: ${totals[key]}"><span>${totals[key]}</span></span>`,
        )}
      </div>
    </div>
    <ul class="tape-key">
      ${segments.map(([key, label]) => markup`<li class="key-${key}">${label}</li>`)}
    </ul>
  </div>`;
}

function viewsAvailable(page) {
  const names = [page.desktop ? 'komputer' : '', page.mobile ? 'telefon' : ''].filter(Boolean);
  if (names.length === 0) return 'brak wyniku';
  return names.length === 2 ? names.join(', ') : `tylko ${names[0]}`;
}

function viewsText(views) {
  const names = { desktop: 'komputer', mobile: 'telefon' };
  return views.map(view => names[view] ?? view).join(', ');
}

function criteriaText(criteria) {
  if (criteria.length === 0) return 'brak przypisanego kryterium WCAG';
  return criteria.map(item => `${item.id} ${item.name}`).join('; ');
}

function fixExample(info) {
  if (!info.before && !info.after) return '';
  return markup`<div class="fix">
    <div class="piece piece-before">
      <p>Przed</p>
      <pre><code>${info.before}</code></pre>
    </div>
    <div class="piece piece-after">
      <p>Po</p>
      <pre><code>${info.after}</code></pre>
    </div>
  </div>`;
}

function ruleDescription(entry) {
  const { info } = entry;
  if (info.translated) return markup`<p>${info.problem}</p>`;
  return markup`<p>${info.problem}</p>
    <p class="small">
      Tytuł i opis pochodzą z narzędzia axe-core i są po angielsku, bo ta reguła nie ma jeszcze
      polskiego opisu.
    </p>`;
}

function pagesTable(entry) {
  const rows = entry.pages.slice(0, MAX_PAGE_ROWS);
  const rest = entry.pages.length - rows.length;
  return markup`<div class="table-scroll" role="region" aria-label="Podstrony z problemem: ${entry.info.title}" tabindex="0">
  <table>
    <caption>
      Podstrony z tym problemem
    </caption>
    <thead>
      <tr>
        <th scope="col">Podstrona</th>
        <th scope="col" class="num">Wystąpień</th>
        <th scope="col">Widok</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(
        page =>
          markup`<tr>
            <td>${shortPath(page.url)}</td>
            <td class="num"><span class="measured">${page.count}</span></td>
            <td>${viewsText(page.views)}</td>
          </tr>`,
      )}
      ${
        rest > 0
          ? markup`<tr>
            <td colspan="3">
              i ${rest}
              ${plural(rest, 'kolejna podstrona', 'kolejne podstrony', 'kolejnych podstron')}
            </td>
          </tr>`
          : ''
      }
    </tbody>
  </table>
  </div>`;
}

function examples(entry) {
  const nodes = entry.pages.flatMap(page => page.nodes.map(node => ({ ...node, page: page.url })));
  const sample = nodes.slice(0, MAX_EXAMPLES);
  if (sample.length === 0) return '';
  return markup`<p class="sub">Przykładowe elementy</p>
    <ul class="plain examples">
      ${sample.map(
        node =>
          markup`<li>
            <span class="small">${shortPath(node.page)}</span> <span class="small">&middot;</span>
            <code>${node.target}</code>
            <pre><code>${node.html}</code></pre>
            ${
              node.phases.length === 1 && node.phases[0] === 'before-consent'
                ? markup`<span class="small"
                  >Widoczny tylko przed zaakceptowaniem banera cookies.</span
                >`
                : ''
            }
          </li>`,
      )}
    </ul>`;
}

function screenshotFigure(entry) {
  const shot = entry.screenshot;
  if (!shot) return '';
  const data = safeBase64(shot.image);
  if (!data) return '';
  return markup`<figure class="swatch">
    <div class="swatch-cloth">
    <img
      src="${raw(`data:image/png;base64,${data}`)}"
      alt="Zrzut ekranu elementu, w którym wykryto problem" />
    </div>
    <figcaption>
      Element: <code>${shot.target}</code> na podstronie ${shortPath(shot.pageUrl)}
    </figcaption>
  </figure>`;
}

function leadText(totals, scanned) {
  if (totals.findings > 0) {
    return markup`Znaleziono ${totals.findings}
      ${plural(totals.findings, 'potwierdzony błąd', 'potwierdzone błędy', 'potwierdzonych błędów')}
      na ${totals.affectedPages}
      ${plural(totals.affectedPages, 'podstronie', 'podstronach', 'podstronach')}, w\u00a0tym
      ${totals.critical} ${plural(totals.critical, 'krytyczny', 'krytycznych', 'krytycznych')}.`;
  }
  return markup`Skan nie znalazł potwierdzonych błędów wykrywalnych automatycznie na ${scanned}
    ${plural(scanned, 'podstronie', 'podstronach', 'podstronach')}.`;
}

function summarySection(model) {
  const { totals } = model;
  return markup`<section aria-labelledby="podsumowanie">
    <h2 id="podsumowanie">Podsumowanie</h2>
    <p>
      Błąd to jedna reguła, która nie została spełniona na jednej podstronie; łącznie daje to
      ${totals.occurrences} ${plural(totals.occurrences, 'miejsce', 'miejsca', 'miejsc')} w kodzie
      stron. Miara obejmuje tylko to, co skaner potrafi zmierzyć.
    </p>
    <table class="weights">
      <caption>
        Błędy według wagi
      </caption>
      <thead>
        <tr>
          <th scope="col">Waga</th>
          <th scope="col" class="num">Liczba</th>
        </tr>
      </thead>
      <tbody>
        ${SEVERITIES.map(
          ([key, label]) =>
            markup`<tr>
              <th scope="row">
                <span class="row-label">${label}</span>
                ${chalkMarks(totals[key])}
              </th>
              <td class="num">${totals[key]}</td>
            </tr>`,
        )}
      </tbody>
    </table>
    <p class="small">
      Skaner automatyczny wykrywa tylko część problemów z dostępnością. Brak wyników w tej liście
      nie oznacza, że strona nie ma innych barier. Elementy do ręcznej weryfikacji znajdziesz w
      osobnej sekcji.
    </p>
  </section>`;
}

function topSection(model) {
  if (model.top.length === 0) {
    return markup`<section aria-labelledby="top3">
      <h2 id="top3">Najważniejsze problemy</h2>
      <p>Narzędzie nie wykryło potwierdzonych błędów, które można by tu wskazać.</p>
    </section>`;
  }
  return markup`<section aria-labelledby="top3">
    <h2 id="top3">Trzy najważniejsze problemy</h2>
    <p>Na warsztat najpierw te trzy poprawki. Wybrane według wagi i liczby wystąpień.</p>
    ${model.top.map((entry, index) => {
      const primary = entry.criteria[0];
      return markup`<article class="card" aria-labelledby="top-${entry.ruleId}">
        <p class="card-kicker">Poprawka ${index + 1}</p>
        <h3 id="top-${entry.ruleId}">${entry.info.title} ${impactBadge(entry.impact)}</h3>
        <ul class="facts">
          <li>
            <strong>Kryterium:</strong> ${primary.id} ${primary.name} (poziom ${primary.level})
          </li>
          <li>
            <strong>EN 301 549:</strong> ${primary.clause}${
              primary.isNew22 ? ` (${WCAG_22_LABEL})` : ''
            }
          </li>
          <li>
            <strong>Skala:</strong> <span class="measured">${entry.occurrences}</span>
            ${plural(entry.occurrences, 'wystąpienie', 'wystąpienia', 'wystąpień')} na
            <span class="measured">${entry.pages.length}</span>
            ${plural(entry.pages.length, 'podstronie', 'podstronach', 'podstronach')}
          </li>
        </ul>
        ${ruleDescription(entry)} ${screenshotFigure(entry)} ${fixExample(entry.info)}
      </article>`;
    })}
  </section>`;
}

function fullListSection(model) {
  if (model.groups.length === 0) {
    return markup`<section aria-labelledby="lista">
      <h2 id="lista">Pełna lista błędów</h2>
      <p>Nie ma potwierdzonych błędów do wyświetlenia.</p>
    </section>`;
  }
  return markup`<section aria-labelledby="lista">
    <h2 id="lista">Pełna lista błędów według kryteriów</h2>
    ${model.groups.map(group => {
      const criterion = group.criterion;
      return markup`<h3 class="group-title">
          ${criterion.id} ${criterion.name}
          <span class="small"
            >(poziom ${criterion.level}, EN 301 549
            ${criterion.clause}${criterion.isNew22 ? `, ${WCAG_22_LABEL}` : ''})</span
          >
        </h3>
        ${group.entries.map(
          entry =>
            markup`<div class="entry entry-split">
              <div class="entry-head">
              <h4>${entry.info.title} ${impactBadge(entry.impact)}</h4>
              <p class="small">
                ${entry.occurrences}
                ${plural(entry.occurrences, 'wystąpienie', 'wystąpienia', 'wystąpień')} na
                ${entry.pages.length}
                ${plural(entry.pages.length, 'podstronie', 'podstronach', 'podstronach')}. Reguła
                axe: <code>${entry.ruleId}</code>${
                  entry.criteria.length > 1
                    ? `. Dotyczy też: ${criteriaText(entry.criteria.slice(1))}`
                    : ''
                }
              </p>
              ${ruleDescription(entry)}
              </div>
              <div class="entry-body">${pagesTable(entry)} ${examples(entry)}</div>
            </div>`,
        )}`;
    })}
  </section>`;
}

function keyboardBlock(keyboard) {
  if (!keyboard) {
    return markup`<p>Test klawiatury na stronie głównej nie zakończył się wynikiem.</p>`;
  }
  return markup`<ul class="plain">
    <li class="neutral">
      Naciśnięto Tab ${keyboard.tabsPressed} ${plural(keyboard.tabsPressed, 'raz', 'razy', 'razy')}
      na stronie głównej (widok na komputerze).
    </li>
    <li class="${keyboard.skipLink ? 'neutral' : 'open'}">
      ${
        keyboard.skipLink
          ? 'Pierwszy Tab trafia w link pomijania nawigacji.'
          : 'Pierwszy Tab nie trafia w link pomijania nawigacji (kryterium 2.4.1 Możliwość pominięcia bloków do sprawdzenia).'
      }
    </li>
    <li class="${keyboard.trap ? 'open' : 'neutral'}">
      ${
        keyboard.trap
          ? 'Fokus krążył w małym zestawie elementów przez co najmniej 10 naciśnięć Tab. To może być pułapka na klawiaturę (kryterium 2.1.2), sprawdź ręcznie.'
          : 'Nie wykryto pułapki na klawiaturę w pierwszych naciśnięciach Tab.'
      }
    </li>
    <li class="${keyboard.invisibleFocus.length > 0 ? 'open' : 'neutral'}">
      ${
        keyboard.invisibleFocus.length > 0
          ? `Dla ${keyboard.invisibleFocus.length} z ${keyboard.focusChecked} sprawdzonych elementów styl fokusu nie zmienił się widocznie (kryterium 2.4.7 Widoczny fokus do sprawdzenia): ${keyboard.invisibleFocus.map(item => item.text || item.tag).join('; ')}.`
          : `Styl fokusu zmieniał się dla wszystkich ${keyboard.focusChecked} sprawdzonych elementów.`
      }
    </li>
  </ul>`;
}

function manualSection(model, pages, keyboard) {
  const reflowPages = pages.filter(page => page.reflow?.overflow);
  return markup`<section class="sewn" aria-labelledby="reczne">
    <h2 id="reczne">Do sprawdzenia ręcznie</h2>
    ${handNote('szyte ręcznie, bez automatu')}
    <p>
      Poniższych rzeczy narzędzie nie potrafiło ocenić jednoznacznie. To nie są potwierdzone błędy,
      tylko miejsca warte uwagi człowieka.
    </p>
    <h3>Elementy, których automat nie rozstrzygnął</h3>
    ${
      model.manual.length === 0
        ? markup`<p>Brak pozycji.</p>`
        : model.manual.map(
            entry =>
              markup`<div class="entry">
              <h4>${entry.info.title}</h4>
              <p class="small">
                ${entry.pages.length}
                ${plural(entry.pages.length, 'podstrona', 'podstrony', 'podstron')}, reguła axe:
                <code>${entry.ruleId}</code>${
                  entry.criteria.length ? `, kryterium ${criteriaText(entry.criteria)}` : ''
                }
              </p>
              ${ruleDescription(entry)} ${examples({ ...entry, pages: entry.pages.slice(0, 1) })}
            </div>`,
          )
    }
    <h3>Dopasowanie do ekranu (kryterium 1.4.10)</h3>
    ${
      reflowPages.length === 0
        ? markup`<p>
          Przy szerokości 320 px (odpowiednik powiększenia do 400%) na żadnej z przeskanowanych
          podstron nie wykryto poziomego przewijania.
        </p>`
        : markup`<p>
            Przy szerokości 320 px treść wystaje poza okno na tych podstronach. Sprawdź, czy da się
            je czytać bez przewijania w dwóch kierunkach.
          </p>
          <ul class="plain">
            ${reflowPages.map(
              page =>
                markup`<li>
                  ${shortPath(page.url)}: szerokość treści ${page.reflow.scrollWidth} px przy oknie
                  ${page.reflow.clientWidth}
                  px${
                    page.reflow.offenders.length
                      ? `, m.in. ${page.reflow.offenders.join(', ')}`
                      : ''
                  }
                </li>`,
            )}
          </ul>`
    }
    <h3>Obsługa klawiaturą na stronie głównej</h3>
    ${keyboardBlock(keyboard)}
  </section>`;
}

function recommendationsSection(model) {
  return markup`<section aria-labelledby="zalecenia">
    <h2 id="zalecenia">Zalecenia</h2>
    <p>
      Dobre praktyki, które nie są wprost wymaganiami WCAG, ale ułatwiają korzystanie ze strony
      technologiom asystującym.
    </p>
    ${
      model.recommendations.length === 0
        ? markup`<p>Narzędzie nie zgłosiło żadnych zaleceń.</p>`
        : model.recommendations.map(
            entry =>
              markup`<div class="entry">
              <h3>${entry.info.title}</h3>
              <p class="small">
                ${entry.occurrences}
                ${plural(entry.occurrences, 'wystąpienie', 'wystąpienia', 'wystąpień')} na
                ${entry.pages.length}
                ${plural(entry.pages.length, 'podstronie', 'podstronach', 'podstronach')}, reguła
                axe: <code>${entry.ruleId}</code>
              </p>
              ${ruleDescription(entry)} ${fixExample(entry.info)}
            </div>`,
          )
    }
  </section>`;
}

function declarationSection(declaration) {
  let body;
  if (!declaration) {
    body = markup`<p>
      Nie udało się sprawdzić, czy strona główna zawiera link do deklaracji dostępności.
    </p>`;
  } else if (!declaration.found) {
    body = markup`<p>
      Na stronie głównej nie znaleziono linku z tekstem „deklaracja dostępności” ani „accessibility
      statement”.
    </p>`;
  } else if (!declaration.checked) {
    body = markup`<p>
      Znaleziono link do deklaracji dostępności (${declaration.url}), ale nie udało się sprawdzić
      jej zawartości.
    </p>`;
  } else if (declaration.missing.length === 0) {
    body = markup`<p>
      Znaleziono link do deklaracji dostępności (${declaration.url}). Strona zawiera wszystkie
      sprawdzane elementy: ${DECLARATION_IDS.join(', ')}.
    </p>`;
  } else {
    body = markup`<p>
      Znaleziono link do deklaracji dostępności (${declaration.url}). Na stronie deklaracji brakuje
      elementów o identyfikatorach: ${declaration.missing.join(', ')}.
    </p>`;
  }
  return markup`<section aria-labelledby="deklaracja">
    <h2 id="deklaracja">Deklaracja dostępności</h2>
    ${body}
    <p class="small">
      Skan sprawdza obecność linku oraz elementów o identyfikatorach ${DECLARATION_IDS.join(', ')}.
      Nie ocenia treści deklaracji.
    </p>
  </section>`;
}

function consentSection(consent) {
  if (!consent) return '';
  let text;
  if (consent.accepted && consent.method === 'autoconsent') {
    text = `Na stronie głównej wykryto baner cookies${consent.cmp ? ` (${consent.cmp})` : ''} i zaakceptowano go automatycznie. Strona główna została sprawdzona przed i po tej zgodzie, pozostałe podstrony po niej.`;
  } else if (consent.accepted) {
    text =
      'Na stronie głównej wykryto baner cookies i zaakceptowano go przyciskiem. Strona główna została sprawdzona przed i po tej zgodzie, pozostałe podstrony po niej.';
  } else {
    text = 'Na stronie głównej nie wykryto banera cookies, który skaner potrafiłby obsłużyć.';
  }
  return markup`<p class="small">${text}</p>`;
}

function limitsSection() {
  const items = [
    'Obsługi strony czytnikiem ekranu (NVDA, JAWS, VoiceOver, TalkBack).',
    'Pełnej obsługi klawiaturą w procesach, takich jak zakup, rejestracja czy formularze wieloetapowe.',
    'Jakości tekstów alternatywnych: skaner wie, że alt istnieje, ale nie ocenia, czy dobrze opisuje obraz.',
    'Treści wideo i audio: napisów, transkrypcji i audiodeskrypcji.',
    'Dokumentów PDF i innych plików do pobrania.',
    'Stron i funkcji za logowaniem.',
    'Zrozumiałości języka, czytelności układu i logiki nawigacji.',
  ];
  return markup`<section class="sewn" aria-labelledby="zakres-limity">
    <h2 id="zakres-limity">Czego ten skan nie sprawdził</h2>
    ${handNote('tu miara nie sięga')}
    <ul class="plain">
      ${items.map(item => markup`<li>${item}</li>`)}
    </ul>
  </section>`;
}

function legalSection(disclaimer) {
  const paragraphs = String(disclaimer)
    .split(/\n{1,}/)
    .map(item => item.trim())
    .filter(Boolean);
  return markup`<section aria-labelledby="prawo">
    <h2 id="prawo">Kontekst prawny</h2>
    <p>
      Ustawa z 26 kwietnia 2024 r. o zapewnianiu spełniania wymagań dostępności niektórych produktów
      i usług przez podmioty gospodarcze (Dz.U. 2024 poz. 731) dotyczy wybranych usług dla
      konsumentów, między innymi handlu elektronicznego. Nie dotyczy usług świadczonych przez
      mikroprzedsiębiorców (art. 4 pkt 1).
    </p>
    <p>
      W raporcie stosujemy WCAG 2.1 na poziomie AA (${WCAG_21_LABEL}) i osobno oznaczamy dodatkowe
      kryteria WCAG 2.2 (${WCAG_22_LABEL}).
    </p>
    <div class="disclaimer">
      <h3>Zastrzeżenie</h3>
      ${paragraphs.map(paragraph => markup`<p>${paragraph}</p>`)}
    </div>
  </section>`;
}

const TAG_STRING = `<svg class="tag-string" viewBox="0 0 72 72" aria-hidden="true" focusable="false"><path d="M36 58C34 38 30 24 37 7M36 58C42 38 46 24 37 7" fill="none" stroke="#e9eff6" stroke-width="2.4" stroke-linecap="round"/><circle cx="37" cy="5" r="4" fill="#c3cedd" stroke="#14181f" stroke-width="1.2"/><circle cx="36" cy="58" r="8" fill="#5a1424" stroke="#9dbbe0" stroke-width="3"/></svg>`;

function hostSize(host) {
  if (host.length > 30) return 'host-long';
  if (host.length > 16) return 'host-mid';
  return 'host-short';
}

function tagBlock(context, scanned) {
  const { engineVersion, siteUrl, model } = context;
  const { findings } = model.totals;
  return markup`<div class="tag">
      ${raw(TAG_STRING)}
      <div class="tag-body">
        <p class="eyebrow">Raport ze skanu dostępności</p>
        <p class="card-no">Karta przymiarki nr <strong>${cardNumber(context)}</strong></p>
        <h1 class="${hostSize(context.host)}">${context.host}</h1>
        <dl class="meta">
          <div>
            <dt>Adres</dt>
            <dd>${siteUrl}</dd>
          </div>
          <div>
            <dt>Data skanu</dt>
            <dd>${formatDate(context.generatedAt)}</dd>
          </div>
          <div>
            <dt>Wymiary</dt>
            <dd>
              komputer 1280 x 800 i telefon (iPhone 13), ${scanned}
              ${plural(scanned, 'podstrona', 'podstrony', 'podstron')}
            </dd>
          </div>
          <div>
            <dt>Silnik</dt>
            <dd>axe-core ${engineVersion}</dd>
          </div>
        </dl>
      </div>
      <div class="stub" aria-hidden="true">
        <span class="stub-count">${findings}</span>
        <span class="stub-cap">
          ${plural(findings, 'potwierdzony błąd', 'potwierdzone błędy', 'potwierdzonych błędów')}
        </span>
        <span class="stub-hand">zmierzone, nie oszacowane</span>
      </div>
    </div>`;
}

function scopeStatus(page) {
  if (page.skipped === 'robots') return 'pominięta: robots.txt';
  return page.error ? `pominięto, ${page.error}` : viewsAvailable(page);
}

function scopeBlock(context, notes) {
  return markup`<div class="scope">
      <h2 class="scope-title" id="zakres">Zakres: sprawdzone podstrony</h2>
      <ul class="scope-list">
        ${context.pages.map(
          page =>
            markup`<li>
              ${shortPath(page.url)}${page.title ? ` (${page.title})` : ''}:
              ${scopeStatus(page)}
            </li>`,
        )}
      </ul>
      ${notes.map(note => markup`<p class="note">${note}</p>`)}
    </div>`;
}

function foundBlock(context, scanned, notes) {
  const { totals } = context.model;
  return markup`<div class="found">
      <p class="lead">${leadText(totals, scanned)}</p>
      ${tapeMeasure(totals)} ${scopeBlock(context, notes)}
    </div>`;
}

export async function buildReport(context) {
  const { model, pages, extras, notes = [] } = context;
  const { disclaimer } = loadConsentTexts(context.consentFile);
  const scanned = pages.filter(page => page.desktop || page.mobile).length;
  const body = markup`<!doctype html>
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Raport dostępności: ${context.host}</title>
        <style>
          ${raw(REPORT_CSS)}
        </style>
      </head>
      <body>
        <a class="skip" href="#tresc">Przejdź do treści raportu</a>
        <header class="masthead">
          <div class="wrap bar">
            <a class="wordmark" href="https://adrianturbinski.pl/">Turbiński</a>
          </div>
          <div class="wrap fitting">
            ${tagBlock(context, scanned)} ${foundBlock(context, scanned, notes)}
          </div>
        </header>
        <nav class="toc" aria-label="Spis treści raportu">
          <div class="wrap">
            <ol>
              <li><a href="#podsumowanie">Podsumowanie</a></li>
              <li><a href="#top3">Najważniejsze problemy</a></li>
              <li><a href="#lista">Pełna lista</a></li>
              <li><a href="#reczne">Do sprawdzenia ręcznie</a></li>
              <li><a href="#zalecenia">Zalecenia</a></li>
              <li><a href="#deklaracja">Deklaracja dostępności</a></li>
              <li><a href="#zakres-limity">Czego nie sprawdzono</a></li>
              <li><a href="#prawo">Kontekst prawny</a></li>
            </ol>
          </div>
        </nav>
        <main id="tresc">
          <div class="wrap">
            ${summarySection(model)} ${consentSection(extras.consent)} ${topSection(model)}
            ${fullListSection(model)} ${manualSection(model, pages, extras.keyboard)}
            ${recommendationsSection(model)} ${declarationSection(extras.declaration)}
            ${limitsSection()} ${legalSection(disclaimer)}
          </div>
        </main>
        <footer class="site-footer">
          <div class="wrap">
            <p><strong>Adrian Turbiński</strong></p>
            <p><a href="https://adrianturbinski.pl/">adrianturbinski.pl</a></p>
            <p>
              Jeśli chcesz omówić wyniki, napisz:
              <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
            </p>
          </div>
        </footer>
      </body>
    </html> `;
  return body.toString();
}
