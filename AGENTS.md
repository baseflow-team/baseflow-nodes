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

父页面与 renderer 分属不同 JS Realm，不共享运行时实例；这是必须保留的运行隔离边界。当前本地 preview 是没有 `sandbox` 的同源 iframe，只提供 Realm、DOM 和 CSS 隔离，不视为恶意代码安全边界。联合调试统一走生产构建后的 `baseflow-preview`，不使用跨子项目的 Vite dev 动态加载。

- 当前 renderer 是通过 URL hash 加载节点、使用固定节点数据的 Runtime 调试壳；正式的节点身份、节点数据和跨窗口交互协议尚未落地。
- 独立域部署、消息鉴权、CSP、Permissions Policy 和更严格的安全隔离属于后续专项，当前不得描述为已实现能力。

## 构建契约

### 产物边界

- `baseflow-node-renderer/runtimeContract.js` 的 `RuntimeVersion` 是当前分支 Runtime ABI 的唯一全局配置；一个分支只维护一个 Runtime ABI，不配置多版本映射。
- 该模块同时被构建脚本和浏览器代码 import，因此**不得引入 JSON module 或任何 Node 专属依赖** —— 从 package.json 读配置会把整份 package.json 连同构建期校验代码打进 renderer 和 demo 产物。
- 构建配置、demo iframe 地址和产物校验必须复用它，不得复制版本或 Runtime 路径。
- demo 构建到 `baseflow-preview/`；清理时保留 `nodes` 和 `runtime`。
- renderer 直接构建到 `baseflow-preview/runtime/v<runtimeVersion>/`，本地每次清空重建。Runtime 路径只包含 ABI 版本，不包含 release 身份。
- 节点构建到 `baseflow-preview/nodes/<node-id>/`，每个节点只拥有并清理自己的目录。
- `baseflow-preview` 是生成产物，禁止手工修改；源码变更后重建对应 workspace。
- 当前仓库没有生产上传或发布脚本；本地构建已使用生产目标目录结构，但 `baseflow-preview` 不承担线上版本存档职责。

### 节点物料

- 节点文件夹名是 node ID 的唯一事实来源，必须为 kebab-case。
- Vite 配置统一使用 `baseflow-node-renderer/scripts/defineNodeConfig.js`：

```ts
export default defineNodeConfig(import.meta.dirname);
```

- 工厂根据包目录确定 Vite root、Rolldown cwd、入口、manifest 和 outDir，不得重新引入对命令 cwd 的依赖。
- 节点产物为 `index.js` 和 `package.json`：CSS 内联到 JS 并自行注入，`package.json` 的 `baseflow` 字段作为 NodeManifest。
- 新节点入口必须是目标浏览器可加载的标准 ESM，并 default export renderer 可挂载的 React Component；`mod.default ?? mod` 只用于历史产物兼容，不属于新节点标准。
- 新版官方构建要求 NodeManifest 显式声明当前 `baseflow.runtimeVersion`；历史产物缺少该字段时固定按 Runtime v1 加载，显式无效值或不支持的版本在 import 节点入口前拒绝。
- renderer 根据节点入口计算同目录 `package.json`，先解析 `baseflow` manifest 和检查 Runtime，再 import `index.js`；失败时展示原始错误，不自动改写依赖、回退版本或修复节点。
- 官方节点构建固定 production JSX、ES2022 和 `process.env.NODE_ENV = "production"`；该配置不为任意依赖提供完整 `process.env` polyfill。
- `index.js` 文件名由构建工厂强制固定；节点包仍应遵循仓库 ESM 约定，声明 `"type": "module"`。
- 当前只有 `break` 完成浏览器 ESM 构建试点；其它节点接入时复用配置工厂并补齐 `build` 脚本。

### 共享依赖

- Runtime v1 只共享 `react`、`react/jsx-runtime`、`react-dom`、`react-dom/client` 和 `@baseflow/render-react` 五个完整 bare import；不提供包名前缀映射，`@baseflow/flow-react` 不共享。
- `baseflow-node-renderer/runtimeContract.js` 是 Runtime 版本、派生 Runtime 路径、历史缺省版本和五个公共模块 ID 的唯一契约源。
- `baseflow-node-renderer/scripts/sharedDependencies.js` 在 Runtime 契约上补充包版本、门面源码和入口名，驱动 shared entry 与 external；Import Map 的目标文件名带内容哈希，只能由 shared 构建产出的 `baseflow-node-renderer/sharedManifest.json` 提供，禁止在其它构建配置里复制公共模块列表或拼接产物文件名。
- 官方节点和 renderer 只将五个完整入口标记为 external；公共包的未登记子路径在构建期拒绝，其它运行时依赖默认打入节点 Bundle。renderer 仅允许将 `@baseflow/render-react/style.css` 作为私有样式打入自身产物。
- shared 先构建到 `baseflow-node-renderer/public/shared/`，再由 renderer 复制到 preview。`public/shared` 和 `sharedManifest.json` 纳入 Git 跟踪，但只能通过 `build:shared` 更新。
- Runtime 目录不再提供不可变身份，因此 `/runtime/v<n>/` 下**全部生成文件必须内容寻址**：shared 入口为 `<name>@<version>-<hash>.js`（版本名保留，便于在 devtools 里辨认实际加载的包），chunk 和 renderer assets 同样带哈希。禁止为了减少 Git 噪音去掉入口哈希 —— 去掉后同名文件在两次构建间字节可变，客户端缓存会静默错配。
- `package.json` 的 semver range 不代表 Runtime 可以自动漂移；实际 shared 版本由 lockfile、安装结果和生成产物共同确定，共享依赖升级必须按 Runtime ABI 兼容性判断。
- Import Map 仅在 build 时动态注入。renderer 的 `vite dev` 不支持加载节点物料，联合调试使用生产预览。
- `@baseflow/render-react/style.css` 由 renderer 统一加载，节点不重复导入。修改共享依赖、版本或 ESM 门面导出后，重建 renderer 和全部已接入节点；React 版本变化还需核对门面显式导出。
- shared 在本地构建，不依赖在线 npm-to-ESM 服务；门面需保持锁定 production 包的公开 named/default export 语义，不输出值为 `undefined` 的伪 API。当前包导出对比只校验门面完整性，不等价于证明社区节点完整兼容。

### Runtime ABI 演进

- `runtimeVersion` 表示节点可观察的 Runtime 契约，不表示构建工具版本、依赖包版本、文件内容或某次 release。Vite、Rollup、helper、chunk 划分、文件 hash 或 shared 字节变化后，只要既有契约保持兼容，仍使用 Runtime v1，直接向 v1 目录发布新一批内容寻址文件；历史节点不重建。
- 当前分支的 `runtimeVersion` 只在发生不可兼容 ABI 变化时修改；兼容实现更新不改路径，只改变 `/runtime/v1/` 下的文件内容与 `index.html` 的引用。未来 Runtime v2 在独立分支维护，不在同一分支同时构建或加载 v1、v2。
- Runtime 路径只按 ABI 版本寻址，父页面可由节点 manifest 的 `runtimeVersion` 直接拼出 renderer 地址（`/runtime/v<n>/index.html`），无需查表或重定向；多 ABI 并存时的取值仍属于父页面协议，当前分支只产出自己这一套。
- 以下情况属于可观察 Runtime ABI 破坏性变化，需要升级 Runtime v2：
  - 删除或重命名五个公共模块入口之一；
  - 删除稳定的 named/default export，或改变其关键语义；
  - 破坏 React、React DOM 与 `@baseflow/render-react` 的共享单例关系；
  - 改变 NodeManifest、节点加载、default export、挂载参数等协议，导致历史 v1 节点不能继续加载或运行；
  - 新增旧 v1 release 不提供、且允许新节点依赖的必需公共入口或能力。
- React、React DOM 的内部 `__*`、编译器、实验性和 `unstable_*` API 不属于稳定 ABI，其变化不自动触发 Runtime 升级。
- 发生潜在不兼容时，优先修正门面或构建配置以继续满足 v1；只有无法保持既有契约时才发布 v2，并保留 v1，不要求历史节点重新构建。

### 社区节点边界

- 平台只负责 Runtime 版本、五个公共入口、共享单例、加载前 manifest 检查和原始加载错误展示，不扫描或验证社区节点的完整依赖图。
- 官方 Vite 工厂和严格 external 只约束仓库内官方节点，不作为社区节点发布门禁；社区节点可以使用其它构建工具，只要最终产物满足标准 ESM、NodeManifest 和 Runtime 入口约定。
- 除五个公共 bare import 外，节点可以携带相对 URL 的本地 chunk，或静态、动态 import 完整 HTTP(S) ESM URL；其它未登记 bare import 由浏览器按标准模块解析规则报错，平台不代理、不改写、不自动补齐。
- 第三方依赖、重复 React、CORS、MIME、CSP、外部 URL 稳定性、浏览器能力和性能由节点开发者自行测试和保证；平台不提供能够发现所有问题的严格 verify 或兼容兜底。

### Runtime release 与生产发布

- renderer 构建已将 Import Map、assets 和整个 shared 目录直接产出到 `/runtime/v<runtimeVersion>/`；目录根下就是 `index.html`、`assets/` 和 `shared/`。
- 发布单元不再是一个目录，而是「一份 `index.html` 及它引用的全部内容寻址文件」：`index.html` 可变且**不做长期缓存**，其余文件按哈希不可变、可长期缓存。
- 不再维护任何形式的 release ID：构建身份就是 `index.html` 里的哈希文件名，比对客户端与线上当前 `index.html` 即可判断是否为旧版本。构建因此保持确定性 —— 同源码两次构建产物应当逐字节一致，不得注入时间戳一类的非确定内容。将来若需要可读的发布标识，由发布流水线用它自己的 git SHA 或构建号盖戳，不进 Runtime 契约。
- **生产发布是增量上传 + 延迟回收，不是清空重建**：新哈希文件先传、`index.html` 最后传；旧哈希文件需保留一段时间再回收，否则已打开的页面和尚未过期的旧 `index.html` 会 404。本地 `emptyOutDir` 清空重建只适用于可丢弃的 preview。
- 一个分支和一个 renderer 实例只对应 Runtime 契约指定的一套 ABI；不同 ABI 的路由和历史文件的回收属于部署层职责，不在当前分支维护版本映射。
- 回滚方式是重新发布旧的 `index.html`（其引用的哈希文件仍在），因此 CI 需存档历次 `index.html`；该目录布局不支持灰度或并行 release，若将来需要按流量分流，必须重新引入路径级 release 身份。
- 当前仓库只负责生成该目录，不负责上传、切流、回滚或清理线上文件。
- 正式节点使用“节点 ID + 精确版本”或“节点 ID + 内容哈希”作为不可变身份；同一身份下的 `index.js`、`package.json` 和私有 chunk 不覆盖。节点外部 URL 的不可变性由开发者负责。

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
- `build:shared`：重建纳入 Git 跟踪的 `public/shared` 与 `sharedManifest.json`，版本、共享表、ESM 门面或 shared 配置变化时执行；它不写入 preview，更新后需再构建 renderer。入口带内容哈希，任何一次内容变化都会改名，Git 上表现为增删而非修改。

### 日常项目构建

node 物料、renderer 和 demo 的构建输入和输出互相独立，可任意排序或分别执行；需联合刷新时建议执行：

```bash
npm run build:nodes
npm run build:renderer
npm run build:demo
npm run build:verify
```

- `build:nodes`：按 `scripts/migratedNodes.js` 发现的清单构建已迁移节点（当前只有 `break`），不清理其它旧节点目录；同一份清单也驱动 `build:verify`，不再两处硬编码。节点是否已迁移以 `package.json` 的 `"build": "vite build"` 为准。
- `build:renderer`：校验已准备的 `public/shared` 与 `sharedManifest.json`，再按 Runtime 契约清理并构建当前 Runtime 目录，同时复制 shared 并按 manifest 注入 Import Map。
- `build:demo`：生成 mock、清理 demo 自有产物并构建父页面，不处理 Monaco。
- `build:verify`：最后只读校验 HTML 资源、demo 的当前 Runtime 引用、Import Map、shared 入口（含残留入口检查）、产物依赖图、Monaco 和已迁移节点产物，不构建、不修复，也不等价于真实浏览器、跨域或外部 ESM 兼容测试。
- 依赖图校验沿**静态 import** 遍历：相对引用必须存在，bare 引用必须是五个公共入口之一，绝对路径引用一律拒绝。动态 `import()` 在静态分析中不可见，因此它不是完整门禁，不能据此断言产物没有未登记依赖。
- `npm run preview` 只启动生产预览，不执行构建。
- 增量构建只运行发生变化的项目；shared 更新后必须再运行 `build:renderer`（入口改名后旧 Import Map 会失效），节点 manifest 变更还需运行 `build:demo` 刷新 mock。
- `runtimeContract.js` 的 `RuntimeVersion` 变化后必须同时重建 renderer 和 demo，并同步官方节点 manifest、重建全部官方节点。
- 当前完整链路使用 `http://localhost:4173/runtime/v1/index.html#/nodes/break/index.js` 验证；该 URL 不随构建变化。预览期间重建后需刷新，缓存未更新时硬刷新。
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
