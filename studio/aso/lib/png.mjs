import { readFileSync } from 'node:fs';

export const pngInfo = source => {
  const buf = Buffer.isBuffer(source) ? source : readFileSync(source);
  if (buf.length < 33 || buf.toString('ascii', 1, 4) !== 'PNG') throw new Error('not a PNG');
  const colourType = buf[25];
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colourType];
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bitDepth: buf[24],
    colourType,
    channels,
    palette: colourType === 3,
    hasAlpha: colourType === 4 || colourType === 6,
  };
};

export const isJpeg = source => {
  const buf = Buffer.isBuffer(source) ? source : readFileSync(source);
  return buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8;
};
