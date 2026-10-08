import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { documentHtml } from '../kit/kit.mjs';
import { pinnedFaceCss } from './fonts.mjs';

export const loadCompose = async app => {
  const file = join(app.paths.studio, 'compose.mjs');
  if (!existsSync(file)) throw new Error(`missing ${file}`);
  return import(pathToFileURL(file).href);
};

export const themeCss = app => {
  const file = join(app.paths.studio, 'theme.css');
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
};

export const docFor = (app, { lang, width, height, css = '', body, background }) =>
  documentHtml({
    lang,
    width,
    height,
    fontCss: pinnedFaceCss(app),
    themeCss: themeCss(app),
    css,
    body,
    background: background ?? app.background ?? '#fff',
  });

export const frameName = (job, output) => {
  const slot = output.variant === 'b' ? `${output.slot}b` : output.slot;
  return job.store === 'feature' ? `feature-${job.lang}` : `${job.store}-${job.lang}-${slot}`;
};

export const validateJob = job => {
  const errors = [];
  for (const key of ['id', 'store', 'lang', 'width', 'height', 'scale', 'body', 'outputs']) {
    if (job[key] === undefined) errors.push(`${job.id ?? 'job'}: missing ${key}`);
  }
  const frames = job.frames ?? 1;
  const frameWidth = job.frameWidth ?? job.width;
  if (frames * frameWidth !== job.width) errors.push(`${job.id}: ${frames} frames of ${frameWidth} do not fill ${job.width}`);
  for (const output of job.outputs ?? []) {
    if (output.frame < 0 || output.frame >= frames) errors.push(`${job.id}: output frame ${output.frame} out of range`);
  }
  return errors;
};
