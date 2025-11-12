// src/content/config.ts
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/project" }),
  schema: z.object({
    name: z.string(),
    timeline: z.object({
      start: z.any().optional(),
      end: z.any().optional(),
    }),
    img: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    order: z.number().int(),
    isActive: z.boolean().default(true),
    techStack: z
      .array(
        z.object({
          name: z.string(),
          color: z.string().optional(),
        })
      )
      .optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string(),
  }),
});

export const collections = {
  project: projectCollection,
  pages: pagesCollection,
};
