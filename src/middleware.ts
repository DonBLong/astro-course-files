import { getActionContext } from "astro:actions";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { action } = getActionContext(context);
  if (action?.calledFrom === "form") {
    const referrer = context.request.headers.get("referer");
    console.log(referrer);

    if (referrer) {
      await next();
      return context.redirect(referrer);
    }
  }
  return next();
});
