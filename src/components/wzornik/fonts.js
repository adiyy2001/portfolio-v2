import { useEffect } from 'react';
import { withPrefix } from 'gatsby';

const latin = 'U+0020-007E, U+00A0-00FF, U+2018-201E, U+2026, U+20AC, U+2116, U+2192';
const polish = 'U+0104-0107, U+0118-0119, U+0141-0144, U+015A-015B, U+0179-017C';

const faces = [
  ['Bodoni Moda', 'wz-bodoni-moda', '600 900'],
  ['JetBrains Mono', 'wz-jetbrains-mono', '400 700'],
  ['Manrope', 'wz-manrope', '500 800'],
  ['Newsreader', 'wz-newsreader', '300 700'],
  ['Archivo', 'wz-archivo', '400'],
  ['Cormorant Garamond', 'wz-cormorant', '500'],
  ['Cormorant Garamond', 'wz-cormorant-italic', '500', 'italic'],
  ['Special Elite', 'wz-special-elite', '400'],
  ['Cinzel Decorative', 'wz-cinzel-decorative', '700'],
  ['Pinyon Script', 'wz-pinyon-script', '400'],
  ['Anton', 'wz-anton', '400'],
  ['Playfair Display', 'wz-playfair-black', '900'],
].flatMap(([family, file, weight, style = 'normal']) => [
  [family, file, weight, style, latin],
  [family, `${file}-ext`, weight, style, polish],
]);

let requested = false;

function loadFaces() {
  if (requested || typeof FontFace === 'undefined' || !document.fonts) return;
  requested = true;
  faces.forEach(([family, file, weight, style, unicodeRange]) => {
    const face = new FontFace(
      family,
      `url(${withPrefix(`/fonts/${file}.woff2`)}) format('woff2')`,
      { weight, style, unicodeRange, display: 'swap' },
    );
    document.fonts.add(face);
    face.load().catch(() => {});
  });
}

export default function useFaces(near) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      loadFaces();
      return undefined;
    }
    const watcher = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          watcher.disconnect();
          loadFaces();
        }
      },
      { rootMargin: '150% 0px' },
    );
    watcher.observe(near.current);
    return () => watcher.disconnect();
  }, [near]);
}
