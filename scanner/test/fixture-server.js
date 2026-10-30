import http from 'node:http';

const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const head = title =>
  `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>`;

const nav = `<header><nav aria-label="Główna"><a href="/kontakt">Kontakt</a> <a href="/o-nas">O nas</a> <a href="/produkt/123">Produkt 123</a> <a href="/produkt/456">Produkt 456</a> <a href="/private/tajne">Prywatne</a> <a href="/plik.pdf">Katalog</a></nav></header>`;
const footer = `<footer><a href="/deklaracja-dostepnosci">Deklaracja dostępności</a> <a href="/regulamin">Regulamin</a></footer>`;

const homePage = () => `${head('Sklep testowy')}<body>
<a href="#glowna" class="skip-link">Przejdź do treści</a>
${nav}
<main id="glowna">
<h1>Sklep testowy</h1>
<p style="color:#bbbbbb;background:#ffffff">Ten tekst ma za niski kontrast względem tła.</p>
<img src="/obraz.png" width="120" height="40">
<form action="/kontakt"><input type="text" name="imie"><button type="submit">Wyślij</button></form>
</main>
${footer}
<div id="cookie-banner" role="dialog" aria-label="Cookies" style="position:fixed;bottom:0;left:0;right:0;background:#ffffff;padding:1rem;border-top:1px solid #000">
<p id="banner-text" style="color:#dddddd">Używamy plików cookies.</p>
<button id="accept" type="button">Akceptuję</button>
</div>
<script>
document.getElementById('accept').addEventListener('click', function () {
  document.getElementById('cookie-banner').remove();
  document.cookie = 'consent=1; path=/';
});
</script>
</body></html>`;

const simplePage = (title, extra = '') =>
  `${head(title)}<body>${nav}<main><h1>${title}</h1><p>Treść podstrony ${title}.</p>${extra}</main>${footer}</body></html>`;

const trapPage = () => `${head('Pułapka')}<body>
<main>
<h1>Strona z pułapką</h1>
<button id="a" type="button">A</button>
<button id="b" type="button">B</button>
<a href="/kontakt">Kontakt</a> <a href="/o-nas">O nas</a> <a href="/regulamin">Regulamin</a>
</main>
<script>
var cycle = [document.getElementById('a'), document.getElementById('b')];
document.addEventListener('keydown', function (event) {
  if (event.key !== 'Tab') return;
  event.preventDefault();
  var index = cycle.indexOf(document.activeElement);
  cycle[(index + 1) % cycle.length].focus();
});
</script>
</body></html>`;

const declarationPage =
  () => `${head('Deklaracja dostępności')}<body>${nav}<main><h1>Deklaracja dostępności</h1>
<p id="a11y-status">Częściowo spełnia wymagania.</p>
<p id="a11y-data-publikacja">2026-01-01</p>
<p id="a11y-kontakt">kontakt@example.test</p></main>${footer}</body></html>`;

export async function startFixtureServer({ robots, redirects = {} } = {}) {
  const requests = [];
  let origin = '';
  const server = http.createServer((request, response) => {
    requests.push({ url: request.url, userAgent: request.headers['user-agent'] });
    const path = request.url.split('?')[0];
    const send = (body, type = 'text/html; charset=utf-8', status = 200) => {
      response.writeHead(status, { 'content-type': type });
      response.end(body);
    };
    if (redirects[path]) {
      const target = redirects[path];
      response.writeHead(302, { location: typeof target === 'function' ? target() : target });
      return response.end();
    }
    if (path === '/') return send(homePage());
    if (path === '/trap/') return send(trapPage());
    if (path === '/robots.txt' && robots)
      return send(robots.body ?? '', 'text/plain', robots.status ?? 200);
    if (path === '/robots.txt') {
      return send(
        `User-agent: *\nDisallow: /private\nSitemap: ${origin}/sitemap.xml\n`,
        'text/plain',
      );
    }
    if (path === '/sitemap.xml') {
      const urls = [
        '/kontakt',
        '/produkt/789',
        '/blog/wpis-1',
        '/blog/wpis-2',
        '/private/x',
        '/plik.pdf',
      ];
      return send(
        `<?xml version="1.0"?><urlset>${urls.map(url => `<url><loc>${origin}${url}</loc></url>`).join('')}</urlset>`,
        'application/xml',
      );
    }
    if (path === '/obraz.png') {
      response.writeHead(200, { 'content-type': 'image/png' });
      return response.end(PIXEL);
    }
    if (path === '/kontakt') {
      return send(
        simplePage(
          'Kontakt',
          '<form><input type="email" name="email"><button type="submit">Wyślij</button></form>',
        ),
      );
    }
    if (path === '/o-nas') return send(simplePage('O nas'));
    if (path === '/regulamin') return send(simplePage('Regulamin'));
    if (path.startsWith('/produkt/')) return send(simplePage(`Produkt ${path.split('/')[2]}`));
    if (path.startsWith('/blog/')) return send(simplePage(`Wpis ${path.split('/')[2]}`));
    if (path.startsWith('/private/') || path.startsWith('/zakazane/')) {
      return send(simplePage('Tajna strona'));
    }
    if (path === '/deklaracja-dostepnosci') return send(declarationPage());
    return send('nie znaleziono', 'text/plain', 404);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  return {
    origin,
    requests,
    close: () => new Promise(resolve => server.close(resolve)),
  };
}
