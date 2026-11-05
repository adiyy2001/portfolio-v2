export const MAX_PDF_REPORT_BYTES = 6 * 1024 * 1024;

export async function renderReportPdf(browser, html) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.route('**/*', route =>
      route.request().url().startsWith('data:') ? route.continue() : route.abort(),
    );
    await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });
    await page.emulateMedia({ media: 'print' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      tagged: true,
      outline: true,
      timeout: 60_000,
    });
    return pdf.length > MAX_PDF_REPORT_BYTES ? null : pdf;
  } finally {
    await context.close().catch(() => {});
  }
}
