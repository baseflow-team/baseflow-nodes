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
- 修改 `package.json#baseflow` 或新增节点：重新构建节点，再运行 `npm run build:demo` 更新 `mock.json`。
- 修改 `src/manifest.ts`：重新构建该节点并刷新页面。
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

#### React UI 节点示例

```json
{
  "name": "@baseflow-nodes/example-node",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "baseflow": {
    "type": "Task",
    "name": "示例节点",
    "icon": "",
    "desc": "示例节点",
    "executor": {
      "node": "@baseflow-executors/example-node@0.0.1"
    },
    "defaultDsl": {
      "nodes": [{ "tag": "@baseflow-nodes/example-node" }],
      "sources": {
        "@baseflow-nodes/example-node": "@baseflow-nodes/example-node@1"
      }
    }
  },
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

#### 无 UI 节点不需要额外的 UI 构建

无 UI 节点同样需要声明上述 `baseflow` 字段，构建命令只需：

```json
{
  "scripts": {
    "build": "node ../../scripts/buildNodeManifest.js",
    "type:check": "tsc --noEmit"
  }
}
```

#### 节点统一使用以下 `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {},
  "include": ["src", "../../env.d.ts"]
}
```

`package.json#name` 的末段必须与 node ID 一致。`npm run build:nodes` 会构建所有声明了非空 `scripts.build` 的节点。

- `baseflow` 必须包含 `type/name/icon/desc/executor/defaultDsl` 六个 key；构建只检查 key 存在，不校验值是否为空，也不比较 `baseflow.type` 与 Manifest 的 `type`，两者由开发者保证一致。
- `runtimeVersion` 可省略；构建时统一由根 `package.json#baseflowRuntimeVersion` 覆盖。
- 产物 `baseflow` 来自源码 package.json；`defaultDsl` 保持源结构，mock 的 `dsl` 也直接使用这个值，不转换为字符串。
- 产物 package.json 只包含 `private/publishConfig/type/name/version/baseflow` 顶级字段，不复制 `scripts/peerDependencies` 等开发配置。
- demo 的 `mock.json` 从产物 `package.json#baseflow` 读取 `type/name/icon/desc/defaultDsl`，无需读取 Manifest。

### 2. 声明 NodeManifest

`src/manifest.ts` 必须默认导出一个对象。它通过独立的 Vite 配置构建为不压缩的 ESM 文件 `manifest.js`，不参与 package.json 元数据提取。源码可以导入运行时依赖，构建会将依赖内联进这个单文件：

```ts
import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Task",
  defaultData: {
    meta: {
      name: "示例节点",
    },
    props: {},
  },
  uiForm: "index.js",
} as NodeManifest;
```

- `uiForm` 在 Manifest 中声明：UI 节点使用 `"index.js"`，无 UI 节点使用配置对象。
- Manifest 中的函数会保留为可执行函数，不再转成字符串。
- 构建钩子通过产物的 `exports/imports/dynamicImports` 记录检查默认导出和模块依赖，失败则终止构建；这是针对构建器可识别依赖的轻量检查。
- `manifest.js` 按 UTF-8 字节计算体积，超过 10 KB（10 × 1024 字节）时另起一行输出英文 `console.warn`，使用 ANSI 红色和下划线样式，不阻止构建。

### 3. 构建 React UI

`vite.config.ts`：

```ts
import { defineNodeConfig } from "../../scripts/defineNodeConfig.js";

export default defineNodeConfig(import.meta.dirname);
```

`src/index.tsx` 在模块执行时直接挂载 UI：

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

统一配置会生成标准 ESM 入口 `index.js`，并将样式注入该入口。加载器准备好节点运行环境后，只需执行 `import(url)` 即可触发 UI 挂载。使用其他框架或构建工具时，也必须生成相同的入口和产物结构，并在模块执行时自行挂载 UI。

### 4. 构建单个节点

在节点目录中执行：

```bash
npm run build
```

产物位于：

```text
baseflow-preview/nodes/example-node/
  package.json
  manifest.js    # 独立 ESM Manifest，依赖内联
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
https://cdn.jsdelivr.net/npm/@baseflow-nodes/example-node@0.0.1/manifest.js
https://cdn.jsdelivr.net/npm/@baseflow-nodes/example-node@0.0.1/index.js
```

其中 `package.json#baseflow` 是节点元数据；`manifest.js` 默认导出节点 Manifest；UI 节点的 `index.js` 是由 renderer iframe 动态 import 的 ESM 入口。

## 节点运行约定

- 节点 UI 运行在独立 iframe Realm 中，避免与 Workflow 父页面共享 JS 运行时和样式。
- 每个 iframe 只初始化一次，节点随入口模块加载而启动；重新启动节点必须重建 iframe。
- 节点与父页面通过 Runtime SDK 封装的 `postMessage`/RPC 通信。React 节点使用 `@baseflow/node-runtime-react`；其他框架可使用基础的 `@baseflow/node-runtime`。
- 节点可以使用自己的框架和 UI 库，也可以动态 import 其他 ESM CDN 依赖。
- 当前本地 preview 使用无 `sandbox` 的同源 iframe，只提供 Realm、DOM 和 CSS 隔离，不是恶意代码安全边界。
