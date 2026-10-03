const MOBILE_QUERY = '(max-width: 859px)';
const CURRENT_BAND = '-35% 0px -60% 0px';

export function initNav() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const button = header?.querySelector<HTMLButtonElement>('[data-menu-button]');
  const nav = header?.querySelector<HTMLElement>('[data-nav]');
  if (!header || !button || !nav) return;

  const setOpen = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    nav.dataset.open = String(open);
  };

  setOpen(false);

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  nav.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', event => {
    if (event.target instanceof Node && !header.contains(event.target)) setOpen(false);
  });

  header.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget))
      setOpen(false);
  });

  window.matchMedia(MOBILE_QUERY).addEventListener('change', () => setOpen(false));

  const links = new Map(
    Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-section-link]')).map(anchor => [
      anchor.dataset.sectionLink,
      anchor,
    ]),
  );
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
  if (links.size === 0 || sections.length === 0) return;

  const markCurrent = (id: string) => {
    links.forEach((anchor, key) => {
      if (key === id) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      const latest = entering[entering.length - 1];
      if (latest) markCurrent(latest.target.id);
      else if (entries.some(entry => !entry.isIntersecting) && window.scrollY < 200)
        markCurrent('');
    },
    { rootMargin: CURRENT_BAND },
  );
  sections.forEach(section => observer.observe(section));
}
