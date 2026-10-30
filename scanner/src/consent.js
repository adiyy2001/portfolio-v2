import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { waitForStableDom } from './stabilize.js';

const require = createRequire(import.meta.url);

let bundle;
function loadBundle() {
  if (!bundle) {
    const distDir = dirname(require.resolve('@duckduckgo/autoconsent'));
    const script = readFileSync(join(distDir, 'autoconsent.playwright.js'), 'utf8');
    const rulesJson = readFileSync(
      require.resolve('@duckduckgo/autoconsent/rules/rules.json'),
      'utf8',
    );
    const rules = JSON.stringify(JSON.parse(rulesJson).autoconsent);
    const config = JSON.stringify({
      enabled: true,
      autoAction: 'optIn',
      disabledCmps: [],
      enablePrehide: false,
      detectRetries: 20,
      enableCosmeticRules: true,
      enableHeuristicDetection: true,
    });
    bundle = {
      script,
      initResponse: `autoconsentReceiveMessage({"type":"initResp","config":${config},"rules":{"autoconsent":${rules}}})`,
    };
  }
  return bundle;
}

function findAndClickAccept() {
  const labels =
    /^(akceptuj(ę)?( wszystkie)?( cookies?)?|zgadzam się|przyjmuję|przyjmij( wszystkie)?|accept( all)?( cookies)?|allow all|i agree|agree|ok|rozumiem|got it)$/i;
  const hint = /cookie|consent|gdpr|rodo|cmp|privacy|prywatno/i;
  const visible = element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return (
      rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    );
  };
  const selector = 'button, a, [role=button], input[type=button], input[type=submit]';
  for (const element of document.querySelectorAll(selector)) {
    const text = (element.innerText || element.value || '').trim().replace(/\s+/g, ' ');
    if (!labels.test(text) || !visible(element)) continue;
    let node = element;
    for (let depth = 0; depth < 6 && node; depth += 1, node = node.parentElement) {
      const marker = `${node.id} ${String(node.className)} ${node.getAttribute('aria-label') || ''}`;
      const position = getComputedStyle(node).position;
      if (hint.test(marker) || position === 'fixed' || position === 'sticky') {
        element.click();
        return text;
      }
    }
  }
  return null;
}

async function runAutoconsent(page, timeoutMs) {
  const { script, initResponse } = loadBundle();
  const state = { detected: false, cmp: null, optIn: null, done: false };
  try {
    await page.exposeBinding('autoconsentSendMessage', async ({ frame }, message) => {
      switch (message.type) {
        case 'init':
          await frame.evaluate(initResponse).catch(() => {});
          break;
        case 'cmpDetected':
          state.detected = true;
          state.cmp = message.cmp ?? state.cmp;
          break;
        case 'optInResult':
          state.optIn = message.result === true;
          state.cmp = message.cmp ?? state.cmp;
          break;
        case 'autoconsentDone':
          state.done = true;
          break;
        case 'eval': {
          let result = false;
          try {
            result = await frame.evaluate(message.code);
          } catch {
            result = false;
          }
          await frame
            .evaluate(
              `autoconsentReceiveMessage(${JSON.stringify({ id: message.id, type: 'evalResp', result })})`,
            )
            .catch(() => {});
          break;
        }
        default:
      }
    });
  } catch {
    return state;
  }
  const inject = frame => frame.evaluate(script).catch(() => {});
  const onNavigated = frame => inject(frame);
  page.on('framenavigated', onNavigated);
  await Promise.all(page.frames().map(inject));
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (state.done || state.optIn !== null) break;
    if (!state.detected && Date.now() - start > 4500) break;
    await page.waitForTimeout(150);
  }
  page.off('framenavigated', onNavigated);
  return state;
}

export async function acceptConsent(page, { timeoutMs = 10_000 } = {}) {
  const state = await runAutoconsent(page, timeoutMs);
  if (state.optIn === true) {
    await waitForStableDom(page, { maxMs: 2000 });
    return { method: 'autoconsent', cmp: state.cmp, accepted: true };
  }
  const clicked = await page.evaluate(findAndClickAccept).catch(() => null);
  if (clicked) {
    await waitForStableDom(page, { maxMs: 2000 });
    return { method: 'fallback', cmp: null, accepted: true, label: clicked };
  }
  return { method: 'none', cmp: state.cmp, accepted: false };
}
