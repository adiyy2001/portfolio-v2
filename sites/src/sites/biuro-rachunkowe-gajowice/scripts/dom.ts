type ElementType<T extends Element> = new () => T;

export const find = <T extends Element>(
  root: ParentNode,
  selector: string,
  type: ElementType<T>,
): T => {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) throw new Error(`Missing element ${selector}`);
  return element;
};

export const findAll = <T extends Element>(
  root: ParentNode,
  selector: string,
  type: ElementType<T>,
): T[] =>
  Array.from(root.querySelectorAll(selector)).filter(
    (element): element is T => element instanceof type,
  );

export const findOptional = <T extends Element>(
  root: ParentNode,
  selector: string,
  type: ElementType<T>,
): T | null => {
  const element = root.querySelector(selector);
  return element instanceof type ? element : null;
};

export const make = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = (): boolean => window.matchMedia('(pointer: coarse)').matches;

export const setSelected = (element: HTMLElement, selected: boolean): void => {
  element.setAttribute('aria-selected', selected ? 'true' : 'false');
  element.tabIndex = selected ? 0 : -1;
};

export const listKeys = (
  list: HTMLElement,
  onMove: (option: HTMLElement, index: number) => void,
): void => {
  list.addEventListener('keydown', event => {
    const options = findAll(list, '[role="option"]', HTMLElement);
    const current = document.activeElement;
    const index = current instanceof HTMLElement ? options.indexOf(current) : -1;
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowDown') next = Math.min(options.length - 1, index + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    const option = options[next];
    if (option && next !== index) onMove(option, next);
  });
};

export const groupKeys = (
  group: HTMLElement,
  selector: string,
  onPick: (button: HTMLElement) => void,
): void => {
  group.addEventListener('keydown', event => {
    const buttons = findAll(group, selector, HTMLElement);
    const current = document.activeElement;
    const index = current instanceof HTMLElement ? buttons.indexOf(current) : -1;
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    const button = buttons[next];
    if (!button) return;
    button.focus();
    onPick(button);
  });
};
