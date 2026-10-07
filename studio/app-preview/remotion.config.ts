import { Config } from '@remotion/cli/config';

const headless =
  process.env.WZ_HEADLESS ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

Config.setEntryPoint('src/index.ts');
Config.setPublicDir('../out/app-preview/public');
Config.setBrowserExecutable(headless);
Config.setChromeMode('headless-shell');
Config.setConcurrency(2);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
