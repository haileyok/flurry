module.exports = {
  env: {
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard-with-typescript", "prettier", "plugin:react-hooks/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
  },
  plugins: ["react", "prettier"],
  rules: {
    "@typescript-eslint/quotes": [2, "single", { avoidEscape: true }],
    "@typescript-eslint/comma-dangle": [2, "always-multiline"],
    "@typescript-eslint/semi": [2, "always"],
    "@typescript-eslint/member-delimiter-style": [2,
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "overrides": {
          "interface": {
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            }
          },
        }
      }],
    "@typescript-eslint/consistent-type-definitions": [1, "interface"],
    "@typescript-eslint/consistent-type-imports": [2, { prefer: "no-type-imports" }],
    "@typescript-eslint/space-before-function-paren": [2, {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "@typescript-eslint/no-non-null-assertion": [0],
    "@typescript-eslint/no-confusing-void-expression": 'off',
    "@typescript-eslint/no-misused-promises": 'off',
    "react/jsx-curly-brace-presence": [2, { props: "never", children: "never" }],
    "jsx-quotes": [2, "prefer-double"],
    "prettier/prettier": [2, {
      endOfLine: "auto",
      singleQuote: true,
      semi: true,
      bracketSpacing: true,
      trailingComma: "all",
      tabWidth: 2,
      printWidth: 80,
    }],
    "no-console": [2],
    "react-hooks/rules-of-hooks": [2],
    "react-hooks/exhaustive-deps": [1],
    "@typescript-eslint/consistent-type-assertions": 'off',
    "@typescript-eslint/no-invalid-void-type": 'off',
    "n/handle-callback-err": 'off',
    "@typescript-eslint/strict-boolean-expressions": 'off',
  },
};
