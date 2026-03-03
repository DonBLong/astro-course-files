import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (response.status === 404 && context.url.pathname.startsWith("/portfolio/")) {
    return context.rewrite("/portfolio/404");
  }

  return response;
});
