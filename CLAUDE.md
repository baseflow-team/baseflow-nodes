# baseflow-nodes 工作区规则

## 工作区事实

- 仓库结构：基于 npm workspaces 的 Monorepo，包含 `baseflow-demo`、`baseflow-nodes/*`、`baseflow-node-renderer`、`baseflow-preview` 等子项目
- Node.js：`>=22.12`
- TypeScript：`5.x`
- React：`19.x`
- 模块系统：ESM
- 代码 Lint/format：Biome
- CSS：Sass
- CSS Lint/format：Stylelint
- Vite：`8.x`
- Vitest：`4.x`

## Monorepo 说明

- `baseflow-demo` 是 Web App 父页面，提供一个简单的 Workflow 运行演示；生产构建为静态入口 Bundle，不直接通过原生 ESM 动态加载节点 UI。
- `baseflow-nodes/*` 是多个独立的节点物料子包，由节点渲染基座加载，通过基座间接服务于父页面，不能独立运行。
- `baseflow-node-renderer` 是嵌入 `baseflow-demo` 的 iframe 子页面，作为节点渲染基座独立渲染节点物料 UI，与父页面保持脚本和样式隔离。
- 当前开发模式不采用跨子项目动态加载资源；联合演示统一将 `baseflow-demo`、`baseflow-node-renderer` 和 `baseflow-nodes/*` 构建到 `./baseflow-preview`，通过生产预览运行。

## Node UI 构建与运行边界

```text
baseflow-demo（父页面）
  └─ iframe
      └─ baseflow-node-renderer（节点渲染基座）
          └─ baseflow-nodes/*（节点物料）
```

- `baseflow-demo`：父页面。
- `baseflow-node-renderer`：节点渲染基座，负责隔离运行、共享依赖、动态加载和挂载节点 UI。
- `baseflow-nodes/*`：节点物料，由节点渲染基座加载，不独立运行。
- `baseflow-node-renderer` 构建到 `./baseflow-preview/renderer`，节点物料构建为 `./baseflow-preview/nodes/<node-id>/`，由节点渲染基座在 iframe 内动态加载 `index.js`。
- 节点物料的产物是 `index.js` 和 `package.json` 两个文件：前者已把 CSS 内联进 JS 自行注入（基座只动态 import JS，不会加载同目录 CSS），后者供父页面以 JSON module 读取 `baseflow` 字段作为 NodeManifest。
- 父页面与节点渲染基座分属不同 JS Realm，这是刻意保留的沙箱边界；二者不共享运行时依赖，后续通过 `postMessage` 协议通信。
- 节点渲染基座 iframe 内仅将 `react`、`react-dom`、`@baseflow/render-react` 作为单例共享依赖，通过 Import Map 统一加载；相关子路径（如 `react/jsx-runtime`、`react-dom/client`）遵循同一映射。
- `@baseflow/render-react/style.css` 由节点渲染基座统一加载，节点物料无需重复加载。
- `@baseflow/flow-react` 明确不共享；除上述三个包外，节点物料的其它运行时依赖均打入各自 Bundle。
- 节点物料的 Vite 配置统一由 `baseflow-node-renderer/scripts/defineNodeConfig.js` 工厂生成，节点自身的 `vite.config.ts` 只需 `export default defineNodeConfig(import.meta.dirname)`。节点 ID 由文件夹名推导并强校验 kebab-case——`outDir` 是清空式构建的目标，ID 为空会退化成清空整个 `nodes` 目录。节点的 Vite root、入口、manifest 和 outDir 均由传入的包目录生成，不依赖构建命令的 cwd；入口产物显式固定为 `index.js`，不依赖 `package.json` 的模块类型推导扩展名。
- 联合预览由根目录 `npm run preview` 提供，可通过 `/renderer/index.html#/nodes/<node-id>/index.js` 验证节点 UI 加载。

### 共享依赖 ESM 构建

- 共享依赖由 `baseflow-node-renderer/vite.shared.config.ts` 统一构建为浏览器可直接加载的 ESM，先输出到 `baseflow-node-renderer/public/shared`，再由节点渲染基座主构建作为静态资源复制到 `./baseflow-preview/renderer/shared`。`public/shared` 作为可直接发布的公共依赖纳入 Git 跟踪，必须通过共享依赖构建更新，不要手工修改。
- React npm 包不能作为浏览器 ESM 原样复制；构建入口位于 `baseflow-node-renderer/src/shared`，用于生成 `react`、JSX runtime、`react-dom`、`react-dom/client` 和 `@baseflow/render-react` 等 ESM 入口及其共享 chunk。
- `baseflow-node-renderer` 的 `build` 脚本会先执行共享依赖构建，再构建节点渲染基座；单独修改共享依赖时也应重新执行 `npm run build --workspace baseflow-node-renderer`。
- `baseflow-node-renderer/scripts/sharedDependencies.js` 是共享依赖的唯一事实来源，同一张表同时驱动三处，无需手工对齐：`vite.shared.config.ts` 的 `lib.entry`、renderer 与节点物料的 `external`、以及 `index.html` 的 Import Map。入口文件名包含实际安装版本，例如 `react-dom@19.2.8.js`；版本从对应依赖的 `package.json` 自动读取，相关共享子路径沿用所属包版本，共享 chunk 继续使用内容哈希。
- Import Map 由 `scripts/sharedImportMapPlugin.js` 在 build 时注入，`index.html` 中不再手写。该插件只在 build 生效：dev 下 `external` 不起作用，renderer 自身的 react 会走 Vite 预构建，与 Import Map 指向的 `./shared` 是两份实例，因此 renderer 的 dev 不支持加载节点物料，联合调试一律走生产预览。
- `@baseflow/render-react/style.css` 不属于 external 的 JavaScript 入口，由节点渲染基座主入口统一导入并输出为 CSS 产物。
- 增删共享依赖只需修改 `scripts/sharedDependencies.js` 的表并重新构建 renderer 与全部节点物料；React 版本变化后需特别核对显式导出的 API。
- `./baseflow-preview/renderer/shared` 中的文件和 chunk 均为生成产物，不要复制、重命名或直接修改。

### 当前手工联合构建

在顶层联合构建脚本完成前，从仓库根目录按以下顺序执行完整构建：

```bash
npm run build --workspace baseflow-demo
npm run build --workspace baseflow-node-renderer
npm run build --workspace @baseflow-nodes/break
npm run preview
```

构建职责与产物：

- `baseflow-demo`：按需复制 monaco、生成节点 mock、清理并重建 demo 自有产物到 `./baseflow-preview`；清理时保留 `nodes` 和 `renderer`。
- `baseflow-node-renderer`：先重建共享依赖，再构建节点渲染基座到 `./baseflow-preview/renderer`（该目录由本次构建清空重建）。
- `@baseflow-nodes/break`：当前试点节点，构建到 `./baseflow-preview/nodes/break/`（该目录由本次构建清空重建）。
- 根目录 `npm run preview`：仅启动 `./baseflow-preview` 的生产预览服务，不执行构建，也不监听源码变化。

增量构建时，只需重建发生变化的部分：

- 修改节点渲染基座、共享依赖表或共享样式后，执行 `npm run build --workspace baseflow-node-renderer`。
- 修改 break 节点 UI 后，执行 `npm run build --workspace @baseflow-nodes/break`。
- 修改 demo 或影响节点 mock 的 `baseflow-nodes/*/package.json` 后，执行 `npm run build --workspace baseflow-demo`。

注意事项：

- 根目录 `npm run build` 当前只构建 `baseflow-demo`，不能作为联合构建命令。
- `baseflow-demo` 的 `predev`/`prebuild` 会执行 `monaco:copy`，从 `node_modules` 复制 monaco 到 `baseflow-demo/public/monaco/monaco-editor`（不含 source map）。该目录是生成产物、不入库，版本一致时自动跳过；需要强制重建时执行 `npm run monaco:copy --workspace baseflow-demo -- --force`。同目录的 `index.html` 与 `monaco.js` 是手写文件，不会被覆盖。
- 当前只有 break 节点完成了浏览器 ESM 构建试点；其它节点接入时，`vite.config.ts` 复用 `defineNodeConfig` 工厂，并在自身 `package.json` 中补上 `build` 脚本。
- 节点构建工厂显式固定入口产物为 `index.js`，不依赖节点包的 `package.json.type` 决定扩展名；节点包仍建议统一声明 `"type": "module"`，与仓库的 ESM 约定保持一致。
- `baseflow-preview` 中的 JS、CSS 和 HTML 均为生成产物，不要直接修改；源码变化后应重新执行对应 workspace 的构建命令。
- 预览服务运行期间重新构建后，需要刷新浏览器；若仍看到旧资源，执行硬刷新。
- 完整链路可访问 `http://localhost:4173/renderer/index.html#/nodes/break/index.js`，确认节点渲染基座成功加载并渲染 break 组件。

## 编码约定

- 命名规范：
  - 常量：PascalCase
  - 文件名：camelCase
  - 组件名：PascalCase
  - 变量/函数：camelCase
- TypeScript 策略：
  - `strict: true`
  - `erasableSyntaxOnly: true`，避免使用在 erasableSyntaxOnly 下容易出问题的语法
  - 优先选择实用、可读的类型设计
  - 避免过度复杂的泛型计算
  - 当类型过重、过复杂、难以顺利验证时，优先采用更简单的方案：简化泛型、放宽接口、显式断言、少量 `any`
  - 在能提升交付效率和可维护性的前提下，可适度使用魔法字符串

### 5.1 模块 ID 与样式命名

- 模块文件夹名是模块 ID 的唯一事实来源，不维护集中注册表。模块 ID 使用 kebab-case，组件名和 SCSS 本地基类使用确定性的 PascalCase 形式；
- 每个模块原则上只导出一个本地基类。内部元素使用基类拼接 BEM 后缀，React 使用 `${styles.HomeHeader}__menu` 形式引用。
- 可使用 `:local(.Module)`，并用 `&:global(__element)` 创建可动态拼接的后缀：

```scss
:local(.HomeHeader) {
  &:global(__menu) {
    position: absolute;

    > :global(.role) {
      color: var(--bf-tx-summary);
      font-size: 11px;
    }
  }
}
```

```tsx
<div className={`${styles.HomeHeader}__menu`}>
  <div>{authUser.username}</div>
  <div className="role">admin</div>
</div>
```

- 模块内部允许使用 `.role`、`.link`、`.on` 等短 className，但父级链必须存在带模块命名空间的本地基类或 BEM 元素，CSS 必须从该作用域锚点限制范围。禁止裸写、跨模块引用或使用短 className 作为运行时及 E2E 选择器。
- `globals.css` 只保留设计变量、reset、基础排版、整屏骨架和公共样式，其中声明的所有 class 必须以 `g-` 开头。模块背景、局部布局、交互状态和响应式规则存放在所属 SCSS Module。

## 代码注释

- 基于“代码即注释”的理念，普通代码无需添加注释。
- 对复杂难懂、模糊易错的关键环节，需要补充简洁、准确的注释。

## 持续优化

- 发现与当前任务相关的错误、不合理实现、明显优化点或更好的替代方案时，应在交付结果中报告；需要写入对应应用目录的 `optimize.md` 时，先与用户确认。

## Memory 使用约束

- 不要默认把对话中观察到的信息写入 memory。过多的 memory 会造成上下文膨胀和隐式规则，影响后续判断。
- 只有同时满足以下条件才考虑写入：极其重要、跨会话仍有效、无法从权威文档或代码现状推导。
- 写入或更新 memory 前必须先与我确认。

## 需先确认的边界

遇到以下情况先暂停并确认：

- 修改会与设计文档冲突。
- 安装、升级或变更项目依赖。
- 删除用途不明的文件或代码。
- 需求歧义会导致不同实现方向、破坏兼容性或产生不可逆影响。
- 需要在“代码真相”和“文档真相”之间做取舍。
- 写入或更新 memory。

## Git 操作

- 不得擅自执行会改变 Git 状态或工作区的操作，例如回滚、commit、add 等；允许使用 `status`、`diff`、`log` 等只读命令进行检查。

## AI 会话风格

- 尽量使用中文。
