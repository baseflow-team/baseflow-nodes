import { createRoot } from "react-dom/client";
import App from "./App";
import { FlowBaseLang, NodeBaseLang } from "./i18n/en";
import * as zhHans from "./i18n/zh-hans";
import { getLocale } from "./utils";
import "@baseflow/flow-react/style.css";
import "./global.css";

const FlowBaseI18n: { [key: string]: { [key: string]: string } } = { "zh-hans": zhHans.FlowBaseLang };
const NodeBaseI18n: { [key: string]: { [key: string]: string } } = { "zh-hans": zhHans.NodeBaseLang };

const locale = getLocale();
if (locale) {
  Object.assign(FlowBaseLang, FlowBaseI18n[locale]);
  Object.assign(NodeBaseLang, NodeBaseI18n[locale]);
}

createRoot(document.getElementById("root")!).render(<App />);
