# baseflow-nodes 工作区规则

## 工程架构

- npm workspaces Monorepo；Node.js `>=22.12`，TypeScript `5.x`，React `19.x`，ESM，Vite `8.x`，Vitest `4.x`。
- 代码使用 Biome；样式使用 Sass 和 Stylelint。
- Package `baseflow-demo`：Web App 父页面，负责 Workflow 演示。
  - `baseflow-demo/public/node-render.html`：嵌入 demo 的 iframe 子页面，负责隔离运行和挂载节点 UI。
- Package `baseflow-nodes/*`：由 `node-render.html` 动态加载的节点物料。
- `baseflow-preview`：由以上 2 者联合构建后的静态目录，其 `preview` 命令在 `baseflow-demo/package.json` 中定义。

## preview 运行架构

```text
baseflow-demo
  └─ iframe: node-render.html
       └─ import: baseflow-nodes/*
```

> `node-render` iframe 由 `baseflow-demo` 页面动态创建，并通父页面的 `postMessage` 事件来驱动 node 动态 `import` 并执行。

baseflow-demo 父页面与 node-render 分属不同 JS Realm，不共享运行时实例；这是必须保留的运行隔离边界。当前本地 preview 是没有 `sandbox` 的同源 iframe，只提供 Realm、DOM 和 CSS 隔离，不视为恶意代码安全边界。联合调试统一走生产构建后的 `baseflow-preview`，不使用跨子项目的 Vite dev 动态加载。

## 项目定位

- 本项目提供用来开发 `baseflow-nodes/*` 节点的脚手架工程，通过构建得到各 node 的最终生产交付产物。
- `baseflow-demo` 及 `baseflow-preview` 仅作为配套演示，不代表最终生产交付产物。

## 构建契约

### 产物边界

- `baseflow-demo` 构建到 `baseflow-preview/`；清理时保留 `nodes`。
- `baseflow-nodes/*` 节点构建到 `baseflow-preview/nodes/<node-id>/`，每个节点只拥有并清理自己的目录。
- `baseflow-preview` 由以上 2 者联合构建，禁止手工修改；

### 节点物料

- 节点文件夹名是 node ID 的唯一事实来源，必须为 kebab-case。
- Vite 配置统一使用 `baseflow-node-renderer/scripts/defineNodeConfig.js`：

```ts
export default defineNodeConfig(import.meta.dirname);
```

- 节点产物为 `index.js` 和 `package.json`：CSS 内联到 JS 并自行注入，`package.json` 的 `baseflow` 字段作为 NodeManifest。
- 新节点入口必须是目标浏览器可加载的标准 ESM，并 default export renderer 可挂载的 React Component；`mod.default ?? mod` 只用于历史产物兼容，不属于新节点标准。
- 新版官方构建要求 NodeManifest 显式声明当前 `baseflow.runtimeVersion`；历史产物缺少该字段时固定按 Runtime v1 加载，显式无效值或不支持的版本在 import 节点入口前拒绝。
- renderer 根据节点入口计算同目录 `package.json`，先解析 `baseflow` manifest 和检查 Runtime，再 import `index.js`；失败时展示原始错误，不自动改写依赖、回退版本或修复节点。
- 官方节点构建固定 production JSX、ES2022 和 `process.env.NODE_ENV = "production"`；该配置不为任意依赖提供完整 `process.env` polyfill。
- `index.js` 文件名由构建工厂强制固定；节点包仍应遵循仓库 ESM 约定，声明 `"type": "module"`。
- 当前只有 `break` 完成浏览器 ESM 构建试点；其它节点接入时复用配置工厂并补齐 `build` 脚本。

### Monaco

- Monaco 复制到带版本号的 `baseflow-demo/public/monaco/monaco-editor@<version>`，该目录不入库，也不属于 demo 的日常 dev/build 流程。
- 首次检出、生成目录丢失或 `monaco-editor` 版本变化时，在根目录执行 `npm run prepare:monaco`；命令始终覆盖目标版本目录。
- `index.html` 和 `monaco.js` 为手写文件，不得覆盖；升级 Monaco 后手工删除旧版本目录，并同步 `index.html` 中的版本目录引用。

## 构建与验证

所有准备和构建子命令必须在仓库根目录执行，并会在写入前校验执行目录。根命令直接调用对应 workspace，当前不提供总构建命令。

### 低频外围依赖

外围依赖只在首次准备、生成物缺失或相关依赖/配置变化时更新：

- `prepare:monaco`：更新 demo 的本地 Monaco 公共资源。

### 日常项目构建

node 物料、renderer 和 demo 的构建输入和输出互相独立，可任意排序或分别执行；需联合刷新时建议执行：

```bash
npm run build:nodes
npm run build:demo
```

- `build:nodes`：按 `scripts/migratedNodes.js` 发现的清单构建已迁移节点（当前只有 `break`），不清理其它旧节点目录；节点是否已迁移以 `package.json` 的 `"build": "vite build"` 为准。
- `build:demo`：生成 mock、清理 demo 自有产物并构建父页面，不处理 Monaco。
- `npm run preview` 只启动生产预览，不执行构建。
- 按变更范围运行 `npm run type:check`、Biome、Stylelint 和相关构建；不额外引入 `tsc --checkJs` 验收要求。

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
