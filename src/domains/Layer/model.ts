import { degree2radian } from "../../lib/math/geometry";

export interface Layer {
  id: number;
  width: Pixel;
  height: Pixel;
  positionX: Pixel;
  positionY: Pixel;
  rotate: Degree;
}

export type Transform = Pick<
  Layer,
  "width" | "height" | "positionX" | "positionY" | "rotate"
>;

export function getAbsoluteCenter(layer: Layer): [Pixel, Pixel] {
  return [
    layer.positionX + layer.width / 2,
    layer.positionY + layer.height / 2,
  ];
}

export function rotateVector(
  vector: [Pixel, Pixel],
  rotate: Degree
): [Pixel, Pixel] {
  const theta = degree2radian(rotate);

  const [x, y] = vector;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  return [x * cos - y * sin, x * sin + y * cos];
}

export function rotateByCenter(degree: Degree, [cx, cy]: [Pixel, Pixel]) {
  return function apply([x, y]: [Pixel, Pixel]) {
    const [rotatedX, rotatedY] = rotateVector([x - cx, y - cy], degree);

    return [rotatedX + cx, rotatedY + cy];
  };
}
