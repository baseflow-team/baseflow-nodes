import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./css/normalize.css";
import "./css/global.css";
import "./css/node.scss";
createRoot(document.getElementById("root")!).render(<App />);
