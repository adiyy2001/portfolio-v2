export const setupContents = (): void => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-contents] a')];
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  const linkFor = new Map<string, HTMLAnchorElement>();
  for (const link of links) linkFor.set(link.hash.slice(1), link);

  const visible = new Set<string>();
  const mark = (): void => {
    const current = [...linkFor.keys()].find(id => visible.has(id));
    for (const [id, link] of linkFor) {
      if (id === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      mark();
    },
    { rootMargin: '-10% 0px -70% 0px' },
  );

  for (const id of linkFor.keys()) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
};
