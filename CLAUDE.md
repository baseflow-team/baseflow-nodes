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
- `baseflow-node-renderer` 构建到 `./baseflow-preview/renderer`，节点物料构建为 `./baseflow-preview/nodes/<node-id>/index.js`，由节点渲染基座在 iframe 内动态加载。
- 父页面与节点渲染基座分属不同 JS Realm，这是刻意保留的沙箱边界；二者不共享运行时依赖，后续通过 `postMessage` 协议通信。
- 节点渲染基座 iframe 内仅将 `react`、`react-dom`、`@baseflow/render-react` 作为单例共享依赖，通过 Import Map 统一加载；相关子路径（如 `react/jsx-runtime`、`react-dom/client`）遵循同一映射。
- `@baseflow/render-react/style.css` 由节点渲染基座统一加载，节点物料无需重复加载。
- `@baseflow/flow-react` 明确不共享；除上述三个包外，节点物料的其它运行时依赖均打入各自 Bundle。
- 联合预览由根目录 `npm run preview` 提供，可通过 `/renderer/index.html#/nodes/<node-id>/index.js` 验证节点 UI 加载。

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
