export interface Draggable {
  destroy(): void;
}

export interface Handlers {
  onMove(dx: Pixel, dy: Pixel, x: Pixel, y: Pixel, e: Event): void;
  onDragStart(x: Pixel, y: Pixel, e: Event): void;
  onDragEnd(e: Event): void;
}
