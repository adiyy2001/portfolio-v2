import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const handcutFile = join(dirname(fileURLToPath(import.meta.url)), 'icons-handcut.json');
const handcut = () => (existsSync(handcutFile) ? JSON.parse(readFileSync(handcutFile, 'utf8')) : null);

export const icons = {
  chleb: ['M3.4 14.6c0-3.7 3.7-6.6 8.6-6.6s8.6 2.9 8.6 6.6c0 1.6-1 2.6-2.5 2.6H5.9c-1.5 0-2.5-1-2.5-2.6Z', 'M9 10.6l1.5 3.1M12.4 10l1.6 3.4M15.8 10.8l1.2 2.4'],
  kromka: ['M6.3 19.5V11C4.3 10.4 3.6 8.9 4.2 7.2 4.9 5.2 7.2 4.2 9.6 4.2h4.8c2.4 0 4.7 1 5.4 3 .6 1.7-.1 3.2-2.1 3.8v8.5Z', 'M9.5 14.2h5'],
  zakwas: ['M8.2 4.6h7.6', 'M9.2 4.6v2.7C7.5 8.2 6.6 9.6 6.6 11.3v7c0 1 .8 1.8 1.8 1.8h7.2c1 0 1.8-.8 1.8-1.8v-7c0-1.7-.9-3.1-2.6-4V4.6', 'M10 14.2h.01M13.6 16.2h.01M12.2 12h.01'],
  maka: ['M8.1 5.8 5.9 9.7C5.3 10.8 5 12 5 13.2v4.8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.8c0-1.2-.3-2.4-.9-3.5l-2.2-3.9', 'M8.3 5.9l.7-1.8h6l.7 1.8c-1.2.8-2.4 1.2-3.7 1.2s-2.5-.4-3.7-1.2Z', 'M9 13.6c1 .8 2 .8 3 0s2-.8 3 0'],
  piec: ['M4.5 20v-8.4a7.5 7.5 0 0 1 15 0V20', 'M3 20h18', 'M8.6 20v-3.6a3.4 3.4 0 0 1 6.8 0V20'],
  zegar: ['M12 4.2a7.8 7.8 0 1 0 .01 0Z', 'M12 8v4.4l3 1.8'],
  torba: ['M6.4 8h11.2l.9 11.5c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5Z', 'M6.4 8l1.3-3.2h8.6L17.6 8', 'M12 12.4a2.4 2.4 0 1 0 .01 0Z'],
  koszyk: ['M3.5 10h17l-1.6 9H5.1Z', 'M8 10l3-5.6M16 10l-3-5.6', 'M9 13v3.6M12 13v3.6M15 13v3.6'],
  noz: ['M9 10.4h9.4c1.9 0 3.6 1.3 3.6 3.1 0 .8-.4 1.5-1 2.1l-1.2 1.3-1.4-1.4-1.5 1.5-1.4-1.4-1.5 1.5-1.4-1.4-1.5 1.5-1-1H9Z', 'M9 10.4H4c-1.1 0-2 .9-2 2v2.7c0 1.1.9 2 2 2h5', 'M4.6 13.7h.01M6.8 13.7h.01'],
  ziarno: ['M12 3.6c3.6 3.2 5 6.3 5 9.2 0 3.3-2.2 5.3-5 5.3s-5-2-5-5.3c0-2.9 1.4-6 5-9.2Z', 'M12 8.4v9.4'],
  adres: ['M12 21c4-4.5 6-7.7 6-10.5a6 6 0 1 0-12 0c0 2.8 2 6 6 10.5Z', 'M12 8.6a2 2 0 1 0 .01 0Z'],
  telefon: ['M6.6 4h2.9l1.5 3.9-1.9 1.4a10 10 0 0 0 5.6 5.6l1.4-1.9 3.9 1.5v2.9c0 1-.8 1.9-1.9 1.9C11.5 19.3 4.7 12.5 4.7 5.9 4.7 4.8 5.6 4 6.6 4Z'],
};

const strokes = name => {
  const cut = handcut()?.[name];
  return cut ? cut.map(item => ({ d: item.d, width: item.width })) : icons[name].map(d => ({ d, width: 1.8 }));
};

const pathMarkup = name => strokes(name).map(item => `<path d="${item.d}" stroke-width="${item.width}"/>`).join('');

export const iconSvg = (name, stroke = c.zyto) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" role="img"><title>${name}</title>${pathMarkup(name)}</svg>`;

export const bakeHandcut = async browser => {
  const page = await browser.newPage();
  const baked = await page.evaluate(
    ({ source, step, amp }) => {
      const hash = text => {
        let h = 2166136261;
        for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
        return (h >>> 0) / 4294967295;
      };
      const round = n => Number(n.toFixed(2));
      const sample = (d, key) => {
        const closed = /[zZ]\s*$/.test(d);
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', d);
        const length = el.getTotalLength();
        if (length < 0.6) return { d, width: 1.8 };
        const count = Math.max(6, Math.round(length / step));
        const waveA = length / Math.max(1, Math.round(length / 5.4));
        const waveB = length / Math.max(1, Math.round(length / 2.3));
        const phaseA = hash(`${key}a`) * Math.PI * 2;
        const phaseB = hash(`${key}b`) * Math.PI * 2;
        const points = [];
        const total = closed ? count : count + 1;
        for (let i = 0; i < total; i += 1) {
          const at = closed ? (i / count) * length : (i / count) * length;
          const p = el.getPointAtLength(at);
          const before = el.getPointAtLength(Math.max(0, at - 0.15));
          const after = el.getPointAtLength(Math.min(length, at + 0.15));
          let tx = after.x - before.x;
          let ty = after.y - before.y;
          const norm = Math.hypot(tx, ty) || 1;
          tx /= norm;
          ty /= norm;
          const edge = !closed && (i === 0 || i === count) ? 0.4 : 1;
          const push = amp * edge * (0.65 * Math.sin((at / waveA) * Math.PI * 2 + phaseA) + 0.35 * Math.sin((at / waveB) * Math.PI * 2 + phaseB));
          points.push([p.x - ty * push, p.y + tx * push]);
        }
        const n = points.length;
        const at = i => (closed ? points[(i + n) % n] : points[Math.min(n - 1, Math.max(0, i))]);
        let out = `M${round(points[0][0])} ${round(points[0][1])}`;
        const segments = closed ? n : n - 1;
        for (let i = 0; i < segments; i += 1) {
          const p0 = at(i - 1);
          const p1 = at(i);
          const p2 = at(i + 1);
          const p3 = at(i + 2);
          const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
          const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
          out += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
        }
        if (closed) out += 'Z';
        return { d: out, width: round(1.65 + hash(`${key}w`) * 0.4) };
      };
      const result = {};
      for (const [name, paths] of Object.entries(source)) {
        result[name] = paths.flatMap((d, i) => d.split(/(?=M)/).map((part, j) => sample(part, `${name}${i}${j}`)));
      }
      return result;
    },
    { source: icons, step: 0.8, amp: 0.1 },
  );
  await page.close();
  writeFile(handcutFile, `${JSON.stringify(baked)}\n`);
};

export const buildIcons = () => {
  for (const name of brand.iconNames) {
    if (!icons[name]) throw new Error(`no drawing for icon ${name}`);
    writeFile(join(brand.paths.pub, file.icon(name)), `${optimizeSvg(iconSvg(name))}\n`);
  }
  const symbols = brand.iconNames.map(name => `<symbol id="${name}" viewBox="0 0 24 24">${pathMarkup(name)}</symbol>`).join('');
  writeFile(join(brand.paths.pub, file.iconsSprite), `${optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${c.zyto}" stroke-linecap="round" stroke-linejoin="round">${symbols}</svg>`)}\n`);
};
