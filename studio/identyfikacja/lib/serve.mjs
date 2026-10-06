import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { sitesRoot } from './paths.mjs';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

export const serveDist = ({ port, root = join(sitesRoot, 'dist'), base = '/wzornik' }) =>
  new Promise((resolvePromise, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      let path = decodeURIComponent(url.pathname);
      if (!path.startsWith(base)) {
        res.writeHead(404).end('not found');
        return;
      }
      path = normalize(path.slice(base.length) || '/');
      let file = join(root, path);
      if (!file.startsWith(root)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file)) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
        return;
      }
      const size = statSync(file).size;
      const type = types[extname(file).toLowerCase()] ?? 'application/octet-stream';
      const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
      if (range) {
        const start = range[1] ? Number(range[1]) : 0;
        const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${start}-${end}/${size}`, 'accept-ranges': 'bytes', 'content-length': end - start + 1 });
        createReadStream(file, { start, end }).pipe(res);
        return;
      }
      res.writeHead(200, { 'content-type': type, 'content-length': size, 'accept-ranges': 'bytes' });
      createReadStream(file).pipe(res);
    });
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () =>
      resolvePromise({ url: `http://127.0.0.1:${port}${base}`, close: () => new Promise(done => server.close(done)) }),
    );
  });
