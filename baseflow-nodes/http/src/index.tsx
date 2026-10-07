import { createRoot } from "react-dom/client";
import App from "./App";
import Lang from "./i18n/en";
import zhHans from "./i18n/zh-hans";

const i18n: { [key: string]: { [key: string]: string } } = { "zh-hans": zhHans };
const params = new URLSearchParams(location.search);
const locale = params.get("_lang_") || "en";
Object.assign(Lang, i18n[locale]);

const container = document.getElementById("root")!;

createRoot(container).render(<App container={container} />);
