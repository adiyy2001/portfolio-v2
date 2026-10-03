const button = document.querySelector<HTMLButtonElement>('[data-seal-replay]');
const root = document.documentElement;

if (button) {
  button.addEventListener('click', () => {
    root.classList.remove('seal-stamp', 'seal-ready', 'seal-replay');
    void root.offsetWidth;
    root.classList.add('seal-replay');
  });
}
