# baseflow-nodes 工作区规则

## 工作区事实

- 仓库结构: 基于 npm workspaces 的 Monorepo，包含 `nodes/*` 多个子项目
- Node.js: `>=22.12`
- TypeScript: `5.x`
- React: `19.x`
- 模块系统: ESM
- Lint/format: Biome
- CSS: sass
- CSS Lint/format: Stylelint
- vite: `8.x`,
- vitest: `4.x`

## Monorepo 说明

- `根目录` 下为 `baseflow-app` 项目，该项目负责启动一个 app 页面，可动态加载 `nodes` 下面的独立节点。
- `nodes/*` 为多个独立的`节点`子项目，它们为 `baseflow-app` 项目提供节点`物料`，不能独立运行。

## 编码约定

- 命名规范:
  - 常量: PascalCase
  - 文件名: camelCase
  - 组件名: PascalCase
  - 变量/函数: camelCase
- TypeScript 策略: 
  - `strict: true`
  - `erasableSyntaxOnly: true`，避免使用在 erasableSyntaxOnly 下容易出问题的语法
  - 优先选择实用、可读的类型设计
  - 避免过度复杂的泛型计算
  - 当类型过重、过复杂、难以顺利验证时，优先采用更简单的方案: 简化泛型、放宽接口、显式断言、少量 `any`
  - 在能提升交付效率和可维护性的前提下，可适度使用魔法字符串

### 5.1 模块 ID 与样式命名

- 模块文件夹名是模块 ID 的唯一事实来源，不维护集中注册表。模块 ID 使用 kebab-case，组件名和 SCSS 本地基类使用确定性的 PascalCase 形式；模块根节点必须声明同名 `data-module-id`。
- 每个模块原则上只导出一个本地基类。内部元素使用基类拼接 BEM 后缀，React 使用 `${styles.HomeHeader}__menu` 形式引用。
- 当前不接受 Sass 展开后的块式 `:global { :local(...) {} }`。必须直接使用 `:local(.Module)`，并用 `&:global(__element)` 创建可动态拼接的后缀：

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

- 基于`代码即注释`的理念，普通代码无需写注释
- 对于复杂难懂、模糊易错的关键环节需要补上注释
- 注释风格保持简洁精炼

## 持续优化

- 在任何时候，发现已有代码中存在错误、不合理、可明显优化的点、或有更好的替代方案，你需要向我报告，不方便报告时可记录到对应应用目录下的 `optimize.md`

## Memory 使用约束

- 不要默认把对话中观察到的信息写入 memory。memory 写多了会造成上下文膨胀和隐式规则，影响后续判断。
- 只有同时满足以下条件才考虑写入: 极其重要、跨会话仍有效、不可从权威文档或代码现状推导。
- 写入或更新 memory 前必须先与我确认。

## 需先确认的边界

遇到以下情况先暂停并确认: 

- 修改会与设计文档冲突
- 安装、升级、变更项目依赖
- 删除未知文件或未知代码
- 涉及到模糊、歧义、不清晰点
- 需要在"代码真相"和"文档真相"之间做取舍
- 写入或更新 memory

## Git 操作

- 不要擅自使用 Git 命令对工作区进行修改，比如: 回滚、commit、add 等操作

## AI 会话风格

尽量使用中文