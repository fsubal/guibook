import React, { useReducer } from "react";
import { initialState } from "../domains/Layer/reducer";

const CanvasContext = React.createContext<ReturnType<typeof useReducer>>([
  initialState,
  (..._args: any) => {
    throw new Error("not initialized");
  },
]);

export default CanvasContext;
