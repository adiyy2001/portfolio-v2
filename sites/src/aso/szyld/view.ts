export const slotNumber = (value: number) => String(value).padStart(2, '0');

const grainSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 2.2 0 0 0 -.6'/></filter><rect width='220' height='220' filter='url(#n)' fill='#fff'/></svg>";

export const grainUrl = `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`;
