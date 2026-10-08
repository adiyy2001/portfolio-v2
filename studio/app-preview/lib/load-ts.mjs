import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { appPreviewRoot } from './paths.mjs';

const require = createRequire(join(appPreviewRoot, 'package.json'));

export const loadTs = async entry => {
  const esbuild = require('esbuild');
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    jsx: 'automatic',
    logLevel: 'silent',
    absWorkingDir: appPreviewRoot,
    nodePaths: [join(appPreviewRoot, 'node_modules')],
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}#${pathToFileURL(entry).href}`);
};
