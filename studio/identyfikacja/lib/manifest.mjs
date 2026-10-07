import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { bytesOf, humanBytes, icoSizes, pngSize, walk, rel } from './files.mjs';
import { groupOf, groups, names } from './convention.mjs';
import { publicBase } from './paths.mjs';
import { viewBoxOf } from './svg.mjs';

const mmPerPt = 25.4 / 72;

export const probeVideo = path => {
  const raw = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,r_frame_rate:format=duration', '-of', 'json', path], { encoding: 'utf8' });
  const data = JSON.parse(raw);
  const stream = data.streams[0];
  return { codec: stream.codec_name, width: stream.width, height: stream.height, duration: Number(Number(data.format.duration).toFixed(2)) };
};

export const probeFile = async (pub, path) => {
  const full = join(pub, path);
  const ext = extname(path).slice(1).toLowerCase();
  const info = { path, bytes: bytesOf(full), type: ext, group: groupOf(path) };
  if (ext === 'png') Object.assign(info, pngSize(full));
  if (ext === 'ico') info.sizes = icoSizes(full).map(item => item.width);
  if (ext === 'svg') {
    const box = viewBoxOf(readFileSync(full, 'utf8'));
    if (box) Object.assign(info, { width: Number(box[2].toFixed(2)), height: Number(box[3].toFixed(2)) });
  }
  if (ext === 'pdf') {
    const doc = await PDFDocument.load(readFileSync(full));
    const page = doc.getPage(0);
    const { width, height } = page.getSize();
    Object.assign(info, { pages: doc.getPageCount(), pageMm: { width: Number((width * mmPerPt).toFixed(1)), height: Number((height * mmPerPt).toFixed(1)) }, pagePx: { width: Math.round((width * 96) / 72), height: Math.round((height * 96) / 72) } });
  }
  if (ext === 'mp4' || ext === 'webm') Object.assign(info, probeVideo(full));
  return info;
};

const summarize = files => {
  const pngWidths = [...new Set(files.filter(file => file.type === 'png').map(file => file.width))].sort((a, b) => a - b);
  const formats = [...new Set(files.map(file => file.type.toUpperCase()))].map(format => (format === 'PNG' && pngWidths.length > 0 ? `PNG ${pngWidths.join(', ')} px` : format));
  return formats.join(', ');
};

export const buildManifest = async (brand, { colors, fonts }) => {
  const { pub, slug } = brand.paths;
  const paths = walk(pub, path => !path.endsWith('manifest.json')).map(path => rel(pub, path));
  const files = [];
  for (const path of paths) files.push(await probeFile(pub, path));
  const groupList = groups
    .map(group => {
      const members = files.filter(file => file.group === group.id);
      return members.length === 0
        ? null
        : { id: group.id, title: group.title, count: members.length, bytes: members.reduce((sum, file) => sum + file.bytes, 0), formats: summarize(members), files: members.map(file => file.path) };
    })
    .filter(Boolean);
  const zipFile = files.find(file => file.path === names(slug).zip);
  return {
    brand: { slug, name: brand.name, style: brand.style, styleId: brand.styleId, trade: brand.trade, city: brand.city },
    base: `${publicBase}/${slug}/`,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
    totalHuman: humanBytes(files.reduce((sum, file) => sum + file.bytes, 0)),
    zip: zipFile ? { path: zipFile.path, bytes: zipFile.bytes } : null,
    groups: groupList,
    files,
    palette: colors?.palette ?? [],
    contrast: colors?.contrast ?? [],
    fonts: fonts ?? [],
  };
};

export const readJson = path => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null);
