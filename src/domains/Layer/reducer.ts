import produce from "immer";
import pick from "lodash-es/pick";
import { Layer, Transform, getAbsoluteCenter, rotateByCenter } from "./model";
import { action, KnownActions, unreduceable } from "../../lib/flux/util";
import { radian2degree } from "../../lib/math/geometry";

interface State {
  layers: Layer[];
  initialTransforms: Record<Layer["id"], Transform>;
  initialMousePosition: [Pixel, Pixel];
  layerCenter: Record<Layer["id"], [Pixel, Pixel]>;
}

export const initialState: State = {
  layers: [
    {
      id: 1,
      width: 200,
      height: 100,
      positionX: 0,
      positionY: 0,
      rotate: 0,
    },
  ],
  initialTransforms: {},
  initialMousePosition: [0, 0],
  layerCenter: {},
};

export const LayerAction = {
  moveStarted: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/moveStarted", { id, x, y }),
  moved: (dx: Pixel, dy: Pixel) => action("layer/moved", { dx, dy }),
  moveEnded: () => action("layer/moveEnded", {}),
  resized: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/resized", { id, x, y }),
  rotated: (id: Layer["id"], x: Pixel, y: Pixel) =>
    action("layer/rotated", { id, x, y }),
};

const reducer = (
  currentState: State,
  action: KnownActions<typeof LayerAction>
) =>
  produce(currentState, (state: State) => {
    switch (action.type) {
      case "layer/moveStarted": {
        const { id, x, y } = action.payload;
        const layer = state.layers.find((layer) => layer.id === id);
        if (!layer) {
          return;
        }

        // 変形開始時のレイヤーの状態を覚えておく
        state.initialTransforms[layer.id] = pick(layer, [
          "width",
          "height",
          "positionX",
          "positionY",
          "rotate",
        ]);

        // 回転のため、レイヤーの中心座標を覚えておく
        state.layerCenter[layer.id] = getAbsoluteCenter(layer);

        // 変形開始時のマウスの座標も覚えておく
        state.initialMousePosition = [x, y];
        break;
      }

      case "layer/moved": {
        const { dx, dy } = action.payload;
        state.layers.forEach((layer) => {
          const transform = state.initialTransforms[layer.id];
          if (!transform) {
            return;
          }

          const { positionX, positionY } = transform;
          layer.positionX = positionX + dx;
          layer.positionY = positionY + dy;
        });
        break;
      }

      case "layer/moveEnded": {
        state.initialTransforms = {};
        state.layerCenter = {};
        state.initialMousePosition = [0, 0];
        break;
      }

      case "layer/resized": {
        const { id, x, y } = action.payload;
        const layer = state.layers.find((layer) => layer.id === id);
        if (!layer) {
          return;
        }

        const transform = state.initialTransforms[layer.id];
        if (!transform) {
          return;
        }

        const layerCenter = state.layerCenter[layer.id];
        if (!layerCenter) {
          return;
        }

        const { width, height } = transform;

        const [cx, cy] = layerCenter;
        const [rotatedCursorX, rotatedCursorY] = rotateByCenter(-layer.rotate, [
          cx,
          cy,
        ])([x, y]);

        const [endX, endY] = [
          transform.width + transform.positionX,
          transform.height + transform.positionY,
        ];

        // レイヤーの中心を原点に拡大する場合、マウスの移動分に対して半分しか大きくならないように見えてしまうので、差分を2倍すると良い
        const nextWidth = width + (rotatedCursorX - endX) * 2;
        const nextHeight = height + (rotatedCursorY - endY) * 2;

        layer.width = nextWidth;
        layer.height = nextHeight;
        layer.positionX = cx - nextWidth / 2;
        layer.positionY = cy - nextHeight / 2;
        break;
      }

      case "layer/rotated": {
        const { id, x, y } = action.payload;
        const layer = state.layers.find((layer) => layer.id === id);
        if (!layer) {
          return;
        }

        const [cx, cy] = state.layerCenter[layer.id];

        /** θ の隣辺の長さ( x 方向) */
        const vx = x - cx;
        /** θ の対辺の長さ( y 方向) */
        const vy = y - cy;
        /** θ: 回転角(ラジアン) */
        const nextTheta = Math.atan2(vy, vx);

        layer.rotate = radian2degree(nextTheta);
        break;
      }

      default: {
        unreduceable(action);
      }
    }
  });

export default reducer;
