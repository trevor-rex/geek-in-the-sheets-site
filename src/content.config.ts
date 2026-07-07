import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const tutorials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tutorials" }),
  schema: z.object({
    // The target search query, phrased as the page h1/title
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Kept out of builds until ready to publish
    draft: z.boolean().default(false),
    // Mirrors the visible manual-method steps; emitted as HowTo JSON-LD
    howToSteps: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .optional(),
    // Slugs of related tutorials for the "Related" section
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { tutorials };
