import React from "react";
import { render } from "react-dom";
import { Canvas } from "./components/Canvas";

document.addEventListener("DOMContentLoaded", () => {
  render(<Canvas />, document.querySelector("#root")!);
});
