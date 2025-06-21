/** @type {import("prettier").Config} */
export default {
  // Base formatting options
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: "lf",

  // Plugin configurations
  plugins: ["prettier-plugin-astro"],

  // File-specific overrides
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
        printWidth: 100, // Slightly wider for Astro components
      },
    },
    {
      files: ["*.json", "*.jsonc"],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: ["*.md", "*.mdx"],
      options: {
        printWidth: 80,
        proseWrap: "preserve",
        tabWidth: 2,
      },
    },
    {
      files: ["*.css", "*.scss", "*.less"],
      options: {
        singleQuote: true,
        tabWidth: 2,
      },
    },
  ],
};
