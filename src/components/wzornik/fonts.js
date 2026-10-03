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
];

let requested = false;

function loadFaces() {
  if (requested || typeof FontFace === 'undefined' || !document.fonts) return;
  requested = true;
  faces.forEach(([family, file, weight]) => {
    const face = new FontFace(
      family,
      `url(${withPrefix(`/fonts/${file}.woff2`)}) format('woff2')`,
      { weight, display: 'swap' },
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
