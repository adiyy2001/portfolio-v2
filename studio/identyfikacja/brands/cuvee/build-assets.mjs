import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withBrowser, htmlToImage, htmlToPdf } from '../../lib/browser.mjs';
import { ensureDir, writeFile } from '../../lib/files.mjs';
import { quantizePng } from '../../lib/png.mjs';
import { PDFDocument } from 'pdf-lib';
import { typesetHtml } from '../../../../sites/src/identyfikacja/cuvee/typography.ts';
import { brand, file } from './theme.mjs';
import { buildIcons } from './icons.mjs';
import { buildPattern } from './pattern.mjs';
import { buildFigures } from './figures.mjs';
import {
  avatarScene,
  applicationScene,
  cardPrintHtml,
  cardScene,
  emailHtmlFile,
  emailScene,
  letterheadPrintHtml,
  letterheadScene,
  ogScene,
  postScene,
} from './scenes.mjs';

const pub = path => join(brand.paths.pub, path);
const outDir = brand.paths.out;

buildPattern();
buildIcons();
buildFigures();
ensureDir(pub('email'));
writeFile(pub(file.emailHtml), typesetHtml(emailHtmlFile()));

const pngData = `data:image/png;base64,${readFileSync(pub(file.logoPng('horizontal', 512))).toString('base64')}`;

const jobs = [
  { name: 'card-front', html: cardScene('front'), out: file.cardFront, width: 1800, height: 1260, type: 'jpeg', scale: 1 },
  { name: 'card-back', html: cardScene('back'), out: file.cardBack, width: 1800, height: 1260, type: 'jpeg', scale: 1 },
  { name: 'letterhead', html: letterheadScene(), out: file.letterhead, width: 1500, height: 1860, type: 'jpeg', scale: 1 },
  { name: 'application', html: applicationScene(), out: file.application, width: 1900, height: 1400, type: 'jpeg', scale: 1 },
  { name: 'email', html: emailScene(pngData), out: file.emailMock, width: 1600, height: 1100, type: 'jpeg', scale: 1 },
  { name: 'avatar', html: avatarScene(), out: file.avatar, width: 1080, height: 1080 },
  { name: 'post-1', html: postScene(1), out: file.post(1), width: 1080, height: 1350 },
  { name: 'post-2', html: postScene(2), out: file.post(2), width: 1080, height: 1350 },
  { name: 'post-3', html: postScene(3), out: file.post(3), width: 1080, height: 1350 },
  { name: 'og', html: ogScene(), out: file.og, width: 1200, height: 630 },
];

const pointsPerMm = 72 / 25.4;
const setPrintBoxes = async (path, bleedMm) => {
  const doc = await PDFDocument.load(readFileSync(path));
  const inset = bleedMm * pointsPerMm;
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    page.setBleedBox(0, 0, width, height);
    page.setTrimBox(inset, inset, width - inset * 2, height - inset * 2);
  });
  writeFileSync(path, await doc.save());
};

const errors = [];
await withBrowser(async browser => {
  for (const job of jobs) {
    const found = await htmlToImage(browser, { outDir, name: job.name, html: job.html, out: pub(job.out), width: job.width, height: job.height, type: job.type ?? 'png', scale: job.scale ?? 1, quality: 80 });
    errors.push(...found.map(message => `${job.name}: ${message}`));
    if (!job.type) quantizePng(pub(job.out));
    console.log(`  ${job.out}`);
  }
  await htmlToPdf(browser, { outDir, name: 'card-print', html: typesetHtml(cardPrintHtml()), out: pub(file.cardPdf), width: 344, height: 231 });
  await setPrintBoxes(pub(file.cardPdf), 3);
  console.log(`  ${file.cardPdf}`);
  await htmlToPdf(browser, { outDir, name: 'letterhead-print', html: typesetHtml(letterheadPrintHtml()), out: pub(file.letterheadPdf), width: 794, height: 1123 });
  console.log(`  ${file.letterheadPdf}`);
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
