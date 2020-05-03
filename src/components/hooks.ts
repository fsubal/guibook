import { useRef, useEffect } from "react";
import makeDraggable from "../lib/draggable";
import { Handlers } from "../lib/draggable/types";

export function useDrag<E extends SVGElement>(
  isTouchDevice: boolean,
  { onMove, onDragStart, onDragEnd }: Handlers
) {
  const ref = useRef<E | null>(null);

  useEffect(() => {
    const draggable = makeDraggable(ref.current!, isTouchDevice, {
      onMove,
      onDragStart,
      onDragEnd,
    });

    return () => {
      draggable.destroy();
    };
  }, [isTouchDevice, onDragEnd, onDragStart, onMove]);

  return ref;
}
