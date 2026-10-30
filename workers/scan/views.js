import consent from './consent.js';

export const site = 'https://adrianturbinski.pl';
export const replyTo = 'contact@adrianturbinski.pl';
const privacyUrl = `${site}/polityka-prywatnosci/`;
const formUrl = `${site}/skaner/`;

export const escapeHtml = value =>
  String(value).replace(
    /[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

const serif = "Georgia,'Times New Roman',serif";
const sans = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const ease = 'cubic-bezier(0.2,0.8,0.2,1)';
const pinkBottom = 'conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg)';

const controllerLine =
  'Administrator danych: Adrian Turbiński, Adrian Turbiński Software, Wrocław, contact@adrianturbinski.pl.';

const pageStyles = `
*{box-sizing:border-box}
html{background:#5a1424;-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:repeating-linear-gradient(45deg,rgba(233,239,246,0.035) 0 1px,transparent 1px 4px),#5a1424;color:#e9eff6;font:400 18px/1.5 ${sans}}
header{padding:20px clamp(16px,4.4vw,72px) 0}
.mark{display:inline-block;padding:8px 0;font:700 1.5rem/1 ${serif};letter-spacing:-0.01em;color:#e9eff6;text-decoration:none}
.mark:focus-visible,.foot a:focus-visible{outline:3px solid #9dbbe0;outline-offset:3px}
main{display:flex;justify-content:center;align-items:flex-start;padding:max(3.5rem,8vh) 16px 40px}
.tag{position:relative;width:min(100%,38rem);margin-top:2.7rem;color:#14181f;filter:drop-shadow(0 1px 0 rgba(0,0,0,0.35)) drop-shadow(0 22px 20px rgba(0,0,0,0.4))}
.string{position:absolute;top:-2.7rem;left:50%;width:4.5rem;height:4.5rem;margin-left:-2.25rem;z-index:1}
.sheet{position:relative;padding:2.6rem 1.8rem 2.6rem;background:#cbd3da;-webkit-mask:${pinkBottom} 50% / 18px 100%;mask:${pinkBottom} 50% / 18px 100%}
.sheet::after{content:"";position:absolute;inset:7px 7px 11px;border:1px dashed #8e1226;pointer-events:none}
h1{margin:0 0 1rem;font:700 clamp(2.1rem,8vw,3.75rem)/1.04 ${serif};letter-spacing:-0.01em;text-wrap:balance}
p{margin:0 0 0.75rem;font-size:1.0625rem;line-height:1.5}
p.soft{color:#2f3743}
.seam{position:relative;height:3px;margin:1.5rem 0}
.run{position:absolute;top:0;bottom:0;left:0;width:100%;overflow:hidden}
.run i{display:block;height:100%;background:repeating-linear-gradient(90deg,#8e1226 0 10px,transparent 10px 16px)}
.cut .run{width:56%}
.rest{position:absolute;top:0;bottom:0;left:64%;right:0;background:repeating-linear-gradient(90deg,rgba(47,55,67,0.55) 0 3px,transparent 3px 9px)}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem 1.25rem;margin-top:1.4rem}
.btn{position:relative;display:inline-block;min-height:48px;padding:12px 24px;background:#3b0d18;color:#e9eff6;font-weight:700;font-size:1.0625rem;line-height:1.3;text-decoration:none}
.btn::after{content:"";position:absolute;inset:4px;border:1px dashed rgba(233,239,246,0.6);pointer-events:none}
button.btn{border:0;font-family:inherit;cursor:pointer}
.btn:hover{background:#5a1424}
.btn:focus-visible,.link:focus-visible{outline:3px solid #8e1226;outline-offset:3px}
.inline{color:#3b0d18;text-underline-offset:4px}
.link{display:inline-block;padding:10px 2px;color:#3b0d18;font-size:1.0625rem;text-decoration:underline;text-underline-offset:4px}
.foot{padding:0 clamp(16px,4.4vw,72px) 28px;color:#e9eff6;font-size:0.8125rem;line-height:1.6}
.foot p{margin:0;max-width:44rem;font-size:inherit}
.foot a{color:#9dbbe0;text-underline-offset:3px}
@media (max-width:30rem){.sheet{padding:2.4rem 1.2rem 2.4rem}.btn{width:100%;text-align:center}.actions{display:block}.link{margin-top:0.5rem}}
@media (prefers-reduced-motion:no-preference){.run i{animation:sew 0.85s ${ease} 0.15s both}@keyframes sew{from{transform:translateX(-100%)}to{transform:none}}}
@media (forced-colors:active){.sheet{border:1px solid CanvasText;-webkit-mask:none;mask:none}.btn{border:1px solid ButtonText}.run i{background:CanvasText}.rest{background:none;border-top:3px dotted CanvasText}}
`;

const stringSvg =
  '<svg class="string" viewBox="0 0 72 72" aria-hidden="true" focusable="false"><path d="M36 58C34 38 30 24 37 7M36 58C42 38 46 24 37 7" fill="none" stroke="#e9eff6" stroke-width="2.4" stroke-linecap="round"/><circle cx="37" cy="5" r="4" fill="#c3cedd" stroke="#14181f" stroke-width="1.2"/><circle cx="36" cy="58" r="8" fill="#5a1424" stroke="#9dbbe0" stroke-width="3"/></svg>';

const mailLink = `<a class="inline" href="mailto:${replyTo}">${replyTo}</a>`;

const pageTexts = {
  confirmAsk: {
    title: 'Potwierdź zlecenie skanu.',
    seam: 'closed',
    lead: 'Kliknij przycisk, żeby potwierdzić adres e-mail i uruchomić skan.',
    more: 'Link z maila jest ważny 24 godziny.',
    actions: 'confirm',
  },
  confirmed: {
    title: 'Adres potwierdzony.',
    seam: 'closed',
    lead: 'Skan ruszył. Raport przyjdzie mailem w ciągu kilkunastu minut.',
    more: 'Link do raportu będzie ważny 30 dni.',
    actions: 'back',
  },
  confirmInvalid: {
    title: 'Link jest nieważny.',
    seam: 'cut',
    lead: 'Ten link jest nieprawidłowy albo wygasł. Wypełnij formularz skanera jeszcze raz.',
    more: 'Link z maila jest ważny 24 godziny.',
    actions: 'form',
  },
  unsubscribed: {
    title: 'Zgoda wycofana.',
    seam: 'closed',
    lead: 'Nie będziesz dostawać wiadomości marketingowych.',
    actions: 'back',
  },
  unsubscribeInvalid: {
    title: 'Link do wypisu jest nieważny.',
    seam: 'cut',
    lead: 'Ten link jest nieprawidłowy.',
    more: `Zgodę możesz wycofać, pisząc na ${mailLink}.`,
    actions: 'back',
  },
  reportExpired: {
    title: 'Raport wygasł.',
    seam: 'cut',
    lead: 'Link do raportu jest ważny 30 dni. Wypełnij formularz skanera jeszcze raz.',
    actions: 'form',
  },
  reportUnknown: {
    title: 'Nie ma takiego raportu.',
    seam: 'cut',
    lead: 'Ten link jest nieprawidłowy albo raport wygasł.',
    more: 'Link do raportu jest ważny 30 dni.',
    actions: 'back',
  },
};

const seamHtml = state =>
  state === 'cut'
    ? '<div class="seam cut" aria-hidden="true"><span class="run"><i></i></span><span class="rest"></span></div>'
    : '<div class="seam" aria-hidden="true"><span class="run"><i></i></span></div>';

const actionsHtml = (kind, token) =>
  kind === 'confirm'
    ? `<form method="post" action="/scan/confirm"><input type="hidden" name="t" value="${escapeHtml(token)}"><div class="actions"><button class="btn" type="submit">Potwierdzam i zlecam skan</button></div></form>`
    : kind === 'form'
      ? `<div class="actions"><a class="btn" href="${formUrl}">Wróć do formularza</a><a class="link" href="${site}/">Wróć na stronę</a></div>`
      : `<div class="actions"><a class="btn" href="${site}/">Wróć na stronę</a></div>`;

const pageHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

const confirmHeaders = {
  ...pageHeaders,
  'Content-Security-Policy': pageHeaders['Content-Security-Policy'].replace(
    "form-action 'none'",
    "form-action 'self'",
  ),
};

export function pageHtml(key, token = '') {
  const { title, seam, lead, more, actions } = pageTexts[key];
  const plainTitle = title.replace(/\.$/, '');
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="color-scheme" content="dark"><title>${escapeHtml(plainTitle)}</title><style>${pageStyles}</style></head><body><header><a class="mark" href="${site}/">Turbiński</a></header><main><div class="tag">${stringSvg}<div class="sheet"><h1>${escapeHtml(title)}</h1>${seamHtml(seam)}<p>${lead}</p>${more ? `<p class="soft">${more}</p>` : ''}${actionsHtml(actions, token)}</div></div></main><footer class="foot"><p>${controllerLine.replace(replyTo, `<a href="mailto:${replyTo}">${replyTo}</a>`)} <a href="${privacyUrl}">Polityka prywatności</a>.</p></footer></body></html>`;
}

export const confirmAskPage = token =>
  new Response(pageHtml('confirmAsk', token), { status: 200, headers: confirmHeaders });

export const statusPage = (key, status = 200) =>
  new Response(pageHtml(key), { status, headers: pageHeaders });

export const footerText = unsubscribeLink =>
  [
    controllerLine,
    `Polityka prywatności: ${privacyUrl}`,
    ...(unsubscribeLink
      ? [`Zgodę na wiadomości marketingowe możesz wycofać tutaj: ${unsubscribeLink}`]
      : []),
  ].join('\n');

const mailStyles = `
a{color:#8e1226}
@media (max-width:620px){.outer{padding:16px 8px !important}.pad{padding:26px 18px !important}.h1{font-size:28px !important}.btn{display:block !important;text-align:center !important}.stubnum{font-size:54px !important}.stubcap{letter-spacing:0.02em !important}}
@media (prefers-color-scheme:dark){.card{background:#2f3743 !important}.ink{color:#e9eff6 !important}.soft{color:#c3cedd !important}.frame{border-color:#9dbbe0 !important}.sew{border-top-color:#9dbbe0 !important}.loose{border-top-color:#7d8791 !important}.card a.text{color:#9dbbe0 !important}.stub{background:#14181f !important}.rule{border-top-color:#7d8791 !important}}
`;

const seamMail = state => {
  const line = 'font-size:0;line-height:0;height:3px;border-top:3px dashed #8e1226';
  if (state === 'cut')
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0"><tr><td class="sew" width="56%" style="width:56%;${line}">&nbsp;</td><td width="8%" style="width:8%;font-size:0;line-height:0">&nbsp;</td><td class="loose" width="36%" style="width:36%;font-size:0;line-height:0;height:3px;border-top:3px dotted #8a949e">&nbsp;</td></tr></table>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0"><tr><td class="sew" style="${line}">&nbsp;</td></tr></table>`;
};

const domainHtml = domain =>
  `<strong style="${domain.length <= 28 ? 'white-space:nowrap' : 'overflow-wrap:anywhere'}">${escapeHtml(domain)}</strong>`;

const paragraph = (html, className = 'ink', color = '#14181f', size = 16) =>
  `<p class="${className}" style="margin:0 0 14px;font:400 ${size}px/1.55 ${sans};color:${color}">${html}</p>`;

const buttonMail = (href, label) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 18px"><tr><td align="left"><table role="presentation" class="btnbox" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:340px"><tr><td bgcolor="#3b0d18" style="background:#3b0d18;padding:4px"><a class="btn" href="${escapeHtml(href)}" style="display:block;padding:14px 22px;border:1px dashed #9dbbe0;font:700 17px/1.3 ${sans};color:#e9eff6;text-decoration:none;text-align:center">${label}</a></td></tr></table></td></tr></table>`;

const linkFallback = href =>
  `<p class="soft" style="margin:0 0 14px;font:400 14px/1.5 ${sans};color:#2f3743">Jeśli przycisk nie działa, skopiuj ten adres do przeglądarki:<br><a class="text" href="${escapeHtml(href)}" style="color:#8e1226;word-break:break-all">${escapeHtml(href)}</a></p>`;

const footerMail = unsubscribeLink =>
  `<p style="margin:0;font:400 13px/1.6 ${sans};color:#c3cedd">${controllerLine.replace(replyTo, `<a href="mailto:${replyTo}" style="color:#9dbbe0">${replyTo}</a>`)} <a href="${privacyUrl}" style="color:#9dbbe0">Polityka prywatności</a>.${
    unsubscribeLink
      ? ` <a href="${escapeHtml(unsubscribeLink)}" style="color:#9dbbe0">Wycofaj zgodę na wiadomości marketingowe</a>.`
      : ''
  }</p>`;

const mailPage = ({ subject, preheader, title, seam, body, unsubscribeLink }) =>
  `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${escapeHtml(subject)}</title><style>${mailStyles}</style></head><body style="margin:0;padding:0;background:#5a1424"><div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#5a1424">${escapeHtml(preheader)}</div><div role="main"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#5a1424" style="background:#5a1424"><tr><td class="outer" align="center" style="padding:28px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px"><tr><td style="padding:0 4px 18px;font:700 24px/1 ${serif};color:#e9eff6">Turbiński</td></tr><tr><td class="card" bgcolor="#cbd3da" style="background:#cbd3da;padding:8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="frame pad" style="padding:34px 30px;border:1px dashed #8e1226"><h1 class="h1 ink" style="margin:0;font:700 34px/1.1 ${serif};color:#14181f">${escapeHtml(title)}</h1>${seamMail(seam)}${body}</td></tr></table></td></tr><tr><td style="padding:20px 4px 0">${footerMail(unsubscribeLink)}</td></tr></table></td></tr></table></div></body></html>`;

export function confirmMail(domain, link) {
  const subject = 'Potwierdź adres e-mail, aby uruchomić skan';
  const text = [
    `Ktoś, najpewniej Ty, poprosił o skan dostępności strony ${domain}.`,
    '',
    `Otwórz link i potwierdź swój adres e-mail, a skan ruszy: ${link}`,
    '',
    'Link jest ważny 24 godziny. Jeśli to nie Ty, zignoruj tę wiadomość, nic się nie wydarzy.',
    '',
    footerText(),
  ].join('\n');
  const html = mailPage({
    subject,
    preheader: 'Link jest ważny 24 godziny.',
    title: 'Potwierdź adres e-mail.',
    seam: 'closed',
    body: [
      paragraph(`Ktoś, najpewniej Ty, poprosił o skan dostępności strony ${domainHtml(domain)}.`),
      paragraph('Otwórz link i potwierdź adres e-mail, a skan ruszy.'),
      buttonMail(link, 'Potwierdź adres e-mail'),
      linkFallback(link),
      paragraph(
        'Link jest ważny 24 godziny. Jeśli to nie Ty, zignoruj tę wiadomość, nic się nie wydarzy.',
      ),
    ].join(''),
  });
  return { subject, text, html };
}

const polishDate = iso => iso.slice(0, 10).split('-').reverse().join('.');

const errorsLabel = count => {
  const last = count % 10;
  const tail = count % 100;
  if (count === 1) return 'potwierdzony błąd';
  if (last >= 2 && last <= 4 && (tail < 12 || tail > 14)) return 'potwierdzone błędy';
  return 'potwierdzonych błędów';
};

const stubMail = count =>
  `<table role="presentation" class="stub" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#2f3743" style="background:#2f3743;margin:0 0 18px"><tr><td style="padding:7px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed #9dbbe0"><tr><td class="stubnum" style="padding:16px 8px 16px 20px;font:700 64px/1 ${serif};color:#e9eff6;white-space:nowrap;width:1%">${count}</td><td class="stubcap" style="padding:16px 20px 16px 8px;font:700 13px/1.35 ${sans};letter-spacing:0.08em;text-transform:uppercase;color:#e9eff6">${errorsLabel(count)}<br><span style="font:italic 400 17px/1.4 ${serif};letter-spacing:0;text-transform:none;color:#9dbbe0">zmierzone, nie oszacowane</span></td></tr></table></td></tr></table>`;

export function reportMail(row, summary, link, expires, unsubscribeLink) {
  const subject = `Raport dostępności: ${row.domain}`;
  const counts = `Potwierdzone błędy: ${summary.violations}, przeskanowane strony: ${summary.pages}.`;
  const validity = `Link jest ważny 30 dni, do ${polishDate(expires)}.`;
  const showUnsubscribe = row.marketing ? unsubscribeLink : '';
  const text = [
    `Skan strony ${row.domain} został zakończony.`,
    counts,
    '',
    `Raport: ${link}`,
    validity,
    '',
    consent.pl.disclaimer,
    '',
    footerText(showUnsubscribe),
  ].join('\n');
  const html = mailPage({
    subject,
    preheader: 'Link do raportu jest ważny 30 dni.',
    title: 'Raport jest gotowy.',
    seam: 'closed',
    unsubscribeLink: showUnsubscribe,
    body: [
      paragraph(`Skan strony ${domainHtml(row.domain)} został zakończony.`),
      stubMail(summary.violations),
      paragraph(`Przeskanowane strony: ${summary.pages}.`),
      buttonMail(link, 'Otwórz raport'),
      linkFallback(link),
      paragraph(validity),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0"><tr><td class="rule" style="padding-top:16px;border-top:1px dotted #2f3743">${paragraph(escapeHtml(consent.pl.disclaimer), 'soft', '#2f3743', 14)}</td></tr></table>`,
    ].join(''),
  });
  return { subject, text, html };
}

export function failureMail(row) {
  const subject = `Nie udało się przeskanować: ${row.domain}`;
  const reason =
    'Strona mogła być chwilowo niedostępna, blokować automatyczne odwiedziny albo odpowiadać zbyt wolno.';
  const text = [
    `Nie udało się przeskanować strony ${row.domain}.`,
    reason,
    'Możesz spróbować ponownie później.',
    '',
    footerText(),
  ].join('\n');
  const html = mailPage({
    subject,
    preheader: 'Możesz spróbować ponownie później.',
    title: 'Skan się nie udał.',
    seam: 'cut',
    body: [
      paragraph(`Nie udało się przeskanować strony ${domainHtml(row.domain)}.`),
      paragraph(reason),
      paragraph('Możesz spróbować ponownie później.'),
    ].join(''),
  });
  return { subject, text, html };
}
