import sharp from 'sharp';

export const row = async (files, { height, gap = 16, pad = 24, background = '#2b2b2b' }) => {
  const tiles = await Promise.all(files.map(file => sharp(file).resize({ height }).png().toBuffer()));
  const widths = await Promise.all(tiles.map(async tile => (await sharp(tile).metadata()).width));
  const width = widths.reduce((sum, w) => sum + w, 0) + gap * (tiles.length - 1) + pad * 2;
  let left = pad;
  const composite = tiles.map((input, i) => {
    const item = { input, left, top: pad };
    left += widths[i] + gap;
    return item;
  });
  return sharp({ create: { width, height: height + pad * 2, channels: 3, background } })
    .composite(composite)
    .png({ compressionLevel: 9 })
    .toBuffer();
};

export const rowByWidth = async (files, { width, gap = 16, pad = 24, background = '#2b2b2b' }) => {
  const tiles = await Promise.all(files.map(file => sharp(file).resize({ width }).png().toBuffer()));
  const heights = await Promise.all(tiles.map(async tile => (await sharp(tile).metadata()).height));
  const height = Math.max(...heights);
  const total = width * tiles.length + gap * (tiles.length - 1) + pad * 2;
  return sharp({ create: { width: total, height: height + pad * 2, channels: 3, background } })
    .composite(tiles.map((input, i) => ({ input, left: pad + i * (width + gap), top: pad })))
    .png({ compressionLevel: 9 })
    .toBuffer();
};

export const stack = async (buffers, { gap = 0, background = '#2b2b2b' } = {}) => {
  const metas = await Promise.all(buffers.map(buffer => sharp(buffer).metadata()));
  const width = Math.max(...metas.map(meta => meta.width));
  const height = metas.reduce((sum, meta) => sum + meta.height, 0) + gap * (buffers.length - 1);
  let top = 0;
  const composite = buffers.map((input, i) => {
    const item = { input, left: 0, top };
    top += metas[i].height + gap;
    return item;
  });
  return sharp({ create: { width, height, channels: 3, background } }).composite(composite).png({ compressionLevel: 9 }).toBuffer();
};

export const columnStats = async (buffer, column) => {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const { data, info } = await sharp(buffer).extract({ left: column, top: 0, width: 1, height: meta.height }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, channels: info.channels, height: info.height };
};

export const columnDiff = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.data.length; i += 1) sum += Math.abs(a.data[i] - b.data[i]);
  return sum / a.data.length;
};
