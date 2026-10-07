import sharp from 'sharp';
import { isJpeg, pngInfo } from './png.mjs';

export const flattenImage = async (input, { format, background, width, height }) => {
  let image = sharp(input).flatten({ background }).removeAlpha().toColourspace('srgb');
  const meta = await sharp(input).metadata();
  if (meta.width !== width || meta.height !== height) image = image.resize(width, height, { fit: 'fill' });
  if (format === 'jpg') {
    return image.jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  }
  return image.png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toBuffer();
};

export const rasterSvg = async (svg, size) =>
  sharp(Buffer.from(svg), { density: 72 * (size / 1024) })
    .resize(size, size, { fit: 'fill' })
    .png()
    .toBuffer();

export const opaqueSquare = async (png, { size, background, alpha }) => {
  let image = sharp(png).flatten({ background });
  if (size) image = image.resize(size, size, { fit: 'fill', kernel: 'lanczos3' });
  image = alpha ? image.ensureAlpha(1) : image.removeAlpha();
  return image.toColourspace('srgb').png({ compressionLevel: 9, palette: false }).toBuffer();
};

export const transparentLayer = async (png, size) =>
  sharp(png).resize(size, size, { fit: 'fill', kernel: 'lanczos3' }).ensureAlpha().png({ compressionLevel: 9, palette: false }).toBuffer();

export const describeImage = async buffer => {
  const meta = await sharp(buffer).metadata();
  const stats = await sharp(buffer).stats();
  return {
    format: meta.format,
    width: meta.width,
    height: meta.height,
    channels: meta.channels,
    space: meta.space,
    hasAlpha: Boolean(meta.hasAlpha),
    opaque: stats.isOpaque,
    png: meta.format === 'png' ? pngInfo(buffer) : null,
    jpeg: isJpeg(buffer),
    bytes: buffer.length,
  };
};

export const toWebp = async (input, width, quality = 84) =>
  sharp(input).resize({ width }).webp({ quality, effort: 5 }).toBuffer();

export const toPng = async (input, width) => sharp(input).resize({ width }).png({ compressionLevel: 9 }).toBuffer();
