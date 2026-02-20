import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

export type ParseResults<Selectors extends string[]> = {
  [Index in keyof Selectors]: {
    cssString: string;
    selector: Selectors[Index];
    regExp: RegExp;
    matchedString: string | null | undefined;
    ast?: Record<string, string>;
  };
};

export interface ParseReturnType<Selectors extends string[]> {
  cssString: string;
  results: ParseResults<Selectors>;
}

function parse<const Selectors extends string[]>(
  styleSheetPath: string,
  selectors: Selectors,
): ParseReturnType<Selectors>;

function parse<const Selectors extends string[]>(cssString: string, selectors: Selectors): ParseReturnType<Selectors>;

function parse<const Selectors extends string[]>(
  source: string,
  selectors: Selectors,
) {
  const path = resolve(cwd(), source);
  const cssString = existsSync(path) ? readFileSync(path, "utf-8") : source;
  const results = selectors.map(selector => {
    const regExp = new RegExp(`(?<=\\${selector}\\s)({[^{}]+})`, "g");

    const matchedString = cssString.match(regExp)?.[0];

    if (matchedString == null) return { selector, regExp, matchedString };

    const ast = toAst(matchedString);

    return { selector, regExp, matchedString, ast };
  }) as ParseResults<Selectors>;
  return { cssString, results };
}

function toAst(cssString: string) {
  const canonicalized = cssString.replaceAll("--", "\"--").replaceAll(/:\s*/g, "\": \"").replaceAll(
    ";",
    "\",",
  ).replace(/,\s*}/, "}");

  return JSON.parse(canonicalized);
}

function toCSS(ast: Record<string, string>) {
  return JSON.stringify(ast, undefined, 1).replaceAll("\"", "").replaceAll(",", ";").replace("\n}", ";\n}");
}

const styleSheetPath = "src/styles/global.css";

const { cssString, results: [root, dark] } = parse(styleSheetPath, [":root", ".dark"]);

function combine(root: Record<string, string>, dark: Record<string, string>) {
  const newRoot = { ...root };
  for (const cssVariable in root) {
    if (!Object.hasOwn(dark, cssVariable)) continue;
    newRoot[cssVariable] = `light-dark(${root[cssVariable]}, ${dark[cssVariable]})`;
  }
  return newRoot;
}

if (root.ast && dark.ast) {
  const newRoot = combine(root.ast, dark.ast);
  const newCssString = cssString.replace(root.regExp, toCSS(newRoot));
  writeFileSync(resolve(cwd(), styleSheetPath), newCssString, "utf-8");
}
