import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [mdx()],
  output: "server",
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});