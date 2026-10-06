import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync } from 'fflate';
import { requireSlug } from '../lib/args.mjs';
import { colorTable, contrastTable, loadBrand } from '../lib/brand.mjs';
import { a4Mm, animationSize, avatarSize, brandbookPx, cardMm, faviconIcoSizes, logoVariants, names, ogSize, pngSizes, postSize, zipExcludes } from '../lib/convention.mjs';
import { bytesOf, icoSizes, pngSize, rel, walk } from '../lib/files.mjs';
import { checkFile, isGuarded } from '../lib/guard.mjs';
import { probeFile } from '../lib/manifest.mjs';
import { checkLogoSvg } from '../lib/svg.mjs';

const { slug, flags } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const { pub } = brand.paths;
const file = names(slug);
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const exists = path => existsSync(join(pub, path));
const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance;

const iconNames = brand.iconNames ?? [];
const expectedFiles = [
  file.favicon, file.ico, file.apple, file.og, file.avatar, ...[1, 2, 3].map(file.post),
  file.cardFront, file.cardBack, file.letterhead, file.application, file.emailMock,
  file.cardPdf, file.letterheadPdf, file.emailHtml, file.mp4, file.webm, file.brandbook,
  file.palette, file.tokens, file.pattern, file.iconsSprite, file.zip, file.manifest,
  ...logoVariants.flatMap(v => [file.logoSvg(v), file.logoPdf(v), ...pngSizes.map(s => file.logoPng(v, s))]),
  ...iconNames.map(file.icon),
];
const missing = expectedFiles.filter(path => !exists(path));
check('all files of the convention exist', missing.length === 0, missing.join(', '));
check('twelve icons are named in brand.json', iconNames.length === 12, `${iconNames.length} names`);
check('fonts and licences published', brand.fonts.every(font => exists(`fonts/OFL-${font.family.replace(/\s+/g, '')}.txt`)) && walk(join(pub, 'fonts'), p => p.endsWith('.woff2')).length >= brand.fonts.length);

if (missing.length === 0) {
  for (const variant of logoVariants) {
    const svg = readFileSync(join(pub, file.logoSvg(variant)), 'utf8');
    const result = checkLogoSvg(svg);
    check(`logo svg ${variant}`, result.ok, result.problems.join(', '));
    for (const size of pngSizes) {
      const png = pngSize(join(pub, file.logoPng(variant, size)));
      check(`logo png ${variant} ${size}`, Math.max(png.width, png.height) === size && png.hasAlpha, `${png.width}x${png.height} alpha ${png.hasAlpha}`);
    }
  }
  const favicon = checkLogoSvg(readFileSync(join(pub, file.favicon), 'utf8'), { maxBytes: 4096 });
  check('favicon.svg', favicon.ok, favicon.problems.join(', '));
  const sizes = icoSizes(join(pub, file.ico)).map(item => item.width);
  check('favicon.ico sizes', faviconIcoSizes.every(size => sizes.includes(size)), sizes.join(','));
  const apple = pngSize(join(pub, file.apple));
  check('apple-touch-icon 180', apple.width === 180 && apple.height === 180);
  const og = pngSize(join(pub, file.og));
  check('og.png 1200x630', og.width === ogSize.width && og.height === ogSize.height);
  const avatar = pngSize(join(pub, file.avatar));
  check('avatar 1080x1080', avatar.width === avatarSize.width && avatar.height === avatarSize.height);
  for (const n of [1, 2, 3]) {
    const post = pngSize(join(pub, file.post(n)));
    check(`post ${n} 1080x1350`, post.width === postSize.width && post.height === postSize.height);
  }

  const card = await probeFile(pub, file.cardPdf);
  check('business card pdf 91x61 mm, 2 pages', card.pages === 2 && near(card.pageMm.width, cardMm.width + 2 * cardMm.bleed, 0.4) && near(card.pageMm.height, cardMm.height + 2 * cardMm.bleed, 0.4), `${card.pages} pages ${card.pageMm.width}x${card.pageMm.height} mm`);
  const paper = await probeFile(pub, file.letterheadPdf);
  check('letterhead pdf A4', paper.pages >= 1 && near(paper.pageMm.width, a4Mm.width, 0.6) && near(paper.pageMm.height, a4Mm.height, 0.6), `${paper.pageMm.width}x${paper.pageMm.height} mm`);
  const book = await probeFile(pub, file.brandbook);
  check('brand book 20 to 30 pages', book.pages >= brandbookPx.minPages && book.pages <= brandbookPx.maxPages, `${book.pages} pages`);
  check('brand book pages 1920x1080 px', near(book.pagePx.width, brandbookPx.width, 1) && near(book.pagePx.height, brandbookPx.height, 1), `${book.pagePx.width}x${book.pagePx.height}`);
  check('brand book up to 6 MB', book.bytes <= 6 * 1024 * 1024, `${book.bytes} B`);
  for (const variant of logoVariants) {
    const pdf = await probeFile(pub, file.logoPdf(variant));
    check(`logo pdf ${variant}`, pdf.pages === 1);
  }

  for (const path of [file.brandbook, file.cardPdf, file.letterheadPdf]) {
    const out = execFileSync('pdffonts', [join(pub, path)], { encoding: 'utf8' }).split('\n').slice(2).filter(Boolean);
    const unembedded = out.filter(line => /\sno\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$/.test(line));
    const type3 = out.filter(line => /\sType 3\s/.test(line));
    check(`pdffonts ${path}: ${out.length} fonts embedded`, out.length > 0 && unembedded.length === 0, unembedded.join(' | '));
    check(`pdffonts ${path}: no Type 3`, type3.length === 0, `${type3.length} Type 3 faces; pin the instances`);
  }

  for (const path of [file.mp4, file.webm]) {
    const info = await probeFile(pub, path);
    check(`${path}: ${animationSize}x${animationSize}, 2 to 4 s, under 1.5 MB`, info.width === animationSize && info.height === animationSize && info.duration >= 2 && info.duration <= 4.2 && info.bytes < 1.5 * 1024 * 1024, `${info.width}x${info.height} ${info.duration}s ${info.bytes} B`);
  }

  const icons = iconNames.map(name => readFileSync(join(pub, file.icon(name)), 'utf8'));
  check('icons: 24 px grid, no text', icons.every(svg => /viewBox="0 0 24 24"/.test(svg) && !/<text/i.test(svg)));
  check('pattern svg has no text', !/<text/i.test(readFileSync(join(pub, file.pattern), 'utf8')));

  const archive = unzipSync(new Uint8Array(readFileSync(join(pub, file.zip))));
  const entries = Object.keys(archive);
  const wanted = walk(pub).map(path => rel(pub, path)).filter(path => !zipExcludes(path));
  const lacking = wanted.filter(path => !entries.includes(`${slug}-identyfikacja/${path}`));
  check('zip holds every deliverable', lacking.length === 0, lacking.slice(0, 5).join(', '));
  check('zip up to 8 MB', bytesOf(join(pub, file.zip)) <= 8 * 1024 * 1024, `${bytesOf(join(pub, file.zip))} B`);

  const manifest = JSON.parse(readFileSync(join(pub, file.manifest), 'utf8'));
  const onDisk = walk(pub, path => !path.endsWith('manifest.json')).map(path => rel(pub, path));
  const stale = manifest.files.filter(item => !exists(item.path) || bytesOf(join(pub, item.path)) !== item.bytes).map(item => item.path);
  check('manifest matches the files on disk', stale.length === 0 && manifest.files.length === onDisk.length, `${manifest.files.length} listed, ${onDisk.length} on disk, stale ${stale.slice(0, 3).join(', ')}`);

  const contrast = contrastTable(brand);
  const failing = contrast.filter(item => !item.pass);
  check(`contrast: ${contrast.length} pairs, all at least AA`, failing.length === 0, failing.map(item => item.id).join(', '));
  const palette = JSON.parse(readFileSync(join(pub, file.palette), 'utf8'));
  check('palette json matches brand.json', palette.palette.length === colorTable(brand).length && palette.contrast.length === contrast.length);
}

const total = walk(pub).reduce((sum, path) => sum + bytesOf(path), 0);
check('published size up to 16 MB', total <= 16 * 1024 * 1024, `${(total / 1024 / 1024).toFixed(1)} MB`);
check('every file under 50 MB', walk(pub).every(path => bytesOf(path) < 50 * 1024 * 1024));

const guarded = [brand.paths.studio, brand.paths.site, brand.paths.page, pub].flatMap(dir => walk(dir, isGuarded));
const bad = guarded.flatMap(path => checkFile(path).map(hit => `${rel(brand.paths.studio, path)}:${hit.line} ${hit.kind}`));
check('no comments and no em or en dashes', bad.length === 0, bad.slice(0, 6).join(', '));

if (flags.dist) {
  const page = join(brand.paths.distBrand, 'index.html');
  check('case study page is in sites/dist', existsSync(page));
  if (existsSync(page)) {
    const html = readFileSync(page, 'utf8');
    check('page has noindex, lang pl, canonical, og image', html.includes('noindex') && html.includes('lang="pl"') && html.includes('rel="canonical"') && html.includes('og:image'));
    check('page footer sentence and link to /dla-klienta/', html.includes('to zmyślona firma') && html.includes('/dla-klienta/'));
  }
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? 'ok  ' : 'FAIL'} ${result.name}${result.ok || !result.detail ? '' : `: ${result.detail}`}`);
}
console.log(`${results.length - failed}/${results.length} checks passed`);
process.exit(failed > 0 ? 1 : 0);
