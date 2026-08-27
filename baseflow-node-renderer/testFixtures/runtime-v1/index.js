import { useState } from "react";
import { jsx } from "react/jsx-runtime";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

var requireFixture = (id) => {
  if (id === "fixture-label") return { label: "runtime-v1" };
  throw new Error(`Unknown fixture dependency: ${id}`);
};
var { label } = requireFixture("fixture-label");

function RuntimeV1Node() {
  const [value] = useState(label);
  return jsx("div", { children: value });
}

function mount(container) {
  const root = createRoot(container);
  flushSync(() => root.render(jsx(RuntimeV1Node, {})));
  return root;
}

export { mount, RuntimeV1Node as default };
