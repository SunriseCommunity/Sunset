export default {
  input: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/openapi/v1.json`,
  output: "lib/types/api",
  plugins: [
    {
      baseUrl: false,
      name: "@hey-api/client-fetch",
    },
    {
      enums: "typescript",
      name: "@hey-api/typescript",
    },
  ],
};
