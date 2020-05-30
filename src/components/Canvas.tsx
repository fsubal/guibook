import React, { useReducer, useCallback } from "react";
import reducer, { initialState, LayerAction } from "../domains/Layer/reducer";
import { RectLayer } from "./RectLayer";
import CanvasContext from "./context";

export function Canvas() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onDragStart = useCallback((x: Pixel, y: Pixel, e: Event) => {
    const layerId = Number((e.currentTarget as HTMLElement).dataset.layerId);

    dispatch(LayerAction.moveStarted(layerId, x, y));
  }, []);

  const onMove = useCallback((dx: Pixel, dy: Pixel) => {
    dispatch(LayerAction.moved(dx, dy));
  }, []);

  const onDragEnd = useCallback((e: Event) => {
    e.stopPropagation();
    dispatch(LayerAction.moveEnded());
  }, []);

  return (
    <CanvasContext.Provider value={[state, dispatch]}>
      <svg
        viewBox="0 0 500 500"
        width="500"
        height="500"
      >
        {state.layers.map((layer) => (
          <RectLayer
            key={layer.id}
            src={layer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMove={onMove}
          />
        ))}
      </svg>
    </CanvasContext.Provider>
  );
}
