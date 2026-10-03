export const minimumValue = 0;
export const maximumValue = 100;
export const initialValue = 50;

const smallStep = 1;
const largeStep = 10;

export const clampValue = (value: number) =>
  Math.min(maximumValue, Math.max(minimumValue, Math.round(value)));

export const valueFromPointer = (clientX: number, left: number, width: number) => {
  if (width <= 0) return initialValue;
  return clampValue(((clientX - left) / width) * maximumValue);
};

export const valueFromKey = (key: string, current: number, shift: boolean) => {
  const step = shift ? largeStep : smallStep;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return clampValue(current - step);
    case 'ArrowRight':
    case 'ArrowUp':
      return clampValue(current + step);
    case 'PageDown':
      return clampValue(current - largeStep);
    case 'PageUp':
      return clampValue(current + largeStep);
    case 'Home':
      return minimumValue;
    case 'End':
      return maximumValue;
    default:
      return null;
  }
};

export const describeValue = (value: number) => `Przed: ${value}%, po: ${maximumValue - value}%`;
