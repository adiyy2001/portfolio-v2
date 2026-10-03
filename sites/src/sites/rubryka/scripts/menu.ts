export const setupMenu = (): void => {
  const header = document.querySelector<HTMLElement>('.spine');
  const toggle = header?.querySelector<HTMLButtonElement>('.spine__toggle');
  if (!header || !toggle) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => toggle.setAttribute('aria-expanded', String(open));

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  header.addEventListener('focusout', event => {
    const next = event.relatedTarget;
    if (isOpen() && next instanceof Node && !header.contains(next)) setOpen(false);
  });

  document.addEventListener('click', event => {
    if (isOpen() && event.target instanceof Node && !header.contains(event.target)) setOpen(false);
  });
};
