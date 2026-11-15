export const initNav = () => {
  const mast = document.querySelector<HTMLElement>('[data-mast]');
  const toggle = mast?.querySelector<HTMLButtonElement>('[data-mast-toggle]');
  if (!mast || !toggle) return;
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    mast.toggleAttribute('data-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  mast.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  mast.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('.mast-nav a')) setOpen(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => setOpen(false));
};
