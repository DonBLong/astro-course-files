import { colord } from "colord";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { parse, Rule } from "postcss";

const filename = "src/styles/global.css";

const styleSheetPath = resolve(cwd(), filename);

const cssString = readFileSync(styleSheetPath, "utf-8");

const root = parse(cssString);

root.walkAtRules("custom-variant", rule => {
  if (rule.params.startsWith("dark")) {
    rule.params = `dark (&:where(.dark, .dark *), @media (prefers-color-scheme: dark))`;
    rule.cloneAfter({ params: rule.params.replaceAll("dark", "light") }).raws.before = "\r\n";
  }
});

let rootRule = new Rule();

root.walkRules(":root", rule => {
  rule.prepend({ name: "apply", params: "scheme-light-dark print:scheme-light" });
  rootRule = rule;
});

let darkRule = new Rule();

root.walkRules(".dark", rule => {
  rule.prepend({ name: "apply", params: "scheme-dark print:scheme-light" });
  darkRule = rule;
});

darkRule.walkDecls(darkDecl => {
  if (darkDecl.variable && colord(darkDecl.value)) {
    rootRule.walkDecls(rootDecl => {
      if (rootDecl.variable && colord(rootDecl.value) && rootDecl.prop === darkDecl.prop) {
        rootDecl.value = `light-dark(${rootDecl.value}, ${darkDecl.value})`;
        darkDecl.remove();
      }
    });
  }
});

const lightRule = darkRule.cloneAfter({ selector: ".light" });

lightRule.walkAtRules("apply", atRule => {
  atRule.params = "scheme-light";
});

writeFileSync(styleSheetPath, root.toString(), "utf-8");
