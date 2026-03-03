import { navigate } from "astro:transitions/client";

export function ReactSelectNav() {
  return (
    <select onChange={e => navigate(e.target.value, { history: "replace" })} defaultValue="/portfolio">
      <option value="/portfolio/projects">Projects</option>
      <option value="/portfolio">∉</option>
      <option value="/portfolio/blog">Blog</option>
    </select>
  );
}
