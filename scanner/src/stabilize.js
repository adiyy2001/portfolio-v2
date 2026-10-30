export async function waitForStableDom(page, { quietMs = 500, maxMs = 5000 } = {}) {
  await page.waitForLoadState('load', { timeout: 5000 }).catch(() => {});
  await page
    .evaluate(
      ({ quiet, max }) =>
        new Promise(resolve => {
          let quietTimer;
          let maxTimer;
          const finish = () => {
            observer.disconnect();
            clearTimeout(quietTimer);
            clearTimeout(maxTimer);
            resolve();
          };
          const observer = new MutationObserver(() => {
            clearTimeout(quietTimer);
            quietTimer = setTimeout(finish, quiet);
          });
          observer.observe(document, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
          });
          quietTimer = setTimeout(finish, quiet);
          maxTimer = setTimeout(finish, max);
        }),
      { quiet: quietMs, max: maxMs },
    )
    .catch(() => {});
}
