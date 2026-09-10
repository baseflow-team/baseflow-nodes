# Baseflow Nodes

节点由独立的 renderer iframe 动态加载：

```text
baseflow-demo
  └─ iframe: node-render.html
       └─ import: baseflow-nodes/*
```

- `baseflow-demo`：Workflow 演示父页面；
- `node-render.html`：加载节点 ESM、并触发其自启动渲染函数；
- `baseflow-nodes/*`：节点源码；
- `baseflow-preview`：三者联合构建后的本地静态预览。

## 环境要求

- Node.js `>=22.12`
- npm workspaces

首次安装依赖后，在仓库根目录准备低频公共资源（不需要每次开发时执行）：

```bash
npm install
npm run prepare:monaco
```

## 快速开始

在仓库根目录依次执行：

```bash
npm run build:nodes
npm run build:demo
npm run preview
```

- `npm run preview` 只启动已有静态产物，不会自动构建。源码变化后，需要重新构建对应 workspace 并刷新页面。

## 开发一个节点

节点目录名是 node ID，使用 kebab-case：

```text
baseflow-nodes/example-node/
  package.json
  tsconfig.json
  src/
    manifest.ts
    index.tsx        # 仅有 UI 的节点需要
  vite.config.ts     # 仅有 UI 的节点需要
```

### 1. 声明 NodeManifest

NodeManifest 由 `src/manifest.ts` 默认导出，构建时生成产物 `package.json` 中的 `baseflow` 字段。

- 有 UI 的节点：请设置字段 inputForm: "index.js"
- 无 UI 的节点：无需设置 inputForm 或 inputForm: ""

### 2. 有 UI 的节点使用统一 Vite 配置

```ts
// vite.config.ts
import { defineNodeConfig } from "../../scripts/defineNodeConfig.js";

export default defineNodeConfig(import.meta.dirname);
```

配置工厂统一处理：

- production JSX 和 ES2022；
- `process.env.NODE_ENV = "production"`；
- Runtime 共享依赖 external；
- CSS 内联和注入；
- 固定输出 `index.js`；
- 保留第一步生成的 NodeManifest；
- 输出到 `baseflow-preview/nodes/<node-id>/`。

> 该配置仅为推荐配置。也可以使用其它构建工具，只要最终产物满足标准 ESM 并 export default 自启动函数。

### 3. 默认导出自启动函数

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";

export default () => createRoot(document.getElementById("root")!).render(<App />);
```

- UI 入口必须 default export 一个无参数自启动函数，由 `node-render` iframe 加载后调用。

## 节点开发规范

- 节点由 iframe 隔离运行，与 flow 窗口的唯一交互方式为原生的 postMessage。
- 推荐使用封装后的 Runtime SDK：`@baseflow/node-runtime-react`；如果你想使用其它非 react 框架（比如 vue），请使用更基础的 `@baseflow/node-runtime`；
- 节点最终的挂载和渲染都由自己的`自启动函数`封装，可以使用任何技术栈、框架、UI库，也支持动态 import esm cdn。
- 本项目的脚手架和构建脚本并非唯一的落地途径。

## 产物与发布

本项目最终有价值的产物为各节点构建后的 `npm package`，位于 `baseflow-preview/nodes` 目录下，你可以将其 npm publish 发布到公网并最终使用。
