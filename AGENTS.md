# baseflow-nodes 工作区规则

## 技术与架构

- npm workspaces Monorepo；Node.js `>=22.12`，TypeScript `5.x`，React `19.x`，ESM，Vite `8.x`，Vitest `4.x`。
- 代码使用 Biome；样式使用 Sass 和 Stylelint。
- `baseflow-demo`：Web App 父页面，负责 Workflow 演示。
- `baseflow-node-renderer`：嵌入 demo 的 iframe 子页面，负责隔离运行和挂载节点 UI。
- `baseflow-nodes/*`：由 renderer 加载的节点物料，不独立运行。
- `baseflow-preview`：demo、renderer 和节点的联合静态产物目录。

```text
baseflow-demo
  └─ iframe: baseflow-node-renderer
       └─ baseflow-nodes/*
```

父页面与 renderer 分属不同 JS Realm，不共享运行时实例；这是必须保留的沙箱边界。联合调试统一走生产构建后的 `baseflow-preview`，不使用跨子项目的 Vite dev 动态加载。

## 构建契约

### 产物边界

- demo 构建到 `baseflow-preview/`；清理时保留 `nodes` 和 `renderer`。
- renderer 构建到 `baseflow-preview/renderer/`，该目录每次清空重建。
- 节点构建到 `baseflow-preview/nodes/<node-id>/`，每个节点只拥有并清理自己的目录。
- `baseflow-preview` 是生成产物，禁止手工修改；源码变更后重建对应 workspace。

### 节点物料

- 节点文件夹名是 node ID 的唯一事实来源，必须为 kebab-case。
- Vite 配置统一使用 `baseflow-node-renderer/scripts/defineNodeConfig.js`：

```ts
export default defineNodeConfig(import.meta.dirname);
```

- 工厂根据包目录确定 Vite root、Rolldown cwd、入口、manifest 和 outDir，不得重新引入对命令 cwd 的依赖。
- 节点产物为 `index.js` 和 `package.json`：CSS 内联到 JS 并自行注入，`package.json` 的 `baseflow` 字段作为 NodeManifest。
- `index.js` 文件名由构建工厂强制固定；节点包仍应遵循仓库 ESM 约定，声明 `"type": "module"`。
- 当前只有 `break` 完成浏览器 ESM 构建试点；其它节点接入时复用配置工厂并补齐 `build` 脚本。

### 共享依赖

- renderer iframe 内仅共享 `react`、`react-dom`、`@baseflow/render-react` 及已登记子路径；`@baseflow/flow-react` 不共享，其它运行时依赖打入节点 Bundle。
- `baseflow-node-renderer/scripts/sharedDependencies.js` 是共享依赖的唯一配置源，同时驱动 shared entry、external 和 Import Map；禁止在其它配置里复制列表。
- shared 先构建到 `baseflow-node-renderer/public/shared/`，再由 renderer 复制到 preview。`public/shared` 纳入 Git 跟踪，但只能通过构建更新。
- shared 入口文件名包含实际安装版本，如 `react-dom@19.2.8.js`；共享 chunk 使用内容哈希。
- Import Map 仅在 build 时动态注入。renderer 的 `vite dev` 不支持加载节点物料，联合调试使用生产预览。
- `@baseflow/render-react/style.css` 由 renderer 统一加载，节点不重复导入。修改共享依赖、版本或 ESM 门面导出后，重建 renderer 和全部已接入节点；React 版本变化还需核对门面显式导出。

### Monaco

- Monaco 复制到带版本号的 `baseflow-demo/public/monaco/monaco-editor@<version>`，该目录不入库，也不属于 demo 的日常 dev/build 流程。
- 首次检出、生成目录丢失或 `monaco-editor` 版本变化时，在根目录执行 `npm run prepare:monaco`；命令始终覆盖目标版本目录。
- `index.html` 和 `monaco.js` 为手写文件，不得覆盖；升级 Monaco 后手工删除旧版本目录，并同步 `index.html` 中的版本目录引用。

## 构建与验证

所有准备和构建子命令必须在仓库根目录执行，并会在写入前校验执行目录。根命令直接调用对应 workspace，当前不提供总构建命令。

### 低频外围依赖

外围依赖只在首次准备、生成物缺失或相关依赖/配置变化时更新：

```bash
npm run prepare:monaco
npm run build:shared
```

- `prepare:monaco`：更新 demo 的本地 Monaco 公共资源。
- `build:shared`：重建纳入 Git 跟踪的 `public/shared`，版本、共享表、ESM 门面或 shared 配置变化时执行；它不写入 preview，更新后需再构建 renderer。

### 日常项目构建

node 物料、renderer 和 demo 的构建输入和输出互相独立，可任意排序或分别执行；需联合刷新时建议执行：

```bash
npm run build:nodes
npm run build:renderer
npm run build:demo
npm run build:verify
```

- `build:nodes`：构建已迁移节点，当前只包含 `break`；不清理其它旧节点目录。
- `build:renderer`：校验已准备的 `public/shared`，再清理并构建 renderer，同时复制 shared 和注入 Import Map。
- `build:demo`：生成 mock、清理 demo 自有产物并构建父页面，不处理 Monaco。
- `build:verify`：最后只读校验 HTML 资源、Import Map、shared 入口、Monaco 和已迁移节点产物，不构建、不修复。
- `npm run preview` 只启动生产预览，不执行构建。
- 增量构建只运行发生变化的项目；shared 更新后必须再运行 `build:renderer`，节点 manifest 变更还需运行 `build:demo` 刷新 mock。
- 完整链路使用 `http://localhost:4173/renderer/index.html#/nodes/break/index.js` 验证。预览期间重建后需刷新，缓存未更新时硬刷新。
- 按变更范围运行 `npm run type:check`、Biome、Stylelint 和相关构建；不额外引入 `tsc --checkJs` 验收要求。

## 编码约定

- 常量、组件和 SCSS 本地基类使用 PascalCase；文件、变量和函数使用 camelCase；模块 ID 使用 kebab-case。
- TypeScript 保持 `strict: true` 和 `erasableSyntaxOnly: true`。类型设计优先实用与可读，避免过度复杂的泛型；必要时可简化接口、显式断言或少量使用 `any`。
- 普通代码不写解释性注释；只为复杂、模糊或易错的关键逻辑添加简洁注释。
- 每个模块原则上只导出一个 SCSS 本地基类；内部元素使用 BEM 后缀，React 以 `${styles.Module}__element` 引用。
- `.role`、`.link`、`.on` 等短 class 必须位于模块命名空间下，不得跨模块引用，也不得作为运行时或 E2E 选择器。
- `globals.css` 只保留设计变量、reset、基础排版和公共骨架；全局 class 必须以 `g-` 开头，其它样式放入所属 SCSS Module。

## 操作边界

- 发现与当前任务相关的错误或优化点时在交付中报告；写入 `optimize.md` 前先确认。
- 以下情况必须先确认：与设计文档冲突；安装、升级或变更依赖；删除用途不明的文件或代码；歧义会影响兼容性或导致不可逆结果；需要在代码与文档之间取舍。
- 不默认写入 memory。只有信息极其重要、跨会话稳定且无法从代码或文档推导时才考虑，写入前必须确认。
- 不得擅自执行改变 Git 状态的操作，包括 `add`、`commit`、回滚等；允许使用 `status`、`diff`、`log` 等只读命令。
- 优先使用中文沟通。
