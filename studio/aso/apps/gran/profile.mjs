export const profile = [
  [0, 840],
  [0.4, 868],
  [0.9, 925],
  [1.4, 985],
  [1.8, 1010],
  [2.1, 1050],
  [2.5, 1150],
  [2.9, 1240],
  [3.4, 1310],
  [3.6, 1296],
  [3.9, 1352],
  [4.4, 1394],
  [4.6, 1408],
  [5.3, 1382],
  [5.9, 1420],
  [6.3, 1520],
  [6.8, 1603],
];

export const steep = [
  [2.0, 2.9],
  [5.9, 6.8],
];

export const profileRange = { km: [0, 6.8], height: [800, 1650] };

export const heightAt = km => {
  for (let i = 1; i < profile.length; i += 1) {
    const [x1, y1] = profile[i];
    const [x0, y0] = profile[i - 1];
    if (km <= x1) return y0 + ((y1 - y0) * (km - x0)) / (x1 - x0);
  }
  return profile[profile.length - 1][1];
};

export const profilePoints = ({ x, y, width, height, range = profileRange }) =>
  profile.map(([km, h]) => [
    x + ((km - range.km[0]) / (range.km[1] - range.km[0])) * width,
    y + height - ((h - range.height[0]) / (range.height[1] - range.height[0])) * height,
  ]);
