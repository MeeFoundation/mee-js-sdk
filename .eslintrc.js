module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      project: "./tsconfig.json"
    },
    ignorePatterns: [".eslintrc.js", "**/*.config.js", "**/*.config.ts"],
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "airbnb-typescript",
    ],
    settings: {
      react: { version: "detect" }
    },
    rules: {
        "max-len": [
            "error",
            { "code": 120, "ignoreComments": true, "ignoreStrings": true }
        ],
        "react/function-component-definition": [2, {
          "namedComponents": "arrow-function",
          "unnamedComponents": "function-expression",
        }],
        "import/prefer-default-export": 0,
        "react/react-in-jsx-scope": 0,
    }
  };