import eslintPluginAstro from "eslint-plugin-astro";
export default [
  ...eslintPluginAstro.configs.recommended,
  {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parserOptions: {
      parser: "@typescript-eslint/parser",
      extraFileExtensions: [".vue"],
      ecmaVersion: 2021,
    },
    plugins: ["vue", "@typescript-eslint"],
    rules: {},
  },
];
