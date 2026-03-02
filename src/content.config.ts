import { getRepos } from "@/api/repos";
import { getUsers } from "@/api/users";
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

const contacts = defineCollection({
  loader: getUsers,
});

const repos = defineCollection({
  loader: getRepos,
  schema: z.object({
    name: z.string(),
    description: z.string().nullable(),
    language: z.string().nullable(),
    html_url: z.string(),
    fork: z.boolean(),
  }),
});

const features = defineCollection({
  loader: file("src/content/features.json"),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

const projects = defineCollection({
  loader: file("src/content/projects.yaml"),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(65),
      href: z.string().url(),
      image: image(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "src/content/**/*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(65),
      slug: z.string(),
      description: z.string().max(160),
      image: image(),
      pubDate: z.date(),
      isDraft: z.boolean().optional(),
      author: reference("authors"),
    }),
});

const authors = defineCollection({
  loader: getUsers,
  schema: z.object({
    name: z.string(),
  }),
});

export const collections = { posts, team, contacts, features, projects, blog, authors, repos };
