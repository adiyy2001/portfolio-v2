import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { c, brand } from './theme.mjs';
import { letters, primaryLayout } from './logo-parts.mjs';


const layout = primaryLayout();
const glyphs = letters(120);
const scale = 820 / layout.width;
const stageW = 1080;
const left = (stageW - layout.width * scale) / 2;
const top = (stageW - layout.height * scale) / 2 + 20;

const letterTags = glyphs
  .map((glyph, index) => `<g class="letter" data-index="${index}" transform="translate(${(layout.left + glyph.x).toFixed(1)} ${layout.baseline.toFixed(1)})"><path fill="${c.kosc}" d="${glyph.d}"/></g>`)
  .join('');

const html = `<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Cuvée animacja</title>
<style>
html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:${c.czern}}
.stage{position:relative;width:1080px;height:1080px;background:${c.czern}}
.logo{position:absolute;left:${left.toFixed(1)}px;top:${top.toFixed(1)}px;width:${(layout.width * scale).toFixed(1)}px;height:${(layout.height * scale).toFixed(1)}px;overflow:visible}
.frame{position:absolute;left:48px;top:48px;width:984px;height:984px;border:1px solid ${c.mosiadz};opacity:0}
</style>
<body>
<div class="stage">
<div class="frame" id="frame"></div>
<svg class="logo" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">
<g id="word">${letterTags}</g>
<rect id="rule" fill="${c.mosiadz}" x="${layout.left}" y="${layout.ruleY}" width="${layout.wordPlaced.width.toFixed(1)}" height="1.6" style="transform-origin:${(layout.left + layout.wordPlaced.width / 2).toFixed(1)}px ${layout.ruleY}px"/>
<path id="small" fill="${c.kosc}" d="${layout.desc.d}"/>
</svg>
</div>
<script>
const slow = 'cubic-bezier(.25,.1,.25,1)';
const spread = 46;
const letters = [...document.querySelectorAll('.letter')];
const mid = (letters.length - 1) / 2;
const animations = [];
letters.forEach((node, index) => {
  const base = node.getAttribute('transform');
  const match = base.match(/translate\\(([-\\d.]+) ([-\\d.]+)\\)/);
  const x = Number(match[1]);
  const y = Number(match[2]);
  const shift = (index - mid) * spread;
  animations.push(
    node.animate(
      [
        { transform: 'translate(' + (x + shift) + 'px,' + y + 'px)', opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.35 },
        { transform: 'translate(' + x + 'px,' + y + 'px)', opacity: 1, offset: 1 },
      ],
      { duration: 1700, delay: 150 + index * 70, easing: slow, fill: 'both' },
    ),
  );
});
animations.push(
  document.getElementById('rule').animate(
    [
      { transform: 'scaleX(0)', opacity: 1, offset: 0 },
      { transform: 'scaleX(1)', opacity: 1, offset: 1 },
    ],
    { duration: 1100, delay: 1000, easing: slow, fill: 'both' },
  ),
);
animations.push(
  document.getElementById('small').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 1700, easing: slow, fill: 'both' }),
);
animations.push(
  document.getElementById('frame').animate([{ opacity: 0 }, { opacity: 0.7 }], { duration: 1400, delay: 400, easing: slow, fill: 'both' }),
);
window.__duration = 3000;
animations.forEach(animation => animation.pause());
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
