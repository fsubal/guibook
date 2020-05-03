export function degree2radian(degree: Degree) {
  return (degree * Math.PI) / 180;
}

export function radian2degree(radian: Radian) {
  return (radian / Math.PI) * 180;
}

export function distanceBetween(
  [x1, y1]: [Pixel, Pixel],
  [x2, y2]: [Pixel, Pixel]
) {
  const [width, height] = [x2 - x1, y2 - y1];

  return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
}
