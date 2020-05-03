import { Draggable, Handlers } from "./types";
import { passive } from "../browser/events";

export class MouseDraggable<E extends SVGElement> implements Draggable {
  private initialClick?: { x: Pixel; y: Pixel };

  constructor(private element: E, private handlers: Handlers) {
    this.element.addEventListener("mousedown", this._onClickStart, passive);
  }

  destroy() {
    this.element.removeEventListener("mousedown", this._onClickStart);
  }

  private _onClickStart = (e: MouseEvent) => {
    e.stopPropagation();

    // 通常ありえない
    if (!e.currentTarget || !e.target) return;

    // document に対してリスナを登録しているのは、
    // ドラッグ中に対象の要素とマウスカーソルが重なっていない状態になって
    // mousemove, mouseup イベントが発生しなくなることによる不具合を防ぐため
    document.addEventListener("mousemove", this._onClickMove, passive);
    document.addEventListener("mouseup", this._onClickEnd, passive);

    const x = e.clientX as Pixel;
    const y = e.clientY as Pixel;

    this.initialClick = { x, y };

    this.handlers.onDragStart(x, y, e);
  };

  private _onClickMove = (e: MouseEvent) => {
    e.stopPropagation();

    // 通常ありえない
    if (!e.currentTarget || !e.target) {
      return;
    }

    if (this.initialClick === undefined) {
      return;
    }

    const { x, y } = this.initialClick;
    const { clientX, clientY } = e;

    this.handlers.onMove(clientX - x, clientY - y, clientX, clientY, e);
  };

  private _onClickEnd = (e: MouseEvent) => {
    e.stopPropagation();

    document.removeEventListener("mousemove", this._onClickMove);
    document.removeEventListener("mouseup", this._onClickEnd);

    this.handlers.onDragEnd(e);

    this.initialClick = undefined;
  };
}
