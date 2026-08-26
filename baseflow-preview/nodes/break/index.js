(() => {
  if (typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = "._Break_llmyq_1 {\n  color: red;\n}/*$vite$:1*/";
  document.head.appendChild(style);
})();
import { jsx } from "react/jsx-runtime";
var index_module_default = { Break: "_Break_llmyq_1" };
//#endregion
//#region src/index.tsx
function Properties({ nodeData }) {
	return /* @__PURE__ */ jsx("div", {
		className: index_module_default.Break,
		children: nodeData.id + nodeData.meta.name
	});
}
//#endregion
export { Properties as default };
