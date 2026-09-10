# Baseflow Nodes

Baseflow 节点开发脚手架。节点构建为独立 npm package，发布后可由 Baseflow 通过 jsDelivr CDN 加载；仓库内同时提供本地 Workflow 演示页面用于联合调试。

```text
baseflow-demo
  └─ iframe: node-render.html
       └─ import: baseflow-nodes/*
```

## 环境准备

- Node.js `>=22.12`
- npm workspaces

首次检出后，在仓库根目录执行：

```bash
npm install
npm run prepare:monaco
```

`prepare:monaco` 只需在首次准备、生成目录丢失或 `monaco-editor` 版本变化时重新执行。

## 本地预览

在仓库根目录依次执行：

```bash
npm run build:nodes
npm run build:demo
npm run preview
```

- `build:nodes`：构建节点到 `baseflow-preview/nodes/<node-id>/`。
- `build:demo`：根据节点产物生成 `mock.json`，并构建演示页面到 `baseflow-preview/`。
- `preview`：启动已有静态产物，不会自动重新构建。

常见增量构建：

- 只修改节点 UI：重新构建该节点并刷新页面。
- 修改 NodeManifest 或新增节点：重新构建节点，再运行 `npm run build:demo` 更新 `mock.json`。
- 修改 demo：运行 `npm run build:demo`。

## 创建节点

节点目录名就是 node ID，必须使用 kebab-case：

```text
baseflow-nodes/example-node/
  package.json
  tsconfig.json
  src/
    manifest.ts
    index.tsx        # 仅 UI 节点需要
  vite.config.ts     # 仅 React UI 节点需要
```

### 1. 配置 package.json

React UI 节点示例：

```json
{
  "name": "@baseflow-nodes/example-node",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node ../../scripts/buildNodeManifest.js && vite build",
    "type:check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@baseflow/node-runtime-react": "^1"
  }
}
```

无 UI 节点不需要 Vite 构建：

```json
{
  "scripts": {
    "build": "node ../../scripts/buildNodeManifest.js",
    "type:check": "tsc --noEmit"
  }
}
```

节点统一使用以下 `tsconfig.json`：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {},
  "include": ["src", "../../env.d.ts"]
}
```

`package.json#name` 的末段必须与 node ID 一致。`npm run build:nodes` 会构建所有声明了非空 `scripts.build` 的节点。

### 2. 声明 NodeManifest

`src/manifest.ts` 必须默认导出一个对象，并且只能使用 `import type`：

```ts
import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Task",
  icon: "",
  desc: "示例节点",
  executor: {
    node: "@baseflow-executors/example-node@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "示例节点",
    },
    props: {},
  },
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/example-node" }],
    sources: {
      "@baseflow-nodes/example-node": "@baseflow-nodes/example-node@*",
    },
  },
} as NodeManifest;
```

- UI 节点设置 `inputForm: "index.js"`。
- 无 UI 节点省略 `inputForm`，也不需要 `src/index.tsx` 和 `vite.config.ts`。
- `runtimeVersion` 由构建脚本统一写入产物，无需在节点中声明。

### 3. 构建 React UI

`vite.config.ts`：

```ts
import { defineNodeConfig } from "../../scripts/defineNodeConfig.js";

export default defineNodeConfig(import.meta.dirname);
```

`src/index.tsx` 默认导出一个无参数的自启动函数：

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";

export default () => createRoot(document.getElementById("root")!).render(<App />);
```

统一配置会生成标准 ESM 入口 `index.js`，并将样式注入该入口。使用其他框架或构建工具时，也必须生成相同的入口和产物结构。

### 4. 构建单个节点

在节点目录中执行：

```bash
npm run build
```

产物位于：

```text
baseflow-preview/nodes/example-node/
  package.json
  index.js       # 仅 UI 节点存在
```

## 验证

根据改动范围，在仓库根目录执行：

```bash
npm run type:check
npm run lint
npm test
```

## 发布与使用

发布前，先在源码节点的 `package.json` 中更新 `version`，再重新构建节点：

```bash
npm run build --workspace @baseflow-nodes/example-node
```

发布构建后的节点产物：

```bash
npm publish ./baseflow-preview/nodes/example-node
```

不要直接修改或发布 `baseflow-nodes/<node-id>` 源码目录，也不要手工修改 `baseflow-preview` 中的生成产物。产物 `package.json` 已默认包含公开发布配置。

发布成功后，使用与 npm package 一致的固定版本访问 jsDelivr：

```text
https://cdn.jsdelivr.net/npm/@baseflow-nodes/example-node@0.0.1/package.json
https://cdn.jsdelivr.net/npm/@baseflow-nodes/example-node@0.0.1/index.js
```

其中 `package.json#baseflow` 是节点 Manifest；UI 节点的 `index.js` 是由 renderer iframe 动态 import 的 ESM 入口。

## 节点运行约定

- 节点 UI 运行在独立 iframe Realm 中，避免与 Workflow 父页面共享 JS 运行时和样式。
- 节点与父页面通过 Runtime SDK 封装的 `postMessage`/RPC 通信。React 节点使用 `@baseflow/node-runtime-react`；其他框架可使用基础的 `@baseflow/node-runtime`。
- 节点可以使用自己的框架和 UI 库，也可以动态 import 其他 ESM CDN 依赖。
- 当前本地 preview 使用无 `sandbox` 的同源 iframe，只提供 Realm、DOM 和 CSS 隔离，不是恶意代码安全边界。
