import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { brand } from './theme.mjs';
import { animationSvg, duration, initialCss, timeline } from '../../../../sites/src/identyfikacja/rzut/lib/motion.ts';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(join(brand.paths.site, 'motion-data.json'), 'utf8'));
const html = `<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Rzut animacja</title>
<style>
html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:#ffffff}
svg{display:block;width:1080px;height:1080px}
${initialCss}
</style>
<body>
${animationSvg(data)}
<script>
const steps = ${JSON.stringify(timeline())};
const animations = steps.flatMap(step => {
  const element = document.getElementById(step.id);
  if (!element) return [];
  const animation = element.animate(step.keyframes, { ...step.options, fill: 'both', easing: 'linear' });
  animation.pause();
  return [animation];
});
window.__duration = ${duration};
window.__seek = ms => {
  animations.forEach(animation => {
    animation.currentTime = ms;
  });
};
window.__seek(0);
</script>
`;
writeFile(join(brand.paths.src, 'animation.html'), html);
console.log('animation.html written');
