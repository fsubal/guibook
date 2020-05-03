import React from "react";
import { useDrag } from "./hooks";
import { isTouchDevice } from "../lib/browser/devise";
import { Layer } from "../domains/Layer/model";

interface Props {
  layer: Layer;
  parentSize: [Pixel, Pixel];
  onMove(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel): void;
  onDragStart(x: Pixel, y: Pixel, e: Event): void;
  onDragEnd(e: Event): void;
}

const HANDLE_SIZE = 10 as Pixel;

/**
 * 実際のリサイズハンドラよりもどのくらい当たり判定を大きくするか
 */
const TOLERANCE = 4 as Pixel;

export function ResizeHandler({
  layer,
  parentSize,
  onMove,
  onDragStart,
  onDragEnd,
}: Props) {
  const ref = useDrag<SVGRectElement>(isTouchDevice, {
    onMove,
    onDragStart,
    onDragEnd,
  });

  const [width, height] = parentSize;
  const x = width - HANDLE_SIZE / 2;
  const y = height - HANDLE_SIZE / 2;

  return (
    <g>
      <rect
        fill="white"
        stroke="#666666"
        strokeWidth="1"
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        x={x}
        y={y}
      />
      {/** 上に透明な当たり判定を大きめにかぶせる */}
      <rect
        ref={ref}
        data-layer-id={layer.id}
        fillOpacity="0"
        width={HANDLE_SIZE + TOLERANCE * 2}
        height={HANDLE_SIZE + TOLERANCE * 2}
        x={x - TOLERANCE}
        y={y - TOLERANCE}
        style={{ cursor: "pointer" }}
      />
    </g>
  );
}
