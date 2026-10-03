export const sealStorageKey = 'rozwaga-sealed';
export const sealFontProbe = '600 16px "Bodoni Moda"';
export const sealReleaseDelay = 1500;

export const headScript = [
  '(function(){',
  'var root=document.documentElement;',
  "root.classList.add('js');",
  'try{',
  "if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;",
  `if(sessionStorage.getItem('${sealStorageKey}'))return;`,
  `sessionStorage.setItem('${sealStorageKey}','1');`,
  '}catch(error){return}',
  "root.classList.add('seal-stamp');",
  "var release=function(){root.classList.add('seal-ready')};",
  `setTimeout(release,${sealReleaseDelay});`,
  'if(document.fonts&&document.fonts.load){',
  `document.fonts.load('${sealFontProbe}').then(release,release);`,
  '}',
  '})();',
].join('');
