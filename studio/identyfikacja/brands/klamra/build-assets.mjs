import { readFileSync, writeFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { glueHtml } from '../../../../sites/src/identyfikacja/klamra/lib/typography.ts';
import { join } from 'node:path';
import { withBrowser, htmlToImage, htmlToPdf } from '../../lib/browser.mjs';
import { ensureDir, writeFile } from '../../lib/files.mjs';
import { quantizePng } from '../../lib/png.mjs';
import { brand, file } from './theme.mjs';
import { buildIcons } from './icons.mjs';
import { buildPattern } from './pattern.mjs';
import { buildFigures } from './figures.mjs';
import { buildAnimationPage } from './animation-page.mjs';
import {
  applicationScene,
  avatarScene,
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
buildAnimationPage();
ensureDir(pub('email'));
writeFile(pub(file.emailHtml), glueHtml(emailHtmlFile()));

const pngData = `data:image/png;base64,${readFileSync(pub(file.logoPng('horizontal', 512))).toString('base64')}`;

const jobs = [
  { name: 'card-front', html: glueHtml(cardScene('front')), out: file.cardFront, width: 1800, height: 1260, type: 'jpeg' },
  { name: 'card-back', html: glueHtml(cardScene('back')), out: file.cardBack, width: 1800, height: 1260, type: 'jpeg' },
  { name: 'letterhead', html: glueHtml(letterheadScene()), out: file.letterhead, width: 1500, height: 1860, type: 'jpeg' },
  { name: 'application', html: glueHtml(applicationScene()), out: file.application, width: 1900, height: 1180, type: 'jpeg' },
  { name: 'email', html: glueHtml(emailScene(pngData)), out: file.emailMock, width: 1600, height: 1100, type: 'jpeg' },
  { name: 'avatar', html: glueHtml(avatarScene()), out: file.avatar, width: 1080, height: 1080 },
  { name: 'post-1', html: glueHtml(postScene(1)), out: file.post(1), width: 1080, height: 1350 },
  { name: 'post-2', html: glueHtml(postScene(2)), out: file.post(2), width: 1080, height: 1350 },
  { name: 'post-3', html: glueHtml(postScene(3)), out: file.post(3), width: 1080, height: 1350 },
  { name: 'og', html: glueHtml(ogScene()), out: file.og, width: 1200, height: 630 },
];

const mm = 72 / 25.4;
const setCardBoxes = async path => {
  const document = await PDFDocument.load(readFileSync(path));
  for (const page of document.getPages()) {
    const { width, height } = page.getMediaBox();
    page.setBleedBox(0, 0, width, height);
    page.setTrimBox(3 * mm, 3 * mm, 85 * mm, 55 * mm);
  }
  writeFileSync(path, await document.save());
};

const errors = [];
await withBrowser(async browser => {
  for (const job of jobs) {
    const found = await htmlToImage(browser, { outDir, name: job.name, html: job.html, out: pub(job.out), width: job.width, height: job.height, type: job.type ?? 'png', scale: 1, quality: 82 });
    errors.push(...found.map(message => `${job.name}: ${message}`));
    if (!job.type) quantizePng(pub(job.out));
    console.log(`  ${job.out}`);
  }
  await htmlToPdf(browser, { outDir, name: 'card-print', html: glueHtml(cardPrintHtml()), out: pub(file.cardPdf), width: 344, height: 231 });
  await setCardBoxes(pub(file.cardPdf));
  console.log(`  ${file.cardPdf}`);
  await htmlToPdf(browser, { outDir, name: 'letterhead-print', html: glueHtml(letterheadPrintHtml()), out: pub(file.letterheadPdf), width: 794, height: 1123 });
  console.log(`  ${file.letterheadPdf}`);
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
