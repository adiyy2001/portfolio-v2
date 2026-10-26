import React from 'react';
import { withPrefix } from 'gatsby';
import { siteMetadata } from './gatsby-config';
import { consentKey } from './src/consent';

export { wrapRootElement, wrapPageElement } from './src/wrap';

const font = name => withPrefix(`/fonts/${name}.woff2`);

const faces = () => `
@font-face{font-family:'Bespoke Serif';src:url(${font('bespoke-serif-500')}) format('woff2');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'Bespoke Serif';src:url(${font('bespoke-serif-700')}) format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'Schibsted Grotesk';src:url(${font('schibsted-grotesk')}) format('woff2');font-weight:400 600;font-style:normal;font-display:swap}
@font-face{font-family:'Mynerve';src:url(${font('mynerve')}) format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Bespoke Serif fallback';src:local('Times New Roman'),local('TimesNewRomanPSMT'),local('Liberation Serif');font-weight:500;size-adjust:118.98%;ascent-override:84.89%;descent-override:22.69%;line-gap-override:7.56%}
@font-face{font-family:'Bespoke Serif fallback';src:local('Times New Roman Bold'),local('TimesNewRomanPS-BoldMT'),local('Liberation Serif Bold');font-weight:700;size-adjust:115.44%;ascent-override:87.49%;descent-override:23.39%;line-gap-override:7.8%}
@font-face{font-family:'Schibsted Grotesk fallback';src:local('Arial'),local('ArialMT'),local('Liberation Sans');font-weight:400 600;size-adjust:105%;ascent-override:93.01%;descent-override:24.55%;line-gap-override:0%}
`;

const counter = code => (
  <script
    key="goatcounter"
    data-goatcounter={`https://${code}.goatcounter.com/count`}
    async
    src="https://gc.zgo.at/count.js"
  />
);

const consentDefaults = id => `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
var stored=null;try{stored=localStorage.getItem('${consentKey}')}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:stored==='granted'?'granted':'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('js',new Date());
gtag('config','${id}');
`;

const analytics = id => [
  <script key="gtag-consent" dangerouslySetInnerHTML={{ __html: consentDefaults(id) }} />,
  <script key="gtag" async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />,
];

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setPostBodyComponents([
    ...(siteMetadata.goatcounter ? [counter(siteMetadata.goatcounter)] : []),
    ...(siteMetadata.analytics ? analytics(siteMetadata.analytics) : []),
  ]);
  setHeadComponents([
    <link
      key="font-display"
      rel="preload"
      href={font('bespoke-serif-700')}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="font-text"
      rel="preload"
      href={font('schibsted-grotesk')}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <style key="font-faces" dangerouslySetInnerHTML={{ __html: faces() }} />,
  ]);
};
