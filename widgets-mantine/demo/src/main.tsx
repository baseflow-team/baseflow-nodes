import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "widgets-mantine";
import List from "./List";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Preview root element was not found");
}

createRoot(container).render(
  <StrictMode>
    <MantineProvider>
      <List />
    </MantineProvider>
  </StrictMode>,
);
