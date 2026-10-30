import { stripDiacritics } from './pages.js';

export async function checkReflow(page) {
  const original = page.viewportSize();
  try {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.waitForTimeout(300);
    return await page.evaluate(() => {
      const root = document.documentElement;
      const overflow = root.scrollWidth > root.clientWidth + 1;
      const offenders = [];
      if (overflow) {
        for (const element of document.body.querySelectorAll('*')) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.right > root.clientWidth + 1) {
            const id = element.id ? `#${element.id}` : '';
            const cls =
              typeof element.className === 'string' && element.className.trim()
                ? `.${element.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                : '';
            offenders.push(`${element.localName}${id}${cls}`);
            if (offenders.length >= 5) break;
          }
        }
      }
      return {
        overflow,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        offenders,
      };
    });
  } finally {
    if (original) await page.setViewportSize(original).catch(() => {});
  }
}

const FOCUS_PROPS = [
  'outline-style',
  'outline-width',
  'outline-color',
  'outline-offset',
  'box-shadow',
  'border-top-color',
  'border-top-width',
  'border-top-style',
  'border-bottom-color',
  'border-bottom-width',
  'border-bottom-style',
  'border-left-color',
  'border-left-width',
  'border-right-color',
  'border-right-width',
  'background-color',
  'text-decoration-line',
];

export function detectFocusTrap(sequence, tabbableCount = Infinity) {
  const WINDOW = 10;
  for (let start = 0; start + WINDOW <= sequence.length; start += 1) {
    const slice = sequence.slice(start, start + WINDOW);
    if (slice.some(item => item.isBody)) continue;
    const distinct = new Set(slice.map(item => item.id)).size;
    if (distinct <= 3 && distinct < tabbableCount) return true;
  }
  return false;
}

export function classifySkipLink(first) {
  if (!first || first.tag !== 'a' || !first.href || !first.href.startsWith('#')) return false;
  if (first.href === '#') return false;
  const text = stripDiacritics(first.text || '');
  return /pomi|skip|przejdz|przeskocz|tresc|content|main|glown/.test(text);
}

export async function checkKeyboard(page, { tabs = 40, focusSamples = 10 } = {}) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    window.__scanElements = new Map();
    window.__scanCounter = 0;
  });
  const describe = props =>
    page.evaluate(properties => {
      const element = document.activeElement;
      if (!element || element === document.documentElement) {
        return { isBody: true, id: 0, tag: 'body', text: '', href: '', styles: {} };
      }
      if (element === document.body) {
        return { isBody: true, id: 0, tag: 'body', text: '', href: '', styles: {} };
      }
      let id = [...window.__scanElements.entries()].find(([, node]) => node === element)?.[0];
      if (!id) {
        window.__scanCounter += 1;
        id = window.__scanCounter;
        window.__scanElements.set(id, element);
      }
      const computed = getComputedStyle(element);
      const styles = {};
      for (const name of properties) styles[name] = computed.getPropertyValue(name);
      return {
        isBody: false,
        id,
        tag: element.localName,
        text: (element.innerText || element.getAttribute('aria-label') || element.value || '')
          .trim()
          .replace(/\s+/g, ' ')
          .slice(0, 60),
        href: element.getAttribute('href') || '',
        styles,
      };
    }, props);

  const sequence = [];
  for (let i = 0; i < tabs; i += 1) {
    await page.keyboard.press('Tab');
    const focused = await describe(FOCUS_PROPS).catch(() => null);
    if (!focused) break;
    sequence.push(focused);
    if (focused.isBody) break;
  }

  const firstFocused = sequence.find(item => !item.isBody);
  const skipLink = classifySkipLink(sequence[0]);
  const tabbableCount = await page
    .evaluate(() => {
      const selector =
        'a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
      return [...document.querySelectorAll(selector)].filter(
        element => !element.disabled && element.getClientRects().length > 0,
      ).length;
    })
    .catch(() => Infinity);
  const trap = detectFocusTrap(sequence, tabbableCount);

  const sampled = [];
  const seen = new Set();
  for (const item of sequence) {
    if (item.isBody || seen.has(item.id)) continue;
    seen.add(item.id);
    sampled.push(item);
    if (sampled.length >= focusSamples) break;
  }
  const invisible = [];
  for (const item of sampled) {
    const before = await page
      .evaluate(
        ({ id, properties }) => {
          const element = window.__scanElements.get(id);
          if (!element) return null;
          element.blur();
          const computed = getComputedStyle(element);
          const styles = {};
          for (const name of properties) styles[name] = computed.getPropertyValue(name);
          return styles;
        },
        { id: item.id, properties: FOCUS_PROPS },
      )
      .catch(() => null);
    if (!before) continue;
    const changed = FOCUS_PROPS.some(name => before[name] !== item.styles[name]);
    if (!changed) invisible.push({ tag: item.tag, text: item.text });
  }

  return {
    tabsPressed: sequence.length,
    reachedEnd: sequence.some(item => item.isBody),
    firstFocus: firstFocused ? { tag: firstFocused.tag, text: firstFocused.text } : null,
    skipLink,
    trap,
    focusChecked: sampled.length,
    invisibleFocus: invisible,
  };
}

export const DECLARATION_IDS = [
  'a11y-data-publikacja',
  'a11y-data-aktualizacja',
  'a11y-status',
  'a11y-kontakt',
];

export function findDeclarationLink(links) {
  return (
    links.find(link => {
      const text = stripDiacritics(link.text || '');
      return /deklaracja dostepnosci|accessibility statement/.test(text);
    }) ?? null
  );
}

export async function checkDeclaration(page, { open }) {
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(anchor => ({
      href: anchor.href,
      text: (anchor.innerText || anchor.getAttribute('aria-label') || anchor.textContent || '')
        .trim()
        .replace(/\s+/g, ' '),
    })),
  );
  const link = findDeclarationLink(links);
  if (!link) return { found: false, url: null, missing: [], checked: false };
  const result = await open(link.href, DECLARATION_IDS);
  if (!result) return { found: true, url: link.href, missing: [], checked: false };
  const missing = result.filter(item => !item.present).map(item => item.id);
  return { found: true, url: link.href, missing, checked: true };
}
