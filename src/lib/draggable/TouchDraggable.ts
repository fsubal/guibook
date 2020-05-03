import { Draggable, Handlers } from "./types";
import { passive } from "../browser/events";

export class TouchDraggable<E extends SVGElement> implements Draggable {
  private initialTouch?: { x: Pixel; y: Pixel };

  constructor(private element: E, private handlers: Handlers) {
    this.element.addEventListener("touchstart", this._onTouchStart, passive);
    this.element.addEventListener("touchmove", this._onTouchMove, passive);
    this.element.addEventListener("touchend", this._onTouchEnd, passive);
  }

  destroy() {
    this.element.removeEventListener("touchstart", this._onTouchStart);
    this.element.removeEventListener("touchmove", this._onTouchMove);
    this.element.removeEventListener("touchend", this._onTouchEnd);
  }

  private _onTouchStart = (e: TouchEvent) => {
    e.stopPropagation();

    // 通常ありえない
    if (!e.currentTarget || !e.target) {
      return;
    }

    // ピンチズーム とかで誤動作させない
    if (e.changedTouches.length !== 1) {
      return;
    }

    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    this.initialTouch = { x, y };
    this.handlers.onDragStart(x, y, e);
  };

  private _onTouchMove = (e: TouchEvent) => {
    e.stopPropagation();

    // 通常ありえない
    if (!e.currentTarget || !e.target) {
      return;
    }

    // ピンチズーム とかで誤動作させない
    if (e.changedTouches.length !== 1) {
      return;
    }

    if (this.initialTouch === undefined) {
      return;
    }

    const { x, y } = this.initialTouch;
    const { clientX, clientY } = e.changedTouches[0];

    this.handlers.onMove(clientX - x, clientY - y, clientX, clientY, e);
  };

  private _onTouchEnd = (e: TouchEvent) => {
    e.stopPropagation();
    this.handlers.onDragEnd(e);
    this.initialTouch = undefined;
  };
}
