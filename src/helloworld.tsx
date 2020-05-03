import React from "react";
import { render } from "react-dom";

document.addEventListener("DOMContentLoaded", () => {
  render(
    <svg id="canvas" viewBox="0 0 500 500" width="500" height="500">
      <rect fill="orange" width="200" height="100" x="0" y="0" />
    </svg>,
    document.querySelector("#root")!
  );
});
