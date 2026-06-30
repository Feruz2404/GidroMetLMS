import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Allow `any` for Prisma dynamic queries (pattern: `where as any`)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow non-null assertions for trusted data
      "@typescript-eslint/no-non-null-assertion": "off",
      // Ban TS comments that suppress real errors
      "@typescript-eslint/ban-ts-comment": "warn",
      // Warn on unused vars (not error, to avoid blocking dev)
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // React hooks deps — warn but don't block
      "react-hooks/exhaustive-deps": "warn",
      // No unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Console is acceptable in API routes for error logging
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Empty blocks should have a comment
      "no-empty": ["warn", { allowEmptyCatch: true }],
      // Prefer const
      "prefer-const": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
      "skills/**",
      "prisma/seed.ts",
      "meteo-lms-source/**",
      "tool-results/**",
    ],
  },
];

export default eslintConfig;