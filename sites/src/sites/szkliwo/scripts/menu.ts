const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const header = document.querySelector<HTMLElement>('.site-header');
const desktop = window.matchMedia('(min-width: 961px)');

if (button && menu && header) {
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
  };

  button.addEventListener('click', () => setOpen(!isOpen()));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', event => {
    if (isOpen() && event.target instanceof Node && !header.contains(event.target)) setOpen(false);
  });

  menu.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });

  desktop.addEventListener('change', event => {
    if (event.matches) setOpen(false);
  });
}
