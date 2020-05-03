import React from "react";
import { useDrag } from "./hooks";
import { Layer } from "../domains/Layer/model";
import { isTouchDevice } from "../lib/browser/devise";

interface Props {
  layer: Layer;
  onMove(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel): void;
  onDragStart(x: Pixel, y: Pixel, e: Event): void;
  onDragEnd(e: Event): void;
}

const RADIUS = 6 as Pixel;

export function RotateHandler({
  layer,
  onMove,
  onDragStart,
  onDragEnd,
}: Props) {
  const ref = useDrag<SVGCircleElement>(isTouchDevice, {
    onMove,
    onDragStart,
    onDragEnd,
  });

  const cx = layer.width + RADIUS * 1.5;
  const cy = layer.height / 2 - RADIUS / 2;

  return (
    <g>
      <line
        x1={layer.width}
        x2={cx}
        y1={cy}
        y2={cy}
        stroke="#666666"
        strokeWidth="1"
      />
      <circle
        data-layer-id={layer.id}
        ref={ref}
        fill="white"
        stroke="#666666"
        strokeWidth="1"
        r={RADIUS}
        cx={cx}
        cy={cy}
      />
    </g>
  );
}
