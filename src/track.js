const counted = new Set([
  'cta_click',
  'contact_click',
  'form_start',
  'generate_lead',
  'form_error',
]);

export function track(name, params = {}) {
  window.gtag?.('event', name, params);
  if (!counted.has(name)) return;
  const label = params.cta ?? params.method ?? params.service ?? params.reason ?? '';
  window.goatcounter?.count?.({
    path: label ? `${name}/${label}` : name,
    title: name,
    event: true,
  });
}

const scrollMarks = [25, 50, 75];

let stopWatching = () => {};

export function watchPage() {
  stopWatching();
  const page = window.location.pathname;
  const seen = new Set();
  const sections = new IntersectionObserver(
    entries => {
      entries
        .filter(entry => entry.isIntersecting)
        .forEach(entry => {
          const section = entry.target.getAttribute('aria-labelledby') || entry.target.id;
          sections.unobserve(entry.target);
          if (section && !seen.has(section)) {
            seen.add(section);
            track('section_view', { section, page });
          }
        });
    },
    { threshold: 0.35 },
  );
  document
    .querySelectorAll('main section[aria-labelledby], main section[id]')
    .forEach(section => sections.observe(section));

  const reached = new Set();
  let frame = 0;
  const measure = () => {
    frame = 0;
    const doc = document.documentElement;
    const depth = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
    scrollMarks
      .filter(mark => depth >= mark && !reached.has(mark))
      .forEach(mark => {
        reached.add(mark);
        track('scroll', { percent_scrolled: mark, page });
      });
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(measure);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  stopWatching = () => {
    sections.disconnect();
    window.removeEventListener('scroll', onScroll);
    if (frame) window.cancelAnimationFrame(frame);
  };
}

export function trackClicks() {
  document.addEventListener(
    'click',
    event => {
      const target = event.target.closest?.('[data-cta], a[href^="mailto:"], a[href^="tel:"]');
      if (!target) return;
      const page = window.location.pathname;
      if (target.dataset.cta) {
        track('cta_click', { cta: target.dataset.cta, page });
        return;
      }
      const method = target.getAttribute('href').startsWith('tel:') ? 'phone' : 'mail';
      track('contact_click', { method, page });
    },
    true,
  );
}
