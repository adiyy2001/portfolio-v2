export const currentSectionIndex = (tops: number[], threshold: number): number => {
  let current = -1;
  tops.forEach((top, index) => {
    if (top <= threshold) current = index;
  });
  return current;
};
