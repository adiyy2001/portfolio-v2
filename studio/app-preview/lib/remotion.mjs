import { join } from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { appPreviewRoot, headlessShell, remotionPublic } from './paths.mjs';

export const browserOptions = {
  browserExecutable: headlessShell,
  chromeMode: 'headless-shell',
  chromiumOptions: { gl: 'swangle' },
  logLevel: 'error',
};

export const makeBundle = () =>
  bundle({
    entryPoint: join(appPreviewRoot, 'src', 'index.ts'),
    publicDir: remotionPublic,
    onProgress: () => undefined,
  });

export const still = async (serveUrl, { id, props = {}, output, scale = 1, format = 'png', quality = 92 }) => {
  const composition = await selectComposition({ serveUrl, id, inputProps: props, ...browserOptions });
  await renderStill({
    composition,
    serveUrl,
    output,
    inputProps: props,
    scale,
    imageFormat: format,
    jpegQuality: format === 'jpeg' ? quality : undefined,
    frame: 0,
    ...browserOptions,
  });
  return output;
};

export const frameStill = async (serveUrl, { id, props = {}, output, frame, scale = 1 }) => {
  const composition = await selectComposition({ serveUrl, id, inputProps: props, ...browserOptions });
  await renderStill({ composition, serveUrl, output, inputProps: props, scale, imageFormat: 'png', frame, ...browserOptions });
  return output;
};

export const video = async (serveUrl, { id, props = {}, output, scale = 1, concurrency = 3, crf = 12, label = id, imageFormat = 'jpeg' }) => {
  const composition = await selectComposition({ serveUrl, id, inputProps: props, ...browserOptions });
  const started = Date.now();
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: output,
    inputProps: props,
    scale,
    crf,
    concurrency,
    imageFormat,
    jpegQuality: imageFormat === 'jpeg' ? 96 : undefined,
    pixelFormat: 'yuv420p',
    muted: true,
    ...browserOptions,
    onProgress: ({ progress }) => {
      const step = Math.floor(progress * 10);
      if (step !== last) {
        last = step;
        process.stdout.write(`${label} ${step * 10}%\n`);
      }
    },
  });
  return { output, seconds: Math.round((Date.now() - started) / 1000), frames: composition.durationInFrames };
};
