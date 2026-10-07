import type { Storyboard } from './types';

export const overlayRules = { maxWords: 6, minFrames: 45, maxCount: 4 } as const;

export const wordCount = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;

export const readingFrames = (text: string, fps = 30) =>
  Math.ceil((wordCount(text) * 0.3 + 0.7) * fps);

export const storyboardProblems = (board: Storyboard) => {
  const problems: string[] = [];
  const shots = [...board.shots].sort((a, b) => a.from - b.from);
  if (shots[0]?.from !== 0) problems.push('first shot must start at frame 0');
  shots.forEach((shot, i) => {
    const next = shots[i + 1];
    if (next && next.from !== shot.to + 1) problems.push(`gap or overlap after ${shot.id}`);
    if (shot.key < shot.from || shot.key > shot.to) problems.push(`key frame outside ${shot.id}`);
  });
  if (shots.at(-1)?.to !== board.duration - 1) problems.push('last shot must end on the last frame');
  const overlays = shots.flatMap(shot => (shot.overlay ? [shot.overlay] : []));
  if (overlays.length > overlayRules.maxCount) problems.push('too many overlays');
  for (const overlay of overlays) {
    const frames = overlay.to - overlay.from + 1;
    if (wordCount(overlay.text) > overlayRules.maxWords) problems.push(`too many words: ${overlay.text}`);
    if (frames < overlayRules.minFrames) problems.push(`overlay too short: ${overlay.text}`);
    if (frames < readingFrames(overlay.text)) problems.push(`overlay not readable in time: ${overlay.text}`);
  }
  const seconds = board.duration / board.fps;
  if (seconds < 15 || seconds > 30) problems.push('store cut must last 15 to 30 s');
  return problems;
};
