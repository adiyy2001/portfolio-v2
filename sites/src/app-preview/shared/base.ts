export const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-padding-top:24px}
body{margin:0}
img,svg,video{max-width:100%}
[hidden]{display:none!important}
.skip{position:absolute;left:16px;top:-80px;z-index:100;padding:12px 18px;background:var(--skip-bg,#000);color:var(--skip-fg,#fff);font:600 16px/1.2 system-ui,sans-serif;text-decoration:none}
.skip:focus{top:16px}
:where(body){text-wrap:balance}
@media (min-width:961px){.files tbody th{min-width:12em}.files td:nth-child(2){min-width:11em}.files td.num{white-space:normal}.shots tbody th{white-space:nowrap}}
.board__full{margin-top:12px}
.nowrap,.top a{white-space:nowrap}
.top{flex-wrap:wrap}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
`;
