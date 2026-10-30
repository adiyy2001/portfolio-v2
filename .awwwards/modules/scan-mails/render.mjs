import { writeFileSync } from 'node:fs';
import { pageHtml, confirmMail, reportMail, failureMail } from '../../../workers/scan/views.js';

const out = new URL('./site/', import.meta.url).pathname;
const pages = ['confirmed', 'confirmInvalid', 'unsubscribed', 'unsubscribeInvalid', 'reportExpired', 'reportUnknown'];
for (const key of pages) writeFileSync(`${out}pages/${key}.html`, pageHtml(key));

const link = 'https://api.adrianturbinski.pl/scan/confirm?t=Qm3vN8xYp2LkR7sTe1WzA5bC9dFgH4jUiOo6PqXyZ0n';
const row = { domain: 'sklep-przyklad.pl', marketing: 1 };
const summary = { violations: 12, pages: 7 };
const report = 'https://api.adrianturbinski.pl/r/Xk3mP9qR2sT7vW1yZ4bC6dF8';
const unsub = 'https://api.adrianturbinski.pl/scan/unsubscribe?t=abc123def456ghi789jkl012mno345pqr678stu90';
const mails = {
  confirm: confirmMail(row.domain, link),
  report: reportMail(row, summary, report, '2026-11-29T10:00:00.000Z', unsub),
  reportOne: reportMail({ ...row, marketing: 0 }, { violations: 1, pages: 3 }, report, '2026-11-29T10:00:00.000Z', unsub),
  failure: failureMail(row),
  hostile: confirmMail('"><script>alert(1)</script>.pl', link + '"><img src=x onerror=alert(1)>'),
};
for (const [name, mail] of Object.entries(mails)) {
  writeFileSync(`${out}mails/${name}.html`, mail.html);
  writeFileSync(`${out}mails/${name}.txt`, mail.text);
}
console.log('ok');
