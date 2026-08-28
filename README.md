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
http://localhost:4173/runtime/v1/index.html#/nodes/break/index.js
```

`npm run preview` 只启动已有静态产物，不会自动构建。源码变化后，需要重新构建对应 workspace 并刷新页面。

`build:nodes` 自动发现已迁移节点，判定依据是 `package.json` 的 `"build": "vite build"`，当前只有 `break`。同一份清单也驱动 `build:verify`，新节点接入后两处一起生效，不需要改构建脚本。

当前 Runtime 的 ABI 版本定义在 `baseflow-node-renderer/runtimeContract.js`：

```js
export const RuntimeVersion = 1;
```

renderer 输出目录、demo iframe 地址和 `build:verify` 校验目标都会从这里派生，不需要维护第二套本地路径或环境变量。Runtime 地址只包含 ABI 版本，不随构建变化。

该模块被构建脚本和浏览器代码共同 import，所以它只放常量，不读 package.json、不依赖任何 Node API。

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
| `npm run build:verify` | 只读校验联合预览产物、当前 Runtime 引用和产物静态依赖图 |
| `npm run preview` | 启动 `baseflow-preview` |

常见增量构建：

- 修改节点源码：构建该节点；
- 修改 NodeManifest：构建节点，再运行 `build:demo` 更新 mock；
- 修改 shared 版本、门面或配置：运行 `build:shared`，再构建 renderer 和已迁移节点；
- 修改 renderer：运行 `build:renderer`；
- 修改 demo：运行 `build:demo`。
- 修改 `runtimeContract.js` 的 `RuntimeVersion`：重新构建 renderer 和 demo，并同步、重建全部官方节点。

完成后按变更范围运行测试、类型检查、Lint 和 `build:verify`。

## 产物与发布

本地 shared 位于：

```text
baseflow-node-renderer/public/shared/
```

entry 文件名同时包含实际安装版本和内容 hash，例如 `react@19.2.8-Rkl2T_TQ.js`；chunk 同样带 hash。实际文件名由 `build:shared` 写入 `baseflow-node-renderer/sharedManifest.json`，Import Map 和产物校验都从这份清单读取，不再从依赖表拼接。

renderer 构建会将页面、Import Map、assets 和整个 shared 目录直接写入当前 Runtime 目录：

```text
baseflow-preview/
  runtime/v1/
    index.html
    assets/
    shared/
```

这与未来线上 `/runtime/v1/` 使用同一套布局：**路径只表示 ABI 版本，不表示某次发布**。因此父页面可以直接由节点 manifest 的 `runtimeVersion` 拼出 renderer 地址，不需要查表或重定向。

发布身份改由内容承担：

- `index.html` 可变，必须 `no-cache` 或短 TTL；
- 其余文件全部内容寻址，可长期缓存（`immutable`）；
- 没有独立的 release ID —— `index.html` 里的哈希文件名就是构建身份，比对客户端与线上当前 `index.html` 即可判断是否为旧版本。构建保持确定性：同源码两次构建产物逐字节一致。

线上发布必须是**增量上传 + 延迟回收**：先传新哈希文件、最后传 `index.html`；旧哈希文件保留一段时间再回收，否则已打开的页面会 404。本地 preview 是可丢弃目录，构建时清空重建。

`runtimeVersion` 只在五个公共入口、共享单例、NodeManifest 或节点加载协议发生破坏性变化时升级。Vite、依赖版本、chunk 或文件内容变化，只要历史节点仍兼容，就保持 Runtime v1，直接向 v1 目录发布新一批文件。未来 Runtime v2 在独立分支维护；同一分支不同时维护多个 Runtime ABI。

当前仓库没有上传、切流或回滚生产 Runtime 的发布脚本。回滚方式是重新发布旧的 `index.html`（其引用的哈希文件仍在），这要求 CI 存档历次 `index.html`；该布局不支持灰度或并行 release。

## 当前限制

- 只有 `break` 完成官方浏览器 ESM 构建迁移；
- renderer 当前仍是通过 URL hash 加载节点、使用固定节点数据的调试壳；
- `vite dev` 不支持跨 workspace 动态加载节点，联合调试必须使用生产构建后的 preview；
- 独立域、安全隔离和更完整的真实环境测试将在后续专项处理。
