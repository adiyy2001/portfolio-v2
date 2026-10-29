import { useEffect } from 'react';
import { withPrefix } from 'gatsby';

const faces = [
  ['Bodoni Moda', 'wz-bodoni-moda', '500'],
  ['Bricolage Grotesque', 'wz-bricolage-grotesque', '400 700'],
  ['Outfit', 'wz-outfit', '400 500'],
  ['Newsreader', 'wz-newsreader', '400'],
  ['Unbounded', 'wz-unbounded', '600'],
  ['Gloock', 'wz-gloock', '400'],
  ['Big Shoulders Display', 'wz-big-shoulders', '800'],
  ['Archivo', 'wz-archivo', '800'],
  ['Besley', 'wz-besley', '800'],
  [
    'Barlow Condensed',
    'wz-barlow-condensed',
    '700',
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  ],
  [
    'Barlow Condensed',
    'wz-barlow-condensed-ext',
    '700',
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  ],
];

let requested = false;

function loadFaces() {
  if (requested || typeof FontFace === 'undefined' || !document.fonts) return;
  requested = true;
  faces.forEach(([family, file, weight, unicodeRange]) => {
    const face = new FontFace(
      family,
      `url(${withPrefix(`/fonts/${file}.woff2`)}) format('woff2')`,
      { weight, display: 'swap', ...(unicodeRange && { unicodeRange }) },
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
