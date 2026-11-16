export function initMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  const summary = menu?.querySelector<HTMLElement>('summary');
  if (!menu || !summary) return;

  const close = () => {
    menu.open = false;
  };

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu.open) return;
    close();
    summary.focus();
  });

  document.addEventListener('click', event => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target)) close();
  });

  menu.addEventListener('focusout', event => {
    const next = event.relatedTarget;
    if (menu.open && next instanceof Node && !menu.contains(next)) close();
  });
}
