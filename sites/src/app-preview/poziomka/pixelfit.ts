export const fitWidth = (avail: number, art: number, natural: number, dpr: number) => {
  const k = Math.floor((avail * dpr) / art + 1e-6);
  if (k < 1) return avail;
  const exact = (k * art) / dpr;
  if (avail * dpr < natural || exact >= avail * 0.6) return exact;
  return avail;
};

export const fitAll = (root: ParentNode = document) => {
  const dpr = window.devicePixelRatio || 1;
  root.querySelectorAll<HTMLElement>('[data-art]').forEach(el => {
    const box = el.closest<HTMLElement>('.fit-box') ?? el.parentElement;
    if (!box) return;
    const style = getComputedStyle(box);
    const own = getComputedStyle(el);
    const frame =
      parseFloat(own.paddingLeft) +
      parseFloat(own.paddingRight) +
      parseFloat(own.borderLeftWidth) +
      parseFloat(own.borderRightWidth);
    const avail =
      box.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight) -
      Number(el.dataset.pad ?? 0) -
      frame;
    const max = Number(el.dataset.max ?? Number.POSITIVE_INFINITY);
    const art = Number(el.dataset.art);
    const natural = Number(el.dataset.natural ?? art);
    const width = fitWidth(Math.min(avail, max), art, natural, dpr);
    el.style.width = `${Math.floor((width + frame) * 1000) / 1000}px`;
    el.dataset.scale = (width * dpr) / art < 0.999 ? 'down' : 'px';
  });
};

export const watchFit = () => {
  const run = () => fitAll();
  run();
  new ResizeObserver(run).observe(document.documentElement);
};
