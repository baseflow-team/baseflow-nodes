import { jsx } from "react/jsx-runtime";
//#region src/index.tsx
function Properties({ nodeData }) {
	return /* @__PURE__ */ jsx("div", { children: nodeData.id + nodeData.meta.name });
}
//#endregion
export { Properties as default };
