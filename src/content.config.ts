import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

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

export const collections = {
  project: projectCollection,
};
