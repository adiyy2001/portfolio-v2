export const logoVariants = ['primary', 'symbol', 'horizontal', 'vertical', 'mono-black', 'negative'];
export const pngSizes = [512, 1024, 2048];
export const faviconIcoSizes = [16, 32, 48];
export const postSize = { width: 1080, height: 1350 };
export const avatarSize = { width: 1080, height: 1080 };
export const ogSize = { width: 1200, height: 630 };
export const animationSize = 1080;
export const cardMm = { width: 85, height: 55, bleed: 3 };
export const a4Mm = { width: 210, height: 297 };
export const brandbookPx = { width: 1920, height: 1080, minPages: 20, maxPages: 30 };

export const names = slug => ({
  logoSvg: variant => `logo/${slug}-${variant}.svg`,
  logoPng: (variant, size) => `logo/png/${slug}-${variant}-${size}.png`,
  logoPdf: variant => `logo/pdf/${slug}-${variant}.pdf`,
  favicon: 'favicon.svg',
  ico: 'favicon.ico',
  apple: 'apple-touch-icon.png',
  og: 'og.png',
  avatar: `social/${slug}-avatar.png`,
  post: n => `social/${slug}-post-${n}.png`,
  cardFront: `mockups/${slug}-card-front.jpg`,
  cardBack: `mockups/${slug}-card-back.jpg`,
  letterhead: `mockups/${slug}-letterhead.jpg`,
  application: `mockups/${slug}-application.jpg`,
  emailMock: `mockups/${slug}-email-signature.jpg`,
  cardPdf: `print/${slug}-business-card.pdf`,
  letterheadPdf: `print/${slug}-letterhead.pdf`,
  emailHtml: `email/${slug}-email-signature.html`,
  mp4: `animation/${slug}-logo.mp4`,
  webm: `animation/${slug}-logo.webm`,
  brandbook: `${slug}-brandbook.pdf`,
  palette: `colors/${slug}-palette.json`,
  tokens: `colors/${slug}-tokens.css`,
  pattern: `pattern/${slug}-pattern.svg`,
  iconsSprite: `icons/${slug}-icons.svg`,
  icon: name => `icons/svg/${slug}-icon-${name}.svg`,
  zip: `${slug}-identyfikacja.zip`,
  manifest: 'manifest.json',
});

export const groups = [
  { id: 'logo', title: 'Logo', match: p => p.startsWith('logo/') },
  { id: 'favicon', title: 'Ikona strony', match: p => ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'].includes(p) },
  { id: 'colors', title: 'Kolor', match: p => p.startsWith('colors/') },
  { id: 'fonts', title: 'Kroje', match: p => p.startsWith('fonts/') },
  { id: 'pattern', title: 'Wzór', match: p => p.startsWith('pattern/') },
  { id: 'icons', title: 'Ikony', match: p => p.startsWith('icons/') },
  { id: 'print', title: 'Druk', match: p => p.startsWith('print/') },
  { id: 'social', title: 'Media społecznościowe', match: p => p.startsWith('social/') },
  { id: 'email', title: 'Podpis e-mail', match: p => p.startsWith('email/') },
  { id: 'mockups', title: 'Makiety', match: p => p.startsWith('mockups/') },
  { id: 'animation', title: 'Animacja logo', match: p => p.startsWith('animation/') },
  { id: 'brandbook', title: 'Brand book', match: p => p.endsWith('-brandbook.pdf') },
  { id: 'zip', title: 'Wszystko w jednym pliku', match: p => p.endsWith('-identyfikacja.zip') },
  { id: 'meta', title: 'Pozostałe', match: () => true },
];

export const groupOf = path => groups.find(group => group.match(path)).id;

export const zipExcludes = path =>
  path.startsWith('animation/') || path.startsWith('mockups/') || path.startsWith('figures/') || path === 'manifest.json' || path.endsWith('.zip') || path === 'og.png';
