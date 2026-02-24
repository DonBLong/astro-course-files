import { file, glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const posts = defineCollection({
  loader: glob({
    pattern: "src/data/posts/**/*.md",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(32),
      tags: z.array(z.string()),
      pubDate: z.coerce.date(),
      isDraft: z.boolean(),
      canonicalURL: z.string().url().optional(),
      cover: image(),
      coverAlt: z.string(),
      author: reference("team"),
      slug: z.string(),
    }),
});

const team = defineCollection({
  loader: file("src/data/team/team.json"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      email: z.string().email(),
      department: z.enum([
        "Engineering",
        "Software Development",
        "Product Design",
      ]),
      avatar: image(),
    }),
});

export const collections = { posts, team };
