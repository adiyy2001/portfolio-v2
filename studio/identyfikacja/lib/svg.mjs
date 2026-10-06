import { optimize } from 'svgo';

export const svgDocument = ({ viewBox, body, defs = '', title = '', role = 'img', extra = '' }) => {
  const [x, y, w, h] = viewBox;
    const heading = title ? `<title>${title}</title>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" role="${role}"${extra}>${heading}${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
};

export const optimizeSvg = (svg, { precision = 2, keepIds = false } = {}) =>
  optimize(svg, {
    multipass: true,
    floatPrecision: precision,
    plugins: [
      { name: 'preset-default', params: { overrides: keepIds ? { cleanupIds: false } : {} } },
      'removeDimensions',
    ],
  }).data;

export const viewBoxOf = svg => {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) return null;
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  return parts.length === 4 && parts.every(Number.isFinite) ? parts : null;
};

export const checkLogoSvg = (svg, { maxBytes = 10000 } = {}) => {
  const problems = [];
  if (/<text[\s>]/i.test(svg) || /<tspan/i.test(svg)) problems.push('contains <text>');
  if (/font-family/i.test(svg)) problems.push('refers to a font family');
  if (/<image[\s>]/i.test(svg)) problems.push('contains <image>');
  if (/<script/i.test(svg) || /\son[a-z]+=/i.test(svg)) problems.push('contains script');
  const box = viewBoxOf(svg);
  if (!box) problems.push('missing or invalid viewBox');
  else if (box[2] <= 0 || box[3] <= 0) problems.push('empty viewBox');
  const bytes = Buffer.byteLength(svg);
  if (bytes >= maxBytes) problems.push(`size ${bytes} B is not under ${maxBytes} B`);
  return { ok: problems.length === 0, problems, bytes, viewBox: box };
};

export const recolor = (svg, map) => Object.entries(map).reduce((acc, [from, to]) => acc.replaceAll(from, to), svg);
