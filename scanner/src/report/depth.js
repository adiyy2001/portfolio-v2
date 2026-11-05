import { markup, plural } from './escape.js';

export const EN_V4_LABEL = 'EN 301 549 V4.1.1 (WCAG 2.2)';
export const EN_V3_LABEL = 'EN 301 549 V3.2.1 (WCAG 2.1)';
const VOID_IN_V4 = new Set(['4.1.1']);

export function standardProfiles(model) {
  const count = keep =>
    model.errors
      .filter(entry => entry.criteria.some(keep))
      .reduce((sum, entry) => sum + entry.pages.length, 0);
  return {
    v3: count(criterion => !criterion.isNew22),
    v4: count(criterion => !VOID_IN_V4.has(criterion.id)),
    onlyV4: model.errors
      .filter(entry => entry.criteria.every(criterion => criterion.isNew22))
      .reduce((sum, entry) => sum + entry.pages.length, 0),
  };
}

export function profilesSection(model) {
  const profiles = standardProfiles(model);
  return markup`<section aria-labelledby="normy">
    <h2 id="normy">Dwie wersje normy EN 301 549</h2>
    <ul class="facts">
      <li>
        <strong>${EN_V3_LABEL}:</strong>
        <span class="measured">${profiles.v3}</span> potwierdzonych błędów, liczonych na podstronę.
      </li>
      <li>
        <strong>${EN_V4_LABEL}:</strong>
        <span class="measured">${profiles.v4}</span> potwierdzonych błędów, w tym
        <span class="measured">${profiles.onlyV4}</span> wyłącznie z kryteriów dodanych w WCAG 2.2.
      </li>
    </ul>
    <p class="small">
      Wersja V4.1.1 wyszła 2 września 2026 r. Według stanu z października 2026 r. nie ma jej jeszcze w
      Dzienniku Urzędowym UE pod Europejskim aktem o dostępności, więc pokazujemy ją jako zapowiedź
      zmian. Obowiązującym wymogiem jeszcze nie jest.
    </p>
  </section>`;
}

export function secondEngineSection(alfa) {
  if (!alfa) return '';
  const heading = 'Druga metoda: Siteimprove Alfa';
  if (alfa.checked === 0) {
    return markup`<section aria-labelledby="alfa">
      <h2 id="alfa">${heading}</h2>
      <p>Tym razem drugi silnik nie sprawdził żadnej podstrony, więc wyniki pochodzą tylko z axe-core.</p>
    </section>`;
  }
  const confirmed = alfa.rows.filter(row => row.confirmed);
  const other = alfa.rows.filter(row => !row.confirmed);
  const line = row =>
    markup`<li>
      <strong>${row.criterion.id} ${row.criterion.name}</strong>: ${row.occurrences}
      ${plural(row.occurrences, 'wystąpienie', 'wystąpienia', 'wystąpień')} na ${row.pages}
      ${plural(row.pages, 'podstronie', 'podstronach', 'podstronach')}
    </li>`;
  return markup`<section aria-labelledby="alfa">
    <h2 id="alfa">${heading}</h2>
    <p>
      Drugi, niezależny silnik sprawdził ${alfa.checked}
      ${plural(alfa.checked, 'podstronę', 'podstrony', 'podstron')}${
        alfa.skipped > 0
          ? markup`, a ${alfa.skipped} ${plural(alfa.skipped, 'pominął', 'pominął', 'pominął')} ze względu na rozmiar albo limit czasu`
          : ''
      }. Liczby z tej sekcji nie wchodzą do podsumowania raportu.
    </p>
    <h3>Potwierdzone dwiema metodami</h3>
    ${
      confirmed.length
        ? markup`<p class="small">To samo kryterium na tej samej podstronie zgłosiły axe-core i Alfa.</p>
          <ul class="plain">${confirmed.map(line)}</ul>`
        : markup`<p>Silniki nie zgłosiły tego samego kryterium na tej samej podstronie.</p>`
    }
    ${
      other.length
        ? markup`<h3>Tylko Alfa, do przeglądu</h3>
          <p class="small">Sprawdź je ręcznie, zanim uznasz je za błąd.</p>
          <ul class="plain">${other.map(line)}</ul>`
        : ''
    }
  </section>`;
}

const PDF_STATUS = {
  'too-large': 'Plik jest za duży na automatyczne sprawdzenie (limit 15 MB).',
  unreachable: 'Nie udało się pobrać pliku.',
  'not-pdf': 'Pod tym adresem nie ma pliku PDF.',
  unreadable: 'Pliku nie da się odczytać, na przykład jest zaszyfrowany.',
  failed: 'Sprawdzenie tego pliku nie powiodło się.',
  unavailable: 'Sprawdzenie tego pliku nie powiodło się.',
  'out-of-time': 'Plik pominięty ze względu na limit czasu skanu.',
};

function pdfResult(file) {
  if (file.status !== 'checked')
    return markup`<p>${PDF_STATUS[file.status] ?? PDF_STATUS.failed}</p>`;
  if (file.passed) return markup`<p>Plik przeszedł automatyczne reguły PDF/UA-1.</p>`;
  return markup`<p>
      Niespełnione reguły PDF/UA-1: <span class="measured">${file.failedRules}</span>, liczba
      niepowodzeń: <span class="measured">${file.failedChecks}</span>.
    </p>
    <ul class="plain small">
      ${file.rules.map(rule => markup`<li><code>${rule.clause}</code> ${rule.description}</li>`)}
    </ul>`;
}

export function pdfSection(pdfs) {
  if (!pdfs?.length) return '';
  return markup`<section aria-labelledby="pdf">
    <h2 id="pdf">Pliki PDF</h2>
    <p>
      Pierwsze pliki PDF znalezione w tej domenie sprawdziło narzędzie veraPDF według reguł PDF/UA-1.
      Opisy reguł pochodzą z narzędzia i są po angielsku. Automat nie oceni, czy kolejność czytania i
      opisy mają sens, więc wynik pozytywny nie zastępuje przeglądu ręcznego.
    </p>
    ${pdfs.map(
      file => markup`<div class="entry">
        <h3><code>${decodeForDisplay(file.url)}</code></h3>
        ${pdfResult(file)}
      </div>`,
    )}
  </section>`;
}

function decodeForDisplay(url) {
  const { pathname, hostname } = new URL(url);
  try {
    return `${hostname}${decodeURIComponent(pathname)}`;
  } catch {
    return `${hostname}${pathname}`;
  }
}

const PDF_LINK_ITEM = /<li class="web-only" data-pdf-link>[\s\S]*?<\/li>/;

export function withoutPdfLink(html) {
  return html.replace(PDF_LINK_ITEM, '');
}

export function nextStepsSection({ pdfAvailable, bookingUrl, fullScanAvailable }) {
  return markup`<section aria-labelledby="dalej">
    <h2 id="dalej">Co dalej</h2>
    <ul class="plain">
      ${pdfAvailable ? markup`<li class="web-only" data-pdf-link><a href="?format=pdf">Pobierz ten raport jako PDF</a></li>` : ''}
      ${
        fullScanAvailable
          ? markup`<li class="web-only">
              <a href="?pelny=1">Zleć pełny skan do 30 podstron</a>. Wymaga potwierdzenia, że domena
              jest Twoja.
            </li>`
          : ''
      }
      <li><a href="${bookingUrl}">Umów 20 minut rozmowy o wynikach</a></li>
    </ul>
  </section>`;
}
