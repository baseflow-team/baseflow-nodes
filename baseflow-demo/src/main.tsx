import { createRoot } from "react-dom/client";
import App from "./App";
import "@baseflow/flow-react/style.css";
import "./css/global.css";
import "./css/node.scss";

createRoot(document.getElementById("root")!).render(<App />);
