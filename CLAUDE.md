# baseflow-nodes 工作区规则

## 工程架构

- npm workspaces Monorepo；Node.js `>=22.12`，TypeScript `5.x`，React `19.x`，ESM，Vite `8.x`，Vitest `4.x`。
- 代码使用 Biome；样式使用 Sass 和 Stylelint。
- Package `widgets-antd`：供 demo 和 React 节点复用的 Ant Design 组件适配层。
- Package `baseflow-demo`：Web App 父页面，负责 Workflow 演示。
  - `baseflow-demo/public/node-render.html`：嵌入 demo 的 iframe 子页面，负责隔离运行和挂载节点 UI。
- Package `baseflow-nodes/*`：由 `node-render.html` 动态加载的节点物料。
- `baseflow-preview`：由 demo 与节点产物联合构成的静态目录，其 `preview` 命令在 `baseflow-demo/package.json` 中定义。

## preview 运行架构

```text
baseflow-demo
  └─ iframe: node-render.html
       └─ import: baseflow-nodes/*
```

> `node-render` iframe 由 `baseflow-demo` 页面动态创建，并通过父页面的 `postMessage` 事件驱动 node 动态 `import` 并执行。

baseflow-demo 父页面与 node-render 分属不同 JS Realm，不共享运行时实例；这是必须保留的运行隔离边界。当前本地 preview 是没有 `sandbox` 的同源 iframe，只提供 Realm、DOM 和 CSS 隔离，不视为恶意代码安全边界。联合调试统一走生产构建后的 `baseflow-preview`，不使用跨子项目的 Vite dev 动态加载。

## 项目定位

- 本项目提供用来开发 `baseflow-nodes/*` 节点的脚手架工程。
- `baseflow-preview/nodes/<node-id>/` 是节点的最终生产交付产物，发布为公开 npm package，并通过固定版本的 jsDelivr URL 提供 Manifest 和 ESM 入口。
- `baseflow-demo` 以及 `baseflow-preview` 中除 `nodes` 以外的内容仅用于配套演示，不属于节点生产交付产物。

## 构建契约

### 产物边界

- `baseflow-demo` 构建到 `baseflow-preview/`；清理 demo 产物时只保留 `nodes`。
- `baseflow-nodes/*` 节点构建到 `baseflow-preview/nodes/<node-id>/`，每个节点只拥有并清理自己的目录。
- `baseflow-preview` 由 demo 与节点产物联合构建，禁止手工修改。

### 节点物料

- 节点文件夹名是 node ID 的唯一事实来源，必须为 kebab-case。
- 仓库内使用 React 的 UI 节点统一使用 `scripts/defineNodeConfig.js`：

```ts
export default defineNodeConfig(import.meta.dirname);
```

- 节点产物必须有 `package.json`，其中的 `baseflow` 字段作为 Manifest，定义节点的`元数据`信息。
- `manifest.ts` 必须 default export 对象，只允许 `import type`；`runtimeVersion` 由根 `package.json#baseflowRuntimeVersion` 统一注入。
- 单节点构建由节点 `package.json` 的 `scripts.build` 定义：第一步运行 `node ../../scripts/buildNodeManifest.js` 生成元数据，有 UI 时第二步再运行 `vite build`。
- 某些节点需要渲染 UI 界面，`index.js` 为其 UI Render 入口，必须是标准 ESM，并 default export 一个无参数的 `自启动函数`，该函数将被 `baseflow-demo/public/node-render.html` 中的 postMessage 触发加载和渲染。
  - UI Render 允许生成额外 chunk、也允许动态 import 其它 ESM CDN 包，但入口只认 `index.js` 默认导出的`自启动函数`
  - 例如 `baseflow-nodes/branch` 为具有 UI 界面的节点
- 某些节点不需要 UI 界面，只需要 `manifest.ts` 定义`元数据`信息。
  - 例如 `baseflow-nodes/break` 为无 UI 界面的节点
- 节点 `package.json` 中存在非空 `scripts.build` 即视为已准备好，由 `scripts/buildNodes.js` 自动发现。

### Monaco

- Monaco 复制到带版本号的 `baseflow-demo/public/monaco/monaco-editor@<version>`，该目录不入库，也不属于 demo 的日常 dev/build 流程。
- 首次检出、生成目录丢失或 `monaco-editor` 版本变化时，在根目录执行 `npm run prepare:monaco`；命令始终覆盖目标版本目录。
- `index.html` 和 `monaco.js` 为手写文件，不得覆盖；升级 Monaco 后手工删除旧版本目录，并同步 `index.html` 中的版本目录引用。

## 构建与验证

根级准备和构建命令必须在仓库根目录执行。单节点可在自身目录中运行 `npm run build`，直接构建到 `baseflow-preview/nodes/<node-id>/`。

### 低频外围依赖

外围依赖只在首次准备、生成物缺失或相关依赖/配置变化时更新：

- `prepare:monaco`：更新 demo 的本地 Monaco 公共资源。

### 日常项目构建

节点和 demo 可以分别构建；联合刷新时必须先构建节点产物，再构建依赖这些产物生成 mock 的 demo：

```bash
npm run build:nodes
npm run build:demo
```

- `build:nodes`：由 `scripts/buildNodes.js` 发现并依次构建包含 `scripts.build` 的节点，每个节点只清理自己的产物目录。
- `build:demo`：清理 demo 自有产物、根据节点产物生成 mock 并构建父页面，不处理 Monaco。
- `npm run preview` 只启动生产预览，不执行构建。
- 按变更范围运行 `npm run type:check`、`npm run lint`、`npm test` 和相关构建；不额外引入 `tsc --checkJs` 验收要求。

## 编码约定

- 常量、组件和 SCSS 本地基类使用 PascalCase；文件、变量和函数使用 camelCase；模块 ID 使用 kebab-case。
- TypeScript 保持 `strict: true` 和 `erasableSyntaxOnly: true`。类型设计优先实用与可读，避免过度复杂的泛型；必要时可简化接口、显式断言或少量使用 `any`。
- 普通代码不写解释性注释；只为复杂、模糊或易错的关键逻辑添加简洁注释。
- 每个模块原则上只导出一个 SCSS 本地基类；内部元素使用 BEM 后缀，React 以 `${styles.Module}__element` 引用。
- `.role`、`.link`、`.on` 等短 class 必须位于模块命名空间下，不得跨模块引用，也不得作为运行时或 E2E 选择器。

## 操作边界

- 发现与当前任务相关的错误或优化点时在交付中报告；写入 `optimize.md` 前先确认。
- 以下情况必须先确认：与设计文档冲突；安装、升级或变更依赖；删除用途不明的文件或代码；歧义会影响兼容性或导致不可逆结果；需要在代码与文档之间取舍。
- 不默认写入 memory。只有信息极其重要、跨会话稳定且无法从代码或文档推导时才考虑，写入前必须确认。
- 不得擅自执行改变 Git 状态的操作，包括 `add`、`commit`、回滚等；允许使用 `status`、`diff`、`log` 等只读命令。
- 优先使用中文沟通。
