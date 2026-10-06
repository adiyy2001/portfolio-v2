import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { brand, c } from './theme.mjs';
import { badgeParts, colorSets, lettersAt } from './logo-parts.mjs';

const fontUrl = name => `../../../../../sites/public/identyfikacja/klamra/fonts/${name}.woff2`;

export const buildAnimationPage = () => {
  const badge = badgeParts(colorSets(c).color);
  const letters = lettersAt(badge.wordSize, badge.wordOrigin);
  const total = badge.width + badge.shadow;
  const scale = 860 / total;
  const tx = (1080 - total * scale) / 2;
  const ty = (1080 - (badge.height + badge.shadow) * scale) / 2 - 40;
  const { frame, shadow, face } = badge.parts;
  const brace = (geo, id) => `<path id="${id}" fill="none" stroke="${c.atrament}" stroke-width="${geo.stroke}" stroke-miterlimit="4" d="${geo.d}"/>`;
  const wordEnd = badge.wordOrigin.x + badge.wordInk + (letters[0]?.x ?? 0) * 0;
  const lastLetter = letters[letters.length - 1];
  const endX = lastLetter.x + lastLetter.advance;
  const startX = letters[0].x;
  const cursorStart = -(endX - startX);
  const duration = 3000;
  const typeStart = 1150;
  const typeStep = 135;
  const letterMarkup = letters.map(l => `<path id="l${l.index}" fill="${c.atrament}" d="${l.d}" style="opacity:0"/>`).join('');
  const html = `<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Klamra animacja</title>
<style>
@font-face{font-family:'Klamra Mono';src:url(${fontUrl('JetBrainsMono-800')}) format('woff2');font-weight:800}
html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:${c.biel}}
svg{display:block;position:absolute;left:0;top:0;overflow:visible}
#tag{position:absolute;left:50%;top:790px;margin-left:-310px;width:620px;text-align:center;font:800 34px/1 'Klamra Mono',monospace;background:${c.roz};color:${c.atrament};border:7px solid ${c.atrament};box-shadow:12px 12px 0 ${c.atrament};padding:18px 0;opacity:0}
</style>
<body>
<svg id="stage" width="1080" height="1080" viewBox="0 0 1080 1080" aria-hidden="true">
<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})">
<g id="shake">
<g id="drop">
<path id="shadow" fill="${c.atrament}" d="${shadow}"/>
<path fill="${c.atrament}" fill-rule="evenodd" d="${frame}"/>
<rect fill="${c.cytryna}" x="${face.x}" y="${face.y}" width="${face.w}" height="${face.h}"/>
</g>
${brace(badge.leftGeo, 'braceL')}
${brace(badge.rightGeo, 'braceR')}
${letterMarkup}
<g id="cursorRun"><g id="cursorBlink"><rect fill="${c.roz}" x="${badge.cursor.x}" y="${badge.cursor.y}" width="${badge.cursor.w}" height="${badge.cursor.h}"/></g></g>
</g>
</g>
</svg>
<div id="tag">szkoła programowania online</div>
<script>
const letters = ${JSON.stringify(letters.map(l => ({ x: Number(l.x.toFixed(2)), advance: Number(l.advance.toFixed(2)) })))};
const typeStart = ${typeStart};
const typeStep = ${typeStep};
const duration = ${duration};
const at = ms => ms / duration;
const make = (id, keyframes, options = {}) => document.getElementById(id).animate(keyframes, { duration, fill: 'both', easing: 'linear', ...options });
const animations = [];

animations.push(make('drop', [
  { transform: 'translateY(-1300px)', offset: 0, easing: 'cubic-bezier(.55,0,.9,.6)' },
  { transform: 'translateY(0px)', offset: at(380), easing: 'cubic-bezier(.2,.7,.4,1)' },
  { transform: 'translateY(-34px)', offset: at(470), easing: 'cubic-bezier(.6,0,.9,.5)' },
  { transform: 'translateY(0px)', offset: at(540) },
  { transform: 'translateY(0px)', offset: 1 },
]));

animations.push(make('shadow', [
  { transform: 'translate(-${badge.shadow}px,-${badge.shadow}px)', offset: 0 },
  { transform: 'translate(-${badge.shadow}px,-${badge.shadow}px)', offset: at(540), easing: 'cubic-bezier(.2,1.6,.4,1)' },
  { transform: 'translate(0px,0px)', offset: at(700) },
  { transform: 'translate(0px,0px)', offset: 1 },
]));

const slide = (id, from) => animations.push(make(id, [
  { transform: 'translateX(' + from + 'px)', opacity: 0, offset: 0 },
  { transform: 'translateX(' + from + 'px)', opacity: 0, offset: at(620) },
  { transform: 'translateX(0px)', opacity: 1, offset: at(900), easing: 'cubic-bezier(.2,.8,.2,1.25)' },
  { transform: 'translateX(0px)', opacity: 1, offset: 1 },
]));
slide('braceL', -900);
slide('braceR', 900);

animations.push(make('shake', [
  { transform: 'translate(0px,0px)', offset: 0 },
  { transform: 'translate(0px,0px)', offset: at(890) },
  { transform: 'translate(-9px,5px)', offset: at(930) },
  { transform: 'translate(8px,-5px)', offset: at(970) },
  { transform: 'translate(-4px,3px)', offset: at(1010) },
  { transform: 'translate(0px,0px)', offset: at(1050) },
  { transform: 'translate(0px,0px)', offset: 1 },
]));

letters.forEach((letter, index) => {
  const when = typeStart + index * typeStep;
  animations.push(make('l' + index, [
    { opacity: 0, offset: 0 },
    { opacity: 0, offset: at(when) },
    { opacity: 1, offset: at(when), easing: 'steps(1,end)' },
    { opacity: 1, offset: 1 },
  ]));
});

const first = letters[0].x;
const end = letters[letters.length - 1].x + letters[letters.length - 1].advance;
const cursorFrames = [{ transform: 'translateX(${cursorStart.toFixed(2)}px)', offset: 0, easing: 'steps(1,end)' }];
letters.forEach((letter, index) => {
  cursorFrames.push({ transform: 'translateX(' + (letter.x + letter.advance - end).toFixed(2) + 'px)', offset: at(typeStart + index * typeStep), easing: 'steps(1,end)' });
});
cursorFrames.push({ transform: 'translateX(0px)', offset: 1 });
animations.push(make('cursorRun', cursorFrames));

animations.push(make('cursorBlink', [
  { opacity: 0, offset: 0, easing: 'steps(1,end)' },
  { opacity: 1, offset: at(900), easing: 'steps(1,end)' },
  { opacity: 0, offset: at(1950), easing: 'steps(1,end)' },
  { opacity: 1, offset: at(2150), easing: 'steps(1,end)' },
  { opacity: 0, offset: at(2350), easing: 'steps(1,end)' },
  { opacity: 1, offset: at(2550), easing: 'steps(1,end)' },
  { opacity: 1, offset: 1 },
]));

animations.push(make('tag', [
  { opacity: 0, transform: 'scale(1.5) rotate(-6deg)', offset: 0 },
  { opacity: 0, transform: 'scale(1.5) rotate(-6deg)', offset: at(2000) },
  { opacity: 1, transform: 'scale(1) rotate(-2deg)', offset: at(2200), easing: 'cubic-bezier(.2,.8,.2,1.2)' },
  { opacity: 1, transform: 'scale(1) rotate(-2deg)', offset: 1 },
]));

window.__duration = duration;
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
  return { wordEnd, first: startX };
};
