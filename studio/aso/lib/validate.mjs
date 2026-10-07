import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync } from 'fflate';
import { checkCopy } from './copycheck.mjs';
import { expectedFiles, stores } from './convention.mjs';
import { describeImage } from './export.mjs';
import { bytesOf, readJson, rel, walk } from './files.mjs';

const MB = 1024 * 1024;

export const budgets = {
  appSoft: 20 * MB,
  appHard: 25 * MB,
  zip: 15 * MB,
  all: 130 * MB,
  storeFile: 8 * MB,
  playIcon: 1024 * 1024,
};

const checkImage = async (file, spec, errors) => {
  const full = file.full;
  const buffer = readFileSync(full);
  const info = await describeImage(buffer);
  const label = file.path;
  if (info.width !== spec.width || info.height !== spec.height) {
    errors.push(`${label}: ${info.width}x${info.height}, expected ${spec.width}x${spec.height}`);
    return info;
  }
  if (spec.type === 'png') {
    if (info.format !== 'png') errors.push(`${label}: not a PNG`);
    else if (spec.channels === 3) {
      if (info.png.colourType !== 2 || info.png.bitDepth !== 8) errors.push(`${label}: not a truecolour 8 bit PNG (colour type ${info.png.colourType}, depth ${info.png.bitDepth})`);
      if (info.png.hasAlpha) errors.push(`${label}: has an alpha channel`);
    } else if (spec.channels === 4) {
      if (info.png.colourType !== 6) errors.push(`${label}: expected RGBA`);
    }
  } else if (spec.type === 'jpg') {
    if (info.format !== 'jpeg') errors.push(`${label}: not a JPEG`);
    if (info.channels !== 3) errors.push(`${label}: JPEG has ${info.channels} channels`);
  }
  if (info.space && info.space !== 'srgb') errors.push(`${label}: colour space ${info.space}`);
  if (spec.opaque && !info.opaque) errors.push(`${label}: not fully opaque`);
  if (spec.transparent && info.opaque) errors.push(`${label}: expected some transparency`);
  if (spec.maxBytes && info.bytes > spec.maxBytes) errors.push(`${label}: ${info.bytes} bytes, limit ${spec.maxBytes}`);
  return info;
};

const imageSpec = (item, app) => {
  const type = item.type;
  if (item.group === 'icons') {
    if (item.icon === 'appstore') return { ...item, channels: 3 };
    if (item.icon === 'play') return { ...item, channels: 4, opaque: true, maxBytes: budgets.playIcon };
    if (item.icon === 'background') return { ...item, channels: 4 };
    if (item.icon === 'foreground') return { ...item, channels: 4, transparent: true };
  }
  return { ...item, type, channels: 3, maxBytes: budgets.storeFile, app };
};

export const checkBoxes = (boxes, errors) => {
  if (!boxes) {
    errors.push('render/boxes.json is missing; run render.mjs first');
    return;
  }
  for (const job of boxes) {
    const canvas = job.canvas;
    const frames = job.strip?.frames ?? 1;
    const frameWidth = job.strip?.frameWidth ?? canvas.width;
    const frameArea = frameWidth * canvas.height;
    const perFrame = new Map();
    for (const box of job.boxes) {
      const label = `${job.id} ${box.kind} ${box.name}`;
      const centre = box.x + box.width / 2;
      const frame = job.strip ? Math.min(frames - 1, Math.max(0, Math.floor(centre / frameWidth))) : 0;
      if (box.kind === 'headline' || box.kind === 'fg') {
        const offset = job.strip ? job.strip.origin ?? 0 : 0;
        const left = box.x - offset;
        if (left < 0 || left + box.width > canvas.width + 0.5 || box.y < 0 || box.y + box.height > canvas.height + 0.5) {
          errors.push(`${label}: outside the canvas`);
        }
        if (job.strip) {
          const from = frame * frameWidth + job.strip.margin;
          const to = (frame + 1) * frameWidth - job.strip.margin;
          if (left < from - 0.5 || left + box.width > to + 0.5) errors.push(`${label}: crosses the seam margin of frame ${frame + 1} (${left.toFixed(1)} to ${(left + box.width).toFixed(1)}, allowed ${from} to ${to})`);
        }
      }
      if (box.kind === 'headline') {
        perFrame.set(frame, (perFrame.get(frame) ?? 0) + box.width * box.height);
        if (box.overflow) errors.push(`${label}: text overflows its box`);
        if (box.words > 1 && box.lastLineWords < 2) errors.push(`${label}: one word last line`);
        if (box.broken) errors.push(`${label}: a word is broken in the middle`);
      }
    }
    if (job.store === 'play') {
      for (const [frame, area] of perFrame) {
        const share = area / frameArea;
        if (share > 0.2) errors.push(`${job.id} frame ${frame + 1}: headline box covers ${(share * 100).toFixed(1)} percent, limit 20`);
      }
    }
  }
};

export const validateApp = async (app, { boxes = true, zip = true } = {}) => {
  const errors = [];
  const warnings = [];
  const info = { files: 0, bytes: 0 };
  errors.push(...checkCopy(app));

  const expected = expectedFiles(app);
  const exportDir = app.paths.exportDir;
  const present = new Map(walk(exportDir).map(full => [rel(exportDir, full), full]));
  for (const item of expected) {
    if (!present.has(item.path)) errors.push(`${item.path}: missing`);
  }
  const expectedSet = new Set(expected.map(item => item.path));
  for (const path of present.keys()) {
    if (!expectedSet.has(path)) errors.push(`${path}: unexpected file`);
  }

  const counts = {};
  for (const item of expected) {
    const full = present.get(item.path);
    if (!full) continue;
    info.files += 1;
    info.bytes += bytesOf(full);
    if (item.type === 'png' || item.type === 'jpg') {
      counts[item.group] = (counts[item.group] ?? 0) + 1;
      await checkImage({ path: item.path, full }, imageSpec(item, app), errors);
    } else if (item.type === 'svg') {
      if (!readFileSync(full, 'utf8').includes('<svg')) errors.push(`${item.path}: not an SVG`);
    } else if (item.type === 'csv') {
      const rows = readFileSync(full, 'utf8').trim().split('\n').length - 1;
      const need = 6 * 2 + 2 + 1 + (app.ipad ? 6 : 0);
      if (rows !== need) errors.push(`${item.path}: ${rows} rows, expected ${need}`);
    }
  }

  const perStore = app.ipad ? { appstore: 12, play: 12, variantB: 4, feature: 2, icons: 5, ipad: 12 } : { appstore: 12, play: 12, variantB: 4, feature: 2, icons: 5 };
  for (const [group, count] of Object.entries(perStore)) {
    if ((counts[group] ?? 0) !== count) errors.push(`group ${group}: ${counts[group] ?? 0} files, expected ${count}`);
  }

  if (boxes) {
    const boxesFile = join(app.paths.render, 'boxes.json');
    checkBoxes(existsSync(boxesFile) ? readJson(boxesFile) : null, errors);
  }

  if (zip) {
    const zipPath = join(app.paths.pub, `${app.slug}-aso.zip`);
    if (!existsSync(zipPath)) errors.push(`${app.slug}-aso.zip: missing`);
    else {
      const size = bytesOf(zipPath);
      if (size > budgets.zip) errors.push(`${app.slug}-aso.zip: ${(size / MB).toFixed(1)} MB, limit 15`);
      const entries = unzipSync(new Uint8Array(readFileSync(zipPath)));
      const root = `${app.slug}-aso/`;
      const names = Object.keys(entries).filter(name => !name.endsWith('/'));
      for (const item of expected) {
        const entry = entries[`${root}${item.path}`];
        if (!entry) errors.push(`zip: ${item.path} missing`);
        else if (present.has(item.path) && entry.length !== bytesOf(present.get(item.path))) errors.push(`zip: ${item.path} differs from the export`);
      }
      for (const name of names) {
        if (!expectedSet.has(name.slice(root.length)) || !name.startsWith(root)) errors.push(`zip: unexpected entry ${name}`);
      }
      const manifestPath = join(app.paths.pub, 'manifest.json');
      if (!existsSync(manifestPath)) errors.push('manifest.json: missing');
      else {
        const manifest = readJson(manifestPath);
        const listed = new Set(manifest.files.map(file => file.path));
        for (const path of expectedSet) if (!listed.has(path)) errors.push(`manifest: ${path} not listed`);
        for (const path of listed) if (!expectedSet.has(path)) errors.push(`manifest: unexpected ${path}`);
        for (const file of manifest.files) {
          const full = present.get(file.path);
          if (full && bytesOf(full) !== file.bytes) errors.push(`manifest: ${file.path} has ${file.bytes} bytes, file has ${bytesOf(full)}`);
        }
        if (manifest.zip?.bytes !== size) errors.push('manifest: zip size differs from the file');
      }
    }
    const pubBytes = walk(app.paths.pub).reduce((sum, file) => sum + bytesOf(file), 0);
    info.published = pubBytes;
    if (pubBytes > budgets.appHard) errors.push(`published folder ${(pubBytes / MB).toFixed(1)} MB, hard cap 25`);
    else if (pubBytes > budgets.appSoft) warnings.push(`published folder ${(pubBytes / MB).toFixed(1)} MB, budget 20`);
    const allRoot = join(app.paths.pub, '..');
    const all = walk(allRoot).reduce((sum, file) => sum + bytesOf(file), 0);
    info.all = all;
    if (all > budgets.all) errors.push(`all ASO files ${(all / MB).toFixed(1)} MB, limit 130`);
  }

  return { errors, warnings, info, stores };
};
