import { currentSectionIndex } from '../lib/current-section';

const toc = document.querySelector<HTMLElement>('[data-toc]');
const body = document.querySelector<HTMLElement>('[data-article-body]');

if (toc && body) {
  const toggle = toc.querySelector<HTMLButtonElement>('.toc__toggle');
  const nav = toc.querySelector<HTMLElement>('.toc__nav');
  const state = toc.querySelector<HTMLElement>('.toc__state');
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('.toc__nav a'));
  const headings = links
    .map(link => document.getElementById(link.hash.slice(1)))
    .filter((heading): heading is HTMLElement => heading !== null);

  const setOpen = (open: boolean) => {
    toggle?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    if (state) state.textContent = open ? 'Zwiń' : 'Rozwiń';
  };

  toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', event => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  let scheduled = false;
  const markCurrent = () => {
    scheduled = false;
    const threshold = window.innerHeight * 0.3;
    const index = currentSectionIndex(
      headings.map(heading => heading.getBoundingClientRect().top),
      threshold,
    );
    links.forEach((link, linkIndex) => {
      if (linkIndex === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(markCurrent);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  markCurrent();
}
