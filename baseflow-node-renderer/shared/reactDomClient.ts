import ReactDomClient from "react-dom/client";

const ReactDomClientExports = ReactDomClient as typeof ReactDomClient & { version: string };

export const { createRoot, hydrateRoot, version } = ReactDomClientExports;
export default ReactDomClient;
