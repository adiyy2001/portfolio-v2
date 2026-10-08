import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const ratio = value => {
  if (!value) return 0;
  const [a, b] = String(value).split('/').map(Number);
  return b ? a / b : a;
};

export const probe = file => {
  const raw = JSON.parse(
    execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-count_frames', '-of', 'json', file], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    }),
  );
  const video = raw.streams.find(s => s.codec_type === 'video');
  const audio = raw.streams.find(s => s.codec_type === 'audio');
  return {
    file,
    bytes: statSync(file).size,
    container: raw.format.format_name,
    duration: Number(Number(raw.format.duration).toFixed(3)),
    bitrate: Number(raw.format.bit_rate),
    video: video
      ? {
          codec: video.codec_name,
          profile: video.profile ?? null,
          level: video.level ?? null,
          width: video.width,
          height: video.height,
          fps: Number(ratio(video.avg_frame_rate).toFixed(3)),
          rFrameRate: video.r_frame_rate,
          frames: Number(video.nb_read_frames ?? video.nb_frames ?? 0),
          pixFmt: video.pix_fmt,
          colorRange: video.color_range ?? null,
          colorSpace: video.color_space ?? null,
          bitrate: Number(video.bit_rate ?? 0),
        }
      : null,
    audio: audio
      ? {
          codec: audio.codec_name,
          channels: audio.channels,
          sampleRate: Number(audio.sample_rate),
          bitrate: Number(audio.bit_rate ?? 0),
        }
      : null,
  };
};
