import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { importNode } from "./utils";

function App() {
  const [Node, setNode] = useState<ComponentType>();
  useEffect(() => {
    const source = document.location.hash;
    importNode(source).then(setNode);
  }, []);

  if (Node) {
    return <Node />;
  }
  return <div>render</div>;
}

export default App;
