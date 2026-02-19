import type { HTMLTag } from "astro/types";

export type HTMLHeadingTag = Extract<
  HTMLTag,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
>;
