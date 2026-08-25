import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { importNode } from "./utils";

interface NodeProps {
  nodeData: {
    id: string;
    meta: {
      name: string;
    };
    props: Record<string, unknown>;
  };
}

function App() {
  const [Node, setNode] = useState<ComponentType<NodeProps> | null>(null);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const source = document.location.hash;
    importNode<NodeProps>(source).then((component) => setNode(() => component), setError);
  }, []);

  if (Node) {
    return (
      <Node
        nodeData={{
          id: "break-preview",
          meta: { name: "循环Break" },
          props: {},
        }}
      />
    );
  }
  if (error) {
    return <pre>{error instanceof Error ? error.message : String(error)}</pre>;
  }
  return <div>render</div>;
}

export default App;
