import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { BrandTheme } from "widgets-mantine";
import List from "./List";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Preview root element was not found");
}

createRoot(container).render(
  <MantineProvider theme={BrandTheme}>
    <List />
  </MantineProvider>,
);
