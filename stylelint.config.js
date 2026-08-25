/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-recommended-scss", "stylelint-config-recess-order"],
  plugins: ["@stylistic/stylelint-plugin"],
  ignoreFiles: ["baseflow-preview/**", "**/public/**", "**/dist/**", "**/node_modules/**"],
  rules: {
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global", "local"] }],
    "selector-type-no-unknown": [true, { ignoreTypes: ["/^__/"] }],
    "@stylistic/indentation": 2,
    "@stylistic/max-empty-lines": 1,
    "@stylistic/no-eol-whitespace": true,
    "@stylistic/no-missing-end-of-source-newline": true,
    "@stylistic/block-opening-brace-space-before": "always",
    "@stylistic/block-closing-brace-newline-before": "always-multi-line",
    "@stylistic/block-closing-brace-newline-after": "always",
    "@stylistic/declaration-colon-space-before": "never",
    "@stylistic/declaration-colon-space-after": "always-single-line",
    "@stylistic/declaration-block-semicolon-newline-after": "always-multi-line",
    "@stylistic/selector-list-comma-newline-after": "always",
  },
};
