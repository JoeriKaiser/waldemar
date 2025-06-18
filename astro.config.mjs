import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [mdx()],
	output: "server",
	adapter: vercel(),
});
