# Baseflow Nodes

Baseflow 节点 UI 物料仓库。节点由独立的 renderer iframe 动态加载，不作为独立 Web App 运行。

```text
baseflow-demo
  └─ iframe: baseflow-node-renderer
       └─ baseflow-nodes/*
```

- `baseflow-demo`：Workflow 演示父页面；
- `baseflow-node-renderer`：加载节点 ESM、提供共享 Runtime 并挂载节点 UI；
- `baseflow-nodes/*`：节点源码；
- `baseflow-preview`：三者联合构建后的本地静态预览。

## 环境要求

- Node.js `>=22.12`
- npm workspaces

首次安装依赖后，在仓库根目录准备低频公共资源：

```bash
npm install
npm run prepare:monaco
npm run build:shared
```

`prepare:monaco` 和 `build:shared` 不需要在每次开发时执行。只有相关生成物缺失，或 Monaco、共享依赖及其构建配置发生变化时才需要重新运行。

## 快速开始

在仓库根目录依次执行：

```bash
npm run build:nodes
npm run build:renderer
npm run build:demo
npm run build:verify
npm run preview
```

打开：

```text
http://localhost:4173/renderer/index.html#/nodes/break/index.js
```

`npm run preview` 只启动已有静态产物，不会自动构建。源码变化后，需要重新构建对应 workspace 并刷新页面。

当前根命令 `build:nodes` 只构建已经迁移的 `break` 节点。

## 开发一个官方节点

节点目录名是 node ID，使用 kebab-case：

```text
baseflow-nodes/example-node/
  package.json
  vite.config.ts
  tsconfig.json
  src/
    index.tsx
```

### 1. 声明 NodeManifest

`package.json` 至少遵循以下结构：

```json
{
  "name": "@baseflow-nodes/example-node",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "baseflow": {
    "runtimeVersion": 1
  },
  "scripts": {
    "build": "vite build",
    "type:check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "*",
    "react-dom": "*",
    "@baseflow/render-react": "*"
  }
}
```

`baseflow` 中还应包含节点类型、描述、默认数据和 executor 等业务元数据，可参考 `baseflow-nodes/break/package.json`。

所有新版官方节点必须显式声明 `runtimeVersion: 1`。只有历史产物允许缺少该字段；显式无效值或不受支持的版本会在加载节点 JavaScript 前被拒绝。

### 2. 使用统一 Vite 配置

```ts
import { defineNodeConfig } from "../../baseflow-node-renderer/scripts/defineNodeConfig.js";

export default defineNodeConfig(import.meta.dirname);
```

配置工厂统一处理：

- production JSX 和 ES2022；
- `process.env.NODE_ENV = "production"`；
- Runtime 共享依赖 external；
- CSS 内联和注入；
- 固定输出 `index.js`；
- 复制并校验 NodeManifest；
- 输出到 `baseflow-preview/nodes/<node-id>/`。

该配置工厂只用于仓库内的官方节点。社区节点可以使用其它构建工具，只要最终产物满足标准 ESM、NodeManifest 和 Runtime v1 入口约定。

### 3. 默认导出 React Component

```tsx
import type { INodeData } from "@baseflow/render-react";

export default function Properties({ nodeData }: { nodeData: INodeData }) {
  return <div>{nodeData.meta.name}</div>;
}
```

新节点必须使用 default export。renderer 暂时保留对部分历史导出形式的兼容，但它不属于新节点标准。

样式使用 SCSS Module。节点 CSS 会内联到 `index.js`，不要生成或依赖独立 CSS 入口。

## Runtime v1

Runtime v1 只提供五个公共 bare import：

| 模块 | 用途 |
| --- | --- |
| `react` | React 核心 API |
| `react/jsx-runtime` | production JSX runtime |
| `react-dom` | React DOM 公共 API |
| `react-dom/client` | `createRoot`、`hydrateRoot` |
| `@baseflow/render-react` | Baseflow 节点渲染 API |

这些模块由 renderer 的 Import Map 映射到同一套 shared 实例。以下入口不受支持：

```text
react/jsx-dev-runtime
react/compiler-runtime
react-dom/server
react-dom/static
react-dom/profiling
@baseflow/render-react/*
```

React、React DOM 的内部 `__*`、编译器和实验性 API 即使当前可以导出，也不属于稳定 Runtime ABI。

官方构建发现公共包的未登记子路径时会直接报错。

其它依赖默认打入节点 Bundle。社区节点也可以自行使用本地 chunk 或完整 HTTP(S) ESM URL，但平台不会代理、改写或检查完整依赖图。

## 平台与节点开发者的责任

平台负责：

- 提供 Runtime 版本和五个公共模块入口；
- 保持这些入口的共享单例关系；
- 加载前解析 NodeManifest 并检查 Runtime 版本；
- 展示 manifest、模块解析和节点加载错误。

节点开发者负责：

- 在目标浏览器中测试节点功能；
- 验证第三方依赖、CORS、MIME、CSP 和网络服务；
- 避免重复 React 和未登记 React 子路径；
- 保证外部 URL 的可用性与版本稳定性。

平台不提供能够发现所有社区节点兼容问题的严格 verify，也不会为社区节点自动补齐依赖或 polyfill。

## 构建命令

| 命令 | 作用 |
| --- | --- |
| `npm test` | 运行 Vitest |
| `npm run type:check` | 运行全仓 TypeScript 检查 |
| `npm run lint` | 运行 Biome 和 Stylelint |
| `npm run build:shared` | 重建 renderer shared |
| `npm run build:nodes` | 构建已迁移节点，当前只有 `break` |
| `npm run build:renderer` | 构建 renderer 并复制 shared |
| `npm run build:demo` | 生成 mock 并构建 demo |
| `npm run build:verify` | 只读校验联合预览产物 |
| `npm run preview` | 启动 `baseflow-preview` |

常见增量构建：

- 修改节点源码：构建该节点；
- 修改 NodeManifest：构建节点，再运行 `build:demo` 更新 mock；
- 修改 shared 版本、门面或配置：运行 `build:shared`，再构建 renderer 和已迁移节点；
- 修改 renderer：运行 `build:renderer`；
- 修改 demo：运行 `build:demo`。

完成后按变更范围运行测试、类型检查、Lint 和 `build:verify`。

## 产物与发布

本地 shared 位于：

```text
baseflow-node-renderer/public/shared/
```

entry 文件名包含实际安装版本，例如 `react@19.2.8.js`；shared chunk 使用内容 hash。这里是可覆盖的本地构建目录，entry 不需要额外增加 hash。

当前仓库没有生产发布脚本。未来线上应将 renderer、Import Map 和整个 shared 目录作为一个不可变 Runtime release 发布，例如：

```text
/runtime/v1/YYYYMMDDTHHmmssZ/
  index.html
  assets/
  shared/
```

时间戳使用 UTC。每次发布生成新目录，已经发布的目录不得覆盖。

## 当前限制

- 只有 `break` 完成官方浏览器 ESM 构建迁移；
- renderer 当前仍是通过 URL hash 加载节点、使用固定节点数据的调试壳；
- `vite dev` 不支持跨 workspace 动态加载节点，联合调试必须使用生产构建后的 preview；
- 独立域、安全隔离和更完整的真实环境测试将在后续专项处理。
