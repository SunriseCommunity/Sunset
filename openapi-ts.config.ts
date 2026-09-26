import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/openapi/v1.json`,
  output: {
    path: "lib/types/api",
    postProcess: [{ command: "eslint", args: ["--fix", "{{path}}"] }],
  },
  plugins: [
    "zod",
    {
      baseUrl: false,
      name: "@hey-api/client-fetch",
    },
    {
      enums: "typescript",
      name: "@hey-api/typescript",
    },
  ],
});
