import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const RAW_COLOR = String.raw`(?:^|\s|:)(?:text|bg|border|from|to|via|ring|fill|stroke|outline|decoration|shadow|divide|placeholder|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b|\[(?:#[0-9a-fA-F]{3,8}|rgba?\()`;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Colours come from the semantic tokens in app/globals.css (bg-paper, text-ink, border-line …).
  // Raw Tailwind palette classes and arbitrary hex/rgb colours break the light/dark themes.
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: ["app/opengraph-image.tsx", "app/twitter-image.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: `:matches(Literal, TemplateElement)[value=/${RAW_COLOR}/]`,
          message: "Use a semantic colour token (see app/globals.css), not a raw palette colour.",
        },
        {
          selector: `TemplateElement[value.raw=/${RAW_COLOR}/]`,
          message: "Use a semantic colour token (see app/globals.css), not a raw palette colour.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "test-results/**",
    "work/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
