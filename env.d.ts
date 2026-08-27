declare module "*.css";
declare module "*.scss";
declare module "*.svg";

interface ImportMetaEnv {
  readonly VITE_NODE_RENDERER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
